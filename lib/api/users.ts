const API_BASE_URL = "https://api.minihome.page/api";

export interface User {
  id: number;
  email: string;
  username: string;
  displayName: string;
  isApproved: boolean;
  isMaster: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UsersListResponse {
  users: User[];
  count: number;
  stats: {
    total: number;
    approved: number;
    pending: number;
    active: number;
    inactive: number;
    master: number;
  };
}

export interface UsersListParams {
  isApproved?: boolean;
  isActive?: boolean;
  isMaster?: boolean;
  search?: string;
}

const getAuthToken = () => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const usersApi = {
  getUsersList: async (params?: UsersListParams): Promise<UsersListResponse> => {
    const token = getAuthToken();
    
    if (!token) {
      throw new Error("Authentication required");
    }

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

    const url = `${API_BASE_URL}/users/list${queryParams.toString() ? `?${queryParams.toString()}` : ""}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error("Unauthorized. Please login again.");
      }
      const error = await response.json().catch(() => ({ message: "Failed to fetch users" }));
      throw new Error(error.message || "Failed to fetch users");
    }

    return response.json();
  },
};

