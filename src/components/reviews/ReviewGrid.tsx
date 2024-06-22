"use client";

import { useRef } from "react";
import { cn } from "@/lib/utils";

import { useInView } from 'framer-motion';

import ReviewColumn from "@/components/reviews/ReviewColumn";

const PHONES = [
    '/testimonials/1.jpg',
    '/testimonials/2.jpg',
    '/testimonials/3.jpg',
    '/testimonials/4.jpg',
    '/testimonials/5.jpg',
    '/testimonials/6.jpg',
]

// splits an array into 3 or numParts arrays
function splitArray<T>(array: Array<T>, numParts: number) {
    const result: Array<Array<T>> = []; //array of array
  
    for (let i = 0; i < array.length; i++) {
        const index = i % numParts
        if (!result[index]) {
            result[index] = []
        }
        result[index].push(array[i]);
    }
  
    return result;
}

const ReviewGrid = () => {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const isInView = useInView(containerRef, { once: true, amount: 0.4 });

    const columns = splitArray<string>(PHONES, 3);
    const column1 = columns[0];
    const column2 = columns[1];
    const column3 = splitArray<string>(columns[2], 2); // array of array

    return (
        <div ref={containerRef} className='relative h-[49rem] max-h-[150vh] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start gap-8 overflow-hidden px-4 -mx-4 mt-16 sm:mt-20 '>
            {isInView ? (
                <>
                    <ReviewColumn
                        msPerPixel={10}
                        reviews={[...column1, ...column3.flat(), ...column2]}
                        reviewClassName={ (reviewIndex) =>
                            cn({
                                'md:hidden': reviewIndex >= column1.length + column3[0].length, // hide column2 data
                                'lg:hidden': reviewIndex >= column1.length, // hide column3[1] and column2 data
                            })
                        }
                    />

                    <ReviewColumn
                        msPerPixel={15}
                        reviews={[...column2, ...column3[1]]}
                        className='hidden md:block' // hidden on small devies
                        reviewClassName={ (reviewIndex) => reviewIndex >= column2.length ? 'lg:hidden' : '' } // hide column3[1] data
                    />

                    <ReviewColumn
                        msPerPixel={10}
                        reviews={column3.flat()}
                        className='hidden md:block' // hidden on small devices
                    />
                </>
            ) : null}

            <div className='absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-slate-100 pointer-events-none' />
            <div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-100 pointer-events-none' />
        </div>
    )
}

export default ReviewGrid