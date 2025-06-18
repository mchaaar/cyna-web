'use client';

import { useState, useEffect } from 'react';
import { useGetProducts } from '../../hooks/useProduct';
import Header from '../../components/Header';
import ProductModal from './ProductModal';

export default function ProductsPage() {
  const { data: productsResponse, loading, error, fetchProducts } = useGetProducts();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const allProducts = productsResponse?.['hydra:member'] || 
                  productsResponse?.['member'] || 
                  (Array.isArray(productsResponse) ? productsResponse : []);
  
  const products = allProducts.filter(product => product.active);

  const openProductModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Products</h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Cybersecurity Products</h1>
            <p className="mt-2 text-gray-600">Discover our comprehensive security solutions</p>
          </div>

          <h2 id="products-heading" className="sr-only">
            Products
          </h2>

          <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {products.map((product) => (
              <button
                key={product.id}
                onClick={() => openProductModal(product)}
                className="group text-left w-full"
              >
                <img
                  alt={product.name}
                  src={product.image1 || 'https://via.placeholder.com/400x400?text=No+Image'}
                  className="aspect-square w-full overflow-hidden rounded-lg object-cover group-hover:opacity-75 sm:aspect-[4/3]"
                />
                <div className="mt-4 flex items-center justify-between text-base font-medium text-gray-900">
                  <h3>{product.name}</h3>
                  <div className="flex flex-col items-end">
                    {product.discountPercentage > 0 && (
                      <span className="text-sm text-red-600 font-medium">
                        -{product.discountPercentage}%
                      </span>
                    )}
                    <p>${product.amountMonth}/month</p>
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-500 italic line-clamp-2">{product.description}</p>
                <div className="mt-2">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Available
                  </span>
                </div>
              </button>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-12">
              <h3 className="mt-2 text-sm font-medium text-gray-900">No products found</h3>
              <p className="mt-1 text-sm text-gray-500">Get started by adding some products.</p>
            </div>
          )}
        </div>
      </div>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      )}
    </div>
  );
}
