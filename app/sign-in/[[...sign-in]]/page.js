import { SignIn } from "@clerk/nextjs";
import Link from "next/link";

export default function SignInPage() {
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
                <Link href="/sign-up" className="text-sm/6 font-semibold text-gray-900">
                    Sign Up
                </Link>
                </div>
            </nav>
        </header>

        <main className="px-6 lg:px-8 mb-24 flex flex-col items-center justify-center -mt-16">
            <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56 flex flex-col items-center justify-center">
                <div className="text-center">
                <h2 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl whitespace-nowrap">
                    Login
                </h2>
                <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                    Continue your learning journey
                </p>
                <div className="flex justify-center mt-10">
                    <SignIn />
                </div>
                </div>
            </div>
        </main>
    </div>
  );
    /*
    <div className="min-h-screen bg-gray-900 text-white">
      <header className="bg-transparent border-b border-white/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold">FlashStudy</h1>
            <div className="flex space-x-4">
              <Link href="/" className="text-white hover:text-gray-300">
                Home
              </Link>
              <Link href="/sign-up" className="text-white hover:text-gray-300">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </header>

      
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] px-4">
        <h2 className="text-4xl font-bold mb-8">Sign In</h2>
        <div className="w-full max-w-md">
          <SignIn />
        </div>
      </main>
    </div>
    */
}