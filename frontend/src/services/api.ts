import type {
  LocationRequest,
  LocationResponse,
  PaginatedResponse,
  AssignCategoryRequest,
  ClientIdentifyResponse,
  CategoryRequest,
  CategoryUpdateRequest,
  CategoryResponse,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

function get<T>(endpoint: string): Promise<T> {
  return request<T>(endpoint, { method: 'GET' });
}

function post<T>(endpoint: string, data?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
}

function put<T>(endpoint: string, data?: unknown): Promise<T> {
  return request<T>(endpoint, {
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });
}

export const clientApi = {
  identify: (clientId?: string): Promise<ClientIdentifyResponse> =>
    post('/client/identify', clientId ? { clientId } : {}),
};

export const locationsApi = {
  saveVisited: (data: LocationRequest): Promise<LocationResponse> =>
    post('/locations/visited', data),

  getVisited: (clientId: string, page: number, size: number): Promise<PaginatedResponse<LocationResponse>> =>
    get(`/locations/visited?clientId=${clientId}&page=${page}&size=${size}`),

  saveFaved: (data: LocationRequest): Promise<LocationResponse> =>
    post('/locations/faved', data),

  getFaved: (clientId: string, page: number, size: number): Promise<PaginatedResponse<LocationResponse>> =>
    get(`/locations/faved?clientId=${clientId}&page=${page}&size=${size}`),

  assignCategory: (id: string, data: AssignCategoryRequest): Promise<LocationResponse> =>
    put(`/locations/faved/${id}/category`, data),

  getFavedByCategory: (clientId: string, categoryId: string, page: number, size: number): Promise<PaginatedResponse<LocationResponse>> =>
    get(`/locations/faved/category/${categoryId}?clientId=${clientId}&page=${page}&size=${size}`),
};

export const categoriesApi = {
  create: (data: CategoryRequest): Promise<CategoryResponse> =>
    post('/categories', data),

  update: (id: string, clientId: string, data: CategoryUpdateRequest): Promise<CategoryResponse> =>
    put(`/categories/${id}?clientId=${clientId}`, data),

  getAll: (clientId: string, page: number, size: number): Promise<PaginatedResponse<CategoryResponse>> =>
    get(`/categories?clientId=${clientId}&page=${page}&size=${size}`),

  getById: (id: string, clientId: string): Promise<CategoryResponse> =>
    get(`/categories/${id}?clientId=${clientId}`),
};
