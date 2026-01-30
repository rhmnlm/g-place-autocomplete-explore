import { useEffect, useRef, useCallback, useState } from 'react';
import { APIProvider, Map, useApiIsLoaded, useMapsLibrary } from '@vis.gl/react-google-maps';
import { Box, Paper, CircularProgress, Typography } from '@mui/material';
import type { PlaceDetails } from '../../types';
import SearchBar from '../SearchBar/SearchBar';
import { LocationDetailCard } from '../LocationDetailCard';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { addFavorite, removeFavoriteLocal } from '../../store/slices/favoritesSlice';
import { clearSelectedPlace, saveVisitedLocation, selectPlace } from '../../store/slices/searchSlice';

declare global {
  interface Window {
    google: typeof google;
  }
}

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
  const dispatch = useAppDispatch();
  const favorites = useAppSelector((state) => state.favorites.items);
  const favoritesLoading = useAppSelector((state) => state.favorites.isLoading);
  const selectedPlace = useAppSelector((state) => state.search.selectedPlace);
  const clientId = useAppSelector((state) => state.client.clientId);

  const isLoaded = useApiIsLoaded();
  const markerLib = useMapsLibrary('marker');
  const placesLib = useMapsLibrary('places');

  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.marker.AdvancedMarkerElement[]>([]);
  const [center, setCenter] = useState<Position>(DEFAULT_CENTER);
  const [mapReady, setMapReady] = useState(false);

  // Update center when a place is selected from autocomplete
  useEffect(() => {
    console.log("useEffect selectedPlace running");
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

  // Handler for marker click - shows details and saves to history
  const handleMarkerClick = useCallback(
    (location: { placeDesc: string; latitude: string; longitude: string }) => {
      const lat = parseFloat(location.latitude);
      const lng = parseFloat(location.longitude);

      // Center map on location
      setCenter({ lat, lng });
      mapRef.current?.setCenter({ lat, lng });
      mapRef.current?.setZoom(15);

      // Set selected place to show detail card
      const placeDetails: PlaceDetails = {
        placeId: '',
        name: location.placeDesc,
        address: '',
        latitude: lat,
        longitude: lng,
      };
      dispatch(selectPlace(placeDetails));

      // Save to history
      if (clientId) {
        dispatch(
          saveVisitedLocation({
            clientId,
            placeDesc: location.placeDesc,
            latitude: location.latitude,
            longitude: location.longitude,
          })
        );
      }
    },
    [clientId, dispatch]
  );

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
        handleMarkerClick(location);
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
  }, [favorites, mapReady, markerLib, handleMarkerClick]);

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

  // Handle POI (Point of Interest) clicks on the map
  useEffect(() => {
    if (!mapRef.current || !mapReady || !placesLib) return;

    const map = mapRef.current;

    const clickListener = map.addListener('click', async (event: google.maps.MapMouseEvent & { placeId?: string }) => {
      // Check if a POI was clicked (has placeId)
      if (!event.placeId) return;

      // Prevent the default info window from showing
      event.stop?.();

      try {
        // Fetch place details using the Places API
        const service = new placesLib.PlacesService(map);

        service.getDetails(
          {
            placeId: event.placeId,
            fields: ['name', 'formatted_address', 'geometry', 'place_id'],
          },
          (place, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && place) {
              const lat = place.geometry?.location?.lat() ?? 0;
              const lng = place.geometry?.location?.lng() ?? 0;

              const placeDetails: PlaceDetails = {
                placeId: place.place_id ?? '',
                name: place.name ?? 'Unknown Place',
                address: place.formatted_address ?? '',
                latitude: lat,
                longitude: lng,
              };

              dispatch(selectPlace(placeDetails));

              // Save to visited history
              if (clientId) {
                dispatch(
                  saveVisitedLocation({
                    clientId,
                    placeDesc: placeDetails.name,
                    latitude: lat.toString(),
                    longitude: lng.toString(),
                  })
                );
              }
            }
          }
        );
      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    });

    return () => {
      google.maps.event.removeListener(clickListener);
    };
  }, [mapReady, placesLib, dispatch, clientId]);

  // Check if selected place is already a favorite
  const isFavorite = selectedPlace
    ? favorites.some(
        (fav) =>
          fav.placeDesc === selectedPlace.name &&
          parseFloat(fav.latitude) === selectedPlace.latitude &&
          parseFloat(fav.longitude) === selectedPlace.longitude
      )
    : false;

  const handleToggleFavorite = () => {
    if (!selectedPlace || !clientId) return;

    if (isFavorite) {
      const favoriteItem = favorites.find(
        (fav) =>
          fav.placeDesc === selectedPlace.name &&
          parseFloat(fav.latitude) === selectedPlace.latitude &&
          parseFloat(fav.longitude) === selectedPlace.longitude
      );
      if (favoriteItem) {
        dispatch(removeFavoriteLocal(favoriteItem.id));
      }
    } else {
      dispatch(
        addFavorite({
          clientId,
          placeDesc: selectedPlace.name,
          latitude: selectedPlace.latitude.toString(),
          longitude: selectedPlace.longitude.toString(),
        })
      );
    }
  };

  const handleCloseDetailCard = () => {
    dispatch(clearSelectedPlace());
  };

  // Update markers when map is ready or favorites change
  useEffect(() => {
    console.log("useEffect for isLoaded, mapReady, markerLib, updateMarkers is running")
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
          clickableIcons={true}
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

      {/* Location detail card */}
      {selectedPlace && (
        <LocationDetailCard
          place={selectedPlace}
          isFavorite={isFavorite}
          isLoading={favoritesLoading}
          onClose={handleCloseDetailCard}
          onToggleFavorite={handleToggleFavorite}
        />
      )}

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
