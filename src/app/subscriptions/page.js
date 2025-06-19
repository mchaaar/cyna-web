'use client';

import { useState, useEffect } from 'react';
import { useGetMySubscriptions, useCancelSubscription } from '../../hooks/useSubscription';
import { useGetProducts } from '../../hooks/useProduct';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Header from '../../components/Header';
import Link from 'next/link';

const SubscriptionsPage = () => {
  const { data: subscriptionsResponse, loading: subscriptionsLoading, error: subscriptionsError, fetchMySubscriptions } = useGetMySubscriptions();
  const { data: productsResponse, loading: productsLoading, error: productsError, fetchProducts } = useGetProducts();
  const { cancelSubscription, loading: cancelLoading } = useCancelSubscription();
  const { user } = useAuth();
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [cancelError, setCancelError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchMySubscriptions(), fetchProducts()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [fetchMySubscriptions, fetchProducts]);

  useEffect(() => {
    if (productsResponse) {
      const productMap = {};
      const allProducts = productsResponse?.member || 
                         productsResponse?.['hydra:member'] || 
                         (Array.isArray(productsResponse) ? productsResponse : []);
      
      allProducts.forEach(product => {
        productMap[product.id] = product;
      });
      
      setProducts(productMap);
    }
  }, [productsResponse]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  };

  const formatPrice = (amount) => {
    if (typeof amount === 'number') {
      return `$${amount.toFixed(2)}`;
    }
    return '$0.00';
  };

  const getSubscriptionStatus = (status) => {
    switch (status) {
      case 'active':
        return 'Active';
      case 'canceled':
        return 'Canceled';
      case 'past_due':
        return 'Past Due';
      case 'pending':
        return 'Pending';
      default:
        return 'Unknown';
    }
  };

  const handleCancelSubscription = async (id) => {
    if (window.confirm('Are you sure you want to cancel this subscription?')) {
      try {
        setLoading(true);
        setCancelError(null);
        await cancelSubscription(id);
        setSuccessMessage('Subscription canceled successfully');
        await fetchMySubscriptions();
      } catch (error) {
        console.error('Error canceling subscription:', error);
        setCancelError(error.message || 'Failed to cancel subscription');
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading || subscriptionsLoading || productsLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (subscriptionsError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Subscriptions</h2>
              <p className="text-gray-600">{subscriptionsError}</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const allSubscriptions = subscriptionsResponse?.member || 
                          subscriptionsResponse?.['hydra:member'] || 
                          (Array.isArray(subscriptionsResponse) ? subscriptionsResponse : []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
            <div className="max-w-xl">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Subscriptions</h1>
              <p className="mt-2 text-sm text-gray-500">
                Manage your active subscriptions, view details, and cancel if needed.
              </p>
            </div>

            {successMessage && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {cancelError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
                <p className="text-sm text-red-700">{cancelError}</p>
              </div>
            )}

            <div className="mt-16">
              <h2 className="sr-only">Active subscriptions</h2>

              {allSubscriptions.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-13h10a2 2 0 012 2v11a2 2 0 01-2 2H9m0-13v13" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No subscriptions found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by subscribing to our products.</p>
                  <div className="mt-6">
                    <Link
                      href="/products"
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Browse Products
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="space-y-20">
                  {allSubscriptions.map((subscription) => {
                    const productId = subscription.product?.id;
                    const productDetails = products[productId] || null;
                    
                    return (
                      <div key={subscription.id}>
                        <div className="rounded-lg bg-gray-50 px-4 py-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                          <dl className="flex-auto divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
                            <div className="max-sm:flex max-sm:justify-between max-sm:py-6 max-sm:first:pt-0 max-sm:last:pb-0">
                              <dt className="font-medium text-gray-900">Start date</dt>
                              <dd className="sm:mt-1">
                                <time dateTime={formatDateTime(subscription.startDate)}>{formatDate(subscription.startDate)}</time>
                              </dd>
                            </div>
                            <div className="max-sm:flex max-sm:justify-between max-sm:py-6 max-sm:first:pt-0 max-sm:last:pb-0">
                              <dt className="font-medium text-gray-900">Subscription ID</dt>
                              <dd className="sm:mt-1">#{subscription.id}</dd>
                            </div>
                            <div className="max-sm:flex max-sm:justify-between max-sm:py-6 max-sm:first:pt-0 max-sm:last:pb-0">
                              <dt className="font-medium text-gray-900">Status</dt>
                              <dd className="sm:mt-1">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  subscription.status === 'active' ? 'bg-green-100 text-green-800' : 
                                  subscription.status === 'canceled' ? 'bg-red-100 text-red-800' : 
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {getSubscriptionStatus(subscription.status)}
                                </span>
                              </dd>
                            </div>
                          </dl>
                        </div>

                        <table className="mt-4 w-full text-gray-500 sm:mt-6">
                          <caption className="sr-only">Subscription</caption>
                          <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                            <tr>
                              <th scope="col" className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">
                                Product
                              </th>
                              <th scope="col" className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">
                                Price
                              </th>
                              <th scope="col" className="hidden py-3 pr-8 font-normal sm:table-cell">
                                Billing Cycle
                              </th>
                              <th scope="col" className="w-0 py-3 text-right font-normal">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                            <tr>
                              <td className="py-6 pr-8">
                                <div className="flex items-center">
                                  <img
                                    alt={productDetails?.name || `Product ${productId || 'Unknown'}`}
                                    src={productDetails?.image1 || "https://via.placeholder.com/64x64?text=Product"}
                                    className="mr-6 size-16 rounded-sm object-cover"
                                  />
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      {productDetails?.name || `Product #${productId || 'Unknown'}`}
                                    </div>
                                    <div className="mt-1 text-gray-500">
                                      Next billing: {subscription.nextBillingDate ? formatDate(subscription.nextBillingDate) : 'N/A'}
                                    </div>
                                    <div className="mt-1 sm:hidden">{formatPrice(subscription.amount)}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="hidden py-6 pr-8 sm:table-cell">{formatPrice(subscription.amount)}</td>
                              <td className="hidden py-6 pr-8 sm:table-cell">
                                {subscription.period === 'month' ? 'Monthly' : 'Yearly'}
                              </td>
                              <td className="py-6 text-right font-medium whitespace-nowrap">
                                <button
                                  onClick={() => handleCancelSubscription(subscription.id)}
                                  disabled={cancelLoading || subscription.status === 'canceled'}
                                  className={`inline-flex items-center justify-center rounded-full w-8 h-8 ${
                                    subscription.status === 'canceled' 
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                      : 'bg-red-100 text-red-600 hover:bg-red-200'
                                  }`}
                                >
                                  <span className="sr-only">Cancel subscription</span>
                                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default SubscriptionsPage;
