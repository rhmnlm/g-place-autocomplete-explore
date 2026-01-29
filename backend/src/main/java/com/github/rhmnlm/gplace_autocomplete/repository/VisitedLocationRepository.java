package com.github.rhmnlm.gplace_autocomplete.repository;

import java.util.UUID;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.github.rhmnlm.gplace_autocomplete.entity.VisitedLocation;

@Repository
public interface VisitedLocationRepository extends JpaRepository<VisitedLocation, UUID> {
    Page<VisitedLocation> findByClient_ClientId(UUID clientId, Pageable pageable);
}
