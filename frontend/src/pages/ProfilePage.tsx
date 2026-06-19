import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, getApiErrorMessage } from '../lib/axios';

// Icons 
const Svg = ({ children, size = 18 }: { children: React.ReactNode; size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
);
const CameraIcon = () => <Svg size={14}><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></Svg>;
const LightningIcon = () => <Svg size={20}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></Svg>;
const ChevronDownIcon = () => <Svg size={16}><polyline points="6 9 12 15 18 9" /></Svg>;

// Schemas 
const profileSchema = z.object({
  username: z.string()
    .min(3, 'Min 3 characters')
    .max(30, 'Max 30 characters')
    .refine((val) => !/\s/.test(val), { message: 'Username cannot contain spaces' }),
  email: z.string().email(),
  phone: z.string()
    .nullable()
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^\d{10}$/.test(val), {
      message: 'Phone number must be exactly 10 digits',
    }),
  gender: z.string().nullable().optional().or(z.literal('')),
  city: z.string()
    .trim()
    .nullable()
    .optional()
    .refine((val) => !val || /^[A-Za-z\s]+$/.test(val), {
      message: 'City must contain letters and spaces only',
    }),
  pincode: z.string()
    .max(6, 'Pincode cannot exceed 6 digits')
    .regex(/^\d*$/, 'Pincode must contain only numbers')
    .optional()
    .or(z.literal(''))
    .refine((val) => !val || /^\d{6}$/.test(val), {
      message: 'Pincode must be exactly 6 digits',
    }),
});

const passwordSchema = z.object({
  current: z.string().min(1, 'Current password is required')
    .refine((val) => !/\s/.test(val), { message: 'Password must not contain spaces' }),
  new: z.string().min(8, 'Min 8 characters').regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
    'Must contain uppercase, lowercase, number, special char'
  ).refine((val) => !/\s/.test(val), { message: 'Password must not contain spaces' }),
  confirm: z.string().min(1, 'Please confirm password')
    .refine((val) => !/\s/.test(val), { message: 'Password must not contain spaces' }),
}).refine(data => data.new === data.confirm, {
  message: "Passwords do not match",
  path: ["confirm"],
});

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

// Toast 
function Toast({ message, type, onClose }: { message: string, type: 'success' | 'error', onClose: () => void }) {
  React.useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-6 right-6 p-4 rounded-lg text-white font-medium z-50 shadow-lg transition-all duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
      {message}
    </div>
  );
}


type ProfileData = ProfileFormData & {
  avatar?: string;
  profilePicture?: string;
  name?: string;
  createdAt?: string;
};

interface ProfileCardProps {
  profile?: ProfileData;
  avatarPreview: string | null;
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onUploadAvatar: () => void;
  isUploading: boolean;
}

function ProfileCard({ profile, avatarPreview, onAvatarChange, onUploadAvatar, isUploading }: ProfileCardProps) {
  const imgUrl = avatarPreview || profile?.avatar || profile?.profilePicture;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center text-center">
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full bg-slate-800 overflow-hidden flex items-center justify-center ring-4 ring-gray-50">
          {imgUrl ? (
            <img src={imgUrl} alt="Avatar" className="w-full h-full object-cover" />
          ) : (
            <svg className="w-full h-full" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="50" cy="50" r="50" fill="#0f172a" />
              <circle cx="50" cy="38" r="18" fill="#1e293b" />
              <circle cx="50" cy="105" r="35" fill="#1e293b" />
            </svg>
          )}
        </div>
        <label
          htmlFor="avatar-upload-input"
          className="absolute bottom-0 right-0 bg-black text-white p-1.5 rounded-full border-2 border-white shadow-sm cursor-pointer hover:bg-gray-800 transition-colors"
        >
          <CameraIcon />
        </label>
        <input
          id="avatar-upload-input"
          type="file"
          className="hidden"
          accept="image/*"
          onChange={onAvatarChange}
        />
      </div>

      {avatarPreview && (
        <button
          onClick={onUploadAvatar}
          disabled={isUploading}
          className="mb-3 px-4 py-1.5 bg-black text-white text-xs font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
        >
          {isUploading ? 'Uploading...' : 'Save New Avatar'}
        </button>
      )}

      <div className="flex items-center gap-2 mb-1">
        <h2 className="text-lg font-semibold text-gray-900">{profile?.username || profile?.name || 'User'}</h2>
      </div>
      <p className="text-sm text-gray-500 mb-4">
        Member since {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
      </p>
      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
        Active Plan
      </span>
    </div>
  );
}

