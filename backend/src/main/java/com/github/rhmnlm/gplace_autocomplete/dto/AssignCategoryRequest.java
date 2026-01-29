package com.github.rhmnlm.gplace_autocomplete.dto;

import java.util.UUID;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AssignCategoryRequest {

    @NotNull(message = "clientId is required")
    private UUID clientId;

    private UUID categoryId; // nullable to remove category assignment
}
