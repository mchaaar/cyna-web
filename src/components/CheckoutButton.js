'use client';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useMyCheckout } from '../hooks/usePayment';

const CheckoutButton = ({ onClose }) => {
  const { isAuthenticated } = useAuth();
  const { myCheckout, loading: checkoutLoading } = useMyCheckout();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  const processCheckout = async () => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }

    setIsLoading(true);
    try {
      const response = await myCheckout();
      
      if (response && response.url) {
        window.location.href = response.url;
      } else {
        console.error('Invalid checkout response:', response);
      }
    } catch (error) {
      console.error('Checkout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <button
      type="button"
      onClick={processCheckout}
      disabled={isLoading}
      className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
    >
      {isLoading ? 'Processing...' : 'Checkout'}
    </button>
  );
};

export default CheckoutButton;
