package com.github.rhmnlm.gplace_autocomplete.repository;

import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.github.rhmnlm.gplace_autocomplete.entity.Client;

@Repository
public interface ClientRepository extends JpaRepository<Client, UUID> {
    boolean existsByClientId(UUID clientId);
}
