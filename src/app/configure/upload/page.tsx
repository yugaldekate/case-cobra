"use client"

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Image, Loader2, MousePointerSquareDashed } from 'lucide-react';

import { cn } from '@/lib/utils';
import { useUploadThing } from '@/lib/uploadthing';

import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';

import Dropzone, { FileRejection } from 'react-dropzone';

const Page = () => {

    const ImageIcon = Image;

    const router = useRouter();
    const { toast } = useToast();

    const [isDragOver , setIsDragOver] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);

    const [isPending, startTransition] = useTransition();

    const { startUpload, isUploading } = useUploadThing('imageUploader', {
        onClientUploadComplete: async ([data]) => {
            const configId = data.serverData.configId;

            startTransition(() => {
                router.push(`/configure/design?id=${configId}`);
            });
        },
        onUploadProgress(p) {
            setUploadProgress(p);
        },
    });

    const onDropAccepted = async(acceptedFiles: File[]) => {
        await startUpload(acceptedFiles, { configId: undefined });
    
        setIsDragOver(false);
    };

    const onDropRejected = (rejectedFiles: FileRejection[]) => {
        const file = rejectedFiles[0];

        setIsDragOver(false);

        toast({
            title: `${file.file.type} type is not supported.`,
            description: "Please choose a PNG, JPG, or JPEG image instead.",
            variant: "destructive"
        });
    };

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