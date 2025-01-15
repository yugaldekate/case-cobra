"use client";

import { db } from "@/db";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";

import { formatPrice } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

import StatusDropdown from "./StatusDropdown";
import { getData } from "./actions";

type OrderStatus = "fulfilled" | "shipped" | "awaiting_shipment";

interface User {
    id: string;
    email: string;
    createdAt?: Date;
    updatedAt?: Date;
}

interface ShippingAddress {
    id: string;
    name: string;
    street: string;
    city: string;
    postalCode: string;
    country: string;
    state: string | null;
    phoneNumber: string | null;
}

interface Order {
    id: string;
    amount: number;
    isPaid: boolean;
    status: OrderStatus;
    userId: string;
    configurationId: string;
    shippingAddressId?: string | null;
    billingAddressId?: string | null;
    createdAt: Date;
    updated: Date;
    user: User;
    shippingAddress: ShippingAddress | null;
}

interface AggregatedSum {
    _sum: {
        amount: number | null;
    };
}

interface DataState {
    orders: Order[];
    lastWeekSum: AggregatedSum | null;
    lastMonthSum: AggregatedSum | null;
}

// Mock function to simulate database calls (replace with your actual db queries)
// const fetchOrdersData = async (): Promise<DataState> => {
//     try {
//         const orders = await db.order.findMany({
//             where: {
//                 isPaid: true,
//                 createdAt: {
//                     gte: new Date(new Date().setDate(new Date().getDate() - 7)),
//                 },
//             },
//             orderBy: {
//                 createdAt: "desc",
//             },
//             include: {
//                 user: {
//                     select: {
//                         id: true,
//                         email: true,
//                     },
//                 },
//                 shippingAddress: {
//                     select: {
//                         id: true,
//                         name: true,
//                         street: true,
//                         city: true,
//                         postalCode: true,
//                         country: true,
//                         state: true,
//                         phoneNumber: true,
//                     },
//                 },
//             },
//         });

//         const lastWeekSum = await db.order.aggregate({
//             where: {
//                 isPaid: true,
//                 createdAt: {
//                     gte: new Date(new Date().setDate(new Date().getDate() - 7)),
//                 },
//             },
//             _sum: {
//                 amount: true,
//             },
//         });

//         const lastMonthSum = await db.order.aggregate({
//             where: {
//                 isPaid: true,
//                 createdAt: {
//                     gte: new Date(new Date().setDate(new Date().getDate() - 30)),
//                 },
//             },
//             _sum: {
//                 amount: true,
//             },
//         });

//         return { orders, lastWeekSum, lastMonthSum };
//     } catch (error) {
//         console.error("Error fetching orders data:", error);
//         throw new Error("Failed to fetch orders data");
//     }
// };

const Page = () => {
    const [data, setData] = useState<DataState>({
        orders: [],
        lastWeekSum: null,
        lastMonthSum: null,
    });

    const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // Initialize with `null`

    useEffect(() => {
        const checkAdmin = localStorage.getItem('isAdmin');

        if (checkAdmin !== null) {
            const parsedIsAdmin = JSON.parse(checkAdmin); // Parse the string value
            setIsAdmin(parsedIsAdmin);
        } else {
            setIsAdmin(false); // Explicitly set to `false` if not found
        }
    }, []);

    console.log("dashboard :", isAdmin);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const collectedData = await getData();
                setData(collectedData);
            } catch (error) {
                console.error("Error at dashboard:", error);
            }
        };
        fetchData();
    }, []);

    if (isAdmin === null) {
        // Show a loading state until `isAdmin` is determined
        return <div>Loading...</div>;
    }

    if (!isAdmin) {
        return notFound();
    }

    const WEEKLY_GOAL = 6000;
    const MONTHLY_GOAL = 25000;

    return (
        <div className="flex min-h-screen w-full bg-muted/40">
            <div className="max-w-7xl w-full mx-auto flex flex-col sm:gap-4 sm:py-4">
                <div className="flex flex-col gap-16">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Last Week</CardDescription>
                                <CardTitle className="text-4xl">
                                    {formatPrice(data.lastWeekSum?._sum.amount ?? 0)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    of {formatPrice(WEEKLY_GOAL)} goal
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Progress
                                    value={((data.lastWeekSum?._sum.amount ?? 0) * 100) / WEEKLY_GOAL}
                                />
                            </CardFooter>
                        </Card>

                        <Card>
                            <CardHeader className="pb-2">
                                <CardDescription>Last Month</CardDescription>
                                <CardTitle className="text-4xl">
                                    {formatPrice(data.lastMonthSum?._sum.amount ?? 0)}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-sm text-muted-foreground">
                                    of {formatPrice(MONTHLY_GOAL)} goal
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Progress
                                    value={((data.lastMonthSum?._sum.amount ?? 0) * 100) / MONTHLY_GOAL}
                                />
                            </CardFooter>
                        </Card>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight">Incoming orders</h1>

                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Customer</TableHead>
                                <TableHead className="hidden sm:table-cell">Status</TableHead>
                                <TableHead className="hidden sm:table-cell">Purchase date</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>

                        <TableBody>
                            {data.orders.map((order) => (
                                <TableRow key={order.id} className="bg-accent">
                                    <TableCell>
                                        <div className="font-medium">{order.shippingAddress?.name}</div>
                                        <div className="hidden text-sm text-muted-foreground md:inline">
                                            {order.user.email}
                                        </div>
                                    </TableCell>

                                    <TableCell className="hidden sm:table-cell">
                                        <StatusDropdown id={order.id} orderStatus={order.status} />
                                    </TableCell>

                                    <TableCell className="hidden md:table-cell">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </TableCell>

                                    <TableCell className="text-right">
                                        {formatPrice(order.amount)}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default Page;
