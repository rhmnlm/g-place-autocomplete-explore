-- Test Data Seed Script
-- Run this manually to populate test data for pagination testing
-- This is NOT a Flyway migration - execute directly in SSMS or Azure Data Studio

-- Create a test client
-- DECLARE @testClientId UNIQUEIDENTIFIER = NEWID();
DECLARE @testClientId UNIQUEIDENTIFIER = 'B838F2B7-D638-4A50-8FD3-91520F384271';
INSERT INTO client (client_id, created_at) VALUES (@testClientId, SYSDATETIME());

PRINT 'Created test client: ' + CAST(@testClientId AS VARCHAR(36));

-- Create categories for the test client
DECLARE @categoryFood UNIQUEIDENTIFIER = NEWID();
DECLARE @categoryEntertainment UNIQUEIDENTIFIER = NEWID();
DECLARE @categoryShopping UNIQUEIDENTIFIER = NEWID();

INSERT INTO category (id, category_name, created_at, updated_at, client_id_fk) VALUES
    (@categoryFood, 'Food', SYSDATETIME(), SYSDATETIME(), @testClientId),
    (@categoryEntertainment, 'Entertainment', SYSDATETIME(), SYSDATETIME(), @testClientId),
    (@categoryShopping, 'Shopping', SYSDATETIME(), SYSDATETIME(), @testClientId);

PRINT 'Created categories: Food, Entertainment, Shopping';

-- Insert 25+ visited locations for pagination testing
INSERT INTO visited_location (id, place_desc, latitude, longitude, created_at, client_id_fk) VALUES
    (NEWID(), 'KLCC Petronas Twin Towers', '3.1578', '101.7117', SYSDATETIME(), @testClientId),
    (NEWID(), 'Batu Caves', '3.2379', '101.6840', SYSDATETIME(), @testClientId),
    (NEWID(), 'Merdeka Square', '3.1480', '101.6938', SYSDATETIME(), @testClientId),
    (NEWID(), 'KL Tower', '3.1529', '101.7038', SYSDATETIME(), @testClientId),
    (NEWID(), 'Petaling Street', '3.1435', '101.6969', SYSDATETIME(), @testClientId),
    (NEWID(), 'Central Market', '3.1456', '101.6958', SYSDATETIME(), @testClientId),
    (NEWID(), 'Pavilion KL', '3.1490', '101.7134', SYSDATETIME(), @testClientId),
    (NEWID(), 'Bukit Bintang', '3.1466', '101.7108', SYSDATETIME(), @testClientId),
    (NEWID(), 'Sunway Lagoon', '3.0734', '101.6067', SYSDATETIME(), @testClientId),
    (NEWID(), 'Aquaria KLCC', '3.1530', '101.7119', SYSDATETIME(), @testClientId),
    (NEWID(), 'National Museum', '3.1375', '101.6875', SYSDATETIME(), @testClientId),
    (NEWID(), 'Islamic Arts Museum', '3.1419', '101.6891', SYSDATETIME(), @testClientId),
    (NEWID(), 'Bird Park KL', '3.1428', '101.6870', SYSDATETIME(), @testClientId),
    (NEWID(), 'Butterfly Park', '3.1445', '101.6862', SYSDATETIME(), @testClientId),
    (NEWID(), 'Lake Gardens', '3.1430', '101.6866', SYSDATETIME(), @testClientId),
    (NEWID(), 'Thean Hou Temple', '3.1220', '101.6865', SYSDATETIME(), @testClientId),
    (NEWID(), 'Jalan Alor', '3.1455', '101.7085', SYSDATETIME(), @testClientId),
    (NEWID(), 'KLCC Park', '3.1558', '101.7123', SYSDATETIME(), @testClientId),
    (NEWID(), 'Genting Highlands', '3.4235', '101.7932', SYSDATETIME(), @testClientId),
    (NEWID(), 'Berjaya Times Square', '3.1420', '101.7107', SYSDATETIME(), @testClientId),
    (NEWID(), 'Mid Valley Megamall', '3.1178', '101.6773', SYSDATETIME(), @testClientId),
    (NEWID(), 'The Curve', '3.1535', '101.6110', SYSDATETIME(), @testClientId),
    (NEWID(), '1 Utama Shopping Centre', '3.1503', '101.6159', SYSDATETIME(), @testClientId),
    (NEWID(), 'IOI City Mall', '2.9704', '101.7178', SYSDATETIME(), @testClientId),
    (NEWID(), 'Putrajaya Mosque', '2.9361', '101.6931', SYSDATETIME(), @testClientId),
    (NEWID(), 'Perdana Putra', '2.9418', '101.6951', SYSDATETIME(), @testClientId),
    (NEWID(), 'Cyberjaya', '2.9213', '101.6559', SYSDATETIME(), @testClientId),
    (NEWID(), 'Bangsar Village', '3.1294', '101.6705', SYSDATETIME(), @testClientId),
    (NEWID(), 'Publika', '3.1710', '101.6669', SYSDATETIME(), @testClientId),
    (NEWID(), 'Nu Sentral', '3.1341', '101.6863', SYSDATETIME(), @testClientId);

