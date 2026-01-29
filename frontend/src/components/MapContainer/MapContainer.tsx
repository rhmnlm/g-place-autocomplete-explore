import { useEffect, useRef, useCallback, useState } from 'react';
import { APIProvider, Map, useApiIsLoaded, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Box, Paper, CircularProgress, Typography } from '@mui/material';
import type { PlaceDetails } from '../../types';
import SearchBar from '../SearchBar/SearchBar';
import { useAppSelector } from '../../store/hooks';

const API_KEY = import.meta.env.VITE_GMAP_API_KEY || '';

const DEFAULT_CENTER = { lat: 3.1558, lng: 101.7147 };
const DEFAULT_ZOOM = 13;

interface Position {
  lat: number;
  lng: number;
}

interface MapContentProps {
  onPlaceSelect: (place: PlaceDetails) => void;
}

const MapContent = ({ onPlaceSelect }: MapContentProps) => {
  const favorites = useAppSelector((state) => state.favorites.items);
  const selectedPlace = useAppSelector((state) => state.search.selectedPlace);

  const isLoaded = useApiIsLoaded();
  const markerLib = useMapsLibrary('marker');

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [center, setCenter] = useState<Position>(DEFAULT_CENTER);
  const [mapReady, setMapReady] = useState(false);

  // Update center when a place is selected from autocomplete
  useEffect(() => {
    if (selectedPlace && mapRef.current) {
      const newCenter = {
        lat: selectedPlace.latitude,
        lng: selectedPlace.longitude,
      };
      setCenter(newCenter);
      mapRef.current.setCenter(newCenter);
      mapRef.current.setZoom(15);
    }
  }, [selectedPlace]);

  // Update markers when favorites change
  const updateMarkers = useCallback(() => {
    if (!mapRef.current || !markerLib || !mapReady) return;

    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.map = null;
    });
    markersRef.current = [];

    // Create markers for favorites
    favorites.forEach((location) => {
      const lat = parseFloat(location.latitude);
      const lng = parseFloat(location.longitude);
      if (isNaN(lat) || isNaN(lng)) return;

      const marker = new markerLib.AdvancedMarkerElement({
        map: mapRef.current,
        position: { lat, lng },
        title: location.placeDesc,
      });

      marker.addListener('click', () => {
        setCenter({ lat, lng });
        mapRef.current?.setCenter({ lat, lng });
        mapRef.current?.setZoom(15);
      });

      markersRef.current.push(marker);
    });

    // Fit bounds to show all markers if there are multiple
    if (favorites.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      favorites.forEach((location) => {
        const lat = parseFloat(location.latitude);
        const lng = parseFloat(location.longitude);
        if (!isNaN(lat) && !isNaN(lng)) {
          bounds.extend({ lat, lng });
        }
      });
      mapRef.current.fitBounds(bounds, {
        top: 50,
        right: 50,
        bottom: 80,
        left: 50,
      });
    }
  }, [favorites, mapReady, markerLib]);

  // Get user's current location on mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          // Use default center if geolocation fails
        }
      );
    }
  }, []);

  // Update markers when map is ready or favorites change
  useEffect(() => {
    if (isLoaded && mapReady && markerLib) {
      updateMarkers();
    }
  }, [isLoaded, mapReady, markerLib, updateMarkers]);

  // Render loading state
  if (!isLoaded) {
    return (
      <Box
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f5f5f5',
        }}
      >
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            Loading map...
          </Typography>
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box
        sx={{
          width: '100%',
          height: '100%',
        }}
      >
        <Map
          defaultZoom={DEFAULT_ZOOM}
          defaultCenter={center}
          center={center}
          mapId="DEMO_MAP_ID"
          onCameraChanged={(ev) => {
            if (!mapRef.current) {
              // @ts-ignore - accessing internal map instance
              mapRef.current = ev.map;
              setMapReady(true);
            }
          }}
        />
      </Box>

      {/* Search bar overlay */}
      <Box
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          right: 16,
          maxWidth: 320,
          zIndex: 1,
        }}
      >
        <SearchBar onPlaceSelect={onPlaceSelect} />
      </Box>
    </>
  );
};

export const MapContainer = () => {
  const [loadError, setLoadError] = useState<Error | null>(null);

  const handlePlaceSelect = (place: PlaceDetails) => {
    // Place selection is handled via Redux in MapContent
    console.log('Place selected:', place);
  };

  // Render error state
  if (loadError) {
    return (
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          borderRadius: 2,
          overflow: 'hidden',
          border: '1px solid',
          borderColor: 'divider',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fef2f2',
        }}
      >
        <Typography variant="body2" color="error">
          Failed to load Google Maps
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        borderRadius: 2,
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <APIProvider
        apiKey={API_KEY}
        onLoad={() => console.log('Maps API loaded')}
        onError={(error) => setLoadError(error instanceof Error ? error : new Error(String(error)))}
        libraries={['places', 'marker']}
      >
        <MapContent onPlaceSelect={handlePlaceSelect} />
      </APIProvider>
    </Paper>
  );
};

export default MapContainer;
