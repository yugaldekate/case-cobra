"use client";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { checkIsLoggedIn, createCheckoutSession } from "./actions";
import { useMutation } from "@tanstack/react-query";

import { cn, formatPrice } from "@/lib/utils";
import { useEffect, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import Confetti from 'react-dom-confetti';

import { Configuration } from "@prisma/client";
import Phone from "@/components/Phone";
import { Button } from "@/components/ui/button";
import { COLORS, MODELS } from "@/validators/option-validator";

import { BASE_PRICE, PRODUCT_PRICES } from "@/config/products";
import { useLogin, useModal } from "@/lib/use-modal";

const confettiConfig = {
    angle: 90,
    spread: 360,
    startVelocity: 40,
    elementCount: 200,
    dragFriction: 0.12,
    duration: 3000,
    stagger: 3,
    perspective: "500px",
    colors: ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#FFBD33', '#33FFF3', 
        '#8E44AD', '#F39C12', '#3498DB', '#2ECC71', '#E74C3C', '#9B59B6', 
        '#1ABC9C', '#E67E22', '#2980B9', '#D35400', '#C0392B', '#27AE60', 
        '#16A085', '#F1C40F'
    ],
};

const DesignPreview = ({ configuration }: { configuration: Configuration }) => {
    const { isLoggedIn } = useLogin();
    const { onClose } = useModal();
    const [showConfetti, setShowConfetti] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);

    const { onOpen } = useModal();
    const router = useRouter();
    const { toast } = useToast();

    useEffect(() => {
        setShowConfetti(true);
        const checkLoginStatus = async () => {
            const { isLoggedIn } = await checkIsLoggedIn();
            setLoggedIn(isLoggedIn);
        };
        checkLoginStatus();
    }, []);

    useEffect(() => {
        const checkLoginStatus = async () => {
            const { isLoggedIn } = await checkIsLoggedIn();
            setLoggedIn(isLoggedIn);
        };
        checkLoginStatus();
    }, [isLoggedIn]);

    const { id, color, model, finish, material } = configuration;
    const tw = COLORS.find((supportedColor) => supportedColor.value === color)?.tw;
    const { label: modelLabel } = MODELS.options.find(({ value }) => value === model)!;

    let totalPrice = BASE_PRICE;
    if (material === 'polycarbonate') totalPrice += PRODUCT_PRICES.material.polycarbonate;
    if (finish === 'textured') totalPrice += PRODUCT_PRICES.finish.textured;

    const { mutate: createPaymentSession, isPending } = useMutation({
        mutationKey: ['get-checkout-session'],
        mutationFn: createCheckoutSession,
        onSuccess: ({ url }) => {
            if (url) {
                router.push(url);
            } else {
                throw new Error('Unable to retrieve payment URL.');
            }
        },
        onError: () => {
            toast({
                title: 'Something went wrong',
                description: 'There was an error on our end. Please try again.',
                variant: 'destructive',
            });
        },
    });

    const handleCheckout = async () => {
        console.log("handleCheckout called");

        if (loggedIn) {
            onClose();
            createPaymentSession({ configId: id });
        } else {
            localStorage.setItem('configurationId', id);
            onOpen();
        }
    };

    return (
        <>
            <div aria-hidden='true' className='pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center'>
                <Confetti active={showConfetti} config={confettiConfig} />
            </div>

            <div className='mt-20 flex flex-col items-center sm:gap-x-6 md:grid md:grid-cols-12 md:grid-rows-1 md:gap-x-8 lg:gap-x-12 text-sm'>
                <div className='md:col-span-4 md:row-span-2 md:row-end-2 lg:col-span-3'>
                    <Phone className={cn(`bg-${tw}`, "max-w-[150px] md:max-w-full")} imgSrc={configuration.croppedImageUrl!} />
                </div>

                <div className='mt-6 md:col-span-9 md:row-end-1'>
                    <h3 className='text-3xl font-bold tracking-tight text-gray-900'>
                        Your {modelLabel} Case
                    </h3>
                    <div className='mt-3 flex items-center gap-1.5 text-base'>
                        <Check className='h-4 w-4 text-green-500' />
                        In stock and ready to ship
                    </div>
                </div>

                <div className='sm:col-span-full md:col-span-9 text-base'>
                    <div className='grid grid-cols-1 gap-y-8 md:grid-cols-2 md:gap-x-6 border-b border-gray-200 sm:py-6 md:py-10 py-8 '>
                        <div>
                            <p className='font-medium text-zinc-950'>
                                Highlights
                            </p>
                            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                                <li>Wireless charging compatible</li>
                                <li>TPU shock absorption</li>
                                <li>Packaging made from recycled materials</li>
                                <li>5 year print warranty</li>
                            </ol>
                        </div>

                        <div>
                            <p className='font-medium text-zinc-950'>
                                Materials
                            </p>
                            <ol className='mt-3 text-zinc-700 list-disc list-inside'>
                                <li>High-quality, durable material</li>
                                <li>Scratch and fingerprint resistant coating</li>
                            </ol>
                        </div>
                    </div>

                    <div className='mt-8'>
                        <div className='bg-gray-50 p-6 sm:rounded-lg sm:p-8 md:col-span-full'>
                            <div className='flow-root text-sm'>
                                <div className='flex items-center justify-between py-1 mt-2'>
                                    <p className='text-gray-600'>
                                        Base price
                                    </p>
                                    <p className='font-medium text-gray-900'>
                                        {formatPrice(BASE_PRICE / 100)}
                                    </p>
                                </div>

                                {finish === 'textured' ? (
                                    <div className='flex items-center justify-between py-1 mt-2'>
                                        <p className='text-gray-600'>Textured finish</p>
                                        <p className='font-medium text-gray-900'>
                                            {formatPrice(PRODUCT_PRICES.finish.textured / 100)}
                                        </p>
                                    </div>
                                ) : null}

                                {material === 'polycarbonate' ? (
                                    <div className='flex items-center justify-between py-1 mt-2'>
                                        <p className='text-gray-600'>Soft polycarbonate material</p>
                                        <p className='font-medium text-gray-900'>
                                            {formatPrice(PRODUCT_PRICES.material.polycarbonate / 100)}
                                        </p>
                                    </div>
                                ) : null}

                                <div className='my-2 h-px bg-gray-200' />

                                <div className='flex items-center justify-between py-2'>
                                    <p className='font-semibold text-gray-900'>Order total</p>
                                    <p className='font-semibold text-gray-900'>
                                        {formatPrice(totalPrice / 100)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className='mt-8 flex justify-end pb-12'>
                            <Button
                                onClick={handleCheckout}
                                className='px-4 sm:px-6 lg:px-8'
                                disabled={isPending}
                                isLoading={isPending}
                            >
                                Check out <ArrowRight className='h-4 w-4 ml-1.5 inline' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DesignPreview;
