// bg-zinc-900 border-zinc-900
// bg-red-700 border-red-700
// bg-emerald-300 border-emerald-300
// bg-violet-400 border-violet-400
// bg-orange-500 border-orange-500
// bg-gray-800 border-gray-800

import { PRODUCT_PRICES } from "@/config/products";

export const COLORS = [
    { label: 'Black', value: 'black', tw: 'zinc-900' },
    { label: 'Crimson Red', value: 'crimson_red', tw: 'red-700' },
    { label: 'Mint Green', value: 'mint_green', tw: 'emerald-300' },
    { label: 'Lavender', value: 'lavender', tw: 'violet-400' },
    { label: 'Coral', value: 'coral', tw: 'orange-500' },
    { label: 'Charcoal Gray', value: 'charcoal_gray', tw: 'gray-800' },
] as const;



export const MODELS = {
    name: 'models',
    options: [
        {
            label: 'iPhone X',
            value: 'iphonex',
        },
        {
            label: 'iPhone 11',
            value: 'iphone11',
        },
        {
            label: 'iPhone 12',
            value: 'iphone12',
        },
        {
            label: 'iPhone 13',
            value: 'iphone13',
        },
        {
            label: 'iPhone 14',
            value: 'iphone14',
        },
        {
            label: 'iPhone 15',
            value: 'iphone15',
        },
    ],
} as const

export const MATERIALS = {
    name: 'material',
    options: [
        {
            label: 'Silicone',
            value: 'silicone',
            description: undefined,
            price: PRODUCT_PRICES.material.silicone,
        },
        {
            label: 'Soft Polycarbonate',
            value: 'polycarbonate',
            description: 'Scratch-resistant coating',
            price: PRODUCT_PRICES.material.polycarbonate,
        },
    ],
} as const
  
export const FINISHES = {
    name: 'finish',
    options: [
        {
            label: 'Smooth Finish',
            value: 'smooth',
            description: undefined,
            price: PRODUCT_PRICES.finish.smooth,
        },
        {
            label: 'Textured Finish',
            value: 'textured',
            description: 'Soft grippy texture',
            price: PRODUCT_PRICES.finish.textured,
        },
    ],
} as const
  