'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { Loader2 } from 'lucide-react';

import { getAuthStatus } from './actions';

import { useQuery } from '@tanstack/react-query';
import { useAdmin, useLogin, useModal } from '@/lib/use-modal';

const Page = () => {
    const router = useRouter();
    const [configId, setConfigId] = useState<string | null>(null);

    const {onLogin} = useLogin();
    const {onClose} = useModal();

    useEffect(() => {
        const configurationId = localStorage.getItem('configurationId');
        if (configurationId) { 
            setConfigId(configurationId);
        }
    }, []);

    const { data } = useQuery({
        queryKey: ['auth-callback'],
        queryFn: async () => await getAuthStatus(),
        retry: true,
        retryDelay: 500,
    });
    
    const isAdmin = data?.user.email === "yugaldekate72@gmail.com";
    
    if(data?.success){
        localStorage.setItem('isLogin', JSON.stringify(true));
        localStorage.setItem('isAdmin', JSON.stringify(isAdmin));
        localStorage.setItem('userId', JSON.stringify(data?.user?.id));
    }
    
    if (data?.success) {
        if (configId) {
            onLogin(); //set isLogin = true
            onClose(); //close Login modal
            
            localStorage.removeItem('configurationId');
            router.push(`/configure/preview?id=${configId}`);
        } else {
            router.push('/');
        }
    }

    return (
        <div className='flex justify-center w-full mt-24'>
            <div className='flex flex-col items-center gap-2'>
                <Loader2 className='h-8 w-8 animate-spin text-zinc-500' />
                <h3 className='font-semibold text-xl'>
                    Logging you in...
                </h3>
                <p>
                    You will be redirected automatically.
                </p>
            </div>
        </div>
    )
}

export default Page
