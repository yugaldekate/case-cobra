import Image from "next/image";
import { Check, Star } from 'lucide-react';

import Phone from "@/components/Phone";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Home() {
    return (
        <div className="bg-slate-50">
            <section>
                <MaxWidthWrapper className='pb-24 sm:pb-32 lg:pb-52 pt-10 lg:pt-24 xl:pt-32 lg:grid lg:grid-cols-3 lg:gap-x-0 xl:gap-x-8'>
                    <div className='col-span-2 px-6 lg:px-0 lg:pt-4'>
                        <div className='relative flex flex-col items-center mx-auto text-center lg:text-left lg:items-start'>
                            <div className='absolute left-0 -top-20 hidden lg:block  w-28'>
                                <div className='absolute inset-x-0 bottom-0 bg-gradient-to-t via-slate-50/50 from-slate-50 h-28' />
                                <Image src='/snake-1.png' className='w-full' width={2048} height={1024} alt="snake image"  />
                            </div>

                            <h1 className='relative w-fit mt-16 tracking-tight !leading-tight text-balance font-bold text-5xl md:text-6xl lg:text-7xl text-gray-900 '>
                                Your Image on a{' '}
                                <span className='bg-green-600 px-2 text-white'>Custom</span>{' '}
                                Phone Case
                            </h1>

                            <p className='mt-8 text-lg lg:pr-10 max-w-prose text-center text-balance md:text-wrap lg:text-left'>
                                Capture your favorite memories with your own,{' '}
                                <span className='font-semibold'>one-of-one</span> phone case.
                                CaseCobra allows you to protect your memories, not just your phone case.
                            </p>

                            <ul className='mt-8 space-y-2 text-left font-medium flex flex-col items-center sm:items-start'>
                                <div className='space-y-2'>
                                    <li className='flex gap-1.5 items-center text-left'>
                                        <Check className='h-5 w-5 shrink-0 text-green-600' />
                                        High-quality, durable material
                                    </li>
                                    <li className='flex gap-1.5 items-center text-left'>
                                        <Check className='h-5 w-5 shrink-0 text-green-600' />5 year
                                        print guarantee
                                    </li>
                                    <li className='flex gap-1.5 items-center text-left'>
                                        <Check className='h-5 w-5 shrink-0 text-green-600' />
                                        Modern iPhone models supported
                                    </li>
                                </div>
                            </ul>

                            <div className='flex flex-col sm:flex-row items-center sm:items-start gap-5 mt-12 '>
                                <div className='flex -space-x-4'>
                                    <Image
                                        className='inline-block rounded-full ring-2 ring-slate-100'
                                        src='/users/user-1.png'
                                        width={40}
                                        height={40}
                                        alt='user image'
                                    />
                                    <Image
                                        className='inline-block rounded-full ring-2 ring-slate-100'
                                        src='/users/user-2.png'
                                        width={40}
                                        height={40}
                                        alt='user image'
                                    />
                                    <Image
                                        className='inline-block rounded-full ring-2 ring-slate-100'
                                        src='/users/user-3.png'
                                        width={40}
                                        height={40}
                                        alt='user image'
                                    />
                                    <Image
                                        className='inline-block rounded-full ring-2 ring-slate-100'
                                        src='/users/user-4.jpg'
                                        width={40}
                                        height={40}
                                        alt='user image'
                                    />
                                    <Image
                                        className='inline-block object-cover rounded-full ring-2 ring-slate-100'
                                        src='/users/user-5.jpg'
                                        width={40}
                                        height={40}
                                        alt='user image'
                                    />
                                </div>

                                <div className='flex flex-col justify-between items-center sm:items-start'>
                                    <div className='flex gap-0.5'>
                                        <Star className='h-4 w-4 text-green-600 fill-green-600' />
                                        <Star className='h-4 w-4 text-green-600 fill-green-600' />
                                        <Star className='h-4 w-4 text-green-600 fill-green-600' />
                                        <Star className='h-4 w-4 text-green-600 fill-green-600' />
                                        <Star className='h-4 w-4 text-green-600 fill-green-600' />
                                    </div>

                                    <p>
                                        <span className='font-semibold'>1,250</span> happy customers
                                    </p>
                                </div>
                            </div>
                        </div>                            
                    </div>
                    
                    <div className='col-span-full lg:col-span-1 w-full flex justify-center px-8 sm:px-16 md:px-0 mt-32 lg:mx-0 lg:mt-20 h-fit'>
                        <div className='relative md:max-w-xl'>
                            <Image
                                src='/your-image.png'
                                className='absolute w-40 lg:w-52 left-48 -top-20 select-none hidden sm:block lg:hidden xl:block'
                                width={160}
                                height={110}
                                alt="design"
                            />
                            <Image
                                src='/line.png'
                                className='absolute w-20 -left-6 -bottom-6 select-none'
                                width={80}
                                height={143}
                                alt="design"
                            />
                            <Phone className='w-64' imgSrc='/testimonials/1.jpg' />
                        </div>
                    </div>
                </MaxWidthWrapper>
            </section>
        </div>
    );
}
