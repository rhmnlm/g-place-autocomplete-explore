package com.github.rhmnlm.gplace_autocomplete.controller;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.github.rhmnlm.gplace_autocomplete.dto.CategoryRequest;
import com.github.rhmnlm.gplace_autocomplete.dto.CategoryResponse;
import com.github.rhmnlm.gplace_autocomplete.dto.CategoryUpdateRequest;
import com.github.rhmnlm.gplace_autocomplete.service.CategoryService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody @Valid CategoryRequest request) {
        CategoryResponse response = categoryService.createCategory(request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable UUID id,
            @RequestParam UUID clientId,
            @RequestBody @Valid CategoryUpdateRequest request) {
        CategoryResponse response = categoryService.updateCategory(id, clientId, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<Page<CategoryResponse>> getCategories(
            @RequestParam UUID clientId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt,desc") String sort
        ) {
        Pageable pageable = PageRequest.of(
            page,
            size,
            Sort.by(Sort.Order.desc("createdAt"))
        );
        Page<CategoryResponse> categories = categoryService.getCategories(clientId, pageable);
        return ResponseEntity.ok(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(
            @PathVariable UUID id,
            @RequestParam UUID clientId) {
        CategoryResponse response = categoryService.getCategoryById(id, clientId);
        return ResponseEntity.ok(response);
    }
}
