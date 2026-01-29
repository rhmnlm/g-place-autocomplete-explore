package com.github.rhmnlm.gplace_autocomplete.controller;

import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.github.rhmnlm.gplace_autocomplete.dto.ClientIdentifyRequest;
import com.github.rhmnlm.gplace_autocomplete.dto.ClientIdentifyResponse;
import com.github.rhmnlm.gplace_autocomplete.service.ClientService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/client")
@RequiredArgsConstructor
public class ClientController {
    
    private final ClientService clientService;
    
    @PostMapping("/identify")
    public ResponseEntity<ClientIdentifyResponse> identify(
            @RequestHeader(value = "X-Client-Id", required = false) UUID clientIdHeader,
            @RequestBody(required = false) @Valid ClientIdentifyRequest request) {
        
        // Prefer header over body, fallback to body if header is null
        UUID clientId = clientIdHeader != null ? clientIdHeader : 
                       (request != null ? request.getClientId() : null);
        
        UUID identifiedClientId = clientService.identifyOrCreateClient(clientId);
        
        return ResponseEntity.ok(new ClientIdentifyResponse(identifiedClientId));
    }
}
