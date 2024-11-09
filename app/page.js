'use client';

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Home() {

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
    <div className="bg-gray-50 min-h-screen">
      {/* AppBar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-indigo-600">FlashStudy</h1>
            <div className="flex space-x-4">
              <SignedOut>
                <Link
                  href="/sign-in"
                className="text-indigo-600 border border-indigo-600 rounded-full px-4 py-2 hover:bg-indigo-600 hover:text-white transition-colors">
                  Sign Up
                </Link>
              </SignedOut>
              <SignedIn>
                <Link href="/flashcards" className="bg-indigo-600 text-white rounded-full px-4 py-2 hover:bg-indigo-700 transition-colors">
                  Dashboard
                </Link>
                <UserButton />
              </SignedIn>
            </div>
          </div>
        </div>
      </header>
      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-indigo-100 to-indigo-50">
        <h2 className="text-5xl font-extrabold mb-4 text-gray-900">Welcome to FlashStudy</h2>
        <p className="text-xl mb-8 text-gray-600">The easiest way to create flashcards from your text and PDF files.</p>
        <Link
          href="/generate/"
          className="bg-indigo-600 text-white rounded-full px-8 py-4 hover:bg-indigo-700 transition-colors">
          Get Started
        </Link>
      </section>
      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-8 text-gray-900">Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Easy Text to Flashcards',
                description:
                  'Simply copy and paste your text or upload a PDF file into the app, and we will generate flashcards for you.',
              },
              {
                title: 'Smart Flashcards',
                description:
                  'Our AI intelligently organizes your text into concise flashcards tailored to your learning style.',
              },
              {
                title: 'Accessible Anywhere',
                description:
                  'Access your flashcards from anywhere, on any device, at any time. Study on the go and never miss a beat.',
              },
            ].map((feature, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h4 className="text-xl font-semibold mb-2 text-indigo-600">{feature.title}</h4>
                <p className="text-gray-700">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
      </section>
    </div>
  );
}