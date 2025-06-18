'use client';

import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/16/solid';
import { useCart } from '../contexts/CartContext';

const CartModal = () => {
  const { 
    items, 
    isOpen, 
    toggleCart, 
    subtotal, 
    updateQuantity, 
    removeItem,
    clearCart
  } = useCart();

  const handleQuantityChange = (id, period, newQuantity) => {
    updateQuantity(id, period, newQuantity);
  };

  const handleRemoveItem = (id, period) => {
    if (confirm('Are you sure you want to remove this item?')) {
      updateQuantity(id, period, 0);
    }
  };

  const shipping = 0;
  const tax = subtotal * 0.2;
  const total = subtotal + shipping + tax;

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={() => toggleCart(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500/75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-stretch justify-center text-center sm:items-center sm:px-6 lg:px-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-105"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-105"
            >
              <Dialog.Panel className="flex w-full transform text-left text-base transition sm:my-8 sm:max-w-3xl">
                <form className="relative flex w-full flex-col overflow-hidden bg-white pt-6 pb-8 sm:rounded-lg sm:pb-6 lg:py-8">
                  <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
                    <Dialog.Title className="text-lg font-medium text-gray-900">Shopping Cart</Dialog.Title>
                    <button 
                      type="button" 
                      onClick={() => toggleCart(false)} 
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <span className="sr-only">Close</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  <section aria-labelledby="cart-heading">
                    <h2 id="cart-heading" className="sr-only">
                      Items in your shopping cart
                    </h2>

                    {items.length === 0 ? (
                      <div className="px-4 py-12 text-center sm:px-6 lg:px-8">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                          />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-gray-900">Your cart is empty</h3>
                        <p className="mt-1 text-sm text-gray-500">Start by adding some products to your cart.</p>
                      </div>
                    ) : (
                      <ul role="list" className="divide-y divide-gray-200 px-4 sm:px-6 lg:px-8">
                        {items.map((item) => (
                          <li key={`${item.id}-${item.period}`} className="flex py-8 text-sm sm:items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-24 w-24 flex-none rounded-lg border border-gray-200 object-cover object-center sm:h-32 sm:w-32"
                            />
                            <div className="ml-4 grid flex-auto grid-cols-1 grid-rows-1 items-start gap-x-5 gap-y-3 sm:ml-6 sm:flex sm:items-center sm:gap-0">
                              <div className="row-end-1 flex-auto sm:pr-6">
                                <h3 className="font-medium text-gray-900">{item.name}</h3>
                                <p className="mt-1 text-gray-500">
                                  {item.period === 'month' ? 'Monthly' : 'Yearly'} subscription
                                </p>
                              </div>
                              <p className="row-span-2 row-end-2 font-medium text-gray-900 sm:order-1 sm:ml-6 sm:w-1/3 sm:flex-none sm:text-right">
                                ${item.price.toFixed(2)}
                              </p>
                              <div className="flex items-center sm:block sm:flex-none sm:text-center">
                                <div className="flex items-center">
                                  <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.id, item.period, item.quantity - 1)}
                                    className="p-1 text-gray-500 hover:text-gray-700"
                                  >
                                    <ChevronDownIcon className="h-5 w-5" aria-hidden="true" />
                                  </button>
                                  <span className="mx-2 text-gray-900">{item.quantity}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleQuantityChange(item.id, item.period, item.quantity + 1)}
                                    className="p-1 text-gray-500 hover:text-gray-700"
                                  >
                                    <ChevronUpIcon className="h-5 w-5" aria-hidden="true" />
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveItem(item.id, item.period)}
                                  className="ml-4 font-medium text-indigo-600 hover:text-indigo-500 sm:mt-2 sm:ml-0"
                                >
                                  <span>Remove</span>
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>

                  {items.length > 0 && (
                    <section aria-labelledby="summary-heading" className="mt-auto sm:px-6 lg:px-8">
                      <div className="bg-gray-50 p-6 sm:rounded-lg sm:p-8">
                        <h2 id="summary-heading" className="sr-only">
                          Order summary
                        </h2>

                        <div className="flow-root">
                          <dl className="-my-4 divide-y divide-gray-200 text-sm">
                            <div className="flex items-center justify-between py-4">
                              <dt className="text-gray-600">Subtotal</dt>
                              <dd className="font-medium text-gray-900">${subtotal.toFixed(2)}</dd>
                            </div>
                            <div className="flex items-center justify-between py-4">
                              <dt className="text-gray-600">Shipping</dt>
                              <dd className="font-medium text-gray-900">Free</dd>
                            </div>
                            <div className="flex items-center justify-between py-4">
                              <dt className="text-gray-600">Tax</dt>
                              <dd className="font-medium text-gray-900">${tax.toFixed(2)}</dd>
                            </div>
                            <div className="flex items-center justify-between py-4">
                              <dt className="text-base font-medium text-gray-900">Order total</dt>
                              <dd className="text-base font-medium text-gray-900">${total.toFixed(2)}</dd>
                            </div>
                          </dl>
                        </div>
                      </div>
                    </section>
                  )}

                  <div className="mt-8 flex justify-end px-4 sm:px-6 lg:px-8 space-x-4">
                    {items.length > 0 && (
                      <button
                        type="button"
                        onClick={clearCart}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        Clear Cart
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => toggleCart(false)}
                      className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Continue Shopping
                    </button>
                    {items.length > 0 && (
                      <button
                        type="submit"
                        className="rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                      >
                        Checkout
                      </button>
                    )}
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CartModal;
