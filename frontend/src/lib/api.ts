import type { 
  PredictResponse, 
  DashboardStats, 
  CaseListResponse, 
  HealthResponse, 
  PatientIn 
} from "../types/api";

const API_BASE_URL = "http://localhost:8000/api/v1";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: "Unknown error" }));
    const message = typeof error.detail === 'string' 
      ? error.detail 
      : JSON.stringify(error.detail || error);
    throw new Error(message);
  }

  return response.json();
}

export const api = {
  getHealth: () => request<HealthResponse>("/health"),

  predict: (data: { patient: PatientIn; xray_base64: string }) =>
    request<PredictResponse>("/predict", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  getCases: (params?: { page?: number; limit?: number; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", params.page.toString());
    if (params?.limit) query.append("limit", params.limit.toString());
    if (params?.search) query.append("search", params.search);
    
    return request<CaseListResponse>(`/cases?${query.toString()}`);
  },

  getDashboardStats: (days: number = 30) => request<DashboardStats>(`/dashboard/stats?days=${days}`),
  
  getCase: (caseId: string) => request<PredictResponse>(`/cases/${caseId}`),
  
  getCasePdfUrl: (caseId: string) => `${API_BASE_URL}/cases/${caseId}/pdf`,

  deleteCase: (caseId: string) => request<{ deleted: boolean; case_id: string }>(`/cases/${caseId}`, {
    method: "DELETE",
  }),
};
