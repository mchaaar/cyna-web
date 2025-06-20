'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import CartModal from './CartModal';

export default function Header() {
  const pathname = usePathname();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { toggleCart, totalItems } = useCart();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { name: 'Home',        href: '/' },
    { name: 'Products',    href: '/products' },
    { name: 'Orders',       href: '/orders',        auth: true },
    { name: 'Subscriptions', href: '/subscriptions', auth: true },
    { name: 'Dashboard',    href: '/dashboard',     auth: true },
    { name: 'Admin',        href: '/admin',         auth: isAdmin() },
  ];

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-40 bg-white ${isScrolled ? 'shadow-sm' : ''}`}>
        <div className="mx-auto max-w-7xl flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center">
            <img src="/cyna.svg" alt="Cyna Logo" className="h-8 w-auto" />
          </Link>

          <nav className="hidden md:flex space-x-6">
            {navItems
              .filter(item => {
                if (item.auth === undefined) return true;
                return item.auth && isAuthenticated;
              })
              .map(item => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`text-sm font-medium ${
                    pathname === item.href ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div
                  onClick={() => toggleCart(true)}
                  className="relative flex items-center text-gray-600 hover:text-gray-900 cursor-pointer"
                  aria-label="Shopping cart"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                       viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {totalItems}
                    </span>
                  )}
                </div>

                <div className="relative">
                  <button
                    onClick={() => setIsCartOpen(prev => !prev)}
                    className="flex items-center text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    {user?.firstName || user?.email.split('@')[0]}
                    <svg className="ml-1 h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.23 8.29a.75.75 0 01.02-1.08z"
                            clipRule="evenodd" />
                    </svg>
                  </button>
                  {isCartOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-md bg-white py-2 shadow-lg">
                      <Link href="/profile"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                      <button onClick={logout}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login"
                      className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign in</Link>
                <Link href="/register"
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <CartModal isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <div className="h-16" />
    </>
  );
}
