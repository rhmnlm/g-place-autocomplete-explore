import { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  Close as CloseIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  LocationOn as LocationIcon,
  Thermostat as ThermostatIcon,
  Air as WindIcon,
  WaterDrop as HumidityIcon,
} from '@mui/icons-material';
import type { PlaceDetails, WeatherData } from '../../types';
import { weatherApi } from '../../services/api';

interface LocationDetailCardProps {
  place: PlaceDetails;
  isFavorite: boolean;
  isLoading?: boolean;
  onClose: () => void;
  onToggleFavorite: () => void;
}

export const LocationDetailCard = ({
  place,
  isFavorite,
  isLoading = false,
  onClose,
  onToggleFavorite,
}: LocationDetailCardProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);

  useEffect(() => {
    const fetchWeather = async () => {
      setWeatherLoading(true);
      try {
        const response = await weatherApi.getByCoordinates(place.latitude, place.longitude);
        setWeather(response.weather);
      } catch (error) {
        console.error('Failed to fetch weather:', error);
        setWeather(null);
      } finally {
        setWeatherLoading(false);
      }
    };

    fetchWeather();
  }, [place.latitude, place.longitude]);

  return (
    <Paper
      elevation={3}
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        right: 16,
        maxWidth: 320,
        zIndex: 2,
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          px: 2,
          py: 1,
          backgroundColor: 'primary.main',
          color: 'primary.contrastText',
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Location Details
        </Typography>
        <IconButton
          size="small"
          onClick={onClose}
          sx={{ color: 'inherit', p: 0.5 }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Box sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, mb: 1.5 }}>
          <LocationIcon sx={{ color: 'primary.main', mt: 0.25 }} />
          <Box sx={{ flex: 1 }}>
            <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.3 }}>
              {place.name}
            </Typography>
            {place.address && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 0.5, lineHeight: 1.4 }}
              >
                {place.address}
              </Typography>
            )}
          </Box>
        </Box>

        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1.5 }}>
          {place.latitude.toFixed(6)}, {place.longitude.toFixed(6)}
        </Typography>

        {/* Weather Section */}
        <Divider sx={{ my: 1.5 }} />
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Weather
          </Typography>
          {weatherLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
              <CircularProgress size={20} />
            </Box>
          ) : weather ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {weather.condition}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <ThermostatIcon sx={{ fontSize: 16, color: 'error.main' }} />
                  <Typography variant="caption">
                    {weather.temperature?.toFixed(1)}°C
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <WindIcon sx={{ fontSize: 16, color: 'info.main' }} />
                  <Typography variant="caption">
                    {weather.windSpeed?.toFixed(1)} km/h
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <HumidityIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                  <Typography variant="caption">
                    {weather.humidity?.toFixed(0)}%
                  </Typography>
                </Box>
              </Box>
            </Box>
          ) : (
            <Typography variant="caption" color="text.secondary">
              Weather data unavailable
            </Typography>
          )}
        </Box>

        <Button
          variant={isFavorite ? 'outlined' : 'contained'}
          fullWidth
          startIcon={isFavorite ? <StarIcon /> : <StarBorderIcon />}
          onClick={onToggleFavorite}
          disabled={isLoading}
          sx={{
            textTransform: 'none',
            ...(isFavorite && {
              borderColor: '#FFD700',
              color: '#B8860B',
              '&:hover': {
                borderColor: '#DAA520',
                backgroundColor: 'rgba(255, 215, 0, 0.08)',
              },
            }),
          }}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </Button>
      </Box>
    </Paper>
  );
};

export default LocationDetailCard;
