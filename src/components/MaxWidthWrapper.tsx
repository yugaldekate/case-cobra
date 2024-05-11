import { cn } from "@/lib/utils"
import { ReactNode } from "react"

const MaxWidthWrapper = ({className, children}: {className?: string, children: ReactNode}) => {
    return (
        <div className={cn("h-full w-full max-w-screen-xl mx-auto px-2.5 md:px-20 border border-blue-400", className)}>
            {children}
        </div>
    )
}

export default MaxWidthWrapper