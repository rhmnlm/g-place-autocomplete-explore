import { configureStore } from '@reduxjs/toolkit';
import clientReducer from './slices/clientSlice';
import searchReducer from './slices/searchSlice';
import favoritesReducer from './slices/favoritesSlice';

export const store = configureStore({
  reducer: {
    client: clientReducer,
    search: searchReducer,
    favorites: favoritesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
