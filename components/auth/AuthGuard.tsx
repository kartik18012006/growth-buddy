/**
 * Auth Guard Component
 * 
 * Alternative to ProtectedRoute - shows loading state while checking auth
 */

'use client';

import { useAuth } from '@/lib/hooks/useAuth';
import { ReactNode } from 'react';

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      )
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}


