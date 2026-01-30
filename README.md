# Google Places Autocomplete Explorer

A full-stack web application for exploring and managing locations using Google Places Autocomplete API. Users can search for places, view them on an interactive map, save favorites, and organize them with custom categories.

## Architecture

This project follows a **monorepo structure** with separate backend and frontend applications communicating via REST APIs.

```
g-place-autocomplete-explore/
├── backend/          # Java Spring Boot REST API
├── frontend/         # React + TypeScript SPA
└── db/               # Database configuration (Docker)
```

### Backend (Spring Boot)

- **Framework**: Spring Boot 4.0.2 with Java 17
- **Database**: MS SQL Server 2019 with Flyway migrations
- **ORM**: Spring Data JPA
- **API Documentation**: SpringDoc OpenAPI (Swagger UI)
- **Architecture**: Controller → Service → Repository pattern
- **External Integration**: Open-Meteo Weather API

### Frontend (React)

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite
- **State Management**: Redux Toolkit with Thunk middleware
- **UI Library**: Material-UI (MUI) v7
- **Maps**: @vis.gl/react-google-maps

### Data Flow

1. Frontend identifies/creates a client via backend API
2. Client ID is persisted in localStorage for session continuity
3. All location data (visited, favorites, categories) is isolated per client
4. Weather data is fetched on-demand when viewing location details

## Requirements

### Backend
- Java 17 or higher
- Gradle
- Docker (for MS SQL Server) or local MS SQL Server instance

### Frontend
- Node.js 18 or higher
- npm or yarn
- Google Maps API Key with the following APIs enabled:
  - Places API
  - Places API (New)
  - Maps JavaScript API

### Database
- MS SQL Server 2019 (via Docker or local installation)

## Installation

### 1. Database Setup

Start the MS SQL Server container:

```bash
cd db
docker-compose up -d
```

This will start MS SQL Server on port `1433` with:
- SA Password: `YourStrong!Passw0rd`
- Persistent data volume

### 2. Backend Setup

```bash
cd backend

# Run the application (migrations run automatically)
./gradlew bootRun
```

The backend will start on `http://localhost:8080`.

#### Seed Data

The backend includes seed data for testing purposes located at:
```
backend/src/main/resources/db/seed_test_data.sql
```

To populate the database with test data, run this SQL script manually against your database using your preferred SQL client (e.g., Azure Data Studio, SQL Server Management Studio, or DBeaver).

#### API Testing

The backend provides Swagger UI for API exploration and testing:
- **Swagger UI**: http://localhost:8080/swagger-ui/index.html

A Postman collection is also available at `backend/postman_collection.json` for testing all API endpoints.

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.dev .env.local
```

Edit `.env.local` and set your Google Maps API key:

```env
VITE_GMAP_API_KEY=your_google_maps_api_key_here
VITE_API_BASE_URL=http://localhost:8080/api
```

> **Important**: Your Google Maps API key must have the following APIs enabled in Google Cloud Console:
> - **Places API** - For place autocomplete and details
> - **Places API (New)** - For enhanced place features
> - **Maps JavaScript API** - For rendering the interactive map

Start the development server:

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`.

## Features

### Place Search with Autocomplete
- Search for any location using Google Places Autocomplete
- Real-time suggestions as you type
- Select a place to view it on the map with detailed information

### Interactive Map
- View searched locations on an interactive Google Map
- Click on Points of Interest (POIs) directly on the map to get details
- Custom markers with distinct styling for selected locations
- Automatic geolocation to center the map on your current position

### Search History
- All searched locations are automatically saved
- View your complete search history in the sidebar
- Click any history item to revisit that location on the map
- Paginated list for easy navigation through past searches

### Favorites Management
- Mark any location as a favorite with a single click
- Remove locations from favorites
- Favorites are persisted in the database and synced across sessions

### Category Organization
- Create custom categories to organize your favorite places
- Assign categories to favorite locations
- Update or rename categories as needed
- Filter favorites by category

### Weather Information
- View current weather conditions for any selected location
- Weather data includes temperature, humidity, and wind speed
- Weather icons indicate current conditions (sunny, cloudy, rainy, etc.)
- Powered by Open-Meteo free weather API

### Client Isolation
- Each user session gets a unique client identifier
- All data (favorites, history, categories) is isolated per client
- Client ID persists in browser localStorage for session continuity

## API Endpoints

### Client
- `POST /api/client/identify` - Identify or create a client

### Locations
- `POST /api/locations/visited` - Save a visited location
- `GET /api/locations/visited` - Get visited locations (paginated)
- `POST /api/locations/faved` - Save a favorite location
- `GET /api/locations/faved` - Get favorite locations (paginated)
- `DELETE /api/locations/faved/{id}` - Remove a favorite
- `PUT /api/locations/faved/{id}/category` - Assign category to favorite

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `PUT /api/categories/{id}` - Update a category

### Weather
- `GET /api/locations/weather` - Get weather by coordinates

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 19 + TypeScript |
| State Management | Redux Toolkit + Thunk |
| UI Components | Material-UI v7 |
| Maps Integration | @vis.gl/react-google-maps |
| Backend Framework | Spring Boot 4.0.2 |
| Language | Java 17 |
| Database | MS SQL Server 2019 |
| ORM | Spring Data JPA |
| Migrations | Flyway |
| API Docs | SpringDoc OpenAPI |
| Build Tools | Vite (FE), Gradle (BE) |

## Development

This project was developed with the assistance of **Large Language Models (LLMs)** to accelerate the development process. LLMs were used for:

- Scaffolding boilerplate code and project structure
- Generating repetitive code patterns (DTOs, entities, API endpoints)
- Writing and refining documentation
- Debugging and troubleshooting issues
- Code review and suggesting improvements

While LLMs significantly sped up development, all generated code was reviewed, tested, and validated to ensure correctness and adherence to best practices.
