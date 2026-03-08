# SONIQUE - Urban Sound Classification System

> AI-powered sound classification application for urban noise monitoring and analysis.

---

## 📋 Project Overview

**SONIQUE** is a web-based application that uses machine learning to classify urban sounds in real-time. It captures audio from users' microphones, processes it through Google's YAMNet model, and visualizes sound patterns on an interactive map with geolocation data.

### Problem It Solves

Urban environments are filled with various sounds that can indicate traffic patterns, noise pollution levels, emergency situations, or environmental conditions. Currently, there's no easy way for individuals or city planners to:
- Monitor and categorize urban sounds in real-time
- Identify noise hotspots geographically
- Build historical data on sound patterns in specific locations

SONIQUE addresses these gaps by providing an accessible, AI-powered sound classification system.

---

## 👥 Target Users (Personas)

| Persona | Description | Goals |
|---------|-------------|-------|
| **Urban Planner** | City official monitoring noise levels | Identify noise hotspots, plan quiet zones |
| **Researcher** | Academic studying urban soundscapes | Collect sound data with location metadata |
| **Environmental Activist** | Advocate for noise pollution awareness | Document and visualize noise levels |
| **Curious Citizen** | Resident interested in their environment | Understand sounds in their neighborhood |

---

## 🎯 Vision Statement

*"To empower communities with accessible AI tools for understanding and visualizing urban soundscapes, enabling data-driven decisions for healthier, more livable cities."*

---

## ✨ Key Features & Goals

### Core Features
- 🎤 **Real-time Audio Recording** - Browser-based microphone capture
- 🤖 **AI Classification** - YAMNet model identifies 500+ sound types
- 📍 **Geolocation Tagging** - Automatic GPS coordinates with each recording
- 🗺️ **Interactive Map** - Leaflet-based visualization with markers
- 🔥 **Heatmap View** - Aggregate sound data visualization
- 📊 **History Tracking** - SQLite storage for historical analysis

### Goals
1. Achieve 85%+ classification accuracy for common urban sounds
2. Support real-time processing under 3 seconds per recording
3. Provide mobile-responsive interface for field use
4. Enable data export for research purposes

---

## 📈 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Classification Accuracy | ≥85% | Top-3 prediction hit rate |
| Processing Time | <3s | Time from upload to result |
| User Adoption | 100+ recordings | Database entry count |
| Map Coverage | 10+ locations | Unique coordinate clusters |

---

## ⚠️ Assumptions & Constraints

### Assumptions
- Users have modern browsers with microphone access
- Users grant location permissions
- Internet connectivity is available for API calls
- Target urban sounds are covered by YAMNet's 521 classes

### Constraints
- **Technical**: YAMNet runs on server (TensorFlow), not edge devices
- **Privacy**: Audio files are deleted after classification
- **Accuracy**: YAMNet is general-purpose, not urban-specific
- **Storage**: SQLite limits concurrent write operations

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui |
| **Backend** | Python 3.11, Flask, TensorFlow, YAMNet |
| **Database** | SQLite |
| **Maps** | Leaflet.js, OpenStreetMap, leaflet.heat |
| **Containerization** | Docker, Docker Compose |

---

## 📁 Project Structure

```
SONIQUE/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # UI components (shadcn/ui)
│   │   ├── pages/         # Route pages
│   │   └── hooks/         # Custom React hooks
│   ├── Dockerfile         # Frontend container
│   └── package.json
├── server/                 # Flask backend
│   ├── app.py             # Main API + YAMNet
│   ├── Dockerfile         # Backend container
│   └── requirements.txt
├── docs/
│   ├── ARCHITECTURE.md    # System architecture
│   ├── MOSCOW.md          # Feature prioritization
│   ├── USER_STORIES.md    # User stories
│   ├── wireframes/        # UI wireframes
│   └── screenshots/       # Proof screenshots
└── docker-compose.yml     # Container orchestration
```

---

## 🌿 Branching Strategy (GitHub Flow)

We follow **GitHub Flow** for this project:

```
main (production-ready)
  │
  ├── feature/backend-api        → Flask server + database
  ├── feature/audio-classification → YAMNet integration
  ├── feature/frontend-ui        → React components
  └── feature/docker-setup       → Docker configuration
```

### Workflow
1. Create feature branch from `main`
2. Make commits with descriptive messages
3. Open Pull Request when ready
4. Merge to `main` after review

### Current Branches
- `main` - Production branch
- `feature/backend-api` - Backend API endpoints
- `feature/audio-classification` - ML classification
- `feature/frontend-ui` - React frontend
- `feature/docker-setup` - Docker configuration

---

## 🚀 Quick Start - Local Development

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Node.js | 18+ | Frontend runtime |
| Python | 3.11+ | Backend runtime |
| Docker | Latest | Containerization |
| ffmpeg | Latest | Audio conversion |

### Option 1: Run with Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/Srazyy/SONIQUE.git
cd SONIQUE

# Build and run containers
docker-compose up --build

# Access the app
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

### Option 2: Run Locally

**Backend:**
```bash
cd server

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
python app.py
# Server runs at http://localhost:5000
```

**Frontend:**
```bash
cd client

# Install dependencies
npm install

# Run development server
npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🔧 Local Development Tools

| Tool | Purpose | Installation |
|------|---------|--------------|
| VS Code | Code editor | [Download](https://code.visualstudio.com/) |
| Docker Desktop | Container runtime | [Download](https://www.docker.com/products/docker-desktop/) |
| Node.js | JavaScript runtime | [Download](https://nodejs.org/) |
| Python | Backend runtime | [Download](https://www.python.org/) |
| ffmpeg | Audio processing | `brew install ffmpeg` (Mac) |
| Git | Version control | [Download](https://git-scm.com/) |

---

## 🎨 Software Design

SONIQUE follows a **Layered + Client-Server architecture**, separating the React frontend and Flask backend into independent layers connected solely through REST API endpoints. This design ensures **low coupling** (frontend and backend can be developed, deployed, and scaled independently via Docker), **high cohesion** (each component handles a single responsibility), and **modularity** (features like audio recording, ML classification, and map visualization are self-contained modules).

### Architecture Diagrams

- [📐 Layered Architecture Diagram (Draw.io source)](docs/design/sonique_layered_architecture.drawio)
- [🔗 Component Interaction Diagram (Draw.io source)](docs/design/sonique_component_diagram.drawio)

![Layered Architecture](docs/design/sonique_layered_architecture.drawio)

### Design Documentation

- [📄 Full Software Design Document](docs/design/SOFTWARE_DESIGN_DOCUMENT.md) — Design principles, architecture rationale, UI design, and key decisions
- [🖼️ UI Wireframes](docs/design/) — 6 screens: Home, Recorder, Map, Results, History, Mobile

---

## 📖 Documentation

- [Architecture Diagram](docs/ARCHITECTURE.md)
- [MoSCoW Prioritization](docs/MOSCOW.md)
- [User Stories](docs/USER_STORIES.md)

---

## 📸 Screenshots

See [docs/screenshots/](docs/screenshots/) for proof of:
- Docker containers running
- Application in browser
- GitHub repository with branches

---

## 👤 Author

**Shresth Kumar Gupta**  
Email: srazyy7@gmail.com  
GitHub: [@Srazyy](https://github.com/Srazyy)
