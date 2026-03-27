# SONIQUE — Data Elements for Data Flows

This document lists the data elements that make up each major data flow in the SONIQUE Level-1 DFD.

---

## 1. Record Command (User → Process 1.0)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| action             | Start / Stop recording signal         |
| recording_duration | Desired recording length (seconds)    |

---

## 2. Microphone Audio Stream (Browser → Process 1.0)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| audio_chunks       | Raw PCM audio data chunks             |
| sample_rate        | Browser capture sample rate (Hz)      |
| channel_count      | Number of audio channels (mono/stereo)|
| mime_type          | Audio encoding format (e.g. audio/webm)|

---

## 3. GPS Coordinates (Browser → Process 2.0)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| latitude           | Decimal degrees (WGS-84)             |
| longitude          | Decimal degrees (WGS-84)             |
| accuracy           | Position accuracy in metres           |
| timestamp          | UTC time of location fix              |

---

## 4. WebM Audio File (Process 1.0 → Process 3.0)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| audio_blob         | Binary WebM file (Opus codec)         |
| file_size          | Size in bytes                         |
| duration           | Recording duration in seconds         |

---

## 5. WAV Audio + Coordinates (Process 3.0 → Process 4.0)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| wav_file_path      | Server-side path to converted WAV     |
| sample_rate        | 16 000 Hz (resampled for YAMNet)      |
| channels           | 1 (mono)                              |
| latitude           | Decimal latitude from Process 2.0     |
| longitude          | Decimal longitude from Process 2.0    |

---

## 6. Audio Waveform (Process 4.0 → YAMNet)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| waveform           | Float32 numpy array, normalised [-1,1]|
| sample_rate        | 16 000 Hz                             |
| num_samples        | Total number of audio samples         |

---

## 7. Predictions (YAMNet → Process 4.0)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| scores             | 2-D array (time_frames × 521 classes) |
| embeddings         | Feature embeddings per time frame     |
| spectrogram        | Log-mel spectrogram of input          |

---

## 8. Classification Results + Coords (Process 4.0 → Process 5.0)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| sound_label        | Top-1 predicted sound class name      |
| confidence         | Top-1 confidence score (0–100 %)      |
| top_3_predictions  | Array of {label, score} for top 3     |
| latitude           | Recording latitude                    |
| longitude          | Recording longitude                   |
| timestamp          | UTC datetime of classification        |

---

## 9. Sound Record (Process 5.0 → D1 Database)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| id                 | Auto-increment primary key            |
| sound_label        | Classified sound name                 |
| confidence         | Confidence percentage                 |
| top_3              | JSON string of top-3 predictions      |
| latitude           | Decimal latitude                      |
| longitude          | Decimal longitude                     |
| created_at         | ISO-8601 timestamp                    |

---

## 10. Display Data (Process 5.0 → Process 6.0)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| sound_label        | Sound class to display                |
| confidence         | Confidence score for marker label     |
| latitude           | Marker latitude                       |
| longitude          | Marker longitude                      |
| marker_color       | Colour code based on sound category   |

---

## 11. History Records (D1 Database → Process 7.0)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| id                 | Record identifier                     |
| sound_label        | Sound class name                      |
| confidence         | Classification confidence             |
| latitude           | Location latitude                     |
| longitude          | Location longitude                    |
| created_at         | Recording timestamp                   |

---

## 12. Tile Requests (Process 6.0 → OpenStreetMap)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| zoom_level         | Map zoom level (0–18)                 |
| tile_x             | Tile column index                     |
| tile_y             | Tile row index                        |

---

## 13. Filter / Search Criteria (User → Process 7.0)

| Data Element       | Description                           |
|--------------------|---------------------------------------|
| filter_label       | Sound type to filter by               |
| search_query       | Free-text search string               |
| sort_order         | Ascending / Descending by date        |
