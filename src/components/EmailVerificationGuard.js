import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, AuthStates } from '../contexts/AuthContext';

export default function EmailVerificationGuard({ children }) {
  const { authState, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (isAuthenticated) {
      router.replace('/app');
    } else if (authState === AuthStates.SIGNED_OUT) {
      router.replace('/login');
    }
  }, [loading, isAuthenticated, authState, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-base font-medium text-gray-700 dark:text-gray-300">
            Checking verification status...
          </p>
        </div>
      </div>
    );
  }

  return children;
}
