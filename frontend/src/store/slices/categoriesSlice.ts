import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { categoriesApi } from '../../services/api';
import type { CategoryResponse } from '../../types';

interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface CategoriesState {
  items: CategoryResponse[];
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
}

const initialState: CategoriesState = {
  items: [],
  pagination: {
    page: 0,
    size: 50,
    totalElements: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async ({ clientId, page = 0, size = 50 }: { clientId: string; page?: number; size?: number }) => {
    const response = await categoriesApi.getAll(clientId, page, size);
    return response;
  }
);

export const createCategory = createAsyncThunk(
  'categories/createCategory',
  async ({ clientId, categoryName }: { clientId: string; categoryName: string }) => {
    const response = await categoriesApi.create({ clientId, categoryName });
    return response;
  }
);

export const updateCategory = createAsyncThunk(
  'categories/updateCategory',
  async ({ id, clientId, categoryName }: { id: string; clientId: string; categoryName: string }) => {
    const response = await categoriesApi.update(id, clientId, { categoryName });
    return response;
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.content;
        state.pagination = {
          page: action.payload.pageable.pageNumber,
          size: action.payload.pageable.pageSize,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch categories';
      })
      .addCase(createCategory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create category';
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export default categoriesSlice.reducer;
