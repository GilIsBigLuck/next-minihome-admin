import {
  API_BASE_URL,
  type ApiResponse,
  type User,
  type UserStats,
  type CreateUserRequest,
  type UpdateUserRequest,
  getAuthToken,
  handleApiError,
} from "./types";

export type { User, UserStats, CreateUserRequest, UpdateUserRequest };

export interface UsersListResponse {
  users: User[];
}

export interface UsersListMeta {
  count: number;
  stats: UserStats;
}

export interface UsersListParams {
  isApproved?: boolean;
  isActive?: boolean;
  isMaster?: boolean;
  search?: string;
}

const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) {
    throw new Error("인증이 필요합니다.");
  }
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const usersApi = {
  // Get users list
  getList: async (
    params?: UsersListParams
  ): Promise<{ users: User[]; count: number; stats: UserStats }> => {
    const queryParams = new URLSearchParams();
    if (params?.isApproved !== undefined) {
      queryParams.append("isApproved", params.isApproved.toString());
    }
    if (params?.isActive !== undefined) {
      queryParams.append("isActive", params.isActive.toString());
    }
    if (params?.isMaster !== undefined) {
      queryParams.append("isMaster", params.isMaster.toString());
    }
    if (params?.search) {
      queryParams.append("search", params.search);
    }

    const url = `${API_BASE_URL}/admin/users/list${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<UsersListResponse> & { meta: UsersListMeta } =
      await response.json();
    return {
      users: result.data.users,
      count: result.meta.count,
      stats: result.meta.stats,
    };
  },

  // Get pending users
  getPending: async (): Promise<{ users: User[]; count: number }> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/pending`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ users: User[] }> & { meta: { count: number } } =
      await response.json();
    return {
      users: result.data.users,
      count: result.meta.count,
    };
  },

  // Get single user
  getById: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ user: User }> = await response.json();
    return result.data.user;
  },

  // Create user
  create: async (data: CreateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ user: User }> = await response.json();
    return result.data.user;
  },

  // Update user
  update: async (id: number, data: UpdateUserRequest): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ user: User }> = await response.json();
    return result.data.user;
  },

  // Delete user
  delete: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ user: User }> = await response.json();
    return result.data.user;
  },

  // Approve user
  approve: async (id: number): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${id}/approve`, {
      method: "PATCH",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ user: User }> = await response.json();
    return result.data.user;
  },
};

// Legacy export for backwards compatibility
export const getUsersList = usersApi.getList;
