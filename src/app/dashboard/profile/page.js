'use client';
import { useAuth } from '@/hooks/useAuth';
import AnimatedButton from '@/components/AnimatedButton';

export default function ProfilePage() {
    const { user } = useAuth();

    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="bg-white p-8 rounded-xl shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Profile Settings</h2>
                <form className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                            defaultValue={user?.email}
                            className="mt-1 block w-full rounded-md border p-2"
                            disabled
                        />
                    </div>
                    <AnimatedButton type="submit">Update Profile</AnimatedButton>
                </form>
            </div>
        </div>
    );
}
