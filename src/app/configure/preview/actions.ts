'use server'

import { db } from '@/db';
import { Order } from '@prisma/client';

import { stripe } from '@/lib/stripe';

import { BASE_PRICE, PRODUCT_PRICES } from '@/config/products';

export const createCheckoutSession = async ({ configId, userId }: { configId: string, userId: string }) => {

    const configuration = await db.configuration.findUnique({
        where: { id: configId },
    });

    if (!configuration) {
        throw new Error('No such configuration found');
    }

    const { finish, material } = configuration;

    let price = BASE_PRICE;
    if (finish === 'textured') price += PRODUCT_PRICES.finish.textured;
    if (material === 'polycarbonate') price += PRODUCT_PRICES.material.polycarbonate;

    let order: Order | undefined = undefined

    const existingOrder = await db.order.findFirst({
        where: {
            userId: userId,
            configurationId: configuration.id,
        },
    });

    if (existingOrder) {
        order = existingOrder;
    } else {
        order = await db.order.create({
            data: {
                userId: userId,
                configurationId: configuration.id,
                amount: price / 100,
            },
        });
    }

    const product = await stripe.products.create({
        name: 'Custom iPhone Case',
        images: [configuration.imageUrl],
        default_price_data: {
            currency: 'INR',
            unit_amount: price,
        },
    });

    const stripeSession = await stripe.checkout.sessions.create({
        mode: 'payment',
        metadata: {
            userId: userId,
            orderId: order.id,
        },
        
        line_items: [{ price: product.default_price as string, quantity: 1 }],
        
        payment_method_types: ['card'],
        shipping_address_collection: { allowed_countries: ['IN', 'DE', 'US'] },

        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/configure/preview?id=${configuration.id}`,
    });

    return { url: stripeSession.url };
}