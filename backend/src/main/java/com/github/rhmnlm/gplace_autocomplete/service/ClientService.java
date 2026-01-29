package com.github.rhmnlm.gplace_autocomplete.service;

import java.time.LocalDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.github.rhmnlm.gplace_autocomplete.entity.Client;
import com.github.rhmnlm.gplace_autocomplete.repository.ClientRepository;
import com.github.rhmnlm.gplace_autocomplete.util.UuidUtil;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClientService {
    
    private final ClientRepository clientRepository;
    
    @Transactional
    public UUID identifyOrCreateClient(UUID clientId) {
        if (clientId != null && clientRepository.existsByClientId(clientId)) {
            log.debug("Client {} already exists", clientId);
            return clientId;
        }
        
        // Create new client
        UUID newClientId = UuidUtil.generateUuidV7();
        Client client = new Client();
        client.setClientId(newClientId);
        client.setCreatedAt(LocalDateTime.now());
        
        clientRepository.save(client);
        log.info("Created new client with ID: {}", newClientId);
        
        return newClientId;
    }
    
    @Transactional(readOnly = true)
    public boolean clientExists(UUID clientId) {
        return clientRepository.existsByClientId(clientId);
    }
}
