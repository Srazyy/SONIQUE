# SONIQUE — Metadata (Data Dictionary) for Key Data Elements

This document provides detailed metadata entries for selected data elements used in the SONIQUE system's data flows.

---

## 1. `sound_label`

| Attribute          | Value                                         |
|--------------------|-----------------------------------------------|
| **Alias**          | Sound Class, Sound Type, Predicted Label       |
| **Description**    | Name of the sound class predicted by the YAMNet model |
| **Composition**    | Atomic — single string value                   |
| **Data Type**      | VARCHAR(100)                                  |
| **Length / Format** | 1–100 characters, title case                  |
| **Domain / Range** | One of 521 AudioSet ontology class names (e.g. "Siren", "Dog bark", "Traffic noise") |
| **Constraints**    | NOT NULL; must exist in YAMNet class map       |
| **Source**          | YAMNet model inference (Process 4.0)           |
| **Example**        | `"Siren"`                                     |

---

## 2. `confidence`

| Attribute          | Value                                         |
|--------------------|-----------------------------------------------|
| **Alias**          | Score, Confidence Score, Prediction Confidence  |
| **Description**    | Percentage confidence of the top-1 prediction  |
| **Composition**    | Atomic — single numeric value                  |
| **Data Type**      | FLOAT                                         |
| **Length / Format** | Decimal, 2 decimal places (e.g. 92.47)        |
| **Domain / Range** | 0.00 – 100.00                                 |
| **Constraints**    | NOT NULL; ≥ 0.00 and ≤ 100.00                 |
| **Source**          | Computed from YAMNet mean scores (Process 4.0) |
| **Example**        | `87.34`                                       |

---

## 3. `latitude`

| Attribute          | Value                                         |
|--------------------|-----------------------------------------------|
| **Alias**          | Lat, GPS Latitude, Y-coordinate                |
| **Description**    | Latitude of the recording location in decimal degrees (WGS-84) |
| **Composition**    | Atomic — single numeric value                  |
| **Data Type**      | REAL                                          |
| **Length / Format** | Decimal degrees, up to 6 decimal places        |
| **Domain / Range** | -90.000000 to +90.000000                       |
| **Constraints**    | NOT NULL                                      |
| **Source**          | Browser Geolocation API (Process 2.0)          |
| **Example**        | `28.613940`                                   |

---

## 4. `longitude`

| Attribute          | Value                                         |
|--------------------|-----------------------------------------------|
| **Alias**          | Lon, GPS Longitude, X-coordinate                |
| **Description**    | Longitude of the recording location in decimal degrees (WGS-84) |
| **Composition**    | Atomic — single numeric value                  |
| **Data Type**      | REAL                                          |
| **Length / Format** | Decimal degrees, up to 6 decimal places        |
| **Domain / Range** | -180.000000 to +180.000000                     |
| **Constraints**    | NOT NULL                                      |
| **Source**          | Browser Geolocation API (Process 2.0)          |
| **Example**        | `77.209021`                                   |

---

## 5. `created_at`

| Attribute          | Value                                         |
|--------------------|-----------------------------------------------|
| **Alias**          | Timestamp, Recording Time, Date-Time            |
| **Description**    | Date and time when the audio was recorded and classified |
| **Composition**    | Atomic — single datetime value                 |
| **Data Type**      | TEXT (ISO-8601)                                |
| **Length / Format** | `YYYY-MM-DDTHH:MM:SS`                         |
| **Domain / Range** | Any valid past or present datetime              |
| **Constraints**    | NOT NULL; auto-set by server at insertion       |
| **Source**          | System clock at time of classification (Process 5.0) |
| **Example**        | `2026-03-26T22:30:00`                          |

---

## 6. `top_3_predictions`

| Attribute          | Value                                         |
|--------------------|-----------------------------------------------|
| **Alias**          | Top Predictions, Prediction List                |
| **Description**    | JSON array containing the top-3 predicted sound classes with confidence scores |
| **Composition**    | Composite: `[ { label: sound_label, score: confidence } × 3 ]` |
| **Data Type**      | TEXT (JSON)                                   |
| **Length / Format** | JSON array, max ~300 characters                |
| **Domain / Range** | Array of 3 objects, each with a valid label and score |
| **Constraints**    | NOT NULL; exactly 3 entries; scores in descending order |
| **Source**          | YAMNet inference result (Process 4.0)          |
| **Example**        | `[{"label":"Siren","score":87.3},{"label":"Car horn","score":8.1},{"label":"Speech","score":3.2}]` |

---

## 7. `audio_blob`

| Attribute          | Value                                         |
|--------------------|-----------------------------------------------|
| **Alias**          | Audio File, WebM Blob, Recording Blob           |
| **Description**    | Binary audio data captured by the browser's MediaRecorder API |
| **Composition**    | Atomic — single binary blob                    |
| **Data Type**      | BLOB                                          |
| **Length / Format** | Variable; typically 50 KB – 500 KB per 5-sec recording |
| **Domain / Range** | Valid WebM/Opus encoded audio                  |
| **Constraints**    | NOT NULL; must be a valid WebM container        |
| **Source**          | Browser MediaRecorder API (Process 1.0)        |
| **Example**        | *(binary data)*                               |

---

## 8. `id`

| Attribute          | Value                                         |
|--------------------|-----------------------------------------------|
| **Alias**          | Record ID, Entry ID, Primary Key                |
| **Description**    | Unique auto-incrementing identifier for each sound record in the database |
| **Composition**    | Atomic — single integer value                  |
| **Data Type**      | INTEGER                                       |
| **Length / Format** | Positive integer                               |
| **Domain / Range** | 1 to 2³¹ – 1                                  |
| **Constraints**    | PRIMARY KEY; AUTO-INCREMENT; NOT NULL; UNIQUE   |
| **Source**          | SQLite auto-generation on INSERT (Process 5.0)  |
| **Example**        | `42`                                          |
