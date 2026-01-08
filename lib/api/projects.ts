import {
  API_BASE_URL,
  type ApiResponse,
  type Project,
  type CreateProjectRequest,
  type UpdateProjectRequest,
  getAuthToken,
  handleApiError,
} from "./types";

export type { Project, CreateProjectRequest, UpdateProjectRequest };

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

export const projectsApi = {
  // Get all projects
  getList: async (): Promise<{ projects: Project[]; count: number }> => {
    const response = await fetch(`${API_BASE_URL}/admin/projects`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ projects: Project[] }> & {
      meta: { count: number };
    } = await response.json();
    return {
      projects: result.data.projects,
      count: result.meta.count,
    };
  },

  // Get single project
  getById: async (id: number): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ project: Project }> = await response.json();
    return result.data.project;
  },

  // Create project
  create: async (data: CreateProjectRequest): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/admin/projects`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ project: Project }> = await response.json();
    return result.data.project;
  },

  // Update project
  update: async (id: number, data: UpdateProjectRequest): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ project: Project }> = await response.json();
    return result.data.project;
  },

  // Delete project
  delete: async (id: number): Promise<Project> => {
    const response = await fetch(`${API_BASE_URL}/admin/projects/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ project: Project }> = await response.json();
    return result.data.project;
  },
};
