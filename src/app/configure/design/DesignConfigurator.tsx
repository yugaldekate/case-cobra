"use client"

import NextImage from "next/image";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Check, ChevronsUpDown } from "lucide-react";


import { Rnd } from 'react-rnd';
import { RadioGroup } from '@headlessui/react';

import { cn, formatPrice } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";

import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import HandleComponent from "@/components/HandleComponent";

import { BASE_PRICE } from "@/config/products";
import { COLORS, FINISHES, MATERIALS, MODELS } from "@/validators/option-validator";

import { SaveConfigArgs, saveConfig } from "./actions";
import { useMutation } from "@tanstack/react-query";


interface DesignConfiguratorProps {
    configId: string
    imageUrl: string
    imageDimensions: { width: number; height: number }
}

const DesignConfigurator = ({configId, imageUrl, imageDimensions}: DesignConfiguratorProps) => {

    const { toast } = useToast();
    const router = useRouter();

    const [options, setOptions] = useState<{ color: (typeof COLORS)[number], model: (typeof MODELS.options)[number], material: (typeof MATERIALS.options)[number], finish: (typeof FINISHES.options)[number]}>({
        color: COLORS[0],
        model: MODELS.options[0],
        material: MATERIALS.options[0],
        finish: FINISHES.options[0],
    });

    //dimension of the Rnd image 
    const [renderedDimension, setRenderedDimension] = useState({
        width: imageDimensions.width / 4,
        height: imageDimensions.height / 4,
    });
    
    //position of Rnd image from the parent's boundary
    const [renderedPosition, setRenderedPosition] = useState({
        x: 150,
        y: 205,
    });

    const containerRef = useRef<HTMLDivElement>(null);
    const phoneCaseRef = useRef<HTMLDivElement>(null);

    const { startUpload } = useUploadThing('imageUploader');

    const saveConfiguration = async() => {
        try {
            const { left: containerLeft, top: containerTop } = containerRef.current!.getBoundingClientRect();
            const { left: caseLeft, top: caseTop, width, height } = phoneCaseRef.current!.getBoundingClientRect();

            const leftOffset = caseLeft - containerLeft;
            const topOffset = caseTop - containerTop;
           
            const actualX = renderedPosition.x - leftOffset; // position of image on left from canvas
            const actualY = renderedPosition.y - topOffset; // position of image on top from canvas

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d'); //2D canvas

            const userImage = new Image();

            userImage.src = imageUrl;
            userImage.crossOrigin = 'anonymous';

            await new Promise((resolve) => (userImage.onload = resolve)); // wait until the image loads

            ctx?.drawImage(
                userImage,
                actualX,
                actualY,
                renderedDimension.width,
                renderedDimension.height
            );

            const base64ToBlob = (base64: string, mimeType: string) => {
                const byteCharacters = atob(base64);
                const byteNumbers = new Array(byteCharacters.length);

                for (let i = 0; i < byteCharacters.length; i++) {
                    byteNumbers[i] = byteCharacters.charCodeAt(i);
                }

                const byteArray = new Uint8Array(byteNumbers);

                return new Blob([byteArray], { type: mimeType });
            }

            const base64 = canvas.toDataURL();
            const base64Data = base64.split(',')[1];

            const blob = base64ToBlob(base64Data, 'image/png');

            const file = new File([blob], 'filename.png', { type: 'image/png' });

            await startUpload([file], { configId: configId });
        } catch (error) {
            toast({
                title: 'Something went wrong',
                description: 'There was a problem saving your config, please try again.',
                variant: 'destructive',
            });
        }
    }

    const { mutate, isPending } = useMutation({
        mutationKey: ['save-config'],
        mutationFn: async (args: SaveConfigArgs) => {
            // await Promise.all([ saveConfiguration(), saveConfig(args) ]);

            try {
                await saveConfiguration();
            } catch (error) {
                console.log('Failed to save configuration');
            }
        
            try {
                await saveConfig(args);
            } catch (error) {
                console.log('Failed to save config');
            }
        },
        onError: () => {
            toast({
                title: 'Something went wrong',
                description: 'There was an error on our end. Please try again.',
                variant: 'destructive',
            });
        },
        onSuccess: () => {
            router.push(`/configure/preview?id=${configId}`);
        },
    });

    return (
        <div className='relative grid grid-cols-1 lg:grid-cols-3 mt-20 mb-20 pb-20'>
            <div ref={containerRef} className='relative col-span-2 flex items-center justify-center overflow-hidden h-[37.5rem] w-full max-w-4xl rounded-lg border-2 border-dashed border-gray-300 p-12 text-center focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2'>
                <div className='relative w-60 bg-opacity-50 pointer-events-none aspect-[896/1831]'>
                    <AspectRatio
                        ref={phoneCaseRef}
                        ratio={896 / 1831}
                        className='relative z-50 pointer-events-none aspect-[896/1831] w-full'
                    >
                        <NextImage
                            fill
                            alt='phone image'
                            src='/phone-template.png'
                            className='pointer-events-none z-50 select-none'
                        />
                    </AspectRatio>
                    <div className='absolute z-40 inset-0 left-[3px] top-[1px] right-[3px] bottom-[1px] rounded-[32px] shadow-[0_0_0_99999px_rgba(229,231,235,0.6)]' />
                    <div
                        className={cn(
                            'absolute inset-0 left-[3px] top-[1px] right-[3px] bottom-[1px] rounded-[32px]',
                            `bg-${options.color.tw}`
                        )}
                    />
                </div>

                <Rnd
                    lockAspectRatio= {true}
                    default={{
                        x: 150, //distance from left of page
                        y: 205, //distance from top of page
                        height: imageDimensions.height / 4,
                        width: imageDimensions.width / 4,
                    }}
                    onResizeStop={( _, __, ref, ___, { x, y } ) => {
                        setRenderedDimension({
                            width: parseInt(ref.style.width.slice(0, -2)), //40px , -2 is the remove px from the last of string
                            height: parseInt(ref.style.height.slice(0, -2)), //50px , -2 is to remove px from the last of string
                        });
            
                        setRenderedPosition({ x, y });
                    }}
                    onDragStop={(_, data) => {
                        const { x, y } = data;
                        setRenderedPosition({ x, y });
                    }}
                    resizeHandleComponent={{
                        bottomRight: <HandleComponent />,
                        bottomLeft: <HandleComponent />,
                        topRight: <HandleComponent />,
                        topLeft: <HandleComponent />,
                    }}
                    className='absolute z-20 border-[3px] border-primary'
                >
                    <div className='relative w-full h-full'>
                        <NextImage
                            fill
                            src={imageUrl}
                            alt='your image'
                            className='pointer-events-none'
                        />
                    </div>
                </Rnd>    
            </div>

            <div className="col-span-full lg:col-span-1 flex flex-col h-[37.5rem] w-full bg-white">
                <ScrollArea className='relative flex-1 overflow-auto'>
                    {/* shadow */}
                    <div
                        aria-hidden='true'
                        className='absolute z-10 inset-x-0 bottom-0 h-12 bg-gradient-to-t from-white pointer-events-none'
                    />

                    <div className='px-8 pb-12 pt-8'>
                        <h2 className='tracking-tight font-bold text-3xl'>
                            Customize your case
                        </h2>

                        <div className='w-full h-px bg-zinc-200 my-6' />

                        <div className='relative mt-4 h-full flex flex-col justify-between'>
                            <div className='flex flex-col gap-6'>
                                <RadioGroup
                                    value={options.color}
                                    onChange={(val) => { setOptions((prev) => ({ ...prev, color: val }))
                                }}>
                                    <Label> Color: {options.color.label} </Label>

                                    <div className='mt-3 flex items-center space-x-3'>
                                        {COLORS.map((color) => (
                                            <RadioGroup.Option
                                                key={color.label}
                                                value={color}
                                                className={({ active, checked }) =>
                                                    cn('relative flex items-center justify-center cursor-pointer rounded-full -m-0.5 p-0.5 active:ring-0 active:outline-none focus:ring-0 focus:outline-none border-2 border-transparent',
                                                        {
                                                            [`border-${color.tw}`]: checked,
                                                        }
                                                    )
                                                }
                                            >
                                                <span
                                                    className={cn(
                                                        `bg-${color.tw}`,
                                                        'h-8 w-8 rounded-full border border-black border-opacity-10'
                                                    )}
                                                />
                                            </RadioGroup.Option>
                                        ))}
                                    </div>
                                </RadioGroup>

                                <div className='relative flex flex-col gap-3 w-full'>
                                    <Label>Model</Label>

                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button
                                                variant='outline'
                                                role='combobox'
                                                className='w-full justify-between'
                                            >
                                                {options.model.label}
                                                <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                                            </Button>
                                        </DropdownMenuTrigger>

                                        <DropdownMenuContent>
                                            {MODELS.options.map((model) => (
                                                <DropdownMenuItem
                                                    key={model.label}
                                                    className={cn(
                                                        'flex items-center text-sm gap-1 p-1.5 cursor-default hover:bg-zinc-100',
                                                        {
                                                            'bg-zinc-100': model.label === options.model.label,
                                                        }
                                                    )}
                                                    onClick={() => { setOptions( (prev) => ({ ...prev, model: model }) ) }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            'mr-2 h-4 w-4 text-bold text-[#178B3C]',
                                                            model.label === options.model.label ? 'opacity-100' : 'opacity-0'
                                                        )}
                                                    />
                                                    {model.label}
                                                </DropdownMenuItem>
                                            ))}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                {[MATERIALS, FINISHES].map(({ name, options: selectableOptions }) => (
                                        <RadioGroup
                                            key={name}
                                            value={options[name]}
                                            onChange={(val) => { setOptions((prev) => ({ ...prev, [name]: val })) }}
                                        >
                                            <Label>
                                                {name.slice(0, 1).toUpperCase() + name.slice(1)} {/* {making 1st character capital} */}
                                            </Label>

                                            <div className='mt-3 space-y-4'>
                                                {selectableOptions.map((option) => (
                                                    <RadioGroup.Option
                                                        key={option.value}
                                                        value={option}
                                                        className={({ active, checked }) =>
                                                            cn(
                                                                'relative block sm:flex sm:justify-between cursor-pointer rounded-lg bg-white px-6 py-4 shadow-sm border-2 border-zinc-200 ring-0 outline-none focus:outline-none focus:ring-0',
                                                                {
                                                                    'border-primary': active || checked,
                                                                }
                                                            )
                                                        }
                                                    >
                                                        <span className='flex items-center'>
                                                            <span className='flex flex-col text-sm'>
                                                                <RadioGroup.Label
                                                                    as='span'
                                                                    className='font-medium text-gray-900'
                                                                >
                                                                    {option.label}
                                                                </RadioGroup.Label>

                                                                {option.description ? (
                                                                    <RadioGroup.Description
                                                                        as='span'
                                                                        className='text-gray-500'
                                                                    >
                                                                        <span className='block sm:inline'>
                                                                            {option.description}
                                                                        </span>
                                                                    </RadioGroup.Description>
                                                                ) : null}
                                                            </span>
                                                        </span>

                                                        {option.price ? (
                                                            <RadioGroup.Description
                                                                as='span'
                                                                className='mt-2 flex text-sm sm:ml-4 sm:mt-0 sm:flex-col sm:text-right'
                                                            >
                                                                <span className='font-medium text-gray-900'>
                                                                    <span className="text-lg">+</span> {formatPrice(option.price / 100)}
                                                                </span>
                                                            </RadioGroup.Description>
                                                        ) : null}
                                                    </RadioGroup.Option>
                                                ))}
                                            </div>
                                        </RadioGroup>
                                    )
                                    )}
                            </div>
                        </div>    
                    </div>
                </ScrollArea>

                <div className='w-full px-8 h-16 bg-white'>
                    <div className='h-px w-full bg-zinc-200' />
                    <div className='w-full h-full flex justify-end items-center'>
                        <div className='w-full flex gap-6 items-center'>
                            <p className='font-medium whitespace-nowrap'>
                                {formatPrice((BASE_PRICE + options.finish.price + options.material.price) / 100)}
                            </p>

                            <Button
                                size='sm'
                                className='w-full'
                                disabled={isPending}
                                isLoading={isPending}
                                loadingText="Saving"
                                onClick={ () =>
                                    mutate({
                                        configId: configId,
                                        color: options.color.value,
                                        finish: options.finish.value,
                                        material: options.material.value,
                                        model: options.model.value,
                                    })
                                }
                            >
                                Continue
                                <ArrowRight className='h-4 w-4 ml-1.5 inline' />
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DesignConfigurator