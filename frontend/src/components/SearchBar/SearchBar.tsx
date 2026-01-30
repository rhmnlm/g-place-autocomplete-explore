import { useState } from 'react';
import {
  TextField,
  InputAdornment,
  Paper,
  Autocomplete,
  Box,
  Typography,
  CircularProgress,
} from '@mui/material';
import { Search as SearchIcon, LocationOn as LocationIcon } from '@mui/icons-material';
import { usePlacesAutocomplete } from '../../hooks';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { selectPlace, saveVisitedLocation } from '../../store/slices/searchSlice';
import type { PlaceDetails } from '../../types';
import type { autocompletesuggestRequest, GPlaceSuggestion } from '../../hooks/usePlacesAutocomplete';

interface SearchBarProps {
  placeholder?: string;
  onPlaceSelect?: (place: PlaceDetails) => void;
  fullWidth?: boolean;
}

export const SearchBar = ({
  placeholder = 'Search for a place...',
  onPlaceSelect,
  fullWidth = true,
}: SearchBarProps) => {
  const dispatch = useAppDispatch();
  const clientId = useAppSelector((state) => state.client.clientId);
  const [inputValue, setInputValue] = useState('');

  const {
    suggestions,
    isLoading,
    setValue,
    clearSuggestions,
    getPlaceDetails,
  } = usePlacesAutocomplete({ debounceMs: 300 });

  const handleInputChange = (_event: React.SyntheticEvent, newInputValue: string) => {
    setInputValue(newInputValue);
    const request:autocompletesuggestRequest = {
      input: newInputValue
    }
    setValue(request);
  };

  const handleSelect = async (
    _event: React.SyntheticEvent,
    value: string | GPlaceSuggestion | google.maps.places.AutocompletePrediction | null
  ) => {
    if (!value || typeof value === 'string') return;

    try {
      const placeDetails = await getPlaceDetails(value.place_id);
      dispatch(selectPlace(placeDetails));
      onPlaceSelect?.(placeDetails);

      if (clientId) {
        dispatch(
          saveVisitedLocation({
            clientId,
            placeDesc: placeDetails.name,
            latitude: placeDetails.latitude.toString(),
            longitude: placeDetails.longitude.toString(),
          })
        );
      }

      clearSuggestions();
      setInputValue('');
    } catch (error) {
      console.error('Failed to get place details:', error);
    }
  };

  return (
    <Paper
      elevation={2}
      sx={{
        borderRadius: 2,
        overflow: 'hidden',
      }}
    >
      <Autocomplete
        fullWidth={fullWidth}
        freeSolo
        disableClearable
        options={suggestions}
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleSelect}
        getOptionLabel={(option) =>
          typeof option === 'string'
            ? option
            : option.description
        }
        filterOptions={(x) => x}
        loading={isLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder={placeholder}
            variant="outlined"
            size="small"
            slotProps={{
              input: {
                ...params.InputProps,
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: 'text.secondary' }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <>
                    {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
                sx: {
                  backgroundColor: '#ffffff',
                  '& fieldset': {
                    border: 'none',
                  },
                },
              },
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                py: 0.5,
              },
            }}
          />
        )}
        renderOption={(props, option) => {
          const { key, ...optionProps } = props;
          return (
            <Box
              key={key}
              component="li"
              {...optionProps}
              sx={{ display: 'flex', alignItems: 'flex-start', gap: 1, py: 1 }}
            >
              <LocationIcon sx={{ color: 'text.secondary', mt: 0.5 }} />
              <Box>
                <Typography variant="body1">
                  {option.description}
                </Typography>
              </Box>
            </Box>
          );
        }}
        noOptionsText={inputValue.length < 2 ? 'Type to search...' : 'No places found'}
      />
    </Paper>
  );
};

export default SearchBar;
