/**
 * Authentication Hook
 * 
 * Custom hook for handling authentication state and actions
 */

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export interface UseAuthReturn {
  session: any;
  status: 'loading' | 'authenticated' | 'unauthenticated';
  isLoading: boolean;
  isAuthenticated: boolean;
  user: any;
  signIn: () => Promise<void>;
  signOut: () => Promise<void>;
  requireAuth: () => void;
}

/**
 * Custom hook for authentication
 */
export function useAuth(requireAuth: boolean = false): UseAuthReturn {
  const { data: session, status } = useSession();
  const router = useRouter();

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated';

  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push('/');
    }
  }, [status, requireAuth, router]);

  const handleSignIn = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  };

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' });
  };

  const handleRequireAuth = () => {
    if (!isAuthenticated) {
      router.push('/');
    }
  };

  return {
    session,
    status,
    isLoading,
    isAuthenticated,
    user: session?.user,
    signIn: handleSignIn,
    signOut: handleSignOut,
    requireAuth: handleRequireAuth,
  };
}


