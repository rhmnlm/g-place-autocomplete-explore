import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  Tabs,
  Tab,
  IconButton,
  CircularProgress,
  Menu,
  MenuItem,
  Button,
  Chip,
  Tooltip,
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  History as HistoryIcon,
  LocationOn as LocationIcon,
  Category as CategoryIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addFavorite, removeFavoriteLocal, assignCategory } from '../../store/slices/favoritesSlice';
import { selectPlace, saveVisitedLocation } from '../../store/slices/searchSlice';
import { fetchCategories } from '../../store/slices/categoriesSlice';
import { CategoryDialog } from '../CategoryDialog';
import type { LocationResponse, PlaceDetails, CategoryResponse } from '../../types';

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
  showCategorySelector?: boolean;
  categories?: CategoryResponse[];
  onToggleFavorite: () => void;
  onCategoryChange?: (categoryId: string | null) => void;
  onClick: () => void;
}

const LocationItem = ({
  location,
  isFavorite,
  showCategorySelector = false,
  categories = [],
  onToggleFavorite,
  onCategoryChange,
  onClick,
}: LocationItemProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleCategoryClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setAnchorEl(e.currentTarget);
  };

  const handleCategorySelect = (categoryId: string | null) => {
    onCategoryChange?.(categoryId);
    setAnchorEl(null);
  };

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
      <Tooltip title={isFavorite ? "Remove" : "Add to favorites"}>
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
      </Tooltip>
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
        {showCategorySelector ? (
          <Chip
            size="small"
            icon={<CategoryIcon sx={{ fontSize: 14 }} />}
            label={location.categoryName || 'No category'}
            onClick={handleCategoryClick}
            sx={{
              mt: 0.5,
              height: 22,
              fontSize: '0.7rem',
              '& .MuiChip-icon': { ml: 0.5 },
            }}
          />
        ) : location.categoryName ? (
          <Typography variant="caption" color="text.secondary">
            {location.categoryName}
          </Typography>
        ) : null}
      </Box>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        onClick={(e) => e.stopPropagation()}
      >
        <MenuItem
          onClick={() => handleCategorySelect(null)}
          selected={!location.categoryId}
        >
          <Typography variant="body2" color="text.secondary">
            No category
          </Typography>
        </MenuItem>
        {categories.map((category) => (
          <MenuItem
            key={category.id}
            onClick={() => handleCategorySelect(category.id)}
            selected={location.categoryId === category.id}
          >
            {category.categoryName}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export const FavoritesSidebar = () => {
  const dispatch = useAppDispatch();
  const [tabValue, setTabValue] = useState(0);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);

  const clientId = useAppSelector((state) => state.client.clientId);
  const favorites = useAppSelector((state) => state.favorites.items);
  const favoritesLoading = useAppSelector((state) => state.favorites.isLoading);
  const searchHistory = useAppSelector((state) => state.search.history);
  const historyLoading = useAppSelector((state) => state.search.isLoading);
  const categories = useAppSelector((state) => state.categories.items);

  // Load categories on mount
  useEffect(() => {
    if (clientId) {
      dispatch(fetchCategories({ clientId }));
    }
  }, [clientId, dispatch]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleLocationClick = (location: LocationResponse, isFromHistory = false) => {
    const placeDetails: PlaceDetails = {
      placeId: location.id,
      name: location.placeDesc,
      address: '',
      latitude: parseFloat(location.latitude),
      longitude: parseFloat(location.longitude),
    };
    dispatch(selectPlace(placeDetails));

    // Save to history when clicking from favorites tab (not from history tab to avoid duplicates)
    if (!isFromHistory && clientId) {
      dispatch(
        saveVisitedLocation({
          clientId,
          placeDesc: location.placeDesc,
          latitude: location.latitude,
          longitude: location.longitude,
        })
      );
    }
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

  const handleCategoryChange = (locationId: string, categoryId: string | null) => {
    if (!clientId) return;
    dispatch(assignCategory({ id: locationId, categoryId, clientId }));
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
        {/* Manage Categories Button */}
        <Box sx={{ px: 1, py: 1, borderBottom: 1, borderColor: 'divider' }}>
          <Button
            size="small"
            startIcon={<SettingsIcon />}
            onClick={() => setCategoryDialogOpen(true)}
            sx={{ textTransform: 'none' }}
          >
            Manage Categories
          </Button>
        </Box>

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
                  showCategorySelector={true}
                  categories={categories}
                  onToggleFavorite={() => handleRemoveFromFavorites(location.id)}
                  onCategoryChange={(categoryId) => handleCategoryChange(location.id, categoryId)}
                  onClick={() => handleLocationClick(location, false)}
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
                  onClick={() => handleLocationClick(location, true)}
                />
                {index < searchHistory.length - 1 && <Divider sx={{ mx: 1 }} />}
              </Box>
            ))
          )}
        </Box>
      </TabPanel>

      {/* Category Management Dialog */}
      <CategoryDialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
      />
    </Paper>
  );
};

export default FavoritesSidebar;
