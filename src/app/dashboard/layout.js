'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../contexts/AuthContext';

export default function DashboardLayout({ children }) {
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {

    }, []);

    return (
        <div>
            {children}
        </div>
    );
}