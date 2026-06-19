import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import AdminLogin from './pages/admin/AdminLogin';
import ResetOTPPasswordPage from './pages/ResetOTPPasswordPage';  // forgot-password

// Protected Pages
import UserDashboard from './pages/UserDashboard';
import ProfilePage from './pages/ProfilePage';

// Admin protected pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

// Layouts & Guards
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedLayout from './layouts/ProtectedLayout';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './layouts/AdminLayout';
import NotFoundPage from './pages/NotFoundPage';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 1000 * 60 * 5, retry: 1, refetchOnWindowFocus: false },
  },
});



const router = createBrowserRouter([
  // PUBLIC ROUTES
  { path: '/', element: <LandingPage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <SignUpPage /> },
  {path: '/admin/login', element: <AdminLogin/>},
  {path: '/forgot-password', element: <ResetOTPPasswordPage/>},

  {
    element: <ProtectedRoute />,
    children: [ // user paths
      {
        element: <ProtectedLayout />,
        children: [
          { path: '/dashboard', element: <UserDashboard /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  // Admin protected
  {
    element: <AdminRoute />, 
    children: [ // admin paths
      {
        element: <AdminLayout />, 
        children: [
          { path: '/admin/dashboard', element: <AdminDashboard /> },
          { path: '/admin/users', element: <UserManagement /> },
        ],
      },
    ],
  },
  {path: '*', element: <NotFoundPage/>}  // catch all non specific path
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}