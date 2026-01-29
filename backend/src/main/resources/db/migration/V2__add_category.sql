-- Flyway migration to add category feature for faved locations

-- Create category table
CREATE TABLE category (
    id UNIQUEIDENTIFIER NOT NULL PRIMARY KEY,
    category_name VARCHAR(100) NOT NULL,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    updated_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    client_id_fk UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT FK_category_client FOREIGN KEY (client_id_fk)
        REFERENCES client(client_id),
    CONSTRAINT UQ_category_name_per_client UNIQUE (category_name, client_id_fk)
);

-- Add category reference to faved_location table
ALTER TABLE faved_location ADD category_id_fk UNIQUEIDENTIFIER NULL;
ALTER TABLE faved_location ADD CONSTRAINT FK_faved_location_category
    FOREIGN KEY (category_id_fk) REFERENCES category(id);

-- Create indexes for better query performance
CREATE INDEX IX_category_client_id_fk ON category(client_id_fk);
CREATE INDEX IX_faved_location_category_id_fk ON faved_location(category_id_fk);