//  Streak Card 
function StreakCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500 shrink-0">
        <LightningIcon />
      </div>
      <div>
        <h3 className="font-semibold text-gray-900">0 Day Streak</h3>
        <p className="text-sm text-gray-500">Keep the momentum!</p>
      </div>
    </div>
  );
}


function PersonalDetailsForm({
  profile,
  onSubmit,
  isPending,
  error,
}: {
  profile?: ProfileData;
  onSubmit: (data: ProfileFormData) => void;
  isPending: boolean;
  error: unknown;
}) {
  // Normalize database nulls to empty strings so they are treated as valid strings in react-hook-form
  const normalizedValues = profile ? {
    username: profile.username || '',
    email: profile.email || '',
    phone: profile.phone || '',
    gender: profile.gender || '',
    city: profile.city || '',
    pincode: profile.pincode || '',
  } : undefined;

  const { register, handleSubmit, setError, formState: { errors, isDirty } } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    values: normalizedValues,
  });

  React.useEffect(() => {
    if (error) {
      const axiosError = error as { response?: { data?: { errors?: { field: string; message: string }[] } } };
      const validationErrors = axiosError?.response?.data?.errors;
      if (Array.isArray(validationErrors)) {
        validationErrors.forEach((err: { field: string; message: string }) => {
          if (err.field && err.message) {
            setError(err.field as keyof ProfileFormData, {
              type: 'server',
              message: err.message
            });
          }
        });
      }
    }
  }, [error, setError]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Personal Details</h3>
        <p className="text-sm text-gray-500 mt-1">Update your profile info and location settings.</p>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Username</label>
          <input type="text" {...register('username')} className={`w-full px-3 py-2.5 border text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`} />
          {errors.username && <span className="text-red-500 text-xs mt-1">{errors.username.message}</span>}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Email Address</label>
          <input type="email" {...register('email')} disabled className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
          <p className="text-xs text-gray-400 mt-1">Email cannot be changed for security reasons.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Phone Number</label>
            <input type="tel" {...register('phone')} className={`w-full px-3 py-2.5 border text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`} />
            {errors.phone && <span className="text-red-500 text-xs mt-1">{errors.phone.message}</span>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500  uppercase tracking-wide mb-2">Gender</label>
            <div className="relative text-black">
              <select {...register('gender')} className={`w-full px-3 py-2.5 border rounded-lg text-sm appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent text-black ${errors.gender ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`}>
                <option value="" className='text-black'>Select Gender</option>
                <option value="Male" className='text-black'>Male</option>
                <option value="Female" className='text-black'>Female</option>
                <option value="Non-binary" className='text-black'>Non-binary</option>
                <option value="Prefer not to say" className='text-black'>Prefer not to say</option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center text-black px-3 pointer-events-none text-gray-500">
                <ChevronDownIcon />
              </div>
            </div>
            {errors.gender && <span className="text-red-500 text-xs mt-1">{errors.gender.message}</span>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">City</label>
            <input type="text" {...register('city')} className={`w-full px-3 py-2.5 border text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors.city ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`} />
            {errors.city && <span className="text-red-500 text-xs mt-1">{errors.city.message}</span>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Pincode</label>
            <input type="text" {...register('pincode')} className={`w-full px-3 py-2.5 border text-black rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors.pincode ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`} />
            {errors.pincode && <span className="text-red-500 text-xs mt-1">{errors.pincode.message}</span>}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button type="submit" disabled={isPending || !isDirty} className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2">
            {isPending ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Saving...</>) : 'Save Changes'}
          </button>
        </div>
      </div>
    </form>
  );
}


function SecurityForm({
  onSubmit,
  isPending,
}: {
  onSubmit: (data: PasswordFormData) => void;
  isPending: boolean;
}) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });

  const handleFormSubmit = (data: PasswordFormData) => {
    onSubmit(data);
    reset(); // Clear password fields after submission
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="bg-white rounded-xl border border-gray-200">
      <div className="p-6 border-b border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900">Security</h3>
        <p className="text-sm text-gray-500 mt-1">Manage your password and account protection.</p>
      </div>
      <div className="p-6 space-y-6">
        <div>
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">Current Password</label>
          <input type="password" {...register('current')} placeholder="••••••••" className={`w-full text-black px-3 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors.current ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`} />
          {errors.current && <span className="text-red-500 text-xs mt-1">{errors.current.message}</span>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase text-black tracking-wide mb-2">New Password</label>
            <input type="password" {...register('new')} className={`w-full px-3 py-2.5 border rounded-lg text-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors.new ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`} />
            {errors.new && <span className="text-red-500 text-xs mt-1">{errors.new.message}</span>}
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 uppercase text-black tracking-wide mb-2">Confirm New Password</label>
            <input type="password" {...register('confirm')} className={`w-full px-3 py-2.5 border rounded-lg text-black text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent ${errors.confirm ? 'border-red-500 focus:ring-red-500' : 'border-gray-200'}`} />
            {errors.confirm && <span className="text-red-500 text-xs mt-1">{errors.confirm.message}</span>}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button type="submit" disabled={isPending} className="px-5 py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors flex items-center gap-2">
            {isPending ? (<><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>Updating...</>) : 'Update Password'}
          </button>
        </div>
      </div>
    </form>
  );
}


