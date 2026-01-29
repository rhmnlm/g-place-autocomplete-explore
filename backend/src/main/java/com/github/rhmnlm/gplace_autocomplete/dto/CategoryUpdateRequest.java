package com.github.rhmnlm.gplace_autocomplete.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CategoryUpdateRequest {

    @NotBlank(message = "categoryName is required")
    @Size(max = 100, message = "categoryName must not exceed 100 characters")
    private String categoryName;
}
