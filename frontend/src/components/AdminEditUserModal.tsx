import { useState } from 'react';

const CameraIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

interface AdminEditUserFormProps {
  user: AdminUser;
  onClose: () => void;
  onSave: (updatedUser: AdminUser, avatarFile: File | null) => Promise<void>;
}

function AdminEditUserForm({ user, onClose, onSave }: AdminEditUserFormProps) {
  const [formData, setFormData] = useState<AdminUser>(user);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setFormData((prev) => ({ ...prev, avatar: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid) return;
    setIsSubmitting(true);
    try {
      await onSave(formData, avatarFile);
    } catch {
      // parent handles the toast; just reset spinner
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEmailValid = formData.email.trim() !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isNameValid = formData.name.trim() !== '' && /^[a-zA-Z\s]+$/.test(formData.name);
  const isPhoneValid = !formData.phone || formData.phone.trim() === '' || /^\d{10}$/.test(formData.phone);
  const isPincodeValid = !formData.pincode || formData.pincode.trim() === '' || /^\d{6}$/.test(formData.pincode);
  const isCityValid = !formData.city || formData.city.trim() === '' || /^[a-zA-Z\s]+$/.test(formData.city.trim());
  const isValid = isEmailValid && isNameValid && isPhoneValid && isPincodeValid && isCityValid;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Edit User Profile</h3>
            <p className="text-sm text-gray-500">Update account details and permissions.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Header Info Card */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl border border-gray-100 mb-2">
            <div className="relative group cursor-pointer flex-shrink-0 w-12 h-12 rounded-full overflow-hidden" onClick={() => document.getElementById('admin-avatar-upload')?.click()}>
              {formData.avatar ? (
                <img src={formData.avatar} alt={formData.name} className="w-full h-full object-cover border border-gray-200 transition-opacity duration-200" />
              ) : (
                <div className="w-full h-full bg-black text-white flex items-center justify-center font-bold text-lg">
                  {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <CameraIcon />
              </div>
            </div>
            <input
              id="admin-avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-900 truncate">{formData.name || 'No Name'}</p>
              <p className="text-xs text-gray-500 truncate">{formData.email}</p>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-white border ${!isNameValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                } rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {!formData.name.trim() ? (
              <p className="mt-1 text-xs text-red-500 font-medium">Full name is required.</p>
            ) : !/^[a-zA-Z\s]+$/.test(formData.name) ? (
              <p className="mt-1 text-xs text-red-500 font-medium">Full name can only contain letters and spaces.</p>
            ) : null}
          </div>

          {/* Email Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 bg-white border ${!isEmailValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                } rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {!formData.email.trim() ? (
              <p className="mt-1 text-xs text-red-500 font-medium">Email address is required.</p>
            ) : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? (
              <p className="mt-1 text-xs text-red-500 font-medium">Please enter a valid email address.</p>
            ) : null}
          </div>

          {/* Role & Gender */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none"
              >
                <option value="User">User</option>
                <option value="Trainer">Trainer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Gender</label>
              <select
                name="gender"
                value={formData.gender || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all appearance-none"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          {/* Phone Number & City */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Phone Number</label>
              <input
                type="text"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                placeholder="10-digit phone number"
                className={`w-full px-4 py-2 bg-white border ${!isPhoneValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                  } rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              />
              {!isPhoneValid && (
                <p className="mt-1 text-xs text-red-500 font-medium">Must be a valid 10-digit number.</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">City</label>
              <input
                type="text"
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                placeholder="e.g. New York"
                className={`w-full px-4 py-2 bg-white border ${
                  !isCityValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                } rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
              />
              {!isCityValid && (
                <p className="mt-1 text-xs text-red-500 font-medium">City can only contain letters and spaces.</p>
              )}
            </div>
          </div>

          {/* Pincode */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pincode</label>
            <input
              type="text"
              name="pincode"
              value={formData.pincode || ''}
              onChange={handleChange}
              placeholder="6-digit pincode"
              className={`w-full px-4 py-2 bg-white border ${!isPincodeValid ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-black'
                } rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:border-transparent transition-all`}
            />
            {!isPincodeValid && (
              <p className="mt-1 text-xs text-red-500 font-medium">Must be a valid 6-digit pincode.</p>
            )}
          </div>

          {/* Platform Access */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p className="text-sm font-semibold text-gray-900">Platform Access</p>
              <p className="text-xs text-gray-500">
                {formData.access ? 'User can log in and use the platform.' : 'User is blocked from logging in.'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
              <input
                type="checkbox"
                name="access"
                checked={formData.access}
                onChange={handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-black rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
            </label>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-black rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export interface AdminUser {
  id: number | string;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  access: boolean;
  avatar: string;
  phone?: string;
  gender?: string;
  city?: string;
  pincode?: string;
}

interface AdminEditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: AdminUser | null;
  onSave: (updatedUser: AdminUser, avatarFile: File | null) => Promise<void>;
}

export default function AdminEditUserModal({ isOpen, onClose, user, onSave }: AdminEditUserModalProps) {
  if (!isOpen || !user) return null;

  return (
    <AdminEditUserForm
      key={String(user.id)}
      user={user}
      onClose={onClose}
      onSave={onSave}
    />
  );
}
