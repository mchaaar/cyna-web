'use client';
import { useEffect } from 'react';
import { initializeRoutes } from '@/lib/cache';

export default function RouteLoader() {
    useEffect(() => {
        initializeRoutes();
    }, []);

    return null;
}
