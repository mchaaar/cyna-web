'use client';

import { useState, useEffect } from 'react';
import {
  useGetProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct
} from '@/hooks/useProduct';
import ProductCreateModal from './ProductCreateModal';
import ProductEditModal from './ProductEditModal';
import LoadingSpinner from './LoadingSpinner';

export default function ProductTable() {
  const { data, loading, error, fetchProducts } = useGetProducts();
  const { createProduct, loading: creating } = useCreateProduct();
  const { updateProduct, loading: updating } = useUpdateProduct();
  const { deleteProduct, loading: deleting } = useDeleteProduct();

  const [products, setProducts] = useState([]);
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    fetchProducts().then(response => {
      const list = Array.isArray(response)
        ? response
        : response?.['hydra:member'] || response?.member || [];
      setProducts(list);
    });
  }, [fetchProducts]);

  const refresh = async () => {
    const response = await fetchProducts();
    const list = Array.isArray(response)
      ? response
      : response?.['hydra:member'] || response?.member || [];
    setProducts(list);
  };

  const handleCreate = async data => {
    await createProduct(data);
    setCreateOpen(false);
    refresh();
    setMessage({ type: 'success', text: 'Product created' });
  };

  const handleUpdate = async data => {
    await updateProduct(selected.id, data);
    setEditOpen(false);
    setSelected(null);
    refresh();
    setMessage({ type: 'success', text: 'Product updated' });
  };

  const handleDelete = async id => {
    if (confirm('Delete this product?')) {
      await deleteProduct(id);
      refresh();
      setMessage({ type: 'success', text: 'Product deleted' });
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-4">
      {message.text && (
        <div className={`p-4 rounded ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
          {message.text}
        </div>
      )}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Products</h3>
        <button onClick={() => setCreateOpen(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Add Product
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price/Month</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(p => (
              <tr key={p.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{p.name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${p.amountMonth}</td>
                <td className="px-6 py-4 whitespace-nowrap">{p.active ? 'Yes' : 'No'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  <button onClick={() => { setSelected(p); setEditOpen(true); }} className="text-blue-600 hover:text-blue-900">Edit</button>
                  <button onClick={() => handleDelete(p.id)} disabled={deleting} className="text-red-600 hover:text-red-900 disabled:opacity-50">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ProductCreateModal isOpen={isCreateOpen} onClose={() => setCreateOpen(false)} onSubmit={handleCreate} loading={creating} />

      <ProductEditModal
        isOpen={isEditOpen}
        onClose={() => { setEditOpen(false); setSelected(null); }}
        product={selected}
        onSubmit={handleUpdate}
        loading={updating}
      />
    </div>
  );
}
