import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, AuthStates } from '../contexts/AuthContext';

export default function PublicOnlyRoute({ children }) {
  const { authState, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (authState === AuthStates.EMAIL_VERIFICATION_REQUIRED) {
      router.replace('/verify-email');
    } else if (isAuthenticated) {
      const returnUrl = router.query.returnUrl;
      if (returnUrl && typeof returnUrl === 'string') {
        router.replace(returnUrl);
      } else {
        router.replace('/app');
      }
    }
  }, [loading, isAuthenticated, authState, router]);

  if (loading || isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-base font-medium text-gray-700 dark:text-gray-300">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  return children;
}
