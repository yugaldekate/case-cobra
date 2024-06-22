import "./globals.css";

import type { Metadata } from "next";
import { Recursive } from "next/font/google";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "@/components/ui/toaster";
import Providers from "@/components/Providers";
import { ModalProvider } from "@/components/ModalProvider";

const recursive = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Case Cobra",
    description: "Your one stop phone-case personalization store",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={recursive.className}>
                <Navbar/>

                <ModalProvider/>

                <main className='flex flex-col min-h-[calc(100vh-3.5rem-1px)] grainy-light'>
                    <div className='flex-1 flex flex-col h-full'>
                        <Providers>
                            {children}
                        </Providers>
                    </div>
                    <Footer/>
                </main>

                <Toaster/>
            </body>
        </html>
    );
}
