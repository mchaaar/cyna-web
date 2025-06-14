'use client';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
        >
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 rounded-lg">{icon}</div>
                <div>
                    <p className="text-gray-500 text-sm">{title}</p>
                    <p className="text-2xl font-bold mt-1">{value}</p>
                </div>
            </div>
        </motion.div>
    );
}
