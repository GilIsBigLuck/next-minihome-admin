// Common API Types based on API Specification

export const API_BASE_URL = "https://api.minihome.page/api";

// Response Codes
export const ResponseCode = {
  SUCCESS: 1,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_ERROR: 500,
} as const;

// Base API Response
export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  meta?: {
    count?: number;
    pagination?: PaginationMeta;
    stats?: Record<string, number>;
  };
}

// Pagination
export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// User Types
export interface User {
  id: number;
  email: string;
  username: string;
  displayName: string | null;
  isActive: boolean;
  isMaster: boolean;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserStats {
  total: number;
  approved: number;
  pending: number;
  active: number;
  inactive: number;
  master: number;
}

export interface CreateUserRequest {
  email: string;
  username: string;
  password: string;
  displayName?: string;
  isApproved?: boolean;
  isMaster?: boolean;
  isActive?: boolean;
}

export interface UpdateUserRequest {
  displayName?: string;
  isActive?: boolean;
  isMaster?: boolean;
  isApproved?: boolean;
}

// Project Types
export interface Project {
  id: number;
  category: string;
  title: string;
  desc: string | null;
  imgUrl: string | null;
  projectUrl: string | null;
  badge: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectRequest {
  category: string;
  title: string;
  desc?: string;
  imgUrl?: string;
  projectUrl?: string;
  badge?: string[];
}

export interface UpdateProjectRequest {
  category?: string;
  title?: string;
  desc?: string;
  imgUrl?: string;
  projectUrl?: string;
  badge?: string[];
}

// Template Types
export interface Template {
  id: number;
  category: string;
  title: string;
  desc: string | null;
  imgUrl: string | null;
  projectUrl: string | null;
  badge: string[] | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateRequest {
  category: string;
  title: string;
  desc?: string;
  imgUrl?: string;
  projectUrl?: string;
  badge?: string[];
}

export interface UpdateTemplateRequest {
  category?: string;
  title?: string;
  desc?: string;
  imgUrl?: string;
  projectUrl?: string;
  badge?: string[];
}

// Auth Types
export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  email: string;
  username: string;
  password: string;
  displayName?: string;
}

export interface RegisterResponse {
  user: User;
}

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

// Helper function to handle API errors
export const handleApiError = async (response: Response): Promise<never> => {
  if (response.status === 401) {
    // Clear token and redirect to login
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    throw new Error("인증이 필요합니다. 다시 로그인해주세요.");
  }

  const error = await response.json().catch(() => ({ message: "요청 처리 중 오류가 발생했습니다." }));
  throw new Error(error.message || "요청 처리 중 오류가 발생했습니다.");
};
