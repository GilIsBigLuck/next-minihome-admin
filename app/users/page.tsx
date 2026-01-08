"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import MainLayout from "@/components/layout/MainLayout";
import {
  Input,
  Button,
  Badge,
  Modal,
  ConfirmDialog,
  Checkbox,
} from "@/components/ui";
import {
  usersApi,
  type User,
  type CreateUserRequest,
  type UpdateUserRequest,
  type UsersListParams,
} from "@/lib/api/users";

const statsCard = cva(
  "bg-white border border-gray-200 shadow-card p-6 flex flex-col gap-2"
);

const statsValue = cva("text-3xl font-black text-black");

const statsLabel = cva(
  "text-xs font-bold uppercase tracking-widest text-gray-400"
);

const table = cva("w-full bg-white border border-gray-200 shadow-card");

const tableHeader = cva("bg-gray-50 border-b border-gray-200");

const tableRow = cva(
  "border-b border-gray-100 hover:bg-gray-50 transition-colors"
);

const tableCell = cva("px-6 py-4 text-sm");

const formGroup = cva("space-y-2");

const formLabel = cva(
  "block text-xs font-bold uppercase tracking-widest text-gray-400"
);

interface UserFormData {
  email: string;
  username: string;
  password: string;
  displayName: string;
  isApproved: boolean;
  isMaster: boolean;
  isActive: boolean;
}

const initialFormData: UserFormData = {
  email: "",
  username: "",
  password: "",
  displayName: "",
  isApproved: true,
  isMaster: false,
  isActive: true,
};

