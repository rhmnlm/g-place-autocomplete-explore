package com.github.rhmnlm.gplace_autocomplete.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class WeatherResponse {
    private UUID locationId;
    private String placeDesc;
    private String latitude;
    private String longitude;
    private LocalDateTime locationCreatedAt;
    
    // Weather data from 3rd party API
    private WeatherData weather;
}
