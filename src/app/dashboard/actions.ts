"use server"

import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { OrderStatus } from '@prisma/client'

export const changeOrderStatus = async ({ id, newStatus }: { id: string, newStatus: OrderStatus }) => {
  await db.order.update({
    where: { id },
    data: { status: newStatus },
  })
}

export const getData = async () => {
    const orders = await db.order.findMany({
        where: {
          isPaid: true,
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        include: {
          user: true,
          shippingAddress: true,
        },
    });
    
    const lastWeekSum = await db.order.aggregate({
        where: {
          isPaid: true,
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 7)),
          },
        },
        _sum: {
          amount: true,
        },
    });
    
    const lastMonthSum = await db.order.aggregate({
        where: {
          isPaid: true,
          createdAt: {
            gte: new Date(new Date().setDate(new Date().getDate() - 30)),
          },
        },
        _sum: {
          amount: true,
        },
    });

    return {orders, lastWeekSum, lastMonthSum};
}

export const checkIsAdmin = async (): Promise<{ isAdmin: boolean }> => {
  try {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user.email) {
      return { isAdmin: false };
    }

    const existingUser = await db.user.findFirst({
      where: { id: user.id },
    });

    console.log("check is admin1 :", typeof process.env.ADMIN_EMAIL, process.env.ADMIN_EMAIL);
    console.log("check is admin2 :", typeof existingUser?.email, existingUser?.email);

    console.log("check is admin :", existingUser?.email === "yugaldekate72@gmail.com");
     
    if (existingUser?.email !== "yugaldekate72@gmail.com") {
      return { isAdmin: false };
    }

    return { isAdmin: true };
  } catch (error) {
    console.error("Error checking admin status:", error);
    return { isAdmin: false }; // Fallback to non-admin if an error occurs
  }
};
