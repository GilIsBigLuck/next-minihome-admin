"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { cva } from "class-variance-authority";
import { clsx } from "clsx";
import MainLayout from "@/components/layout/MainLayout";
import { Input, Button, Badge } from "@/components/ui";
import { usersApi, type UsersListParams } from "@/lib/api/users";

const statsCard = cva(
  "bg-white border border-gray-200 shadow-card p-6 flex flex-col gap-2"
);

const statsValue = cva(
  "text-3xl font-black text-black"
);

const statsLabel = cva(
  "text-xs font-bold uppercase tracking-widest text-gray-400"
);

const table = cva(
  "w-full bg-white border border-gray-200 shadow-card"
);

const tableHeader = cva(
  "bg-gray-50 border-b border-gray-200"
);

const tableRow = cva(
  "border-b border-gray-100 hover:bg-gray-50 transition-colors"
);

const tableCell = cva(
  "px-6 py-4 text-sm"
);

export default function UsersPage() {
  const [filters, setFilters] = useState<UsersListParams>({});
  const [search, setSearch] = useState("");

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["users", filters, search],
    queryFn: () =>
      usersApi.getUsersList({
        ...filters,
        search: search || undefined,
      }),
    retry: 1,
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
            <Button
              variant="primary"
              className="mt-4"
              onClick={() => refetch()}
            >
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

        {/* Filters */}
        <div className="bg-white border border-gray-200 shadow-card p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              label="Search"
              icon="search"
              placeholder="Search by username, email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:col-span-2"
            />
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
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="w-full">
              <label className="block text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">
                Master Account
              </label>
              <select
                className="appearance-none w-full bg-white border border-gray-200 text-black py-2.5 pl-4 pr-10 text-sm font-medium focus:outline-none focus:border-black cursor-pointer hover:bg-gray-50 max-w-xs"
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
            <Button
              variant="secondary"
              onClick={clearFilters}
              className="mt-6"
            >
              Clear Filters
            </Button>
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
                    <th className={clsx(tableCell(), "text-left font-bold text-black")}>
                      User
                    </th>
                    <th className={clsx(tableCell(), "text-left font-bold text-black")}>
                      Email
                    </th>
                    <th className={clsx(tableCell(), "text-left font-bold text-black")}>
                      Username
                    </th>
                    <th className={clsx(tableCell(), "text-left font-bold text-black")}>
                      Status
                    </th>
                    <th className={clsx(tableCell(), "text-left font-bold text-black")}>
                      Created
                    </th>
                    <th className={clsx(tableCell(), "text-right font-bold text-black")}>
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
                            {user.displayName.charAt(0)}
                          </div>
                          <div>
                            <div className="font-bold text-black">{user.displayName}</div>
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
                        <span className="font-mono text-gray-600">{user.username}</span>
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
                          <button
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="View Details"
                          >
                            <span className="material-symbols-outlined text-gray-400 hover:text-black">
                              visibility
                            </span>
                          </button>
                          <button
                            className="p-2 hover:bg-gray-100 rounded transition-colors"
                            title="Edit"
                          >
                            <span className="material-symbols-outlined text-gray-400 hover:text-black">
                              edit
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
                  Showing <span className="font-bold text-black">{data.users.length}</span> of{" "}
                  <span className="font-bold text-black">{data.count}</span> users
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
    </MainLayout>
  );
}

