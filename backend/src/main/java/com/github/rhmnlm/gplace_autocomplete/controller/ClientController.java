package com.github.rhmnlm.gplace_autocomplete.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ClientController {
    
    @PostMapping("/identify")
    public String identify() {
        return "";
    }
}
