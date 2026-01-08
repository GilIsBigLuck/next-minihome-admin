import {
  API_BASE_URL,
  type ApiResponse,
  type LoginRequest,
  type LoginResponse,
  type RegisterRequest,
  type RegisterResponse,
  handleApiError,
} from "./types";

export type { LoginRequest, LoginResponse, RegisterRequest, RegisterResponse };

export const authApi = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/public/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: data.username,
        password: data.password,
      }),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<LoginResponse> = await response.json();
    return result.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    const response = await fetch(`${API_BASE_URL}/public/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        username: data.username,
        password: data.password,
        displayName: data.displayName,
      }),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<RegisterResponse> = await response.json();
    return result.data;
  },
};
