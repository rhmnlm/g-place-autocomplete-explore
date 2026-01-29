package com.github.rhmnlm.gplace_autocomplete.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class WeatherData {
    private String description;
    private Double temperature;
    private Double feelsLike;
    private Integer humidity;
    private Double windSpeed;
    private String condition;
}
