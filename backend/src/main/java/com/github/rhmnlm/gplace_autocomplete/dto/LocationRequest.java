package com.github.rhmnlm.gplace_autocomplete.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class LocationRequest {
    @NotNull(message = "clientId is required")
    private UUID clientId;

    @NotBlank(message = "placeDesc is required")
    private String placeDesc;

    @NotBlank(message = "latitude is required")
    private String latitude;

    @NotBlank(message = "longitude is required")
    private String longitude;

    private UUID categoryId; // optional, for faved locations only
}
