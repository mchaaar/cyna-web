'use client';

import { useState } from 'react';
import AdminTable from '@/components/AdminTable';
import ProductTable from '@/components/ProductTable';
import Header from '@/components/Header';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('users');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
          <nav className="mt-4 flex space-x-4">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2 font-medium rounded ${
                activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 font-medium rounded ${
                activeTab === 'products' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700'
              }`}
            >
              Products
            </button>
          </nav>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
          {activeTab === 'users' ? <AdminTable /> : <ProductTable />}
        </div>
      </div>
    </div>
  );
}
