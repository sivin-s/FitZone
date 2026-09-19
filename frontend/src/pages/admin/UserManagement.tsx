import Pagination from "../../components/Pagination";
import { adminService } from "../../services/adminService";
import type { User, UsersResponse, UserListParams } from "../../services/types";
import { useDebounce } from "../../hooks/useDebounce";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiErrorMessage } from "../../lib/axios";
import AdminEditUserModal, {
  type AdminUser,
} from "../../components/AdminEditUserModal";
import Toast from "../../components/Toast";

function roleBadge(user: User) {
  if (user.isPremium)
    return "bg-purple-100 text-purple-700 border border-purple-200"; // Premium Purple
  if (user.role === "trainer") return "bg-blue-100 text-blue-700";
  if (user.role === "admin") return "bg-gray-900 text-white";
  return "bg-gray-100 text-gray-600";
}

function statusDot(isBlocked: boolean) {
  return isBlocked ? "bg-red-600" : "bg-green-500";
}

export default function UserManagement() {
  const queryClient = useQueryClient();

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const [tab, setTab] = useState("All Users");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("All");
  const [limit, setLimit] = useState(10);
  const [sort, setSort] = useState("createdAt:desc");
  const debouncedSearch = useDebounce(search.trim());
  const searchPending = search.trim() !== debouncedSearch;
  const membership: UserListParams['membership'] = tab === "Premium Members" ? "premium" : tab === "Trainers" ? "trainers" : tab === "Basic Members" ? "basic" : "all";
  const [sortBy, sortOrder] = sort.split(":") as [NonNullable<UserListParams['sortBy']>, NonNullable<UserListParams['sortOrder']>];

  // Added missing tabs array
  const tabs = ["All Users", "Premium Members", "Trainers", "Basic Members"];

  const { data, isLoading, isFetching, isError, error, refetch } = useQuery<UsersResponse>({
    queryKey: ["admin-users", debouncedSearch, page, limit, membership, statusFilter, sort],
    queryFn: async ({ signal }) => {
      const response = await adminService.getUsers({ search: debouncedSearch, page, limit, membership, status: statusFilter.toLowerCase() as UserListParams['status'], sortBy, sortOrder }, signal);
      return response.data.data;
    },
    enabled: !searchPending,
  });

  const blockMutation = useMutation({
    mutationFn: (userId: string) => adminService.blockUser(userId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
    onError: (error: unknown) => setToast({ message: getApiErrorMessage(error, "Unable to block user."), type: "error" }),
  });

  const unblockMutation = useMutation({
    mutationFn: (userId: string) => adminService.unblockUser(userId),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["admin-users"] }),
    onError: (error: unknown) => setToast({ message: getApiErrorMessage(error, "Unable to unblock user."), type: "error" }),
  });

  const filtered = data?.users ?? [];
  const totalPages = data?.totalPages ?? 1;
  const currentPage = data?.page ?? page;

  const hasFilters = search !== "" || tab !== "All Users" || statusFilter !== "All";
  const clearFilters = () => {
    setSearch("");
    setTab("All Users");
    setStatusFilter("All");
    setPage(1);
  };
  const paginationBusy = isFetching || searchPending;
  const totalUsers = data?.total ?? 0;

  const handleToggleAccess = (userId: string, isCurrentlyBlocked: boolean) => {
    if (isCurrentlyBlocked) {
      unblockMutation.mutate(userId);
    } else {
      blockMutation.mutate(userId);
    }
  };

  const exportUsers = () => {
    const rows = [["Name", "Email", "Role", "Status", "Joined Date"]];
    filtered.forEach((u) =>
      rows.push([
        u.username,
        u.email,
        u.role,
        u.isBlocked ? "Blocked" : "Active",
        new Date(u.createdAt).toLocaleDateString(),
      ]),
    );
    const csv = rows.map((r) => r.map((v) => {
      const safe = /^[=+@\-\t\r\n]/.test(v) ? `'${v}` : v;
      return `"${safe.replace(/"/g, '""')}"`;
    }).join(",")).join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "users.csv";
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  };

  const updateUserMutation = useMutation({
    mutationFn: async ({
      updatedUser,
      avatarFile,
    }: {
      updatedUser: AdminUser;
      avatarFile: File | null;
    }) => {
      const formData = new FormData();
      formData.append("username", updatedUser.name);
      formData.append("email", updatedUser.email);
      formData.append("role", updatedUser.role.toLowerCase());
      formData.append("isBlocked", String(!updatedUser.access));
      if (updatedUser.phone) formData.append("phone", updatedUser.phone);
      if (updatedUser.gender) formData.append("gender", updatedUser.gender);
      if (updatedUser.city?.trim()) formData.append("city", updatedUser.city.trim());
      if (updatedUser.pincode) formData.append("pincode", String(updatedUser.pincode));
      if (avatarFile) formData.append("image", avatarFile);

      await adminService.updateUser(String(updatedUser.id), formData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      setToast({ message: "User profile updated successfully!", type: "success" });
      setIsEditModalOpen(false);
      setEditingUser(null);
    },
    onError: (error: unknown) => {
      setToast({ message: getApiErrorMessage(error, "Failed to update user. Please try again."), type: "error" });
    },
  });

  const openEditModal = (user: User) => {
    const modalUser: AdminUser = {
      id: user._id,
      name: user.username,
      email: user.email,
      role: user.role.charAt(0).toUpperCase() + user.role.slice(1),
      status: user.isBlocked ? "Blocked" : "Active",
      joined: new Date(user.createdAt).toLocaleDateString(),
      access: !user.isBlocked,
      avatar: user.profilePicture || "",
      phone: user.phone || "",
      gender: user.gender === "Non-binary" ? "Other" : user.gender || "",
      city: user.city || "",
      pincode: user.pincode || "",
    };
    setEditingUser(modalUser);
    setIsEditModalOpen(true);
  };

  return (
    <>
      <div className="min-h-screen bg-[#f7f7f6] text-gray-900">
        <div className="px-4 sm:px-6 lg:px-10 py-5 sm:py-7">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                User Management
              </h2>
            </div>
            <div className="w-full max-w-xs sm:max-w-sm">
              <div className="flex items-center gap-3 bg-white border border-gray-300 rounded-xl px-4 h-12 shadow-sm transition focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100">
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
                <input
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                  aria-label="Search users"
                  className="w-full outline-none text-[15px] bg-transparent placeholder:text-gray-400"
                  type="search"
                  maxLength={100}
                  placeholder="Search name or email…"
                />
                {search && <button type="button" aria-label="Clear search" className="rounded p-1 text-gray-500 hover:bg-gray-100 focus-visible:outline-2" onClick={() => { setSearch(""); setPage(1); }}>×</button>}
              </div>
            </div>
          </div>

          {/* Tabs + Filter/Export */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div className="bg-[#f1f1ef] p-1.5 rounded-xl inline-flex flex-wrap gap-1">
              {tabs.map((item) => (
                <button
                  key={item}
                  aria-pressed={tab === item}
                  onClick={() => {
                    setTab(item);
                    setPage(1);
                  }}
                  className={`px-5 py-2.5 rounded-lg text-[14px] font-semibold ${
                    tab === item
                      ? "bg-black text-white"
                      : "text-gray-600 bg-transparent"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 self-end">
              <select
                value={statusFilter}
                aria-label="Filter by status"
                onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
                className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-semibold outline-none"
              >
                <option value="All">All Status</option>
                <option value="Active">Active</option>
                <option value="Blocked">Blocked</option>
              </select>

              <select aria-label="Sort users" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm">
                <option value="createdAt:desc">Newest first</option>
                <option value="createdAt:asc">Oldest first</option>
                <option value="username:asc">Name A–Z</option>
                <option value="username:desc">Name Z–A</option>
                <option value="email:asc">Email A–Z</option>
                <option value="email:desc">Email Z–A</option>
              </select>
              <button
                disabled={isFetching || searchPending || !filtered.length}
                onClick={exportUsers}
                className="w-11 h-11 rounded-xl border border-gray-200 bg-white flex items-center justify-center text-gray-600"
                title="Export current page as CSV"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3"
                  />
                </svg>
              </button>
            </div>
          </div>

          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 text-sm">
            <p role="status" aria-live="polite" className="text-gray-600">
              {paginationBusy ? "Updating users…" : `${totalUsers} ${totalUsers === 1 ? "user" : "users"} found`}
              {tab !== "All Users" && ` · ${tab}`}
              {statusFilter !== "All" && ` · ${statusFilter}`}
            </p>
            {hasFilters && <button type="button" onClick={clearFilters} className="rounded-lg border border-gray-300 bg-white px-3 py-2 font-medium hover:bg-gray-100 focus-visible:outline-2 focus-visible:outline-indigo-500">Clear filters</button>}
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
              {isLoading || searchPending ? (
                <div className="p-12 text-center text-gray-400 flex justify-center">
                  <span className="loading loading-spinner loading-md"></span>
                </div>
              ) : isError ? (
                <div className="p-12 text-center" role="alert"><p>{getApiErrorMessage(error, "Unable to load users.")}</p><button className="mt-3 underline" onClick={() => refetch()}>Try again</button></div>
              ) : filtered.length === 0 ? (
                <div className="p-12 text-center text-gray-400">
                  <p className="font-semibold text-gray-500">No users found.</p>
                  {hasFilters && <button type="button" onClick={clearFilters} className="mt-3 font-medium text-indigo-600 underline">Clear filters to see all users</button>}
                </div>
              ) : (
                filtered.map((user) => (
                  <div
                    key={user._id}
                    className="grid grid-cols-1 md:grid-cols-12 px-6 py-5 border-t border-gray-100 first:border-t-0 gap-4 md:gap-2 items-center"
                  >
                    <div className="md:col-span-4 flex items-center gap-4">
                      {user.profilePicture ? <img
                        src={user.profilePicture}
                        alt={user.username}
                        className="w-11 h-11 shrink-0 rounded-full object-cover"
                      /> : <span className="w-11 h-11 shrink-0 rounded-full bg-slate-100 grid place-items-center font-semibold">{user.username.charAt(0).toUpperCase()}</span>}
                      <div className="min-w-0 break-words">
                        <div className="font-semibold text-[15px] leading-5 flex items-center gap-1.5">
                          {user.username}
                          {user.isPremium && (
                            <svg
                              className="w-4 h-4 text-purple-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <title>Premium Member</title>
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          )}
                        </div>
                        <div className="text-gray-500 text-[14px]">
                          {user.email}
                        </div>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <span
                        className={`inline-flex px-3 py-1.5 rounded-full text-[13px] font-semibold ${roleBadge(user)}`}
                      >
                        {user.isPremium ? "Premium" : user.role}
                      </span>
                    </div>

                    <div className="md:col-span-2 flex items-center gap-2 text-[15px]">
                      <span
                        className={`w-2.5 h-2.5 rounded-full ${statusDot(user.isBlocked)}`}
                      ></span>
                      <span>{user.isBlocked ? "Blocked" : "Active"}</span>
                    </div>

                    <div className="md:col-span-2 text-[15px] text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </div>

                    <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3">
                      {/* Access Toggle */}
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-gray-500 hidden sm:inline">
                          Access
                        </span>
                        <button
                          aria-label={`${user.isBlocked ? "Unblock" : "Block"} ${user.username}`}
                          role="switch"
                          aria-checked={!user.isBlocked}
                          onClick={() =>{
                            handleToggleAccess(user._id, user.isBlocked)
                          }
                          }
                          disabled={
                            blockMutation.isPending || unblockMutation.isPending
                          }
                          className={`w-9 h-5 rounded-full relative transition-colors ${!user.isBlocked ? "bg-black" : "bg-gray-300"}`}
                        >
                          <span
                            className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${!user.isBlocked ? "right-0.5" : "left-0.5"}`}
                          ></span>
                        </button>
                      </div>

                      {/* EDIT BUTTON (Placed here in the Actions column) */}
                      <button
                        onClick={() => openEditModal(user)}
                        className="p-2 text-gray-500 hover:text-black hover:bg-gray-100 rounded-lg transition-colors"
                        title="Edit User"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Pagination */}
            {!isError && data && !searchPending && (
              <Pagination currentPage={currentPage} totalPages={totalPages} totalUsers={totalUsers} limit={limit} busy={paginationBusy} onPageChange={setPage} onPageSizeChange={(size) => { setLimit(size); setPage(1); }} />
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
        onSave={(updatedUser, avatarFile) =>
          updateUserMutation.mutateAsync({ updatedUser, avatarFile })
        }
      />

      {toast && (
        <Toast
          show={!!toast}
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}
