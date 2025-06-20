import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ProductEditModal({ isOpen, onClose, onSubmit, product }) {
  const [form, setForm] = useState({
    name: '',
    description: '',
    amountMonth: '',
    amountYear: '',
    active: false,
    discountPercentage: '',
    image1: '',
    image2: '',
    image3: ''
  });

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        description: product.description || '',
        amountMonth: product.amountMonth || '',
        amountYear: product.amountYear || '',
        active: product.active || false,
        discountPercentage: product.discountPercentage || '',
        image1: product.image1 || '',
        image2: product.image2 || '',
        image3: product.image3 || ''
      });
    }
  }, [product]);

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  }

  function submit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <Transition show={isOpen} as={Fragment}>
      <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={onClose}>
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50" onClick={onClose} />
        <div
          className="relative mx-auto my-8 w-full max-w-md sm:max-w-lg md:max-w-xl bg-white rounded-lg shadow-xl"
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
            <h3 className="text-lg font-medium text-gray-900 mb-6">Edit Product</h3>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md"
                  required
                />
              </div>
              <button
                type="submit"
                className="mt-4 inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Update
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
}
