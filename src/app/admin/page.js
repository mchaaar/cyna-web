'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import AdminTable from '@/components/AdminTable';
import StatsCard from '@/components/StatsCard';
import Header from '@/components/Header';
import { UsersIcon, ShieldCheckIcon, UserGroupIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    const { user, loading, isAdmin } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && (!user || !isAdmin())) {
            router.push('/unauthorized');
        }
    }, [user, loading, isAdmin, router]);

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

    if (!user || !isAdmin()) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="mt-1 text-sm text-gray-600">
                            Manage users and monitor system activity.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatsCard
                            title="Total Users"
                            value="Loading..."
                            icon={<UserGroupIcon className="h-6 w-6 text-blue-600" />}
                        />
                        <StatsCard
                            title="Administrators"
                            value="Loading..."
                            icon={<ShieldCheckIcon className="h-6 w-6 text-red-600" />}
                        />
                        <StatsCard
                            title="Active Sessions"
                            value="Loading..."
                            icon={<UsersIcon className="h-6 w-6 text-green-600" />}
                        />
                        <StatsCard
                            title="New Users Today"
                            value="Loading..."
                            icon={<UsersIcon className="h-6 w-6 text-purple-600" />}
                        />
                    </div>

                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-6">
                            <AdminTable />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
