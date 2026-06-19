import { Outlet, useLocation, useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import TraineeSidebar from '../components/TraineeSidebar';

const ROUTE_MAP: Record<string, string> = {
    dashboard: '/dashboard',
    profile: '/profile',
};

const PATH_TO_ID: Record<string, string> = {
    '/dashboard': 'dashboard',
    '/profile': 'profile',
};

export default function ProtectedLayout() {
    const navigate = useNavigate();
    const location = useLocation();
    const queryClient = useQueryClient();

    // Determine the active sidebar tab based on path. Default to 'dashboard' if path matches, or fallback.
    const activeId = PATH_TO_ID[location.pathname] ?? 'dashboard';

    const logoutMutation = useMutation({
        mutationFn: () => api.post('/auth/logout'),
        onSuccess: () => {
            queryClient.clear();
            navigate('/login', { replace: true })
        }
    });

    const handleNavigate = (id: string) => {
        if (id === 'logout') {
            logoutMutation.mutate();
            return;
        }
        const path = ROUTE_MAP[id];
        if (path) navigate(path);
    };

    return (
        <div className="flex h-screen bg-base-200">
            {/* Sidebar component */}
            <TraineeSidebar activeId={activeId} onNavigate={handleNavigate} />

            {/* Main Content Area: This is where DashboardPage, ProfilePage, etc., render */}
            <main className="flex-1 overflow-y-auto p-6">
                <Outlet />
            </main>
        </div>
    )
}