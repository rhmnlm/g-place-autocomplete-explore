import { useEffect } from 'react';
import { Provider } from 'react-redux';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import { MainLayout, MapContainer, FavoritesSidebar } from './components';
import { store } from './store';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { identifyClient } from './store/slices/clientSlice';
import { fetchFavorites } from './store/slices/favoritesSlice';
import { fetchSearchHistory } from './store/slices/searchSlice';
import '@fontsource/inter/300.css';
import '@fontsource/inter/400.css';
import '@fontsource/inter/500.css';
import '@fontsource/inter/600.css';
import '@fontsource/inter/700.css';

function AppContent() {
  const dispatch = useAppDispatch();
  const clientId = useAppSelector((state) => state.client.clientId);

  useEffect(() => {
    dispatch(identifyClient());
  }, [dispatch]);

  useEffect(() => {
    if (clientId) {
      dispatch(fetchFavorites({ clientId }));
      dispatch(fetchSearchHistory({ clientId }));
    }
  }, [clientId, dispatch]);

  return (
    <MainLayout
      mapSection={<MapContainer />}
      sidebarSection={<FavoritesSidebar />}
    />
  );
}

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppContent />
      </ThemeProvider>
    </Provider>
  );
}

export default App;
