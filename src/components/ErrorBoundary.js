'use client';
import { useEffect } from 'react';
import AnimatedButton from '@/components/AnimatedButton';

export default function ErrorBoundary({ error, reset }) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-red-50">
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-red-600 mb-4">
                    Something went wrong!
                </h2>
                <AnimatedButton onClick={reset}>Try Again</AnimatedButton>
            </div>
        </div>
    );
}
