'use client'

import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ThreeScene from '@/components/ThreeScene';

export default function DashboardLayout({ children }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!user) router.push('/login');
    }, [user]);

    return (
        <div className="min-h-screen bg-gray-50">
            <ThreeScene />
            <nav className="bg-white shadow-sm">
                {/* Navigation items */}
            </nav>
            <main className="p-6">{children}</main>
        </div>
    );
}
