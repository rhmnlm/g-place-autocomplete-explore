import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { locationsApi } from '../../services/api';
import type { LocationRequest, LocationResponse } from '../../types';

interface Pagination {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
}

interface FavoritesState {
  items: LocationResponse[];
  pagination: Pagination;
  isLoading: boolean;
  error: string | null;
}

const initialState: FavoritesState = {
  items: [],
  pagination: {
    page: 0,
    size: 20,
    totalElements: 0,
    totalPages: 0,
  },
  isLoading: false,
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async ({ clientId, page = 0, size = 20 }: { clientId: string; page?: number; size?: number }) => {
    const response = await locationsApi.getFaved(clientId, page, size);
    return response;
  }
);

export const addFavorite = createAsyncThunk(
  'favorites/addFavorite',
  async (data: LocationRequest) => {
    const response = await locationsApi.saveFaved(data);
    return response;
  }
);

export const assignCategory = createAsyncThunk(
  'favorites/assignCategory',
  async ({ id, categoryId, clientId }: { id: string; categoryId: string | null; clientId: string }) => {
    const response = await locationsApi.assignCategory(id, { categoryId, clientId });
    return response;
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState,
  reducers: {
    removeFavoriteLocal: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.content;
        state.pagination = {
          page: action.payload.pageable.pageNumber,
          size: action.payload.pageable.pageSize,
          totalElements: action.payload.totalElements,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch favorites';
      })
      .addCase(addFavorite.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(addFavorite.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to add favorite';
      })
      .addCase(assignCategory.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  },
});

export const { removeFavoriteLocal } = favoritesSlice.actions;
export default favoritesSlice.reducer;
