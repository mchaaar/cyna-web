'use client';
import { motion } from 'framer-motion';
import AnimatedButton from './AnimatedButton';

export default function AuthForm({ title, onSubmit, isLogin }) {
    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        onSubmit(Object.fromEntries(formData));
    };

    return (
        <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-8 rounded-lg shadow-lg w-96"
            onSubmit={handleSubmit}
        >
            <h2 className="text-3xl font-bold mb-6 text-gray-800">{title}</h2>

            <div className="space-y-4">
                <input
                    name="email"
                    type="email"
                    placeholder="Email"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                />
                <AnimatedButton type="submit">
                    {isLogin ? 'Sign In' : 'Create Account'}
                </AnimatedButton>
            </div>
        </motion.form>
    );
}
