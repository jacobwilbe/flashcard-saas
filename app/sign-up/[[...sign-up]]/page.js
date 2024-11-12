import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    
    <div className="bg-white">
        <header className="absolute inset-x-0 top-0 z-50 sticky">
            <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                <a href="/" className="-m-1.5 p-1.5">
                    <span className="sr-only">FlashStudy</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                    </svg>  
                </a>
                </div>
                <div className="flex lg:gap-x-12 md:gap-x-6 gap-x-6">
                <Link href="/" className="text-sm/6 font-semibold text-gray-900">
                    Home
                </Link>
                <Link href="/sign-in" className="text-sm/6 font-semibold text-gray-900">
                    Sign In
                </Link>
                </div>
            </nav>
        </header>

        <main className="px-6 lg:px-8 mb-24 flex flex-col items-center justify-center -mt-28">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 flex flex-col items-center justify-center">
                <div className="text-center">
                <h2 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl whitespace-nowrap">
                    Sign Up
                </h2>
                <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                    Start your learning journey with FlashStudy
                </p>
                <div className="flex justify-center mt-10">
                    <SignUp />
                </div>
                </div>
            </div>
        </main>
    </div>
  );
}