"use client"

import Image from 'next/image';
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from './ui/dialog';

import { buttonVariants } from './ui/button';

import { LoginLink, RegisterLink } from '@kinde-oss/kinde-auth-nextjs'

const LoginModal = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: () => void }) => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogContent className='z-[999999]'>
                <DialogHeader>
                    <div className='relative mx-auto w-24 h-24 mb-2'>
                        <Image
                            src='/snake-1.png'
                            alt='snake image'
                            className='object-contain'
                            fill
                        />
                    </div>
                    <DialogTitle className='text-3xl text-center font-bold tracking-tight text-gray-900'>
                        Log in to continue
                    </DialogTitle>
                    <DialogDescription className='text-base text-center py-2'>
                        <span className='font-medium text-zinc-900'>
                            Your configuration was saved!
                        </span>
                        <br/>
                        Please login or create an account to complete your purchase.
                    </DialogDescription>
                </DialogHeader>

                <div className='grid grid-cols-2 gap-6 divide-x divide-gray-200'>
                    <LoginLink className={buttonVariants({ variant: 'outline' })}>
                        Login
                    </LoginLink>
                    <RegisterLink className={buttonVariants({ variant: 'default' })}>
                        Sign up
                    </RegisterLink>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default LoginModal
