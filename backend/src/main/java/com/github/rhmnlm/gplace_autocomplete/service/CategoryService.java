package com.github.rhmnlm.gplace_autocomplete.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.rhmnlm.gplace_autocomplete.dto.CategoryRequest;
import com.github.rhmnlm.gplace_autocomplete.dto.CategoryResponse;
import com.github.rhmnlm.gplace_autocomplete.dto.CategoryUpdateRequest;
import com.github.rhmnlm.gplace_autocomplete.entity.Category;
import com.github.rhmnlm.gplace_autocomplete.entity.Client;
import com.github.rhmnlm.gplace_autocomplete.repository.CategoryRepository;
import com.github.rhmnlm.gplace_autocomplete.repository.ClientRepository;
import com.github.rhmnlm.gplace_autocomplete.util.UuidUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final ClientRepository clientRepository;

    @Transactional
    public CategoryResponse createCategory(CategoryRequest request) {
        Client client = clientRepository.findById(request.getClientId())
            .orElseThrow(() -> new IllegalArgumentException("Client not found: " + request.getClientId()));

        LocalDateTime now = LocalDateTime.now();

        Category category = new Category();
        category.setId(UuidUtil.generateUuidV7());
        category.setCategoryName(request.getCategoryName());
        category.setCreatedAt(now);
        category.setUpdatedAt(now);
        category.setClient(client);

        Category saved = categoryRepository.save(category);
        log.info("Created category {} for client {}", saved.getId(), request.getClientId());

        return toCategoryResponse(saved);
    }

    @Transactional
    public CategoryResponse updateCategory(UUID categoryId, UUID clientId, CategoryUpdateRequest request) {
        Category category = categoryRepository.findByIdAndClient_ClientId(categoryId, clientId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Category not found: " + categoryId + " for client: " + clientId));

        category.setCategoryName(request.getCategoryName());
        category.setUpdatedAt(LocalDateTime.now());

        Category saved = categoryRepository.save(category);
        log.info("Updated category {} for client {}", saved.getId(), clientId);

        return toCategoryResponse(saved);
    }

    @Transactional(readOnly = true)
    public Page<CategoryResponse> getCategories(UUID clientId, Pageable pageable) {
        Page<Category> categories = categoryRepository.findByClient_ClientId(clientId, pageable);
        return categories.map(this::toCategoryResponse);
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(UUID categoryId, UUID clientId) {
        Category category = categoryRepository.findByIdAndClient_ClientId(categoryId, clientId)
            .orElseThrow(() -> new IllegalArgumentException(
                "Category not found: " + categoryId + " for client: " + clientId));

        return toCategoryResponse(category);
    }

    private CategoryResponse toCategoryResponse(Category category) {
        return new CategoryResponse(
            category.getId(),
            category.getCategoryName(),
            category.getCreatedAt(),
            category.getUpdatedAt(),
            category.getClient().getClientId()
        );
    }
}
