package com.github.rhmnlm.gplace_autocomplete.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LocationResponse {
    private UUID id;
    private String placeDesc;
    private String latitude;
    private String longitude;
    private LocalDateTime createdAt;
    private UUID clientId;
    private UUID categoryId;
    private String categoryName;
    private String message;

    public LocationResponse(UUID id, String placeDesc, String latitude, String longitude,
                            LocalDateTime createdAt, UUID clientId) {
        this(id, placeDesc, latitude, longitude, createdAt, clientId, null, null, null);
    }

    public LocationResponse(UUID id, String placeDesc, String latitude, String longitude,
                            LocalDateTime createdAt, UUID clientId, UUID categoryId, String categoryName) {
        this(id, placeDesc, latitude, longitude, createdAt, clientId, categoryId, categoryName, null);
    }
}
