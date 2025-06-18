'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const sessionId = searchParams.get('session_id');
    
    if (sessionId) {
      setTimeout(() => {
        setOrderDetails({
          id: 'order-123',
          status: 'paid',
          amount: 399.99
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
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-green-600 mt-4 mb-4">Payment Successful!</h1>
        <p className="mb-4">Thank you for your purchase. Your payment has been processed successfully.</p>
        
        {orderDetails && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p><strong>Order ID:</strong> {orderDetails.id}</p>
            <p><strong>Status:</strong> {orderDetails.status}</p>
            <p><strong>Amount:</strong> ${orderDetails.amount}</p>
          </div>
        )}
        
        <div className="mt-6 space-y-3">
          <Link href="/orders" className="block w-full bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
            View My Orders
          </Link>
          <Link href="/products" className="block w-full text-blue-600 border border-blue-600 px-4 py-2 rounded hover:bg-blue-50">
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
