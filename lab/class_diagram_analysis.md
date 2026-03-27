# Analysis-Level Class Diagram — Complete Analysis (JTJ &amp; SONIQUE)

---

## 1. JTJ — Class Diagram Analysis

### 1.1 Classes Identified (10 classes)

| Class             | Stereotype   | Purpose                                           |
|-------------------|-------------|---------------------------------------------------|
| **Customer**       | Entity       | Stores customer contact/marketing details          |
| **Property**       | Entity       | Represents a property to be cleaned                |
| **Booking**        | Entity       | Central record linking customer, property, and job |
| **BookingForm**    | Entity       | Physical form (3 copies) tracking signatures       |
| **Cleaner**        | Entity       | Staff member who performs cleaning                 |
| **Job**            | Entity       | Instance of cleaning work done on a date           |
| **Invoice**        | Entity       | Financial document for charging the customer       |
| **InvoiceLineItem**| Entity      | Individual line on an invoice                      |
| **Payment**        | Entity       | Records customer payment against an invoice        |
| **Schedule**       | Entity       | Weekly work schedule for a cleaner                 |
| **Appointment**    | Entity       | Office manager's property visit appointment        |

### 1.2 Key Relationships &amp; Multiplicities

| Relationship                     | Multiplicity | Rationale                                                 |
|----------------------------------|-------------|-----------------------------------------------------------|
| Customer → Booking              | 1 : *       | A customer can have many bookings (one-off and regular)    |
| Customer → Property             | 1 : *       | Regular customers may have multiple properties             |
| Booking → BookingForm           | 1 : 3       | Exactly 3 copies: 1 customer + 2 office                   |
| Booking → Job                   | 1 : 1..*    | One-off = 1 job; regular = many weekly jobs                |
| Cleaner → Job                   | 1..* : *    | A team of 2-3 cleaners per job; each cleaner has many jobs |
| Customer → Invoice              | 1 : *       | Monthly invoices for regular + one-off invoices            |
| Invoice → InvoiceLineItem       | 1 : 1..*    | Monthly invoices consolidate multiple properties           |
| Invoice → Payment               | 1 : 0..1    | An invoice may or may not be paid yet                      |
| Cleaner → Schedule              | 1 : *       | New schedule generated each week                           |
| Customer → Appointment          | 1 : *       | Multiple property visits may be scheduled                  |

### 1.3 Analysis Observations

**Domain Model Characteristics:**
- **Central entity is Booking** — it links Customer, Property, BookingForm, Job, and indirectly to Invoice. This makes it the most important class in the domain.
- **BookingForm has fixed multiplicity (3)** — this rigid constraint reflects the physical process of creating 3 carbon copies.
- **Job is the join between Booking and Cleaner** — it acts as an association class, since many cleaners can work on a booking and each cleaner can work on many bookings.
- **Invoice has two generation modes** — `generateOneOffInvoice()` (immediate, single booking) vs `generateMonthlyInvoice()` (end of month, multiple bookings for same customer). This is a key business rule.

**State Behaviour:**
- **Booking has a state machine**: BOOKED → COMPLETED → INVOICED → PAID. This lifecycle drives the entire process flow.
- **Invoice also has states**: UNPAID → PAID. The transition occurs when Payment is processed.

**Potential Design Issues:**
- The Cleaner→Job relationship (1..*:*) means the team composition per job is not formally constrained beyond "2 or 3". An association class `CleaningTeam` could enforce this.
- Regular customers with multiple properties should receive a **single consolidated invoice**. The InvoiceLineItem class handles this correctly.

---

## 2. SONIQUE — Class Diagram Analysis

### 2.1 Classes Identified (10 classes)

| Class                  | Stereotype   | Purpose                                           |
|------------------------|-------------|---------------------------------------------------|
| **User**               | Boundary     | Represents the browser user and their permissions  |
| **AudioRecording**     | Entity       | Raw audio captured from the browser microphone     |
| **GeoLocation**        | Value Object | GPS coordinates (lat, lon, accuracy)               |
| **ClassificationRequest** | Control  | Orchestrates the upload→convert→classify pipeline  |
| **ClassificationResult**  | Entity   | Aggregates the ML model's output                   |
| **Prediction**         | Entity       | A single label + confidence score                  |
| **SoundRecord**        | Entity       | Persisted database record (SQLite)                 |
| **MapMarker**          | Boundary     | Leaflet marker displayed on the interactive map    |
| **HeatmapLayer**       | Boundary     | leaflet.heat overlay showing sound concentration   |
| **YAMNetClassifier**   | Control      | Wraps the TensorFlow Hub YAMNet model              |

