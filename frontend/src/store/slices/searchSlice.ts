import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import { locationsApi } from '../../services/api';
import type { LocationRequest, LocationResponse, PlaceDetails } from '../../types';

interface SearchState {
  history: LocationResponse[];
  selectedPlace: PlaceDetails | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SearchState = {
  history: [],
  selectedPlace: null,
  isLoading: false,
  error: null,
};

export const fetchSearchHistory = createAsyncThunk(
  'search/fetchHistory',
  async ({ clientId, page = 0, size = 50 }: { clientId: string; page?: number; size?: number }) => {
    const response = await locationsApi.getVisited(clientId, page, size);
    return response;
  }
);

export const saveVisitedLocation = createAsyncThunk(
  'search/saveVisited',
  async (data: LocationRequest) => {
    const response = await locationsApi.saveVisited(data);
    return response;
  }
);

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    selectPlace: (state, action: PayloadAction<PlaceDetails | null>) => {
      state.selectedPlace = action.payload;
    },
    clearSelectedPlace: (state) => {
      state.selectedPlace = null;
    },
    clearHistory: (state) => {
      state.history = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSearchHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSearchHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.history = action.payload.content;
      })
      .addCase(fetchSearchHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch search history';
      })
      .addCase(saveVisitedLocation.fulfilled, (state, action) => {
        state.history.unshift(action.payload);
      });
  },
});

export const { selectPlace, clearSelectedPlace, clearHistory } = searchSlice.actions;
export default searchSlice.reducer;
