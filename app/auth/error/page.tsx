'use client';

import { useSearchParams } from 'next/navigation';
import { AlertCircle, Home } from 'lucide-react';
import Link from 'next/link';

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  const getErrorMessage = () => {
    switch (error) {
      case 'Configuration':
        return {
          title: 'Configuration Error',
          message: 'The authentication service is not properly configured. Please contact support.',
          details: 'Missing environment variables or invalid OAuth configuration.',
        };
      case 'AccessDenied':
        return {
          title: 'Access Denied',
          message: 'You do not have permission to access this application.',
          details: 'Please contact the administrator if you believe this is an error.',
        };
      case 'Verification':
        return {
          title: 'Verification Failed',
          message: 'The verification token is invalid or has expired.',
          details: 'Please try signing in again.',
        };
      default:
        return {
          title: 'Authentication Error',
          message: 'An error occurred during authentication.',
          details: error || 'Unknown error. Please try again.',
        };
    }
  };

  const errorInfo = getErrorMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-primary-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="flex items-center justify-center mb-6">
          <div className="rounded-full bg-red-100 p-3">
            <AlertCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
        
        <h1 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          {errorInfo.title}
        </h1>
        
        <p className="text-gray-600 mb-4 text-center">
          {errorInfo.message}
        </p>
        
        {errorInfo.details && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 font-mono">
              {errorInfo.details}
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <Link
            href="/"
            className="w-full flex items-center justify-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            Back to Home
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Try Again
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            If this problem persists, please check that all environment variables are set correctly in your Vercel deployment.
          </p>
        </div>
      </div>
    </div>
  );
}

