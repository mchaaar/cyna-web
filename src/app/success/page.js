'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      setTimeout(() => {
        setOrderDetails({
          id: 'order-14034056',
          status: 'paid',
          amount: 399.99,
          items: [
            {
              id: 1,
              name: 'Enterprise Security Suite',
              description: 'Comprehensive cybersecurity protection for your business infrastructure',
              quantity: 1,
              price: 399.99,
              image: '/shield.svg'
            }
          ],
          shippingAddress: {
            name: 'Alex Johnson',
            street: '123 Security Lane',
            city: 'Cyber City',
            state: 'CY',
            zip: '90045',
            country: 'USA'
          },
          paymentMethod: 'Visa ending in 4242',
          subtotal: 399.99,
          discount: 0,
          shipping: 0,
          tax: 0,
          total: 399.99
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [searchParams]);
  
  if (loading) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-4">Processing your payment...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="max-w-xl">
          <h1 className="text-base font-medium text-blue-600">Thank you!</h1>
          <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl text-black">
            Your cybersecurity protection is active!
          </p>
          <p className="mt-2 text-base text-gray-500">
            Order #{orderDetails?.id || '14034056'} has been processed successfully.
          </p>

          {orderDetails?.id && (
            <dl className="mt-12 text-sm font-medium">
              <dt className="text-gray-900">Order number</dt>
              <dd className="mt-2 text-blue-600">{orderDetails.id}</dd>
            </dl>
          )}
        </div>

        <div className="mt-10 border-t border-gray-200">
          <div className="sm:ml-40 sm:pl-6">

            <h3 className="sr-only">Summary</h3>

            <dl className="space-y-6 border-t border-gray-200 pt-10 text-sm">
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Subtotal</dt>
                <dd className="text-gray-700">${orderDetails?.subtotal?.toFixed(2) || '399.99'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Tax</dt>
                <dd className="text-gray-700">${orderDetails?.tax?.toFixed(2) || '0.00'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="font-medium text-gray-900">Total</dt>
                <dd className="text-gray-900">${orderDetails?.total?.toFixed(2) || '399.99'}</dd>
              </div>
            </dl>
          </div>
        </div>
        
        <div className="mt-10 flex justify-end">
          <Link
            href="/dashboard"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}