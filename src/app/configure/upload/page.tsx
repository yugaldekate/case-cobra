"use client"

import { useState, useTransition } from 'react';
import Dropzone, { FileRejection } from 'react-dropzone';
import { Image, Loader2, MousePointerSquareDashed } from 'lucide-react';

import { cn } from '@/lib/utils';

import { Progress } from '@/components/ui/progress';

const onDropAccepted = () => {}
const onDropRejected = () => {}


const Page = () => {

    const ImageIcon = Image;

    const [isDragOver , setIsDragOver] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const [isPending, startTransition] = useTransition();

    const isUploading = false;

    return (
        <div className={cn(
                'relative flex-1 h-full w-full flex flex-col justify-center items-center my-16 p-2 rounded-xl lg:rounded-2xl bg-gray-900/5 ring-1 ring-inset ring-gray-900/10', 
                { 'ring-blue-900/25 bg-blue-900/10': isDragOver }
            )} 
        >
            <Dropzone 
                onDropRejected={onDropRejected}
                onDropAccepted={onDropAccepted}
                onDragEnter={() => setIsDragOver(true)}
                onDragLeave={() => setIsDragOver(false)}
                accept={{
                    'image/png': ['.png'],
                    'image/jpeg': ['.jpeg'],
                    'image/jpg': ['.jpg'],
                }}
            >
                {({ getRootProps, getInputProps }) => (
                    <div className='h-full w-full flex-1 flex flex-col items-center justify-center' {...getRootProps()}>
                        <input {...getInputProps()} />

                        {isDragOver ? (
                            <MousePointerSquareDashed className='h-6 w-6 text-zinc-500 mb-2' />
                        ) : isUploading || isPending ? (
                            <Loader2 className='animate-spin h-6 w-6 text-zinc-500 mb-2' />
                        ) : (
                            <ImageIcon className='h-6 w-6 text-zinc-500 mb-2'/>
                        )}

                        <div className='flex flex-col justify-center mb-2 text-sm text-zinc-700'>
                            {isUploading ? (
                                <div className='flex flex-col items-center'>
                                    <p>Uploading...</p>
                                    <Progress
                                        value={uploadProgress}
                                        className='mt-2 w-40 h-2 bg-gray-300'
                                    />
                                </div>
                            ) : isPending ? (
                                <div className='flex flex-col items-center'>
                                    <p>Redirecting, please wait...</p>
                                </div>
                            ) : isDragOver ? (
                                <p>
                                    <span className='font-semibold'>Drop file</span> to upload
                                </p>
                            ) : (
                                <p>
                                    <span className='font-semibold cursor-pointer'>Click to upload</span> or
                                    drag and drop
                                </p>
                            )}
                        </div>

                        {isPending ? (
                            null
                        ) : (
                            <p className='text-xs text-zinc-500'>
                                PNG, JPG, JPEG
                            </p>
                        )}
                    </div>    
                )}
            </Dropzone>
            
        </div>
    )
}

export default Page