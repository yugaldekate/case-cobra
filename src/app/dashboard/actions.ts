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
