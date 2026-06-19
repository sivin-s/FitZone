import { Link } from 'react-router';
import { useAuth } from '../hooks/useAuth';

export default function NotFoundPage() {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // Determine home link depending on authentication status and user role
  let homeLink = '/';
  if (isAuthenticated && user) {
    homeLink = user.role === 'admin' ? '/admin/dashboard' : '/dashboard';
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-200 p-8 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <span className="text-3xl font-bold text-gray-400">404</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Page Not Found</h2>
        <p className="text-gray-600 mb-6">
          The page you are looking for doesn't exist, has been moved, or you don't have permission to view it.
        </p>
        <Link 
          to={homeLink}
          className="inline-block px-6 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
        >
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}