export type CategoryType = 'cafes' | 'parks' | 'restaurants' | 'museums' | 'other';

export interface Category {
  id: CategoryType;
  label: string;
  color: string;
}

export interface Location {
  id: string;
  name: string;
  category: CategoryType;
  latitude: number;
  longitude: number;
  address?: string;
}

export interface MapViewport {
  center: {
    lat: number;
    lng: number;
  };
  zoom: number;
}

// API Request/Response types
export interface LocationRequest {
  clientId: string;
  placeDesc: string;
  latitude: string;
  longitude: string;
  categoryId?: string;
}

export interface LocationResponse {
  id: string;
  placeDesc: string;
  latitude: string;
  longitude: string;
  createdAt: string;
  clientId: string;
  categoryId?: string;
  categoryName?: string;
}

export interface PaginatedResponse<T> {
  content: T[];
  pageable: {
    pageNumber: number;
    pageSize: number;
  };
  totalElements: number;
  totalPages: number;
}

export interface AssignCategoryRequest {
  categoryId: string | null;
  clientId: string;
}

export interface ClientIdentifyResponse {
  clientId: string;
}

// Category API types
export interface CategoryRequest {
  clientId: string;
  categoryName: string;
}

export interface CategoryUpdateRequest {
  categoryName: string;
}

export interface CategoryResponse {
  id: string;
  categoryName: string;
  createdAt: string;
  updatedAt: string;
  clientId: string;
}

// Google Places types
export interface PlaceDetails {
  placeId: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
}
