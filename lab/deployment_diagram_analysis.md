# Deployment Diagram Analysis — JTJ &amp; SONIQUE

---

## 1. JTJ — Deployment Diagram Analysis

### 1.1 Diagram Overview
The JTJ deployment diagram maps the physical architecture of a manual, offline business process. It identifies the geographical and physical locations where business activities occur and where physical artifacts (paperwork) reside.

### 1.2 Nodes &amp; Execution Environments
1. **JTJ Main Office (Physical Location Node)**
   - **Front Desk (Workstation)**: Handles inbound calls via the *Telephone* and logs appointments in the *Booking Diary*.
   - **Accounts Desk (Workstation)**: Handles the generation of *Invoice Forms*.
   - **Filing System (Storage Facility)**: The central repository for persistence. Holds *Customer Files*, *Booking Forms (2 office copies)*, and the *Invoice Ledger*.
2. **Cleaner Vehicle (Mobile Unit Node)**
   - Acts as a transient environment holding the *Job Clipboard* which carries the active *Booking Form (Office Copy 1)* and the *Weekly Schedule*.
3. **Customer Premises (Physical Location Node)**
   - The site where service is performed. Contains a logical storage node for the customer's personal records (holding their copy of the *Booking Form* and the *Received Invoice*).

### 1.3 Communication Paths
- **Telephone Line**: Synchronous communication between the Front Desk and the Customer.
- **Postal Service**: Asynchronous batch communication for delivering invoices from Accounts to the Customer.
- **Physical Handover (Dispatch)**: Transfer of paperwork from the Main Office to the Cleaner Vehicle.
- **Physical Transport (Road)**: The geographical movement of the cleaners and paperwork to the Customer Premises.

### 1.4 Architectural Implications
- **Physical Data Duplication**: Data persistence relies on physical carbon copies (e.g., 3 copies of a booking form). This introduces high risk for data inconsistency if a copy is lost or modified independently.
- **Latency**: Communication paths like the Postal Service introduce significant latency into the system state (e.g., transitioning from INVOICED to PAID).

---

## 2. SONIQUE — Deployment Diagram Analysis

### 2.1 Diagram Overview
The SONIQUE deployment diagram represents a modern, containerized client-server web application architecture, mapping software artifacts to their execution environments.

### 2.2 Nodes &amp; Execution Environments
1. **Client Device (Device Node)**
   - **Web Browser (Execution Environment)**: Runs the *React Frontend App* artifact. This is the only component the end-user interacts with.
2. **Docker Host Server (Device Node)**
   - **Nginx Container (Execution Environment)**: Acts as a web server/reverse proxy, hosting the *Static Frontend Assets*.
   - **Flask Container (Execution Environment)**: The application server running the *SONIQUE API* and the *YAMNet TensorFlow Model*. This handles all compute-heavy ML inference.
   - **Docker Volume Mount (Execution Environment)**: A dedicated filesystem mount ensuring the persistence of the *SQLite Database File*, isolating data from container lifecycles.
3. **OSM Tile Server (External Device Node)**
   - Third-party infrastructure hosting *Map Tiles*.

### 2.3 Communication Paths
- **HTTPS (Internet) [Client ↔ Nginx]**: Secure, synchronous web traffic handling JSON API responses and static file delivery.
- **HTTPS (Internet) [Client ↔ OSM]**: Direct fetching of map tiles by the browser, offloading bandwidth from the SONIQUE server.
- **HTTP (Internal Docker Network) [Nginx ↔ Flask]**: Unencrypted reverse proxy routing within the secure boundaries of the Docker host.
- **File System Access [Flask ↔ Volume]**: Direct disk I/O operations for reading/writing to SQLite.

### 2.4 Architectural Implications
- **Containerization**: By splitting Nginx and Flask into separate execution environments on the same host, the system gains modularity. If the Flask API crashes, Nginx can still serve a generic error page.
- **Client-Side Offloading**: By having the Client Device communicate directly with the OSM Tile Server, the Docker Host Server saves significant egress bandwidth.
- **Data Persistence Strategy**: Using a Docker Volume ensures that if the Flask container is destroyed, rebuilt, or updated, the underlying database file (`sounds.db`) remains intact.

---

## 3. Comparative Analysis

| Aspect | JTJ (Manual Process) | SONIQUE (Web Application) |
|--------|----------------------|---------------------------|
| **Node Types** | Geographic locations, physical vehicles, desks | Hardware devices, OS containers, external APIs |
| **Artifacts** | Paper forms, ledgers, diaries | Compiled JS/CSS, Python scripts, ML Models, DB files |
| **Communication** | Physical transport, telephone, postal mail | TCP/IP networks: HTTPS, HTTP, Local socket/Disk I/O |
| **Latency Profile** | Measured in hours or days (postal, driving) | Measured in milliseconds (HTTP/HTTPS) |
| **Data Synchronization** | Manual filing, carbon copies (highly error-prone) | ACID-compliant database reads/writes |

**Summary**: 
Deploying JTJ means organizing people, cars, and filing cabinets across a city. Deploying SONIQUE means orchestrating Docker containers and network configuration on a Linux host. While fundamentally different, both deployment models serve the same purpose: allocating resources and defining the communication channels necessary to execute the system's architecture.
