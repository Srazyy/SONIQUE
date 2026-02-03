# SONIQUE - Urban Sound Classification System

> AI-powered sound classification application for urban noise monitoring and analysis.

## 🎯 Vision

SONIQUE aims to revolutionize urban sound monitoring by providing real-time audio classification using machine learning. The system captures ambient sounds, classifies them using Google's YAMNet model, and visualizes sound patterns on an interactive map.

## 🛠️ Tech Stack

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Python, Flask, TensorFlow, YAMNet
- **Database**: SQLite
- **Maps**: Leaflet.js with heatmap visualization
- **Containerization**: Docker

## 📁 Project Structure

```
SONIQUE/
├── client/          # React frontend
├── server/          # Flask backend
├── docs/            # Documentation & diagrams
└── docker-compose.yml
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Python 3.11+
- Docker (optional)

### Local Development

```bash
# Frontend
cd client
npm install
npm run dev

# Backend
cd server
pip install -r requirements.txt
python app.py
```

### Docker

```bash
docker-compose up --build
```

## 📖 Documentation

- [Architecture](docs/ARCHITECTURE.md)
- [MoSCoW Prioritization](docs/MOSCOW.md)
- [User Stories](docs/USER_STORIES.md)

## 📸 Screenshots

See [docs/screenshots/](docs/screenshots/) for proof of execution.

## 👤 Author

**Shresth Kumar Gupta**
