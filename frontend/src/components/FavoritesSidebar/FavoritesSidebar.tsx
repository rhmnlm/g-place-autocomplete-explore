import { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  History as HistoryIcon,
  LocationOn as LocationIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addFavorite, removeFavoriteLocal } from '../../store/slices/favoritesSlice';
import { selectPlace } from '../../store/slices/searchSlice';
import type { LocationResponse, PlaceDetails } from '../../types';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      sx={{ flex: 1, overflow: 'hidden', display: value === index ? 'flex' : 'none', flexDirection: 'column' }}
      {...other}
    >
      {value === index && children}
    </Box>
  );
}

interface LocationItemProps {
  location: LocationResponse;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onClick: () => void;
}

const LocationItem = ({ location, isFavorite, onToggleFavorite, onClick }: LocationItemProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        py: 1.25,
        px: 1,
        borderRadius: 1,
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.04)',
        },
      }}
      onClick={onClick}
    >
      <IconButton
        size="small"
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          onToggleFavorite();
        }}
        sx={{
          color: isFavorite ? '#FFD700' : 'text.secondary',
          p: 0.5,
          '&:hover': {
            backgroundColor: isFavorite ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0, 0, 0, 0.04)',
          },
        }}
      >
        {isFavorite ? <StarIcon fontSize="small" /> : <StarBorderIcon fontSize="small" />}
      </IconButton>
      <LocationIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
      <Box sx={{ flex: 1, overflow: 'hidden' }}>
        <Typography
          variant="body2"
          sx={{
            color: 'text.primary',
            fontWeight: 500,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {location.placeDesc}
        </Typography>
        {location.categoryName && (
          <Typography variant="caption" color="text.secondary">
            {location.categoryName}
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export const FavoritesSidebar = () => {
  const dispatch = useAppDispatch();
  const [tabValue, setTabValue] = useState(0);

  const clientId = useAppSelector((state) => state.client.clientId);
  const favorites = useAppSelector((state) => state.favorites.items);
  const favoritesLoading = useAppSelector((state) => state.favorites.isLoading);
  const searchHistory = useAppSelector((state) => state.search.history);
  const historyLoading = useAppSelector((state) => state.search.isLoading);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLocationClick = (location: LocationResponse) => {
    const placeDetails: PlaceDetails = {
      placeId: location.id,
      name: location.placeDesc,
      address: '',
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
    };
    dispatch(selectPlace(placeDetails));
  };

  const handleAddToFavorites = (location: LocationResponse) => {
    if (!clientId) return;
    dispatch(
      addFavorite({
        clientId,
        placeDesc: location.placeDesc,
        latitude: location.latitude,
        longitude: location.longitude,
      })
    );
  };

  const handleRemoveFromFavorites = (locationId: string) => {
    dispatch(removeFavoriteLocal(locationId));
  };

  const isFavorite = (location: LocationResponse) => {
    return favorites.some(
      (fav) =>
        fav.placeDesc === location.placeDesc &&
        fav.latitude === location.latitude &&
        fav.longitude === location.longitude
    );
  };

  return (
    <Paper
      elevation={0}
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            minHeight: 48,
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 500,
            },
          }}
        >
          <Tab
            icon={<StarIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="Favorites"
            sx={{ gap: 0.5 }}
          />
          <Tab
            icon={<HistoryIcon sx={{ fontSize: 18 }} />}
            iconPosition="start"
            label="History"
            sx={{ gap: 0.5 }}
          />
        </Tabs>
      </Box>

      {/* Favorites Tab */}
      <TabPanel value={tabValue} index={0}>
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 1,
            py: 0.5,
          }}
        >
          {favoritesLoading ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          ) : favorites.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                py: 4,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No favorites yet
              </Typography>
            </Box>
          ) : (
            favorites.map((location, index) => (
              <Box key={location.id}>
                <LocationItem
                  location={location}
                  isFavorite={true}
                  onToggleFavorite={() => handleRemoveFromFavorites(location.id)}
                  onClick={() => handleLocationClick(location)}
                />
                {index < favorites.length - 1 && <Divider sx={{ mx: 1 }} />}
              </Box>
            ))
          )}
        </Box>
      </TabPanel>

      {/* Search History Tab */}
      <TabPanel value={tabValue} index={1}>
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            px: 1,
            py: 0.5,
          }}
        >
          {historyLoading ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                py: 4,
              }}
            >
              <CircularProgress size={24} />
            </Box>
          ) : searchHistory.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                py: 4,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                No search history yet
              </Typography>
            </Box>
          ) : (
            searchHistory.map((location, index) => (
              <Box key={location.id}>
                <LocationItem
                  location={location}
                  isFavorite={isFavorite(location)}
                  onToggleFavorite={() =>
                    isFavorite(location)
                      ? handleRemoveFromFavorites(
                          favorites.find(
                            (f) =>
                              f.placeDesc === location.placeDesc &&
                              f.latitude === location.latitude
                          )?.id || ''
                        )
                      : handleAddToFavorites(location)
                  }
                  onClick={() => handleLocationClick(location)}
                />
                {index < searchHistory.length - 1 && <Divider sx={{ mx: 1 }} />}
              </Box>
            ))
          )}
        </Box>
      </TabPanel>
    </Paper>
  );
};

export default FavoritesSidebar;
