'use client';

import Link from 'next/link';

export default function CancelPage() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-red-600 mb-4 mt-4">Payment Cancelled</h1>
        <p className="mb-4">Your payment process was cancelled. No charges were made to your account.</p>
        
        <div className="mt-6 space-y-3">
          <Link href="/products" className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            Return to Products
          </Link>
          <Link href="/cart" className="block w-full text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50">
            View Cart
          </Link>
        </div>
      </div>
    </div>
  );
}
