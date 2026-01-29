package com.github.rhmnlm.gplace_autocomplete.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class WeatherResponse {
    private String latitude;
    private String longitude;
    
    // Weather data from 3rd party API
    private WeatherData weather;
}
