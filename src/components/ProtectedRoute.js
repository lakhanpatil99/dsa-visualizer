import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth, AuthStates } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { authState, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    if (authState === AuthStates.EMAIL_VERIFICATION_REQUIRED) {
      router.replace('/verify-email');
    } else if (!isAuthenticated) {
      // Preserve current path for redirection after login
      const currentPath = router.asPath;
      if (currentPath && currentPath !== '/' && currentPath !== '/login') {
        router.replace(`/login?returnUrl=${encodeURIComponent(currentPath)}`);
      } else {
        router.replace('/login');
      }
    }
  }, [loading, isAuthenticated, authState, router]);

  if (loading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-base font-medium text-gray-700 dark:text-gray-300">
            Verifying your session...
          </p>
        </div>
      </div>
    );
  }

  return children;
}
