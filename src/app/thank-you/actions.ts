'use server'

import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'

export const getPaymentStatus = async ({ orderId, userId }: { orderId: string, userId: string }) => {

    const order = await db.order.findFirst({
        where: { 
            id: orderId, 
            userId: userId 
        },
        include: {
            user: true,
            configuration: true,
            billingAddress: true,
            shippingAddress: true,
        },
    });

    if (!order) throw new Error('This order does not exist.');

    if (order.isPaid) {
        return order;
    } else {
        return false;
    }
}
