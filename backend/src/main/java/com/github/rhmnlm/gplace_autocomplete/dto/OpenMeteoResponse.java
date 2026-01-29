package com.github.rhmnlm.gplace_autocomplete.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class OpenMeteoResponse {
    private double latitude;
    private double longitude;
    
    @JsonProperty("current")
    private CurrentWeather currentWeather;

    @Data
    public static class CurrentWeather {
        private String time;

        @JsonProperty("temperature_2m")
        private double temperature;

        @JsonProperty("wind_speed_10m")
        private double windspeed;

        @JsonProperty("wind_direction_10m")
        private double winddirection;

        @JsonProperty("relative_humidity_2m")
        private double humidity;
        
        @JsonProperty("is_day")
        private int isDay;
        
        @JsonProperty("weathercode")
        private int weathercode;
    }
}
