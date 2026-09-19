import { Navigate, Outlet, useLocation } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function PublicRoute() {
  const { isAuthenticated, user, isLoading: isUserLoading } = useAuth();
  const { isAdminAuthenticated, isLoading: isAdminLoading } = useAdminAuth();
  const location = useLocation();

  const isAdminPath = location.pathname.startsWith('/admin');

  // Show spinner while the relevant session is being checked
  if (isAdminPath ? isAdminLoading : isUserLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-base-200">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  if (isAdminPath) {
    // On /admin/login: if admin is already logged in, redirect to admin dashboard
    if (isAdminAuthenticated) {
      return <Navigate to="/admin/dashboard" replace />;
    }
    // Otherwise show the admin login page regardless of user session
  } else {
    // On /login, /register etc: if user is already logged in, redirect to user dashboard
    if (isAuthenticated && user?.role !== 'admin') {
      return <Navigate to="/dashboard" replace />;
    }
    // Admins can still access /login to log in as a regular user
  }

  return <Outlet />;
}
