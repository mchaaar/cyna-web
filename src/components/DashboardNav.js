'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function DashboardNav() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const links = [
        { href: '/dashboard', label: 'Overview' },
        { href: '/dashboard/profile', label: 'Profile' },
        { href: '/dashboard/admin', label: 'Admin', role: 'admin' }
    ];

    return (
        <nav className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="p-2 rounded-md text-gray-700"
                        >
                            {isOpen ? (
                                <XMarkIcon className="h-6 w-6" />
                            ) : (
                                <Bars3Icon className="h-6 w-6" />
                            )}
                        </button>
                    </div>
                    <div className="hidden md:flex space-x-8">
                        {links.map(link => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`${pathname === link.href
                                        ? 'border-b-2 border-blue-500 text-gray-900'
                                        : 'text-gray-500 hover:text-gray-700'
                                    } inline-flex items-center px-1 pt-1 text-sm font-medium`}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            <div className={`md:hidden ${isOpen ? 'block' : 'hidden'}`}>
                <div className="pt-2 pb-3 space-y-1">
                    {links.map(link => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="block pl-3 pr-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>
            </div>
        </nav>
    );
}
