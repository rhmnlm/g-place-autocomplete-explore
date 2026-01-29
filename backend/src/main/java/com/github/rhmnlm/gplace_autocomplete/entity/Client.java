package com.github.rhmnlm.gplace_autocomplete.entity;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "client")
@Data
public class Client {
    
    @Id
    @Column(name = "client_id")
    private UUID clientId;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}
