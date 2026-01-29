package com.github.rhmnlm.gplace_autocomplete.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.rhmnlm.gplace_autocomplete.dto.AssignCategoryRequest;
import com.github.rhmnlm.gplace_autocomplete.dto.LocationRequest;
import com.github.rhmnlm.gplace_autocomplete.dto.LocationResponse;
import com.github.rhmnlm.gplace_autocomplete.dto.WeatherData;
import com.github.rhmnlm.gplace_autocomplete.dto.WeatherResponse;
import com.github.rhmnlm.gplace_autocomplete.service.LocationService;
import com.github.rhmnlm.gplace_autocomplete.service.WeatherService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/locations")
@RequiredArgsConstructor
public class LocationController {
    
    private final LocationService locationService;
    private final WeatherService weatherService;
    
    @PostMapping("/visited")
    public ResponseEntity<LocationResponse> saveVisitedLocation(@RequestBody @Valid LocationRequest request) {
        LocationResponse response = locationService.saveVisitedLocation(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/faved")
    public ResponseEntity<LocationResponse> saveFavedLocation(@RequestBody @Valid LocationRequest request) {
        LocationResponse response = locationService.saveFavedLocation(request);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/visited")
    public ResponseEntity<Page<LocationResponse>> getVisitedLocations(
            @RequestParam UUID clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
        ) {
        Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Order.desc("createdAt"))
        );
        Page<LocationResponse> locations = locationService.getVisitedLocations(clientId, pageable);
        return ResponseEntity.ok(locations);
    }
    
    @GetMapping("/faved")
    public ResponseEntity<Page<LocationResponse>> getFavedLocations(
            @RequestParam UUID clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
        ) {
        Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Order.desc("createdAt"))
        );
        Page<LocationResponse> locations = locationService.getFavedLocations(clientId, pageable);
        return ResponseEntity.ok(locations);
    }

    @PutMapping("/faved/{id}/category")
    public ResponseEntity<LocationResponse> assignCategoryToFavedLocation(
            @PathVariable UUID id,
            @RequestBody @Valid AssignCategoryRequest request) {
        LocationResponse response = locationService.assignCategoryToFavedLocation(
            id, request.getCategoryId(), request.getClientId());
        return ResponseEntity.ok(response);
    }

    @GetMapping("/faved/category/{categoryId}")
    public ResponseEntity<Page<LocationResponse>> getFavedLocationsByCategory(
            @PathVariable UUID categoryId,
            @RequestParam UUID clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
        ) {
        Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Order.desc("createdAt"))
        );
        Page<LocationResponse> locations = locationService.getFavedLocationsByCategory(categoryId, clientId, pageable);
        return ResponseEntity.ok(locations);
    }

    @GetMapping("/weather")
    public ResponseEntity<WeatherResponse> getLocationWeather(
        @RequestParam String latitude,
        @RequestParam String longitude
    ) {
        
        // Fetch weather data from 3rd party API (Open-Meteo)
        double lat = Double.parseDouble(latitude);
        double lon = Double.parseDouble(longitude);
        WeatherData weatherData = weatherService.getWeatherByCoordinates(lat, lon);
        
        // Build response (include location data even if weather API fails)
        WeatherResponse response = WeatherResponse.builder()
            .latitude(latitude)
            .longitude(longitude)
            .weather(weatherData) // Can be null if weather API fails
            .build();
        
        return ResponseEntity.ok(response);
    }
}
