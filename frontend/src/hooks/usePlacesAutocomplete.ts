import { useState, useCallback, useRef, useEffect } from 'react';
import type { PlaceDetails } from '../types';

interface LocationBias {
  lat: number;
  lng: number;
}

interface Bounds {
  north: number;
  south: number;
  east: number;
  west: number;
}

interface UsePlacesAutocompleteOptions {
  debounceMs?: number;
  types?: string[];
  // Location bias - results will be biased towards this location within the radius
  location?: LocationBias;
  radius?: number; // in meters
  // Bounds - results will be biased within these bounds
  bounds?: Bounds;
  // Restrict to specific country (ISO 3166-1 Alpha-2 country code)
  componentRestrictions?: { country: string | string[] };
}

export type autocompletesuggestRequest = Pick<google.maps.places.AutocompleteRequest, 'input'>

export interface GPlaceSuggestion {
  description: string;
  place_id: string
}

interface UsePlacesAutocompleteResult {
  value: string;
  setValue: (value: autocompletesuggestRequest) => void;
  suggestions: GPlaceSuggestion[];
  isLoading: boolean;
  clearSuggestions: () => void;
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails>;
}

export const usePlacesAutocomplete = (
  options: UsePlacesAutocompleteOptions = {}
): UsePlacesAutocompleteResult => {
  const [value, setValueState] = useState('');
  const [suggestions, setSuggestions] = useState<GPlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesServiceDiv = useRef<HTMLDivElement | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const initService = () => {
      if (window.google?.maps?.places && !autocompleteService.current) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      }
    };

    // Try immediately
    initService();

    // Also try after a short delay in case Google Maps loads async
    const timer = setTimeout(initService, 1000);

    return () => {
      clearTimeout(timer);
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const fetchSuggestions = useCallback(
    async (request: autocompletesuggestRequest) => {
      if (!google.maps?.places?.AutocompleteService || request.input.length < 2) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const queryRequest: google.maps.places.QueryAutocompletionRequest = {
          input: request.input,
        };

        // Add location bias if provided
        if (options.location) {
          queryRequest.location = new google.maps.LatLng(
            options.location.lat,
            options.location.lng
          );
          queryRequest.radius = options.radius ?? 50000; // default 50km
        }

        // Add bounds if provided
        if (options.bounds) {
          queryRequest.bounds = new google.maps.LatLngBounds(
            { lat: options.bounds.south, lng: options.bounds.west },
            { lat: options.bounds.north, lng: options.bounds.east }
          );
        }

        autocompleteService.current?.getQueryPredictions(
          queryRequest,
          (
            predictions: google.maps.places.QueryAutocompletePrediction[] | null,
            status: google.maps.places.PlacesServiceStatus
          ) => {
            setIsLoading(false);
            console.log(predictions);
            if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
              setSuggestions([]);
              return;
            }
            const suggestions = predictions.map((prediction) => {
              return {
                description: prediction.description,
                place_id: prediction.place_id ?? ''
              }
            });
            setSuggestions(suggestions);
          }
        );
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
        setIsLoading(false);
      }
    },
    [options.types, options.location, options.radius, options.bounds]
  );

  const setValue = useCallback(
    (newValue: autocompletesuggestRequest) => {
      setValueState(newValue.input);

      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }

      if (newValue.input.length < 2) {
        setSuggestions([]);
        return;
      }

      debounceTimer.current = setTimeout(() => {
        fetchSuggestions(newValue);
      }, options.debounceMs || 300);
    },
    [fetchSuggestions, options.debounceMs]
  );

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
  }, []);

  const getPlaceDetails = useCallback((placeId: string): Promise<PlaceDetails> => {
    return new Promise((resolve, reject) => {
      if (!placesService.current) {
        if (!placesServiceDiv.current) {
          placesServiceDiv.current = document.createElement('div');
        }
        placesService.current = new google.maps.places.PlacesService(placesServiceDiv.current);
      }

      placesService.current.getDetails(
        {
          placeId,
          fields: ['name', 'formatted_address', 'geometry', 'place_id'],
        },
        (place, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && place) {
            resolve({
              placeId: place.place_id!,
              name: place.name!,
              address: place.formatted_address!,
              latitude: place.geometry!.location!.lat(),
              longitude: place.geometry!.location!.lng(),
            });
          } else {
            reject(new Error('Failed to get place details'));
          }
        }
      );
    });
  }, []);

  return {
    value,
    setValue,
    suggestions,
    isLoading,
    clearSuggestions,
    getPlaceDetails,
  };
};
