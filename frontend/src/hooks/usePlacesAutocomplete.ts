import { useState, useCallback, useRef, useEffect } from 'react';
import type { PlaceDetails } from '../types';

interface UsePlacesAutocompleteOptions {
  debounceMs?: number;
  types?: string[];
}

type queryAutocompletePrediction = google.maps.places.QueryAutocompletePrediction[] | null;
export type autocompletesuggestRequest = Pick<google.maps.places.AutocompleteRequest, 'input'>

interface UsePlacesAutocompleteResult {
  value: string;
  setValue: (value: autocompletesuggestRequest) => void;
  suggestions: string[];
  isLoading: boolean;
  clearSuggestions: () => void;
  getPlaceDetails: (placeId: string) => Promise<PlaceDetails>;
}

export const usePlacesAutocomplete = (
  options: UsePlacesAutocompleteOptions = {}
): UsePlacesAutocompleteResult => {
  const [value, setValueState] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const autocompletesuggestion = useRef<google.maps.places.AutocompleteSuggestion | null>(null);
  const placesServiceDiv = useRef<HTMLDivElement | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    const initService = () => {
      if (window.google?.maps?.places && !autocompleteService.current) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      }

      if (window.google?.maps?.places && !autocompletesuggestion.current) {
        autocompletesuggestion.current = new window.google.maps.places.AutocompleteSuggestion();
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
      console.log("here it's calling google api", request.input)
      if (!google.maps?.places?.AutocompleteService || request.input.length < 2) {
        console.log("burned here - API not loaded or input too short");
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        console.log("fetching suggestions...")
        // const suggestionResponse = await google.maps.places.AutocompleteSuggestion.fetchAutocompleteSuggestions(
        //   request
        // );

        // console.log("suggestions", suggestionResponse);
        // const { suggestions } = suggestionResponse;

        // const places = suggestions.map((suggestion) => ''
        //   // suggestionResponse.suggestions?.text?.text ?? ''
        // ).filter(Boolean);

        autocompleteService.current?.getQueryPredictions({input: request.input}, 
          (
            predictions: google.maps.places.QueryAutocompletePrediction[] | null,
            status: google.maps.places.PlacesServiceStatus
          ) => {
            if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
              alert(status);
              return;
            }
            console.log(predictions);
            const suggestions = predictions.map((prediction) => 
              prediction.description
            );
            console.log("predictions", suggestions);
            setSuggestions(suggestions);
          }
        )

        // setSuggestions([]);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    },
    [options.types]
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
