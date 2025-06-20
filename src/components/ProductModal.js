import { Dialog, Transition } from '@headlessui/react'
import { Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function ProductModal({ isOpen, onClose, product }) {
  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50" onClick={onClose} />
        <div
          className="relative mx-auto my-8 w-full max-w-md sm:max-w-lg bg-white rounded-lg shadow-xl"
          onClick={e => e.stopPropagation()}
        >
          <Dialog.Panel className="px-6 py-8 sm:p-8">
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
              onClick={onClose}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h3 className="text-lg font-medium text-gray-900 mb-6">Product Details</h3>
            <div className="space-y-4">
              <p className="text-gray-900"><strong>Name:</strong> {product.name}</p>
              <p className="text-gray-900"><strong>Description:</strong> {product.description}</p>
              <p className="text-gray-900"><strong>Monthly Price:</strong> {product.amountMonth}</p>
              <p className="text-gray-900"><strong>Yearly Price:</strong> {product.amountYear}</p>
              <p className="text-gray-900"><strong>Discount:</strong> {product.discountPercentage}%</p>
              <p className="text-gray-900"><strong>Status:</strong> {product.active ? 'Active' : 'Inactive'}</p>
              {product.image1 && (
                <img src={product.image1} alt="Product image 1" className="mt-2 max-h-40 rounded shadow-sm" />
              )}
              {product.image2 && (
                <img src={product.image2} alt="Product image 2" className="mt-2 max-h-40 rounded shadow-sm" />
              )}
              {product.image3 && (
                <img src={product.image3} alt="Product image 3" className="mt-2 max-h-40 rounded shadow-sm" />
              )}
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  )
}