export default function UsersPage() {
  const queryClient = useQueryClient();
  const [filters, setFilters] = useState<UsersListParams>({});
  const [search, setSearch] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isApproveDialogOpen, setIsApproveDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", filters, search],
    queryFn: () =>
      usersApi.getList({
        ...filters,
        search: search || undefined,
      }),
    retry: 1,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateUserRequest) => usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsCreateModalOpen(false);
      setFormData(initialFormData);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateUserRequest }) =>
      usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsEditModalOpen(false);
      setSelectedUser(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
    },
  });

  const approveMutation = useMutation({
    mutationFn: (id: number) => usersApi.approve(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      setIsApproveDialogOpen(false);
      setSelectedUser(null);
    },
  });

  const handleFilterChange = (key: keyof UsersListParams, value: string) => {
    if (value === "all") {
      const newFilters = { ...filters };
      delete newFilters[key];
      setFilters(newFilters);
    } else {
      setFilters({
        ...filters,
        [key]: value === "true",
      });
    }
  };

  const clearFilters = () => {
    setFilters({});
    setSearch("");
  };

  const handleCreate = () => {
    createMutation.mutate({
      email: formData.email,
      username: formData.username,
      password: formData.password,
      displayName: formData.displayName || undefined,
      isApproved: formData.isApproved,
      isMaster: formData.isMaster,
      isActive: formData.isActive,
    });
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      username: user.username,
      password: "",
      displayName: user.displayName || "",
      isApproved: user.isApproved,
      isMaster: user.isMaster,
      isActive: user.isActive,
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedUser) return;
    updateMutation.mutate({
      id: selectedUser.id,
      data: {
        displayName: formData.displayName || undefined,
        isApproved: formData.isApproved,
        isMaster: formData.isMaster,
        isActive: formData.isActive,
      },
    });
  };

  const handleDelete = (user: User) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (selectedUser) {
      deleteMutation.mutate(selectedUser.id);
    }
  };

  const handleApprove = (user: User) => {
    setSelectedUser(user);
    setIsApproveDialogOpen(true);
  };

  const confirmApprove = () => {
    if (selectedUser) {
      approveMutation.mutate(selectedUser.id);
    }
  };

  if (error) {
    return (
      <MainLayout
        breadcrumbs={["System", "Users"]}
        title="Users"
        description="Manage and view all users in the system"
      >
        <div className="max-w-7xl mx-auto">
          <div className="bg-white border-2 border-red-500 p-8 text-center">
            <p className="text-red-500 font-bold">
              {error instanceof Error ? error.message : "Failed to load users"}
            </p>
            <Button variant="primary" className="mt-4" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      breadcrumbs={["System", "Users"]}
      title="Users"
      description="Manage and view all users in the system"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Statistics */}
        {data?.stats && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className={statsCard()}>
              <div className={statsValue()}>{data.stats.total}</div>
              <div className={statsLabel()}>Total</div>
            </div>
            <div className={statsCard()}>
              <div className={statsValue()}>{data.stats.approved}</div>
              <div className={statsLabel()}>Approved</div>
            </div>
            <div className={statsCard()}>
              <div className={statsValue()}>{data.stats.pending}</div>
              <div className={statsLabel()}>Pending</div>
            </div>
            <div className={statsCard()}>
              <div className={statsValue()}>{data.stats.active}</div>
              <div className={statsLabel()}>Active</div>
            </div>
            <div className={statsCard()}>
              <div className={statsValue()}>{data.stats.inactive}</div>
              <div className={statsLabel()}>Inactive</div>
            </div>
            <div className={statsCard()}>
              <div className={statsValue()}>{data.stats.master}</div>
              <div className={statsLabel()}>Master</div>
            </div>
          </div>
        )}

        {/* Filters and Actions */}
        <div className="bg-white border border-gray-200 shadow-card p-6">
          <div className="flex items-center justify-between gap-4 mb-4">
            <div className="flex-1">
              <Input
                label="Search"
                icon="search"
                placeholder="Search by username, email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              variant="primary"
              icon="person_add"
              className="mt-6"
              onClick={() => {
                setFormData(initialFormData);
                setIsCreateModalOpen(true);
              }}
            >
              Add User
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="w-full">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Approval Status
              </label>
              <select
                className="appearance-none w-full bg-white border border-gray-200 text-black py-2.5 pl-4 pr-10 text-sm font-medium focus:outline-none focus:border-black cursor-pointer hover:bg-gray-50"
                value={
                  filters.isApproved === undefined
                    ? "all"
                    : filters.isApproved.toString()
                }
                onChange={(e) => handleFilterChange("isApproved", e.target.value)}
              >
                <option value="all">All</option>
                <option value="true">Approved</option>
                <option value="false">Pending</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Active Status
              </label>
              <select
                className="appearance-none w-full bg-white border border-gray-200 text-black py-2.5 pl-4 pr-10 text-sm font-medium focus:outline-none focus:border-black cursor-pointer hover:bg-gray-50"
                value={
                  filters.isActive === undefined
                    ? "all"
                    : filters.isActive.toString()
                }
                onChange={(e) => handleFilterChange("isActive", e.target.value)}
              >
                <option value="all">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
            <div className="w-full">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Master Account
              </label>
              <select
                className="appearance-none w-full bg-white border border-gray-200 text-black py-2.5 pl-4 pr-10 text-sm font-medium focus:outline-none focus:border-black cursor-pointer hover:bg-gray-50"
                value={
                  filters.isMaster === undefined
                    ? "all"
                    : filters.isMaster.toString()
                }
                onChange={(e) => handleFilterChange("isMaster", e.target.value)}
              >
                <option value="all">All</option>
                <option value="true">Master Only</option>
                <option value="false">Non-Master</option>
              </select>
            </div>
            <div className="flex items-end">
              <Button variant="secondary" onClick={clearFilters}>
                Clear Filters
              </Button>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className={table()}>
          {isLoading ? (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined animate-spin text-4xl text-gray-400">
                refresh
              </span>
              <p className="text-gray-500 mt-4">Loading users...</p>
            </div>
          ) : data?.users && data.users.length > 0 ? (
            <>
              <table className="w-full">
                <thead className={tableHeader()}>
                  <tr>
                    <th
                      className={clsx(tableCell(), "text-left font-bold text-black")}
                    >
                      User
                    </th>
                    <th
                      className={clsx(tableCell(), "text-left font-bold text-black")}
                    >
                      Email
                    </th>
                    <th
                      className={clsx(tableCell(), "text-left font-bold text-black")}
                    >
                      Username
                    </th>
                    <th
                      className={clsx(tableCell(), "text-left font-bold text-black")}
                    >
                      Status
                    </th>
                    <th
                      className={clsx(tableCell(), "text-left font-bold text-black")}
                    >
                      Created
                    </th>
                    <th
                      className={clsx(tableCell(), "text-right font-bold text-black")}
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.users.map((user) => (
                    <tr key={user.id} className={tableRow()}>
                      <td className={tableCell()}>
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-black font-bold">
                            {(user.displayName || user.username).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-black">
                              {user.displayName || user.username}
                            </div>
                            {user.isMaster && (
                              <Badge variant="published" className="mt-1">
                                Master
                              </Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className={tableCell()}>
                        <span className="text-gray-600">{user.email}</span>
                      </td>
                      <td className={tableCell()}>
                        <span className="font-mono text-gray-600">
                          {user.username}
                        </span>
                      </td>
                      <td className={tableCell()}>
                        <div className="flex flex-wrap gap-2">
                          {user.isApproved ? (
                            <Badge variant="published">Approved</Badge>
                          ) : (
                            <Badge variant="scheduled">Pending</Badge>
                          )}
                          {user.isActive ? (
                            <Badge variant="published">Active</Badge>
                          ) : (
                            <Badge variant="draft">Inactive</Badge>
                          )}
                        </div>
                      </td>
                      <td className={tableCell()}>
                        <span className="text-gray-500 text-xs font-mono">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className={clsx(tableCell(), "text-right")}>
                        <div className="flex items-center justify-end gap-2">
                          {!user.isApproved && (
                            <button
                              className="p-2 hover:bg-green-50 rounded transition-colors"
                              title="Approve User"
                              onClick={() => handleApprove(user)}
                            >
                              <span className="material-symbols-outlined text-gray-400 hover:text-green-500">
                                check_circle
                              </span>
                            </button>
                          )}
                          <button
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Edit"
                            onClick={() => handleEdit(user)}
                          >
                            <span className="material-symbols-outlined text-gray-400 hover:text-black">
                              edit
                            </span>
                          </button>
                          <button
                            className="p-2 hover:bg-red-50 rounded transition-colors"
                            title="Delete"
                            onClick={() => handleDelete(user)}
                          >
                            <span className="material-symbols-outlined text-gray-400 hover:text-red-500">
                              delete
                            </span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                <p className="text-sm text-gray-600 font-medium">
                  Showing{" "}
                  <span className="font-bold text-black">{data.users.length}</span>{" "}
                  of <span className="font-bold text-black">{data.count}</span> users
                </p>
              </div>
            </>
          ) : (
            <div className="p-12 text-center">
              <span className="material-symbols-outlined text-4xl text-gray-400">
                person_off
              </span>
              <p className="text-gray-500 mt-4">No users found</p>
            </div>
          )}
        </div>
      </div>

      {/* Create User Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Add New User"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleCreate}
              disabled={
                createMutation.isPending ||
                !formData.email ||
                !formData.username ||
                !formData.password
              }
            >
              {createMutation.isPending ? "Creating..." : "Create User"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className={formGroup()}>
            <label className={formLabel()}>Email *</label>
            <Input
              type="email"
              placeholder="user@example.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />
          </div>
          <div className={formGroup()}>
            <label className={formLabel()}>Username *</label>
            <Input
              placeholder="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
            />
          </div>
          <div className={formGroup()}>
            <label className={formLabel()}>Password *</label>
            <Input
              type="password"
              placeholder="Minimum 8 characters"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
            />
          </div>
          <div className={formGroup()}>
            <label className={formLabel()}>Display Name</label>
            <Input
              placeholder="John Doe"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
            />
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            <Checkbox
              label="Approved"
              checked={formData.isApproved}
              onChange={(e) =>
                setFormData({ ...formData, isApproved: e.target.checked })
              }
            />
            <Checkbox
              label="Active"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
            />
            <Checkbox
              label="Master"
              checked={formData.isMaster}
              onChange={(e) =>
                setFormData({ ...formData, isMaster: e.target.checked })
              }
            />
          </div>
          {createMutation.isError && (
            <p className="text-red-500 text-sm">
              {createMutation.error instanceof Error
                ? createMutation.error.message
                : "Failed to create user"}
            </p>
          )}
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        title="Edit User"
        size="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditModalOpen(false);
                setSelectedUser(null);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className={formGroup()}>
            <label className={formLabel()}>Email</label>
            <Input
              type="email"
              value={formData.email}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className={formGroup()}>
            <label className={formLabel()}>Username</label>
            <Input
              value={formData.username}
              disabled
              className="bg-gray-50"
            />
          </div>
          <div className={formGroup()}>
            <label className={formLabel()}>Display Name</label>
            <Input
              placeholder="John Doe"
              value={formData.displayName}
              onChange={(e) =>
                setFormData({ ...formData, displayName: e.target.value })
              }
            />
          </div>
          <div className="flex flex-wrap gap-6 pt-2">
            <Checkbox
              label="Approved"
              checked={formData.isApproved}
              onChange={(e) =>
                setFormData({ ...formData, isApproved: e.target.checked })
              }
            />
            <Checkbox
              label="Active"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData({ ...formData, isActive: e.target.checked })
              }
            />
            <Checkbox
              label="Master"
              checked={formData.isMaster}
              onChange={(e) =>
                setFormData({ ...formData, isMaster: e.target.checked })
              }
            />
          </div>
          {updateMutation.isError && (
            <p className="text-red-500 text-sm">
              {updateMutation.error instanceof Error
                ? updateMutation.error.message
                : "Failed to update user"}
            </p>
          )}
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmDelete}
        title="Delete User"
        message={`Are you sure you want to delete "${selectedUser?.displayName || selectedUser?.username}"? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
        isLoading={deleteMutation.isPending}
      />

      {/* Approve Confirmation */}
      <ConfirmDialog
        isOpen={isApproveDialogOpen}
        onClose={() => {
          setIsApproveDialogOpen(false);
          setSelectedUser(null);
        }}
        onConfirm={confirmApprove}
        title="Approve User"
        message={`Are you sure you want to approve "${selectedUser?.displayName || selectedUser?.username}"? They will be able to access the system.`}
        confirmText="Approve"
        cancelText="Cancel"
        variant="info"
        isLoading={approveMutation.isPending}
      />
    </MainLayout>
  );
}
