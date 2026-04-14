# Component Diagram Analysis — JTJ &amp; SONIQUE

---

## 1. JTJ — Component Diagram Analysis

### 1.1 Subsystems Identified
The JTJ system has been logically decomposed into 6 coarse-grained subsystems to manage the complexity of its manual operations:

1. **Customer Interface**: Handles all external communications (booking requests, sending forms, receiving payments).
2. **Booking Management**: Core business operations for scoping and setting up jobs.
3. **Operations**: The physical execution of cleaning jobs and staff tracking.
4. **Finance &amp; Invoicing**: Financial calculations, billing, and receipting.
5. **Data Storage**: Filing cabinets and ledgers (represented as datastores) for persistence.
6. **Reporting**: Aggregation of data for management visibility.

### 1.2 Key Components &amp; Interfaces

| Component | Responsibility | Interfaces |
|-----------|----------------|------------|
| **Booking Request Handler** | Intake of customer requests | Uses Appointment Scheduler |
| **Booking Creator** | Generates the central Booking record | Uses Cleaner Scheduler, Creates Forms |
| **Job Execution Tracker** | Monitors cleaners on-site | Uses Hours Recorder, Triggers Invoicing |
| **Invoice Generator** | Calculates cost based on job tracking | Uses Payment Processor, Monthly Consolidation |

### 1.3 Architectural Analysis

- **Delegation Pattern**: The `Payment Receiver` (customer facing) delegates actual financial processing to the `Payment Processor` (finance subsystem). This provides a security/responsibility boundary.
- **Dependency Flow**: The architecture is roughly sequential: `Customer Interface → Booking Management → Operations → Finance`.
- **Data Centricity**: Several components interact directly with the corresponding data stores (Customer File, Booking File). In a software implementation, this would likely be abstracted behind a Data Access Object (DAO) layer, but for a manual business process, direct access is an accurate representation.
- **Handling of Regular Bookings**: The `Monthly Consolidation Engine` specifically handles the business rule for regular customers by aggregating multiple invoices.

---

## 2. SONIQUE — Component Diagram Analysis

### 2.1 Subsystems Identified
SONIQUE utilizes a strict modern web application architecture, separated into client, server, and external dependencies:

1. **React Frontend (Client)**: The browser-side application running React and Vite.
2. **Flask Backend (Server)**: The Python-based REST API and machine learning pipeline.
3. **Database**: Persistent local storage.
4. **External Infrastructure**: Third-party tile providers for mapping.

### 2.2 Key Components &amp; Interfaces

| Component | Responsibility | Interfaces |
|-----------|----------------|------------|
| **App Container** | Root component managing route state | Uses Recorder, Map |
| **Recorder Component** | Captures WebM audio via Browser API | Uses API Client |
| **LiveMap Component** | Renders Leaflet map and GeoJSON data | Uses API Client, Fetches OSM Tiles |
| **API Client** | Axios/React Query data fetching layer | Uses REST API Interface |
| **API Routes Handler** | Flask endpoints (`/upload`, `/history`) | Exposes REST API, Delegates to Processors |
| **Audio Processing** | FFmpeg/librosa WAV conversion | Called by API Handler |
| **ML Classifier** | YAMNet TensorFlow inference | Called by API Handler |
| **Data Access Layer** | SQLite wrapper (`init_db`, `save`) | Uses SQLite DB |

### 2.3 Architectural Analysis

- **Strict Layering via REST**: The only bridge between the React Frontend and Flask Backend is the `REST API (JSON/HTTP)` provided interface. This enforces low coupling—the frontend and backend can be tested and deployed completely independently.
- **Facade Pattern in Backend**: The `API Routes Handler` acts as a facade. It receives the multipart form data, but delegates all heavy lifting to the `Audio Processing`, `ML Classifier`, and `Data Access Layer` components.
- **Third-Party Integration**: The `LiveMap Component` has a direct external dependency on the `OpenStreetMap Provider` for map tiles, which bypasses the Flask backend entirely to reduce server load.
- **Clean Persistence Boundary**: Only the `Data Access Layer` interacts with the SQLite database, isolating SQL queries from the ML and routing logic.

---

## 3. Comparative Analysis

| Aspect | JTJ | SONIQUE |
|--------|-----|---------|
| **Architecture Paradigm** | Process-oriented (Business capability) | Client-Server (Technical capability) |
| **Number of Components** | High (16 components) | Moderate (8 core components) |
| **Communication Style** | Manual handoffs / paperwork | Synchronous HTTP (REST) |
| **Coupling** | Moderate-High (many cross-subsystem arrows) | Very Low (single REST bottleneck) |
| **External Dependencies** | Customers (Actors) | OpenStreetMap (External System) |
| **Data Persistence** | Distributed across filing cabinets | Centralized via DAO to SQLite |

**Key Takeaways**:
1. **Physical vs Technical Integration**: JTJ's diagram shows how different departments (Finance, Operations, Reception) integrate via paperwork. SONIQUE's diagram shows how different tech stacks (React, Python, Leaflet) integrate via network protocols.
2. **Bottlenecks**: JTJ has complex multi-point interactions, meaning delays in one department (e.g., Job Tracking) block others (Invoicing). SONIQUE utilizes strict boundaries where the generic `API Routes Handler` is the sole entry point, making it highly secure but also a singular point of failure.
