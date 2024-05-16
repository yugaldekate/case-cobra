"use client";

import { cn } from '@/lib/utils';
import { useEffect, useRef, useState } from 'react';

import Review from '@/components/reviews/Review';

interface ReviewColumnProps {
    reviews: string[],
    className?: string,
    msPerPixel?: number,
    reviewClassName?: (reviewIndex: number) => string,
}

const ReviewColumn = ({ reviews, className, reviewClassName, msPerPixel = 0 }: ReviewColumnProps) => {
    const columnRef = useRef<HTMLDivElement | null>(null);

    const [columnHeight, setColumnHeight] = useState(0);
    const duration = `${columnHeight * msPerPixel}ms`; // msPerPixel = time taken to animate 1px, so columnHeight in px * msPerPixel time to animate 1 column

    // keep track if the column size changes due to browser resize
    useEffect(() => {
        if (!columnRef.current) return;
    
        const resizeObserver = new window.ResizeObserver(() => {
            setColumnHeight(columnRef.current?.offsetHeight ?? 0);
        })
    
        resizeObserver.observe(columnRef.current); // observe the column height
    
        return () => {
            resizeObserver.disconnect();
        }
    }, []);

    return (
        <div
            ref={columnRef}
            className={cn('animate-marquee space-y-8 py-4', className)}
            style={{ '--marquee-duration': duration } as React.CSSProperties}
        >
            {reviews.concat(reviews).map((imgSrc, reviewIndex) => (
                <Review
                    key={reviewIndex}
                    imgSrc={imgSrc}
                    className={reviewClassName?.(reviewIndex % reviews.length)}
                />
            ))}
        </div>
    )
}

export default ReviewColumn