'use client';

import Link from 'next/link';
import Header from '../../components/Header';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mt-4">403</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mt-2">Access Denied</h2>
          <p className="text-gray-600 mt-4 max-w-md">
            You don't have permission to access this page. Please contact your administrator if you believe this is an error.
          </p>
          <div className="mt-6">
            <Link
              href="/dashboard"
              className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Return to Dashboard
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
