package com.github.rhmnlm.gplace_autocomplete.util;

import java.util.UUID;

import com.fasterxml.uuid.Generators;
import com.fasterxml.uuid.impl.TimeBasedEpochRandomGenerator;

public class UuidUtil {
    
    private static final TimeBasedEpochRandomGenerator UUID_V7_GENERATOR = 
        Generators.timeBasedEpochRandomGenerator();
    
    /**
     * Generate a UUID v7 for better performance in database indexes
     * Uses Unix Epoch time + random for better index locality
     * Falls back to UUID v4 if v7 generation fails
     */
    public static UUID generateUuidV7() {
        try {
            return UUID_V7_GENERATOR.generate();
        } catch (Exception e) {
            // Fallback to standard UUID if v7 generation fails
            return UUID.randomUUID();
        }
    }
}