export default function ProfilePage() {
  const queryClient = useQueryClient();
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  //  Fetch
  const { data: profile, isLoading } = useQuery({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const res = await api.get('/user/profile');
      return res.data.data; // Adjust if your backend wraps data differently
    }
  });

  //  Update 
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormData) => {
      const { username, phone, gender, city, pincode } = data;
      const res = await api.put('/user/profile', { username, phone, gender, city, pincode });
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] }); // Updates header/sidebar
      setToast({ msg: 'Profile updated successfully!', type: 'success' });
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { status?: number; data?: { errors?: unknown } } };
      const isValidationError = axiosError?.response?.status === 400 && axiosError?.response?.data?.errors;
      if (!isValidationError) {
        setToast({ msg: getApiErrorMessage(error, 'Failed to update profile.'), type: 'error' });
      }
    }
  });

  // Change Password 
  const changePasswordMutation = useMutation({
    mutationFn: async (data: PasswordFormData) => {
      const res = await api.patch('/user/change-password', {
        oldPassword: data.current,
        newPassword: data.new
      });
      return res.data;
    },
    onSuccess: () => {
      setToast({ msg: 'Password changed successfully!', type: 'success' });
    },
    onError: (error: unknown) => {
      setToast({ msg: getApiErrorMessage(error, 'Failed to change password. Check your current password.'), type: 'error' });
    }
  });

  // Upload Avatar 
  const uploadAvatarMutation = useMutation({
    mutationFn: async () => {
      if (!avatarFile) return;
      const formData = new FormData();
      formData.append('image', avatarFile); // Backend expects key 'image'
      await api.patch('/user/avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-profile'] });
      queryClient.invalidateQueries({ queryKey: ['auth-user'] });
      setAvatarFile(null);
      setAvatarPreview(null);
      setToast({ msg: 'Avatar updated successfully!', type: 'success' });
    },
    onError: (error: unknown) => {
      setToast({ msg: getApiErrorMessage(error, 'Failed to upload avatar.'), type: 'error' });
    }
  });

  // Handlers
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // Instant preview
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <span className="loading loading-spinner loading-lg text-black"></span>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-4 space-y-6">
          <ProfileCard
            profile={profile}
            avatarPreview={avatarPreview}
            onAvatarChange={handleAvatarChange}
            onUploadAvatar={() => uploadAvatarMutation.mutate()}
            isUploading={uploadAvatarMutation.isPending}
          />
          <StreakCard />
        </div>

        <div className="lg:col-span-8 space-y-6">
          <PersonalDetailsForm
            profile={profile}
            onSubmit={(data: ProfileFormData) => updateProfileMutation.mutate(data)}
            isPending={updateProfileMutation.isPending}
            error={updateProfileMutation.error}
          />
          <SecurityForm
            onSubmit={(data: PasswordFormData) => changePasswordMutation.mutate(data)}
            isPending={changePasswordMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}