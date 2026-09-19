import { Navigate, Outlet, useLocation } from 'react-router';
import { useAdminAuth } from '../hooks/useAdminAuth';

export default function AdminRoute() {
    const { admin, isAdminAuthenticated, isLoading } = useAdminAuth();
    const location = useLocation();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-screen bg-base-200">
                <span className="loading loading-spinner loading-lg text-primary"></span>
            </div>
        );
    }

    // No adminAccessToken — redirect to admin login
    if (!isAdminAuthenticated) {
        return <Navigate to="/admin/login" state={{ from: location }} replace />;
    }

    // Token exists but is not an admin role (shouldn't happen with adminMe endpoint, but safety check)
    if (admin?.role !== 'admin') {
        return <Navigate to="/admin/login" replace />;
    }

    return <Outlet />;
}
