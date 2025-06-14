'use client';

import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';

export default function Register() {
    const { login } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <AuthForm
                title="Create Account"
                onSubmit={login}
                isLogin={false}
            />
        </div>
    );
}
