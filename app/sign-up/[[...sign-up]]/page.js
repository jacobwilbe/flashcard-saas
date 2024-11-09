import { SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* AppBar */}
      <header className="bg-transparent border-b border-white/20 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-xl font-bold">FlashStudy</h1>
            <div className="flex space-x-4">
              <Link href="/" className="text-white hover:text-gray-300">
                Home
              </Link>
              <Link href="/sign-in" className="text-white hover:text-gray-300">
                Login
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Sign Up Section */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] px-4">
        <h2 className="text-4xl font-bold mb-8">Sign Up</h2>
        <div className="w-full max-w-md">
          <SignUp />
        </div>
      </main>
    </div>
  );
}