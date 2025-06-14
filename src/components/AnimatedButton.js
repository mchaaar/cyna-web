'use client';
import { motion } from 'framer-motion';

export default function AnimatedButton({ children, ...props }) {
    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            {...props}
        >
            {children}
        </motion.button>
    );
}
