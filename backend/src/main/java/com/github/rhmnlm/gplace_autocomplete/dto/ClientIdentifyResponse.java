package com.github.rhmnlm.gplace_autocomplete.dto;

import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ClientIdentifyResponse {
    private UUID clientId;
}
