'use client';

import { useAuth } from '@/hooks/useAuth';
import AuthForm from '@/components/AuthForm';

export default function Login() {
    const { login } = useAuth();

    return (
        <div className="min-h-screen flex items-center justify-center">
            <AuthForm
                title="Welcome Back"
                onSubmit={login}
                isLogin={true}
            />
        </div>
    );
}
