package com.github.rhmnlm.gplace_autocomplete.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import com.github.rhmnlm.gplace_autocomplete.dto.OpenMeteoResponse;
import com.github.rhmnlm.gplace_autocomplete.dto.WeatherData;
import com.github.rhmnlm.gplace_autocomplete.util.WeatherCodeMapper;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class WeatherService {
    
    private final RestClient restClient;
    
    public WeatherService(@Value("${weather.api.base-url}") String baseUrl) {
        this.restClient = RestClient.builder()
            .baseUrl(baseUrl)
            .build();
    }
    
    final static String[] CURRENT_PARAM = {
        "temperature_2m",
        "relative_humidity_2m",
        "weather_code",
        "precipitation",
        "is_day",
        "apparent_temperature",
        "wind_speed_10m",
        "wind_direction_10m"
    };

    public WeatherData getWeatherByCoordinates(double latitude, double longitude) {
        try {
            log.debug("Fetching weather for coordinates: lat={}, lon={}", latitude, longitude);

            String current_param = String.join(",", CURRENT_PARAM);
            
            OpenMeteoResponse response = restClient.get()
                .uri( uriBuilder -> uriBuilder
                    .path("/forecast")
                    .queryParam("latitude", latitude)
                    .queryParam("longitude", longitude)
                    .queryParam("current", current_param)
                    .build()
                )
                .retrieve()
                .body(OpenMeteoResponse.class);
            
            if (response == null || response.getCurrentWeather() == null) {
                log.warn("Weather API returned null response for lat={}, lon={}", latitude, longitude);
                return null;
            }
            
            OpenMeteoResponse.CurrentWeather current = response.getCurrentWeather();
            
            WeatherData weatherData = WeatherData.builder()
                .description(WeatherCodeMapper.getWeatherDescription(current.getWeathercode()))
                .temperature(current.getTemperature())
                .feelsLike(current.getTemperature())
                .windSpeed(current.getWindspeed())
                .humidity(current.getHumidity())
                .condition(WeatherCodeMapper.getWeatherDescription(current.getWeathercode()))
                .build();
            
            log.info("Successfully fetched weather data for lat={}, lon={}", latitude, longitude);
            return weatherData;
            
        } catch (Exception e) {
            log.error("Error fetching weather data for lat={}, lon={}: {}", latitude, longitude, e.getMessage(), e);
            return null; // Return null on error, let caller handle gracefully
        }
    }
}
