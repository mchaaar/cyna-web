'use client';
import AdminTable from '@/components/AdminTable';
import StatsCard from '@/components/StatsCard';
import { UsersIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
    return (
        <div className="space-y-8 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Administrators"
                    value="5"
                    icon={<ShieldCheckIcon className="h-6 w-6 text-red-600" />}
                />
                <StatsCard
                    title="Total Users"
                    value="1,234"
                    icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">User Management</h2>
                <AdminTable />
            </div>
        </div>
    );
}
