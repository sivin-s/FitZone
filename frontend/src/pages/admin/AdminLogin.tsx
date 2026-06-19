import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useNavigate } from 'react-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '../../lib/axios';
import {Eye,EyeClosed} from 'lucide-react'

const adminLoginSchema = z.object({
  email: z.string().trim().email('Invalid email address').min(1, 'Email is required'),
  password: z.string().min(1, 'Password is required'),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors }, setError } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const loginMutation = useMutation({
    mutationFn: async (data: AdminLoginFormData) => {
      const response = await api.post('/auth/login', data);
      return response.data;
    },
    onSuccess: (data) => {
      const user = data.data?.user || data.user;
      if (!user || user.role !== 'admin') {
        api.post('/auth/logout');
        setError('root', { type: 'manual', message: 'Access Denied. Admins only.' });
        return;
      }
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      navigate('/admin/dashboard', { replace: true });
    },
    onError: (error: unknown) => {
      const message = getApiErrorMessage(error, 'Invalid credentials.');
      setError('root', { type: 'manual', message });
    },
  });

  const onSubmit = (data: AdminLoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto"><h1 className="text-2xl font-bold text-gray-900">FitZone</h1></div>
      </header>
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-10">
            <div className="flex items-center justify-center mb-6">
              <span className="text-2xl font-bold text-gray-900 mr-2">FitZone</span>
              <span className="bg-black text-white text-xs font-semibold px-2 py-1 rounded uppercase tracking-wide">ADMIN</span>
            </div>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-semibold text-gray-900 mb-2">Admin Access</h2>
              <p className="text-gray-600 text-base">Enter your management credentials</p>
            </div>

            {errors.root && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{errors.root.message}</p>
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input type="email" id="email" placeholder="admin@fitzone.com"
                  className={`w-full px-4 py-3 border text-black rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  {...register('email')} />
                {errors.email && <span className="block text-red-500 text-sm mt-1">{errors.email.message}</span>}
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? 'text' : 'password'} id="password" placeholder="••••••••"
                    className={`w-full px-4 py-3 border text-black rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none pr-12 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                    {...register('password')} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                    {showPassword ? 
                    <Eye color="#000000" />
                    : 
                      <EyeClosed color="#000000" /> 
                    }
                  </button>
                </div>
              </div>
              <button type="submit" disabled={loginMutation.isPending}
                className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-colors ${loginMutation.isPending ? 'bg-gray-800 cursor-not-allowed' : 'bg-black hover:bg-gray-900'}`}>
                {loginMutation.isPending ? 'Signing In...' : 'Sign In to Console'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}