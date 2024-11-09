'use client';

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";

export default function Home() {

  const handleSubmit = async () => {
    const checkoutSession = await fetch('/api/checkout_sessions', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    })

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
    if (error) {
      console.warn(error.message)
    }
  }

  const handleSubmitBasic = async () => {
    const checkoutSession = await fetch('/api/basic_ckeckout', {
      method: 'POST',
      headers: {
        origin: 'http://localhost:3000',
      },
    })

    const checkoutSessionJson = await checkoutSession.json();

    if (checkoutSession.statusCode === 500) {
      console.error(checkoutSession.message)
      return
    }

    const stripe = await getStripe()
    const {error} = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    })
    if (error) {
      console.warn(error.message)
    }
  }

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* AppBar */}
      <header className="bg-transparent shadow-none sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-xl font-bold text-gray-900">FlashStudy</h1>
            <div className="flex space-x-4">
              <Link href="/sign-in">
                <a className="text-blue-600 border border-blue-600 rounded-full px-4 py-2">Login</a>
              </Link>
              <Link href="/sign-up">
                <a className="bg-blue-600 text-white rounded-full px-4 py-2">Sign Up</a>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-16 bg-gradient-to-r from-teal-100 to-teal-50">
        <h2 className="text-4xl font-bold mb-4">Welcome to FlashStudy</h2>
        <p className="text-xl mb-8">The easiest way to create flashcards from your text and PDF files.</p>
        <Link href="/generate/">
          <a className="bg-blue-600 text-white rounded-full px-8 py-4">Get Started</a>
        </Link>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center mb-8">Features</h3>
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
              <div key={index} className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300">
                <h4 className="text-xl font-semibold mb-2">{feature.title}</h4>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold mb-8">Pricing</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-lg">
              <h4 className="text-2xl font-semibold mb-2">Basic</h4>
              <p className="text-xl mb-4">$5 / month</p>
              <p className="mb-4">Generate unlimited flashcards from text and test yourself as much as you want. Limited storage.</p>
              <button
                className="bg-blue-600 text-white rounded-full px-8 py-2"
                onClick={() => {
                  // Handle Basic plan selection
                }}
              >
                Choose Basic
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
  