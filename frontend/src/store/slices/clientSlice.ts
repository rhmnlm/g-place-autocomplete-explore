import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { clientApi } from '../../services/api';

interface ClientState {
  clientId: string | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ClientState = {
  clientId: localStorage.getItem('clientId'),
  isLoading: false,
  error: null,
};

export const identifyClient = createAsyncThunk(
  'client/identify',
  async (_, { getState }) => {
    const state = getState() as { client: ClientState };
    const existingClientId = state.client.clientId;
    const response = await clientApi.identify(existingClientId || undefined);
    return response.clientId;
  }
);

const clientSlice = createSlice({
  name: 'client',
  initialState,
  reducers: {
    clearClient: (state) => {
      state.clientId = null;
      localStorage.removeItem('clientId');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(identifyClient.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(identifyClient.fulfilled, (state, action) => {
        state.isLoading = false;
        state.clientId = action.payload;
        localStorage.setItem('clientId', action.payload);
      })
      .addCase(identifyClient.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to identify client';
      });
  },
});

export const { clearClient } = clientSlice.actions;
export default clientSlice.reducer;
