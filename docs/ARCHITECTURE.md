# SONIQUE Architecture

## System Overview

SONIQUE is a full-stack application for urban sound classification and mapping.

```mermaid
graph TB
    subgraph Client["Frontend (React)"]
        UI[User Interface]
        REC[Audio Recorder]
        MAP[Leaflet Map]
    end
    
    subgraph Server["Backend (Flask)"]
        API[REST API]
        YAM[YAMNet Model]
        DB[(SQLite)]
    end
    
    UI --> REC
    REC -->|WebM Audio| API
    API --> YAM
    YAM -->|Classification| API
    API --> DB
    DB -->|History| API
    API -->|Results| MAP
    MAP --> UI
```

## Components

### Frontend
| Component | Technology | Purpose |
|-----------|------------|---------|
| UI Framework | React 18 + TypeScript | Component-based UI |
| Build Tool | Vite | Fast HMR & bundling |
| Styling | Tailwind CSS + shadcn/ui | Modern design system |
| Maps | Leaflet + react-leaflet | Geospatial visualization |
| Audio | Web Audio API | Browser recording |

### Backend
| Component | Technology | Purpose |
|-----------|------------|---------|
| API Framework | Flask | REST endpoints |
| ML Model | YAMNet (TensorFlow Hub) | Audio classification |
| Audio Processing | librosa + ffmpeg | Audio conversion |
| Database | SQLite | Sound history storage |

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant YAMNet
    participant Database
    
    User->>Frontend: Record audio
    Frontend->>Backend: POST /upload (WebM + coords)
    Backend->>Backend: Convert to WAV
    Backend->>YAMNet: Classify audio
    YAMNet-->>Backend: Top 3 predictions
    Backend->>Database: Save results
    Backend-->>Frontend: Return classification
    Frontend->>User: Display on map
```

## Folder Structure

```
SONIQUE/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Route pages
│   │   └── hooks/         # Custom hooks
│   ├── Dockerfile         # Frontend container
│   └── package.json
├── server/                 # Flask backend
│   ├── app.py             # Main application
│   ├── Dockerfile         # Backend container
│   └── requirements.txt
├── docs/                   # Documentation
└── docker-compose.yml     # Orchestration
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check |
| POST | `/upload` | Upload audio for classification |
| GET | `/history` | Get all sound history |
