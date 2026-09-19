import { authService } from '../services/authService';
import { Outlet, useLocation, useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
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
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            queryClient.clear();
            queryClient.setQueryData(['auth-user'], null);
      queryClient.setQueryData(['auth-admin'], null);
      queryClient.removeQueries({ queryKey: ['user-profile'] });
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
        <div className="flex flex-col md:flex-row min-h-dvh md:h-dvh bg-slate-50">
            {/* Sidebar component */}
            <TraineeSidebar activeId={activeId} onNavigate={handleNavigate} />

            {/* Main Content Area: This is where DashboardPage, ProfilePage, etc., render */}
            <main className="flex-1 min-w-0 overflow-y-auto p-4 sm:p-6">
                <Outlet />
            </main>
        </div>
    )
}
