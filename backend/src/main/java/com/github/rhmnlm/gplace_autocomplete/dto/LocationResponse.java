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
}
