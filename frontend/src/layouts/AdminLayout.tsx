import { Outlet, useLocation, useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/axios';
import AdminSidebar from '../components/AdminSidebar';

const ROUTE_MAP: Record<string, string> = {
  dashboard: '/admin/dashboard',
  users: '/admin/users',
};

const PATH_TO_ID: Record<string, string> = {
  '/admin/dashboard': 'dashboard',
  '/admin/users': 'users',
};

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const activeId = PATH_TO_ID[location.pathname] ?? 'dashboard';

  const logoutMutation = useMutation({
    mutationFn: () => api.post('/auth/logout'),
    onSuccess: () => {
      queryClient.setQueryData(['auth-admin'], null);
      navigate('/admin/login', { replace: true });
    },
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
    <div className='flex flex-col md:flex-row min-h-dvh md:h-dvh bg-gray-50'>
      <div className='shadow-sm'>
        <AdminSidebar activeId={activeId} onNavigate={handleNavigate} />
      </div>
      <main className='flex-1 min-w-0 overflow-y-auto'>
        <Outlet />
      </main>
    </div>
  )
}
