import Image from "next/image";

import ReviewGrid from "@/components/reviews/ReviewGrid";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

const Reviews = () => {
    return (
        <MaxWidthWrapper className='relative max-w-5xl'>
            <Image
                aria-hidden='true'
                width={193}
                height={143}
                src='/what-people-are-buying.png'
                alt="what people are buying"
                className='absolute select-none hidden xl:block -left-32 top-1/3'
            />

            <ReviewGrid/>
    
        </MaxWidthWrapper>
    )
}

export default Reviews