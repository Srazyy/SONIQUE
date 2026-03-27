# Sequence & Collaboration Diagram Analysis — JTJ and SONIQUE

---

## 1. JTJ — Sequence Diagram Analysis

### One-Off Job Process (17 messages, 6 objects)

| Object              | Role                                            |
|---------------------|-------------------------------------------------|
| :Customer           | Initiates request, agrees terms, signs, pays    |
| :Receptionist       | Coordinates bookings, invoices, and receipts     |
| :Office Manager     | Visits property, estimates price, assigns cleaners |
| :BookingFile        | Stores and manages booking records               |
| :Cleaners           | Carry out cleaning and return signed forms       |
| :InvoiceFile        | Stores invoice and payment records               |

**Key Observations:**

- **Receptionist is the central hub** — she initiates almost all administrative messages (booking, invoice, receipt), making her the highest-coupled object.
- **Synchronous flow** — all messages are sequential; no step can proceed until the previous one completes (e.g., invoice cannot be sent until signed form arrives).
- **Customer appears at both ends** of the sequence — they initiate the request and are the final recipient of the receipted invoice, forming a complete cycle.
- **BookingFile and InvoiceFile** act as passive entity objects — they only receive writes and return confirmations, not triggering behaviour themselves.
- **Bottleneck risk** — the Receptionist object handles messages 1, 2, 8, 12, 13, 14, 15, 16, 17 (9 of 17 messages), indicating she is a process bottleneck.

### Regular Weekly Cleaning (loop + monthly fragments)

- Uses UML **loop** fragment `[every week]` for recurring cleaning.
- Uses separate **loop** fragment `[every month]` for invoice generation.
- **Office Manager** assigns the same cleaner each week (preference-based scheduling).
- **Consolidated invoice** — multiple properties for the same customer result in a single monthly invoice (unlike one-off which is immediate).

---

## 2. JTJ — Collaboration Diagram Analysis

### One-Off Job (6 objects, 17 numbered messages)

**Object Coupling Analysis:**

| Object            | Links | Messages Sent/Received | Coupling Level |
|-------------------|-------|------------------------|----------------|
| :Customer         | 3     | 7                      | Medium         |
| :Receptionist     | 4     | 9                      | **High**       |
| :Office Manager   | 3     | 5                      | Medium         |
| :BookingFile      | 2     | 3                      | Low            |
| :Cleaners         | 3     | 5                      | Medium         |
| :InvoiceFile      | 1     | 2                      | Low            |

**Key Observations:**

- **Star topology centred on Receptionist** — the collaboration diagram reveals that the Receptionist links to 4 of 5 other objects, confirming her role as the system coordinator.
- **No direct link between Customer and Cleaners' data** — all communication passes through intermediaries (Receptionist or BookingFile), which is typical for service companies where the office mediates all interactions.
- **BookingFile connects to two actors** (Office Manager and Receptionist) — indicating it is a shared resource that could create concurrency issues in a digital system.
- **InvoiceFile is only accessed by Receptionist** — single point of access, good for data integrity but creates a dependency.

---

## 3. SONIQUE — Sequence Diagram Analysis

### Audio Classification (17 messages, 7 objects)

| Object               | Role                                          |
|----------------------|-----------------------------------------------|
| :User                | Initiates recording, views results             |
| :React Frontend      | Orchestrates UI interactions and API calls     |
| :Browser APIs        | Provides microphone and GPS access             |
| :Flask Backend       | Converts audio, runs classification, stores data |
| :YAMNet Model        | Performs ML inference on audio waveform         |
| :SQLite Database     | Persists classification records                |
| :OpenStreetMap       | Provides map tile images for display           |

**Key Observations:**

