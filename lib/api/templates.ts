import {
  API_BASE_URL,
  type ApiResponse,
  type Template,
  type CreateTemplateRequest,
  type UpdateTemplateRequest,
  getAuthToken,
  handleApiError,
} from "./types";

export type { Template, CreateTemplateRequest, UpdateTemplateRequest };

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

export const templatesApi = {
  // Get all templates
  getList: async (): Promise<{ templates: Template[]; count: number }> => {
    const response = await fetch(`${API_BASE_URL}/admin/templates`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ templates: Template[] }> & {
      meta: { count: number };
    } = await response.json();
    return {
      templates: result.data.templates,
      count: result.meta.count,
    };
  },

  // Get single template
  getById: async (id: number): Promise<Template> => {
    const response = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ template: Template }> = await response.json();
    return result.data.template;
  },

  // Create template
  create: async (data: CreateTemplateRequest): Promise<Template> => {
    const response = await fetch(`${API_BASE_URL}/admin/templates`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ template: Template }> = await response.json();
    return result.data.template;
  },

  // Update template
  update: async (
    id: number,
    data: UpdateTemplateRequest
  ): Promise<Template> => {
    const response = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ template: Template }> = await response.json();
    return result.data.template;
  },

  // Delete template
  delete: async (id: number): Promise<Template> => {
    const response = await fetch(`${API_BASE_URL}/admin/templates/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      await handleApiError(response);
    }

    const result: ApiResponse<{ template: Template }> = await response.json();
    return result.data.template;
  },
};
