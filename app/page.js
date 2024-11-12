'use client';

import { CloudArrowUpIcon, LockClosedIcon, ServerIcon } from '@heroicons/react/20/solid'

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import Image from "next/image";
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Dialog, DialogPanel } from '@headlessui/react';
import { useState } from 'react';
const features = [
  {
    name: 'Easy Text to Flashcards',
    description:
      'Simply copy and paste your text or upload a PDF file into the app, and we will generate flashcards for you.',
    icon: CloudArrowUpIcon,
  },
  {
    name: 'Smart Flashcards',
    description: 'Our AI intelligently organizes your text into concise flashcards tailored to your learning style.',
    icon: LockClosedIcon,
  },
  {
    name: 'Accessible Anywhere',
    description: 'Access your flashcards from anywhere, on any device, at any time. Study on the go and never miss a beat.',
    icon: ServerIcon,
  },
]

const navigation = [
  { name: 'Home', href: '#home' },
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' }
]

export default function Home() {

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
    if (error) {
      console.warn(error.message);
    }
  };

  const handleSubmitBasic = async () => {
    const checkoutSession = await fetch('/api/basic_ckeckout', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    });

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });
    if (error) {
      console.warn(error.message);
    }
  };

  return (
          <div id="home" className="bg-white">
            <header className="absolute inset-x-0 top-0 z-50 sticky">
              <nav aria-label="Global" className="flex items-center justify-between p-6 lg:px-8">
                <div className="flex lg:flex-1">
                  <a href="#" className="-m-1.5 p-1.5">
                    <span className="sr-only">FlashStudy</span>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                    </svg>  
                  </a>
                </div>
                <div className="hidden lg:flex lg:gap-x-12">
                  {navigation.map((item) => (
                    <a key={item.name} href={item.href} className="text-sm/6 font-semibold text-gray-900">
                      {item.name}
                    </a>
                  ))}
                </div>
                <div className="hidden lg:flex lg:flex-1 lg:justify-end">
                  <SignedOut>
                    <Link href="/sign-in" className="text-sm/6 font-semibold text-gray-900">
                      Log in <span aria-hidden="true">&rarr;</span>
                    </Link>
                  </SignedOut>
                  <SignedIn>
                    <Link href="/flashcards" className="text-sm/6 font-semibold text-gray-900 mr-4">
                      Dashboard
                    </Link>
                    <UserButton className="text-sm/6 font-semibold text-gray-900" />
                  </SignedIn>
                </div>
              </nav>
              <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
                <div className="fixed inset-0 z-50" />
                <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
                  <div className="mt-6 flow-root">
                    <div className="-my-6 divide-y divide-gray-500/10">
                      <div className="space-y-2 py-6">
                        {navigation.map((item) => (
                          <a
                            key={item.name}
                            href={item.href}
                            className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                          >
                            {item.name}
                          </a>
                        ))}
                      </div>
                      <div className="py-6">
                        <a
                          href="#"
                          className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-gray-900 hover:bg-gray-50"
                        >
                          Log in
                        </a>
                      </div>
                    </div>
                  </div>
                </DialogPanel>
              </Dialog>
            </header>

            <div className="relative isolate px-6 pt-14 lg:px-8 mb-24">
              <div
                aria-hidden="true"
                className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
              >
                <div
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                  className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
                />
              </div>
              <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                <div className="text-center">
                  <h1 className="text-balance text-5xl font-semibold tracking-tight text-gray-900 sm:text-7xl whitespace-nowrap">
                    Welcome to FlashStudy
                  </h1>
                  <p className="mt-8 text-pretty text-lg font-medium text-gray-500 sm:text-xl/8">
                    The easiest way to create flashcards from your text and PDF files with the help of generative AI.
                  </p>
                  <div className="mt-10 flex items-center justify-center gap-x-6">
                    <SignedOut>
                      <a
                        href="/sign-in"
                      className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Get started
                      </a>
                    </SignedOut>
                    <SignedIn>
                      <a href="/flashcards" className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                        Dashboard
                      </a>
                    </SignedIn>
                    <a href="#features" className="text-sm/6 font-semibold text-gray-900">
                      Learn more <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
              >
                <div
                  style={{
                    clipPath:
                      'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
                  }}
                  className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
                />
              </div>
            </div>

            <div id="features" className="min-h-screen pt-16 overflow-hidden bg-white py-24 sm:py-32">
              <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2">
                  <div className="lg:pr-8 lg:pt-4">
                    <div className="lg:max-w-lg">
                      <h2 className="text-base/7 font-semibold text-indigo-600">Study Smart</h2>
                      <p className="mt-2 text-pretty text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                        A better learning experience
                      </p>
                      <p className="mt-6 text-lg/8 text-gray-600">
                        Join thousands of learners who have transformed their study habits with FlashStudy.
                      </p>
                      <dl className="mt-10 max-w-xl space-y-8 text-base/7 text-gray-600 lg:max-w-none">
                        {features.map((feature) => (
                          <div key={feature.name} className="relative pl-9">
                            <dt className="inline font-semibold text-gray-900">
                              <feature.icon aria-hidden="true" className="absolute left-1 top-1 h-5 w-5 text-indigo-600" />
                              {feature.name}
                            </dt>{' '}
                            <dd className="inline">{feature.description}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                  <Image
                    alt="Product screenshot"
                    src="/Screenshot 2024-11-11 at 8.45.41 PM.png"
                    width={1500}
                    height={1000}
                    className="w-full sm:w-[48rem] max-w-none rounded-xl shadow-xl ring-1 ring-gray-400/10"
                  />
                </div>
              </div>
            </div>

            
            <div id="pricing" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-96">
              <h3 className="text-3xl font-bold mb-8 text-gray-900">Choose the Right Plan for You</h3>
              <p className="text-xl mb-12 text-gray-600">
                Choose a plan that fits your learning needs and get started with FlashStudy today.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-2xl font-semibold mb-2 text-indigo-600">Free</h4>
                  <p className="mb-4 text-gray-700">The perfect plan if you are just getting started with our product.</p>
                  <ul className="text-left mb-4 text-gray-600">
                    <li>✔️ Weekly Limit of 10 Flashcards generated either from text or PDF</li>
                    <li>✔️ Unlimited Storage</li>
                    <li>✔️ Limit of 5 test sessions per week</li>
                  </ul>
                  <button className="bg-indigo-600 text-white rounded-full px-8 py-2 hover:bg-indigo-700 transition-colors">
                    Get started today
                  </button>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                  <h4 className="text-2xl font-semibold mb-2 text-indigo-600">$20 One Time Payment</h4>
                  <p className="mb-4 text-gray-700">A plan with unlimited learning potential.</p>
                  <ul className="text-left mb-4 text-gray-600">
                    <li>✔️ Unlimited Flashcards generated either from text or PDF</li>
                    <li>✔️ Unlimited Storage</li>
                    <li>✔️ Unlimited Test Sessions</li>
                  </ul>
                  <button className="bg-indigo-600 text-white rounded-full px-8 py-2 hover:bg-indigo-700 transition-colors">
                    Get started today
                  </button>
                </div>
              </div>
            </div>
          </div>
  );
}