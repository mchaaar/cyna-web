import Link from 'next/link';

export default function Unauthorized() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-red-600">401</h1>
                <p className="text-2xl mt-4 mb-8">Unauthorized Access</p>
                <div className="space-x-4">
                    <Link
                        href="/login"
                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Login
                    </Link>
                    <Link
                        href="/"
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50"
                    >
                        Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}
