package com.github.rhmnlm.gplace_autocomplete.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.github.rhmnlm.gplace_autocomplete.entity.FavedLocation;

@Repository
public interface FavedLocationRepository extends JpaRepository<FavedLocation, UUID> {
    Page<FavedLocation> findByClient_ClientId(UUID clientId, Pageable pageable);

    Page<FavedLocation> findByCategory_IdAndClient_ClientId(UUID categoryId, UUID clientId, Pageable pageable);
}
