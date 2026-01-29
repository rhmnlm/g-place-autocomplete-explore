package com.github.rhmnlm.gplace_autocomplete.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.rhmnlm.gplace_autocomplete.dto.LocationRequest;
import com.github.rhmnlm.gplace_autocomplete.dto.LocationResponse;
import com.github.rhmnlm.gplace_autocomplete.entity.Category;
import com.github.rhmnlm.gplace_autocomplete.entity.Client;
import com.github.rhmnlm.gplace_autocomplete.entity.FavedLocation;
import com.github.rhmnlm.gplace_autocomplete.entity.VisitedLocation;
import com.github.rhmnlm.gplace_autocomplete.repository.CategoryRepository;
import com.github.rhmnlm.gplace_autocomplete.repository.ClientRepository;
import com.github.rhmnlm.gplace_autocomplete.repository.FavedLocationRepository;
import com.github.rhmnlm.gplace_autocomplete.repository.VisitedLocationRepository;
import com.github.rhmnlm.gplace_autocomplete.util.UuidUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class LocationService {
    
    private final VisitedLocationRepository visitedLocationRepository;
    private final FavedLocationRepository favedLocationRepository;
    private final ClientRepository clientRepository;
    private final CategoryRepository categoryRepository;
    
    @Transactional
    public LocationResponse saveVisitedLocation(LocationRequest request) {
        Client client = clientRepository.findById(request.getClientId())
            .orElseThrow(() -> new IllegalArgumentException("Client not found: " + request.getClientId()));
        
        VisitedLocation location = new VisitedLocation();
        location.setId(UuidUtil.generateUuidV7());
        location.setPlaceDesc(request.getPlaceDesc());
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setCreatedAt(LocalDateTime.now());
        location.setClient(client);
        
        VisitedLocation saved = visitedLocationRepository.save(location);
        log.info("Saved visited location {} for client {}", saved.getId(), request.getClientId());
        
        return toLocationResponse(saved);
    }
    
    @Transactional
    public LocationResponse saveFavedLocation(LocationRequest request) {
        Client client = clientRepository.findById(request.getClientId())
            .orElseThrow(() -> new IllegalArgumentException("Client not found: " + request.getClientId()));

        FavedLocation location = new FavedLocation();
        location.setId(UuidUtil.generateUuidV7());
        location.setPlaceDesc(request.getPlaceDesc());
        location.setLatitude(request.getLatitude());
        location.setLongitude(request.getLongitude());
        location.setCreatedAt(LocalDateTime.now());
        location.setClient(client);

        String message = null;

        // Handle optional category assignment
        if (request.getCategoryId() != null) {
            Category category = categoryRepository.findByIdAndClient_ClientId(request.getCategoryId(), request.getClientId())
                .orElse(null);
            if (category != null) {
                location.setCategory(category);
            } else {
                message = "Category not found: " + request.getCategoryId() + ". Location saved without category.";
                log.warn(message);
            }
        }

        FavedLocation saved = favedLocationRepository.save(location);
        log.info("Saved faved location {} for client {}", saved.getId(), request.getClientId());

        return toLocationResponse(saved, message);
    }

    @Transactional
    public LocationResponse assignCategoryToFavedLocation(UUID locationId, UUID categoryId, UUID clientId) {
        FavedLocation location = favedLocationRepository.findById(locationId)
            .orElseThrow(() -> new IllegalArgumentException("Faved location not found: " + locationId));

        // Verify location belongs to client
        if (!location.getClient().getClientId().equals(clientId)) {
            throw new IllegalArgumentException("Faved location " + locationId + " does not belong to client " + clientId);
        }

        String message = null;

        // categoryId can be null to remove category assignment
        if (categoryId != null) {
            Category category = categoryRepository.findByIdAndClient_ClientId(categoryId, clientId)
                .orElse(null);
            if (category != null) {
                location.setCategory(category);
            } else {
                message = "Category not found: " + categoryId + ". Category not updated.";
                log.warn(message);
            }
        } else {
            location.setCategory(null);
        }

        FavedLocation saved = favedLocationRepository.save(location);
        log.info("Updated category for faved location {} to {}", locationId, categoryId);

        return toLocationResponse(saved, message);
    }

    @Transactional(readOnly = true)
    public Page<LocationResponse> getFavedLocationsByCategory(UUID categoryId, UUID clientId, Pageable pageable) {
        Page<FavedLocation> locations = favedLocationRepository.findByCategory_IdAndClient_ClientId(categoryId, clientId, pageable);
        return locations.map(this::toLocationResponse);
    }
    
    @Transactional(readOnly = true)
    public Page<LocationResponse> getVisitedLocations(UUID clientId, Pageable pageable) {
        Page<VisitedLocation> locations = visitedLocationRepository.findByClient_ClientId(clientId, pageable);
        return locations.map(this::toLocationResponse);
    }
    
    @Transactional(readOnly = true)
    public Page<LocationResponse> getFavedLocations(UUID clientId, Pageable pageable) {
        Page<FavedLocation> locations = favedLocationRepository.findByClient_ClientId(clientId, pageable);
        return locations.map(this::toLocationResponse);
    }
    
    @Transactional(readOnly = true)
    public VisitedLocation getVisitedLocationById(UUID locationId) {
        return visitedLocationRepository.findById(locationId)
            .orElseThrow(() -> new IllegalArgumentException("Visited location not found: " + locationId));
    }
    
    @Transactional(readOnly = true)
    public FavedLocation getFavedLocationById(UUID locationId) {
        return favedLocationRepository.findById(locationId)
            .orElseThrow(() -> new IllegalArgumentException("Faved location not found: " + locationId));
    }
    
    private LocationResponse toLocationResponse(VisitedLocation location) {
        return new LocationResponse(
            location.getId(),
            location.getPlaceDesc(),
            location.getLatitude(),
            location.getLongitude(),
            location.getCreatedAt(),
            location.getClient().getClientId()
        );
    }
    
    private LocationResponse toLocationResponse(FavedLocation location) {
        return toLocationResponse(location, null);
    }

    private LocationResponse toLocationResponse(FavedLocation location, String message) {
        Category category = location.getCategory();
        return new LocationResponse(
            location.getId(),
            location.getPlaceDesc(),
            location.getLatitude(),
            location.getLongitude(),
            location.getCreatedAt(),
            location.getClient().getClientId(),
            category != null ? category.getId() : null,
            category != null ? category.getCategoryName() : null,
            message
        );
    }
}
