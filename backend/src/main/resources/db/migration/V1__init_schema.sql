-- Flyway migration script to create initial schema
-- UUIDs will be generated as UUIDv7 in Java application code

-- Create client table
CREATE TABLE client (
    client_id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME()
);

-- Create visited_location table
CREATE TABLE visited_location (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    place_desc VARCHAR(255) NOT NULL,
    latitude VARCHAR(64) NOT NULL,
    longitude VARCHAR(64) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    client_id_fk UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_visited_location_client FOREIGN KEY (client_id_fk)
        REFERENCES client(client_id)
);

-- Create faved_location table
CREATE TABLE faved_location (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    place_desc VARCHAR(255) NOT NULL,
    latitude VARCHAR(64) NOT NULL,
    longitude VARCHAR(64) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    client_id_fk UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_faved_location_client FOREIGN KEY (client_id_fk)
        REFERENCES client(client_id)
);

-- Create indexes for better query performance
CREATE INDEX IX_visited_location_client_id_fk ON visited_location(client_id_fk);
CREATE INDEX IX_visited_location_created_at ON visited_location(created_at DESC);

CREATE INDEX IX_faved_location_client_id_fk ON faved_location(client_id_fk);
CREATE INDEX IX_faved_location_created_at ON faved_location(created_at DESC);
