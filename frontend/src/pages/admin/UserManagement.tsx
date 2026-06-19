import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/axios';
import AdminEditUserModal, { type AdminUser } from '../../components/AdminEditUserModal';

function roleBadge(user: User) {
  if (user.isPremium) return 'bg-purple-100 text-purple-700 border border-purple-200'; // Premium Purple
  if (user.role === 'trainer') return 'bg-blue-100 text-blue-700';
  if (user.role === 'admin') return 'bg-gray-900 text-white';
  return 'bg-gray-100 text-gray-600';
}

function statusDot(isBlocked: boolean) {
  return isBlocked ? 'bg-red-600' : 'bg-green-500';
}

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
  isBlocked: boolean;
  isVerified: boolean;
  createdAt: string;
  profilePicture?: string;
  isPremium: boolean;
}

interface UsersResponse {
  users: Array<User>;
  total: number;
  page: number;
  limit: number;
}

export default function UserManagement() {
  const queryClient = useQueryClient();

  // 1. MODAL STATE (Moved INSIDE the component to fix syntax error)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);

  const [tab, setTab] = useState('All Users');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('All');
  const limit = 10;
  
  // Added missing tabs array
const tabs = ['All Users', 'Premium Members', 'Trainers', 'Basic Members'];

  const { data, isLoading } = useQuery<UsersResponse>({
    queryKey: ['admin-users', search, page, limit],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      params.append('page', page.toString());
      params.append('limit', limit.toString());

      const response = await api.get(`/admin/users?${params.toString()}`);
      return response.data.data;
    }
  });

  const blockMutation = useMutation({
    mutationFn: (userId: string) => api.patch(`/admin/users/${userId}/block`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  });

  const unblockMutation = useMutation({
    mutationFn: (userId: string) => api.patch(`/admin/users/${userId}/unblock`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  });

  const users = data?.users;
  const totalPages = Math.max(1, Math.ceil((data?.total || 0) / limit));

  const filtered = useMemo(() => {
    const list = users ?? [];
    return list.filter((user) => {
     
      if(user.role === 'admin'){
        return false;  // skip the admin
      }
      const matchesTab =
      tab === 'All Users' ? true :
      tab === 'Premium Members' ? user.isPremium === true : 
      tab === 'Trainers' ? user.role === 'trainer' :
      tab === 'Basic Members' ? user.role === 'user' && !user.isPremium :
      true;

      const matchesStatus = 
        statusFilter === 'All' ? true :
        statusFilter === 'Active' ? !user.isBlocked :
        statusFilter === 'Blocked' ? user.isBlocked :
        true;

      return matchesTab && matchesStatus;
    });
  }, [users, tab, statusFilter]);

  const handleToggleAccess = (userId: string, isCurrentlyBlocked: boolean) => {
    if (isCurrentlyBlocked) {
      unblockMutation.mutate(userId);
    } else {
      blockMutation.mutate(userId);
    }
  };

  const exportUsers = () => {
    const rows = [['Name', 'Email', 'Role', 'Status', 'Joined Date']];
    filtered.forEach(u => rows.push([u.username, u.email, u.role, u.isBlocked ? 'Blocked' : 'Active', new Date(u.createdAt).toLocaleDateString()]));
    const csv = rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'users.csv';
    a.click();
  };

  // 2. HANDLE SAVE USER (Updates backend, explicitly ignores email)
  const handleSaveUser = async (updatedUser: AdminUser) => {
    // Map Modal data back to Backend payload (Excluding email)
    const payload = {
      username: updatedUser.name,
      role: updatedUser.role.toLowerCase(), // 'User' -> 'user'
      isBlocked: !updatedUser.access,       // 'access: true' -> 'isBlocked: false'
    };

    try {
      // Call backend API (Ensure you have PATCH /admin/users/:id in your backend)
      await api.patch(`/admin/users/${updatedUser.id}`, payload);
      
      // Refresh the table data
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      
      // Close modal
      setIsEditModalOpen(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Failed to update user:', error);
      alert('Failed to update user. Please try again.');
    }
  };

  // Helper to map Backend User -> Modal AdminUser
  const openEditModal = (user: User) => {
    const modalUser: AdminUser = {
      id: user._id,
      name: user.username,
      email: user.email, // Email is shown in modal but won't be sent back to backend
      role: user.role.charAt(0).toUpperCase() + user.role.slice(1), // 'user' -> 'User'
      status: user.isBlocked ? 'Blocked' : 'Active',
      joined: new Date(user.createdAt).toLocaleDateString(),
      access: !user.isBlocked,
      avatar: user.profilePicture ||  ""
    };
    setEditingUser(modalUser);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-[#f7f7f6] text-gray-900">
        <div className="px-4 sm:px-6 lg:px-10 py-5 sm:py-7">
          {/* Page Header */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
            </div>
            <div className="w-full max-w-xs sm:max-w-sm">
              <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl px-4 h-12">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full outline-none text-[15px] bg-transparent placeholder:text-gray-400"
                  placeholder="Search users by name, email..."
                />
              </div>
            </div>
          </div>

          {/* Tabs + Filter/Export */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="bg-[#f1f1ef] p-1.5 rounded-xl inline-flex flex-wrap gap-1">
              {tabs.map((item) => (
                <button
                  key={item}
                  onClick={() => { setTab(item); setPage(1); }}
                  className={`px-5 py-2.5 rounded-lg text-[14px] font-semibold ${
                    tab === item ? 'bg-black text-white' : 'text-gray-600 bg-transparent'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-3 self-end">
              <select 
                value={statusFilter} 
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold outline-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>
              
              <button onClick={exportUsers} className="w-11 h-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600" title="Export CSV">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                </svg>
              </button>
            </div>
          </div>

          {/* Users Table */}
          <section className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="hidden md:grid grid-cols-12 px-6 py-4 bg-[#fafaf9] text-[12px] font-bold tracking-wide text-gray-600 uppercase">
              <div className="col-span-4">User</div>
              <div className="col-span-2">Role</div>
              <div className="col-span-2">Status</div>
              <div className="col-span-2">Joined Date</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            <div>
              {isLoading ? (
                <div className="p-12 text-center text-gray-400 flex justify-center">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <p className="font-semibold text-gray-500">No users found.</p>
                </div>
              ) : (
                filtered.map((user) => (
                  <div key={user._id} className="grid grid-cols-1 md:grid-cols-12 px-6 py-5 border-t border-gray-100 first:border-t-0 gap-4 md:gap-2 items-center">
                    <div className="md:col-span-4 flex items-center gap-4">
  <img src={user.profilePicture || ""} alt={user.username} className="w-11 h-11 rounded-full object-cover" />
  <div>
    <div className="font-semibold text-[15px] leading-5 flex items-center gap-1.5">
      {user.username}
      {user.isPremium && (
        <svg className="w-4 h-4 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
          <title>Premium Member</title>
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      )}
    </div>
    <div className="text-gray-500 text-[14px]">{user.email}</div>
  </div>
</div>

                    <div className="md:col-span-2">
  <span className={`inline-flex px-3 py-1.5 rounded-full text-[13px] font-semibold ${roleBadge(user)}`}>
    {user.isPremium ? 'Premium' : user.role}
  </span>
</div>

                    <div className="md:col-span-2 flex items-center gap-2 text-[15px]">
                      <span className={`w-2.5 h-2.5 rounded-full ${statusDot(user.isBlocked)}`}></span>
                      <span>{user.isBlocked ? 'Blocked' : 'Active'}</span>
                    </div>

                    <div className="md:col-span-2 text-[15px] text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                      {/* Access Toggle */}
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-gray-500 hidden sm:inline">Access</span>
                        <button
                          onClick={() => handleToggleAccess(user._id, user.isBlocked)}
                          disabled={blockMutation.isPending || unblockMutation.isPending}
                          className={`w-9 h-5 rounded-full relative transition-colors ${!user.isBlocked ? 'bg-black' : 'bg-gray-300'}`}
                        >
                          <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${!user.isBlocked ? 'right-0.5' : 'left-0.5'}`}></span>
                        </button>
                      </div>

                      {/* EDIT BUTTON (Placed here in the Actions column) */}
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 flex items-center justify-between gap-4 border-t border-gray-100">
                <div className="text-[14px] text-gray-600">Page {page} of {totalPages}</div>
                <div className="flex items-center gap-2 text-[14px]">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50">‹</button>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-50">›</button>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      <AdminEditUserModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingUser(null);
        }}
        user={editingUser}
        onSave={handleSaveUser}
      />
    </>
  );
}