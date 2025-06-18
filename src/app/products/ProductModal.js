'use client';

import { useState } from 'react';
import { Dialog, DialogBackdrop, DialogPanel, Radio, RadioGroup } from '@headlessui/react';
import { XMarkIcon, StarIcon } from '@heroicons/react/24/outline';
import { CheckIcon } from '@heroicons/react/20/solid';
import AddToCartButton from '../../components/AddToCartButton';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export default function ProductModal({ product, isOpen, onClose }) {
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  if (!product) return null;

  const periods = [
    { 
      name: 'Monthly', 
      value: 'month',
      description: 'Pay monthly', 
      price: product.amountMonth 
    },
    { 
      name: 'Yearly', 
      value: 'year',
      description: 'Save with annual billing', 
      price: product.amountYear 
    },
  ];

  const currentPrice = selectedPeriod === 'month' ? product.amountMonth : product.amountYear;
  const discountedPrice = product.discountPercentage > 0 
    ? (currentPrice * (1 - product.discountPercentage / 100)).toFixed(2)
    : currentPrice;

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-10">
      <DialogBackdrop
        transition
        className="fixed inset-0 hidden bg-gray-500/75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in md:block"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-stretch justify-center text-center md:items-center md:px-2 lg:px-4">
          <DialogPanel
            transition
            className="flex w-full transform text-left text-base transition data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[enter]:ease-out data-[leave]:duration-200 data-[leave]:ease-in md:my-8 md:max-w-2xl md:px-4 data-[closed]:md:translate-y-0 data-[closed]:md:scale-95 lg:max-w-4xl"
          >
            <div className="relative flex w-full items-center overflow-hidden bg-white px-4 pt-14 pb-8 shadow-2xl sm:px-6 sm:pt-8 md:p-6 lg:p-8">
              <button
                type="button"
                onClick={onClose}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-500 sm:top-8 sm:right-6 md:top-6 md:right-6 lg:top-8 lg:right-8"
              >
                <span className="sr-only">Close</span>
                <XMarkIcon aria-hidden="true" className="size-6" />
              </button>

              <div className="grid w-full grid-cols-1 items-start gap-x-6 gap-y-8 sm:grid-cols-12 lg:gap-x-8">
                <div className="sm:col-span-4 lg:col-span-5">
                  <div className="aspect-square w-full">
                    <img
                      alt={product.name}
                      src={product.image1 || 'https://via.placeholder.com/400x400?text=No+Image'}
                      className="h-full w-full rounded-lg bg-gray-100 object-cover"
                    />
                  </div>
                </div>
                <div className="sm:col-span-8 lg:col-span-7">
                  <h2 className="text-2xl font-bold text-gray-900 sm:pr-12">{product.name}</h2>

                  <section aria-labelledby="information-heading" className="mt-4">
                    <h3 id="information-heading" className="sr-only">
                      Product information
                    </h3>

                    <div className="flex items-center">
                      <div className="flex flex-col">
                        {product.discountPercentage > 0 && (
                          <p className="text-sm text-gray-500 line-through">${currentPrice}</p>
                        )}
                        <p className="text-lg text-gray-900 sm:text-xl font-semibold">
                          ${discountedPrice}/{selectedPeriod}
                        </p>
                      </div>
                      
                      {product.discountPercentage > 0 && (
                        <div className="ml-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            Save {product.discountPercentage}%
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4">
                      <p className="text-base text-gray-700">{product.description}</p>
                    </div>

                    <div className="mt-6 flex items-center">
                      <CheckIcon aria-hidden="true" className="size-5 shrink-0 text-green-500" />
                      <p className="ml-2 font-medium text-gray-500">
                        Available for immediate deployment
                      </p>
                    </div>
                  </section>

                  <section aria-labelledby="options-heading" className="mt-6">
                    <h3 id="options-heading" className="sr-only">
                      Product options
                    </h3>

                    <form>
                      <div className="sm:flex sm:justify-between">
                        <fieldset>
                          <legend className="block text-sm font-medium text-gray-700">Billing Period</legend>
                          <RadioGroup value={selectedPeriod} onChange={setSelectedPeriod}>
                            <div className="mt-1 grid grid-cols-1 gap-4 sm:grid-cols-2">
                              {periods.map((period) => (
                                <Radio
                                  key={period.value}
                                  as="div"
                                  value={period.value}
                                  aria-label={period.name}
                                  aria-description={period.description}
                                  className="group relative block cursor-pointer rounded-lg border border-gray-300 p-4 focus:outline-none data-[focus]:ring-2 data-[focus]:ring-blue-500"
                                >
                                  <p className="text-base font-medium text-gray-900">{period.name}</p>
                                  <p className="mt-1 text-sm text-gray-500">{period.description}</p>
                                  <p className="mt-1 text-sm font-semibold text-gray-900">${period.price}</p>
                                  <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute -inset-px rounded-lg border-2 border-transparent group-data-[checked]:border-blue-500 group-data-[focus]:border"
                                  />
                                </Radio>
                              ))}
                            </div>
                          </RadioGroup>
                        </fieldset>
                      </div>
                      
                      <div className="mt-6">
                        <AddToCartButton product={product} period={selectedPeriod} />
                      </div>
                      
                      <div className="mt-6 text-center">
                        <div className="group inline-flex text-base font-medium">
                          <svg
                            aria-hidden="true"
                            className="mr-2 size-6 shrink-0 text-gray-400 group-hover:text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          </svg>
                          <span className="text-gray-500 group-hover:text-gray-700">Enterprise Security Guarantee</span>
                        </div>
                      </div>
                    </form>
                  </section>
                </div>
              </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
}