- **React Frontend is the central orchestrator** — it initiates communication with 5 of 6 other objects (Browser APIs, Flask, OpenStreetMap, and presents to User).
- **Asynchronous potential** — messages 2-3 (mic access) and 4-5 (geolocation) could execute in parallel in a real implementation, but the sequence diagram shows them sequentially for clarity.
- **Flask Backend has self-calls** (messages 8, 11) — `convertToWAV()` and `extractTop3Predictions()` are internal operations, shown as self-referencing messages.
- **The critical path** runs through messages 7→8→9→10→11→12→13→14 (8 synchronous steps), defining the processing latency that must stay under 3 seconds per the project requirements.
- **External dependency on OpenStreetMap** — messages 15-16 interact with an external service; network failure here would prevent map rendering but not classification itself.

### View Sound History (8 messages, optional filter)

- Simpler sequence with only 4 objects.
- Uses UML **opt** (optional) fragment for user-initiated filtering.
- **Client-side filtering** — the filter operation (message 7) is handled in the React frontend without additional API calls, improving responsiveness.

---

## 4. SONIQUE — Collaboration Diagram Analysis

### Audio Classification (7 objects, 17 numbered messages)

**Object Coupling Analysis:**

| Object              | Links | Messages Sent/Received | Coupling Level |
|---------------------|-------|------------------------|----------------|
| :User               | 1     | 3                      | Low            |
| :React Frontend     | 4     | 8                      | **High**       |
| :Browser APIs       | 1     | 4                      | Low            |
| :Flask Backend      | 3     | 9                      | **High**       |
| :YAMNet Model       | 1     | 2                      | Low            |
| :SQLite Database    | 1     | 2                      | Low            |
| :OpenStreetMap      | 1     | 2                      | Low            |

**Key Observations:**

- **Two high-coupling objects** — both React Frontend (4 links) and Flask Backend (3 links) are highly coupled, reflecting the client-server architecture where the frontend orchestrates the user experience and the backend orchestrates the data processing.
- **Fan-out pattern on Flask** — Flask connects to YAMNet, SQLite, and React, creating a fan-out processing pipeline. This is a good candidate for future decomposition into microservices.
- **Peripheral objects are loosely coupled** — Browser APIs, YAMNet, SQLite, and OpenStreetMap each have only 1 link, meaning they can be replaced or upgraded independently (e.g., swap YAMNet for another model).
- **No direct User-to-Backend link** — all user interactions are mediated by the React Frontend, which is a clean separation of concerns.

---

## 5. Comparative Analysis: JTJ vs SONIQUE

| Aspect                | JTJ                                | SONIQUE                              |
|-----------------------|------------------------------------|--------------------------------------|
| **System Type**       | Manual business process            | Automated software system            |
| **Central Coordinator** | Receptionist (human)             | React Frontend + Flask Backend       |
| **Number of Objects** | 6                                  | 7                                    |
| **Message Count**     | 17 (one-off) + 9 (regular)        | 17 (classify) + 8 (history)          |
| **Data Stores**       | BookingFile, InvoiceFile           | SQLite Database                      |
| **External Services** | None                               | OpenStreetMap, Browser APIs          |
| **Bottleneck**        | Receptionist (9/17 messages)       | Flask Backend (9/17 messages)        |
| **Loop Patterns**     | Weekly cleaning, monthly invoicing | None (single-shot interactions)      |
| **Self-calls**        | None                               | Flask (convert, extract)             |
| **Coupling**          | Star topology around Receptionist  | Dual-hub (Frontend + Backend)        |

### Key Takeaways

1. **JTJ's manual process** creates a human bottleneck at the Receptionist — the new computer system should automate her most repetitive tasks (invoicing, scheduling).
2. **SONIQUE's architecture** correctly separates concerns with the frontend handling presentation and the backend handling processing, but Flask's high coupling suggests future microservice decomposition for scalability.
3. Both systems follow a **pipeline pattern** — data flows linearly from input to output, making them straightforward to understand and maintain.
4. **Collaboration diagrams reveal topology** that sequence diagrams hide — JTJ's star pattern and SONIQUE's dual-hub pattern are immediately visible in collaboration diagrams but only implied in sequence diagrams.