### 2.2 Key Relationships &amp; Multiplicities

| Relationship                              | Multiplicity | Rationale                                         |
|-------------------------------------------|-------------|---------------------------------------------------|
| User → AudioRecording                    | 1 : *       | A user can make many recordings in a session       |
| AudioRecording → GeoLocation             | 1 : 1       | Each recording has exactly one GPS fix             |
| AudioRecording → ClassificationRequest   | 1 : 1       | Each recording produces one API request            |
| ClassificationRequest → ClassificationResult | 1 : 1   | One request = one result                           |
| ClassificationResult → Prediction        | 1 : 3       | YAMNet always returns top-3 predictions            |
| ClassificationResult → SoundRecord       | 1 : 1       | Result is persisted as a database record           |
| SoundRecord → MapMarker                  | 1 : 1       | Each record has one marker on the map              |
| SoundRecord → HeatmapLayer              | * : 1       | All records contribute to a single heatmap         |
| ClassificationRequest ──▷ YAMNetClassifier | dependency | Request uses the classifier (not ownership)       |

### 2.3 Analysis Observations

**Architecture Alignment:**
- Classes map cleanly to the **Layered Architecture**: Boundary classes (User, MapMarker, HeatmapLayer) in the Frontend layer, Control classes (ClassificationRequest, YAMNetClassifier) in the Backend layer, Entity classes (SoundRecord) in the Data layer.
- **GeoLocation is a Value Object** — it has no identity, only values. Two locations with the same lat/lon are considered equal.

**Design Patterns:**
- **Pipeline pattern** — AudioRecording → ClassificationRequest → ClassificationResult → SoundRecord → MapMarker. This is a linear transformation chain, ideal for functional decomposition.
- **Dependency Injection** on YAMNetClassifier — ClassificationRequest uses it via a `<<uses>>` dependency, meaning the classifier could be swapped for another model without changing the request class.

**Multiplicity Fixed at 3:**
- `ClassificationResult → Prediction` is fixed at exactly 3, reflecting the Top-3 prediction contract. If the system later wants Top-5 or Top-10, this constraint would need changing.

**Persistence Boundary:**
- Only **SoundRecord** is persisted to SQLite. AudioRecording is transient (audio files are deleted after classification). This is a deliberate privacy-conscious design.

---

## 3. Comparative Analysis

| Aspect                      | JTJ                                        | SONIQUE                                     |
|-----------------------------|---------------------------------------------|----------------------------------------------|
| **Number of Classes**       | 10                                          | 10                                           |
| **Central Entity**          | Booking                                     | ClassificationRequest                        |
| **Stereotype Distribution** | All Entity (physical domain)                | Mixed: Boundary + Control + Entity + Value   |
| **State Behaviour**         | Booking lifecycle (4 states)                | None (stateless request/response)            |
| **Inheritance**             | None needed                                 | None needed                                  |
| **Fixed Multiplicities**    | BookingForm = 3 copies                      | Prediction = 3 results                       |
| **Persistence**             | All entities persisted (files/database)     | Only SoundRecord persisted (privacy design)  |
| **Association Classes**     | Job (joins Booking + Cleaner)               | None                                         |
| **Dependencies**            | None                                        | ClassificationRequest → YAMNetClassifier     |
| **Domain Complexity**       | Higher (regular + one-off, invoicing rules)  | Lower (single pipeline, no business rules)   |

### Key Differences

1. **JTJ is a business process domain** — entities represent real-world paperwork (forms, invoices, schedules). Relationships have complex business rules (consolidated invoices, team composition).
2. **SONIQUE is a data processing pipeline** — the class diagram follows a linear flow from input to output. The main complexity is in the ML classification, not in the domain relationships.
3. **JTJ requires state management** (booking status, invoice status), while SONIQUE is essentially stateless — each recording is processed independently.
4. **JTJ's cleaner assignment** involves scheduling constraints (same cleaner each week, availability), making it a more complex domain model than SONIQUE's straightforward classification pipeline.
