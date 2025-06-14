'use client';
import DashboardNav from '@/components/DashboardNav';
import StatsCard from '@/components/StatsCard';
import { ChartBarIcon, UsersIcon } from '@heroicons/react/24/outline';

export default function DashboardPage() {
    return (
        <div className="space-y-8 p-4">
            <DashboardNav />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatsCard
                    title="Total Users"
                    value="1,234"
                    icon={<UsersIcon className="h-6 w-6 text-blue-600" />}
                />
                <StatsCard
                    title="Active Sessions"
                    value="89"
                    icon={<ChartBarIcon className="h-6 w-6 text-green-600" />}
                />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm">
                <h2 className="text-xl font-bold mb-4">Recent Activity</h2>
            </div>
        </div>
    );
}