PRINT 'Inserted 30 visited locations';

-- Insert 25+ faved locations with categories for pagination testing
INSERT INTO faved_location (id, place_desc, latitude, longitude, created_at, client_id_fk, category_id_fk) VALUES
    -- Food category
    (NEWID(), 'Village Park Restaurant', '3.1512', '101.6543', SYSDATETIME(), @testClientId, @categoryFood),
    (NEWID(), 'Nasi Lemak Antarabangsa', '3.1079', '101.6304', SYSDATETIME(), @testClientId, @categoryFood),
    (NEWID(), 'Restoran Rebung', '3.1219', '101.6867', SYSDATETIME(), @testClientId, @categoryFood),
    (NEWID(), 'Yut Kee Restaurant', '3.1557', '101.6967', SYSDATETIME(), @testClientId, @categoryFood),
    (NEWID(), 'Lot 10 Hutong', '3.1478', '101.7122', SYSDATETIME(), @testClientId, @categoryFood),
    (NEWID(), 'Wong Ah Wah', '3.1458', '101.7082', SYSDATETIME(), @testClientId, @categoryFood),
    (NEWID(), 'Fatty Crab', '3.1103', '101.6591', SYSDATETIME(), @testClientId, @categoryFood),
    (NEWID(), 'Madam Kwan''s', '3.1578', '101.7117', SYSDATETIME(), @testClientId, @categoryFood),
    (NEWID(), 'Old Town White Coffee', '3.1490', '101.7134', SYSDATETIME(), @testClientId, @categoryFood),
    (NEWID(), 'Din Tai Fung', '3.1490', '101.7134', SYSDATETIME(), @testClientId, @categoryFood),
    -- Entertainment category
    (NEWID(), 'TGV Cinemas KLCC', '3.1578', '101.7117', SYSDATETIME(), @testClientId, @categoryEntertainment),
    (NEWID(), 'GSC Mid Valley', '3.1178', '101.6773', SYSDATETIME(), @testClientId, @categoryEntertainment),
    (NEWID(), 'Zouk Club KL', '3.1377', '101.6872', SYSDATETIME(), @testClientId, @categoryEntertainment),
    (NEWID(), 'Empire City Casino', '2.9834', '101.7531', SYSDATETIME(), @testClientId, @categoryEntertainment),
    (NEWID(), 'Resorts World Genting', '3.4235', '101.7932', SYSDATETIME(), @testClientId, @categoryEntertainment),
    (NEWID(), 'Kidzania KL', '3.0734', '101.6067', SYSDATETIME(), @testClientId, @categoryEntertainment),
    (NEWID(), 'Jump Street Trampoline Park', '3.1143', '101.6362', SYSDATETIME(), @testClientId, @categoryEntertainment),
    (NEWID(), 'District 21', '3.1010', '101.7178', SYSDATETIME(), @testClientId, @categoryEntertainment),
    -- Shopping category
    (NEWID(), 'Suria KLCC', '3.1578', '101.7117', SYSDATETIME(), @testClientId, @categoryShopping),
    (NEWID(), 'Pavilion KL', '3.1490', '101.7134', SYSDATETIME(), @testClientId, @categoryShopping),
    (NEWID(), 'Mid Valley Megamall', '3.1178', '101.6773', SYSDATETIME(), @testClientId, @categoryShopping),
    (NEWID(), 'Sunway Pyramid', '3.0734', '101.6067', SYSDATETIME(), @testClientId, @categoryShopping),
    (NEWID(), 'IOI City Mall', '2.9704', '101.7178', SYSDATETIME(), @testClientId, @categoryShopping),
    (NEWID(), 'The Gardens Mall', '3.1178', '101.6773', SYSDATETIME(), @testClientId, @categoryShopping),
    (NEWID(), 'Bangsar Shopping Centre', '3.1294', '101.6705', SYSDATETIME(), @testClientId, @categoryShopping),
    (NEWID(), 'KLCC Isetan', '3.1578', '101.7117', SYSDATETIME(), @testClientId, @categoryShopping),
    -- Some without categories
    (NEWID(), 'Random Cafe 1', '3.1500', '101.7000', SYSDATETIME(), @testClientId, NULL),
    (NEWID(), 'Random Cafe 2', '3.1510', '101.7010', SYSDATETIME(), @testClientId, NULL),
    (NEWID(), 'Random Place', '3.1520', '101.7020', SYSDATETIME(), @testClientId, NULL),
    (NEWID(), 'Unknown Spot', '3.1530', '101.7030', SYSDATETIME(), @testClientId, NULL);

PRINT 'Inserted 30 faved locations';

-- Output the test client ID for use in Postman
SELECT
    @testClientId AS test_client_id,
    @categoryFood AS category_food_id,
    @categoryEntertainment AS category_entertainment_id,
    @categoryShopping AS category_shopping_id;
