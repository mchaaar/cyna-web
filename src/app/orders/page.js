'use client';

import { useState, useEffect } from 'react';
import { useGetOrders } from '../../hooks/useOrder';
import { useGetProducts } from '../../hooks/useProduct';
import { useAuth } from '../../contexts/AuthContext';
import ProtectedRoute from '../../components/ProtectedRoute';
import Header from '../../components/Header';
import Link from 'next/link';

const OrdersPage = () => {
  const { data: ordersResponse, loading: ordersLoading, error: ordersError, fetchOrders } = useGetOrders();
  const { data: productsResponse, loading: productsLoading, error: productsError, fetchProducts } = useGetProducts();
  const { user } = useAuth();
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([fetchOrders(), fetchProducts()]);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [fetchOrders, fetchProducts]);

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

  const getOrderStatus = (status) => {
    switch (status) {
      case 'paid':
        return 'Paid';
      case 'completed':
        return 'Delivered';
      case 'processing':
        return 'Processing';
      case 'pending':
        return 'Pending';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  };

  const calculateOrderTotal = (orderItems) => {
    if (!orderItems || !Array.isArray(orderItems)) return 0;
    return orderItems.reduce((total, item) => total + (item.price || 0), 0);
  };

  if (loading || ordersLoading || productsLoading) {
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

  if (ordersError) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50">
          <Header />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Orders</h2>
              <p className="text-gray-600">{ordersError}</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  const allOrders = ordersResponse?.member || 
                   ordersResponse?.['hydra:member'] || 
                   (Array.isArray(ordersResponse) ? ordersResponse : []);

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="bg-white">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:pb-24">
            <div className="max-w-xl">
              <h1 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">Order history</h1>
              <p className="mt-2 text-sm text-gray-500">
                Check the status of recent orders, manage returns, and download invoices.
              </p>
            </div>

            <div className="mt-16">
              <h2 className="sr-only">Recent orders</h2>

              {allOrders.length === 0 ? (
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h2m0-13h10a2 2 0 012 2v11a2 2 0 01-2 2H9m0-13v13" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by placing your first order.</p>
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
                  {allOrders.map((order) => (
                    <div key={order.id}>
                      <h3 className="sr-only">
                        Order placed on <time dateTime={formatDateTime(order.createdAt)}>{formatDate(order.createdAt)}</time>
                      </h3>

                      <div className="rounded-lg bg-gray-50 px-4 py-6 sm:flex sm:items-center sm:justify-between sm:space-x-6 sm:px-6 lg:space-x-8">
                        <dl className="flex-auto divide-y divide-gray-200 text-sm text-gray-600 sm:grid sm:grid-cols-3 sm:gap-x-6 sm:divide-y-0 lg:w-1/2 lg:flex-none lg:gap-x-8">
                          <div className="max-sm:flex max-sm:justify-between max-sm:py-6 max-sm:first:pt-0 max-sm:last:pb-0">
                            <dt className="font-medium text-gray-900">Date placed</dt>
                            <dd className="sm:mt-1">
                              <time dateTime={formatDateTime(order.createdAt)}>{formatDate(order.createdAt)}</time>
                            </dd>
                          </div>
                          <div className="max-sm:flex max-sm:justify-between max-sm:py-6 max-sm:first:pt-0 max-sm:last:pb-0">
                            <dt className="font-medium text-gray-900">Order number</dt>
                            <dd className="sm:mt-1">#{order.id}</dd>
                          </div>
                          <div className="max-sm:flex max-sm:justify-between max-sm:py-6 max-sm:first:pt-0 max-sm:last:pb-0">
                            <dt className="font-medium text-gray-900">Total amount</dt>
                            <dd className="font-medium text-gray-900 sm:mt-1">
                              {formatPrice(order.total || calculateOrderTotal(order.orderItems))}
                            </dd>
                          </div>
                        </dl>
                      </div>

                      <table className="mt-4 w-full text-gray-500 sm:mt-6">
                        <caption className="sr-only">Products</caption>
                        <thead className="sr-only text-left text-sm text-gray-500 sm:not-sr-only">
                          <tr>
                            <th scope="col" className="py-3 pr-8 font-normal sm:w-2/5 lg:w-1/3">
                              Product
                            </th>
                            <th scope="col" className="hidden w-1/5 py-3 pr-8 font-normal sm:table-cell">
                              Price
                            </th>
                            <th scope="col" className="hidden py-3 pr-8 font-normal sm:table-cell">
                              Status
                            </th>
                            <th scope="col" className="w-0 py-3 text-right font-normal">
                              Info
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 border-b border-gray-200 text-sm sm:border-t">
                          {order.orderItems?.map((orderItem) => {
                            const productId = orderItem.product?.id;
                            const productDetails = products[productId] || null;
                            
                            return (
                              <tr key={orderItem.id}>
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
                                        Period: {orderItem.period || 'N/A'}
                                      </div>
                                      <div className="mt-1 sm:hidden">{formatPrice(orderItem.price)}</div>
                                    </div>
                                  </div>
                                </td>
                                <td className="hidden py-6 pr-8 sm:table-cell">{formatPrice(orderItem.price)}</td>
                                <td className="hidden py-6 pr-8 sm:table-cell">
                                  {getOrderStatus(order.status)}
                                  {order.paidAt && (
                                    <div className="text-xs text-gray-400 mt-1">
                                      Paid: {formatDate(order.paidAt)}
                                    </div>
                                  )}
                                </td>
                                <td className="py-6 text-right font-medium whitespace-nowrap">
                                  <Link href="/products" className="text-indigo-600">
                                    View<span className="hidden lg:inline"> Product</span>
                                    <span className="sr-only">, Product #{productId}</span>
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default OrdersPage;
