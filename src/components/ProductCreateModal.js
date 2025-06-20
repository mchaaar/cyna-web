import { Dialog, Transition } from '@headlessui/react'
import { Fragment, useState } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function ProductCreateModal({ isOpen, onClose, onSubmit }) {
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
  })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  function submit(e) {
    e.preventDefault()
    const payload = { 
      ...form,
      category: '/api/categories/1',
      status: 1
    }
    if (payload.discountPercentage !== '') {
      payload.discountPercentage = parseInt(payload.discountPercentage, 10)
    }
    onSubmit(payload)
  }

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
            <h3 className="text-lg font-medium text-gray-900 mb-6">Create Product</h3>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Monthly Price</label>
                <input
                  type="number"
                  name="amountMonth"
                  value={form.amountMonth}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Yearly Price</label>
                <input
                  type="number"
                  name="amountYear"
                  value={form.amountYear}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Discount Percentage</label>
                <input
                  type="number"
                  name="discountPercentage"
                  value={form.discountPercentage}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label className="ml-2 block text-sm text-gray-900">Active</label>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image 1 URL</label>
                <input
                  type="text"
                  name="image1"
                  value={form.image1}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image 2 URL</label>
                <input
                  type="text"
                  name="image2"
                  value={form.image2}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image 3 URL</label>
                <input
                  type="text"
                  name="image3"
                  value={form.image3}
                  onChange={handleChange}
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                />
              </div>
              <button
                type="submit"
                className="mt-4 inline-flex justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Save
              </button>
            </form>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  )
}
