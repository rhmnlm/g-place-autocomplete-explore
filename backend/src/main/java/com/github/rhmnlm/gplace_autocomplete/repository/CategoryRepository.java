package com.github.rhmnlm.gplace_autocomplete.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.github.rhmnlm.gplace_autocomplete.entity.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, UUID> {

    Page<Category> findByClient_ClientId(UUID clientId, Pageable pageable);

    Optional<Category> findByIdAndClient_ClientId(UUID id, UUID clientId);
}
