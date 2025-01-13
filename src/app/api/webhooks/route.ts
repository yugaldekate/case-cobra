import { db } from '@/db';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import OrderReceivedEmail from '@/app/emails/OrderReceivedEmail';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        // Read raw body to get the correct signature
        const body = await req.text();
        const signature = req.headers.get('stripe-signature');  // Corrected to use req.headers.get()

        console.log("Stripe Signature: ", signature);

        if (!signature) {
            return new Response('Invalid signature', { status: 400 });
        }

        // Construct the event object from the raw body and signature
        const event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );

        // Handle the checkout session completed event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object as Stripe.Checkout.Session;

            if (!session.customer_details?.email) {
                throw new Error('Missing user email');
            }

            console.log("Event data: ", session);

            const { userId, orderId } = session.metadata || {
                userId: null,
                orderId: null,
            };

            if (!userId || !orderId) {
                throw new Error('Invalid request metadata');
            }

            const billingAddress = session.customer_details!.address;
            const shippingAddress = session.shipping_details!.address;

            // Update the order in the database
            const updatedOrder = await db.order.update({
                where: {
                    id: orderId,
                },
                data: {
                    isPaid: true,
                    shippingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: shippingAddress!.city!,
                            country: shippingAddress!.country!,
                            postalCode: shippingAddress!.postal_code!,
                            street: shippingAddress!.line1!,
                            state: shippingAddress!.state,
                        },
                    },
                    billingAddress: {
                        create: {
                            name: session.customer_details!.name!,
                            city: billingAddress!.city!,
                            country: billingAddress!.country!,
                            postalCode: billingAddress!.postal_code!,
                            street: billingAddress!.line1!,
                            state: billingAddress!.state,
                        },
                    },
                },
            });

            // Send the order confirmation email
            await resend.emails.send({
                from: 'CaseCobra <yugaldekate22@gmail.com>',
                to: [session.customer_details.email],
                subject: 'Thanks for your order!',
                react: OrderReceivedEmail({
                    orderId,
                    orderDate: updatedOrder.createdAt.toLocaleDateString(),
                    // @ts-ignore
                    shippingAddress: {
                        name: session.customer_details!.name!,
                        city: shippingAddress!.city!,
                        country: shippingAddress!.country!,
                        postalCode: shippingAddress!.postal_code!,
                        street: shippingAddress!.line1!,
                        state: shippingAddress!.state,
                    },
                }),
            });
        }

        // Return a successful response
        return NextResponse.json({ result: event, ok: true });
    } catch (err) {
        console.error('Error processing webhook:', err);

        // Return an error response if something goes wrong
        return NextResponse.json(
            { message: 'Something went wrong', ok: false },
            { status: 500 }
        );
    }
}
