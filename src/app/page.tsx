import Image from "next/image";
import MaxWidthWrapper from "@/components/MaxWidthWrapper";

export default function Home() {
    return (
        <div className="bg-slate-50">
            <section>
                <MaxWidthWrapper className='pb-24 sm:pb-32 lg:pb-52 pt-10 lg:pt-24 xl:pt-32 lg:grid lg:grid-cols-3 lg:gap-x-0 xl:gap-x-8'>
                    <div>Case Cobra</div>     
                </MaxWidthWrapper>
            </section>
        </div>
    );
}
