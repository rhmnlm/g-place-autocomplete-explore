package com.github.rhmnlm.gplace_autocomplete.dto;

import java.time.LocalDateTime;
import java.util.UUID;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CategoryResponse {

    private UUID id;
    private String categoryName;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UUID clientId;
}
