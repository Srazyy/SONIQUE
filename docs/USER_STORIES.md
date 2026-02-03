# User Stories

## Audio Recording & Classification

### US-01: Record Audio
**As a** user  
**I want to** record audio from my microphone  
**So that** I can capture environmental sounds for classification

**Acceptance Criteria:**
- [ ] Click record button to start recording
- [ ] Visual feedback shows recording in progress
- [ ] Recording stops after specified duration

---

### US-02: Classify Sound
**As a** user  
**I want to** automatically classify recorded audio  
**So that** I can identify the type of sound

**Acceptance Criteria:**
- [ ] Audio is sent to backend for processing
- [ ] YAMNet model returns top 3 predictions
- [ ] Results display with confidence scores

---

### US-03: View Classification Results
**As a** user  
**I want to** see the classification results  
**So that** I understand what sound was detected

**Acceptance Criteria:**
- [ ] Display sound label prominently
- [ ] Show confidence percentage
- [ ] Show all top predictions

---

### US-04: Automatic Location Capture
**As a** user  
**I want to** automatically capture my location  
**So that** sounds are geotagged

**Acceptance Criteria:**
- [ ] Browser requests location permission
- [ ] GPS coordinates captured with recording
- [ ] Location shown on confirmation

---

### US-05: Real-time Waveform
**As a** user  
**I want to** see a waveform while recording  
**So that** I know audio is being captured

**Acceptance Criteria:**
- [ ] Visual waveform displays during recording
- [ ] Waveform responds to audio input
- [ ] Animation is smooth

---

## Map Features

### US-06: View Map
**As a** user  
**I want to** see an interactive map  
**So that** I can visualize sound locations

**Acceptance Criteria:**
- [ ] Map loads with default view
- [ ] Map is interactive (zoom, pan)
- [ ] Uses Leaflet with OpenStreetMap

---

### US-07: See Sound Markers
**As a** user  
**I want to** see markers on the map  
**So that** I can identify sound locations

**Acceptance Criteria:**
- [ ] Markers appear at recorded locations
- [ ] Markers show sound type on hover
- [ ] Different colors for different sounds

---

### US-08: View Heatmap
**As a** user  
**I want to** see a heatmap overlay  
**So that** I can identify sound hotspots

**Acceptance Criteria:**
- [ ] Heatmap shows concentration of sounds
- [ ] Colors indicate intensity
- [ ] Toggle heatmap on/off

---

### US-09: Center Map on Location
**As a** user  
**I want to** center the map on my current location  
**So that** I can see nearby sounds

**Acceptance Criteria:**
- [ ] Button to center on user location
- [ ] Smooth animation to new center
- [ ] Marker shows user position

---

### US-10: Click Marker for Details
**As a** user  
**I want to** click on a marker  
**So that** I can see sound details

**Acceptance Criteria:**
- [ ] Popup appears on marker click
- [ ] Shows sound type and confidence
- [ ] Shows timestamp

---

## History & Data

### US-11: View Sound History
**As a** user  
**I want to** view my recording history  
**So that** I can review past sounds

**Acceptance Criteria:**
- [ ] List of past recordings
- [ ] Shows date, location, sound type
- [ ] Sorted by most recent

---

### US-12: Persist Data
**As a** user  
**I want to** have my data saved  
**So that** it persists across sessions

**Acceptance Criteria:**
- [ ] Data stored in SQLite database
- [ ] Survives app restart
- [ ] No data loss

---

### US-13: Filter History
**As a** user  
**I want to** filter history by sound type  
**So that** I can find specific sounds

**Acceptance Criteria:**
- [ ] Dropdown to select sound type
- [ ] List filters accordingly
- [ ] "All" option available

---

### US-14: Search Sounds
**As a** user  
**I want to** search for sounds  
**So that** I can quickly find records

**Acceptance Criteria:**
- [ ] Search input field
- [ ] Searches by sound label
- [ ] Real-time filtering

---

### US-15: Clear History
**As a** user  
**I want to** clear my history  
**So that** I can start fresh

**Acceptance Criteria:**
- [ ] Clear all button
- [ ] Confirmation dialog
- [ ] Data deleted from database

---

## UI/UX

### US-16: Responsive Design
**As a** user  
**I want to** use the app on mobile  
**So that** I can record sounds on the go

**Acceptance Criteria:**
- [ ] Layout adapts to screen size
- [ ] Touch-friendly controls
- [ ] Map works on mobile

---

### US-17: Loading States
**As a** user  
**I want to** see loading indicators  
**So that** I know the app is working

**Acceptance Criteria:**
- [ ] Spinner during API calls
- [ ] Skeleton loaders for content
- [ ] Disable buttons while loading

---

### US-18: Error Messages
**As a** user  
**I want to** see clear error messages  
**So that** I know what went wrong

**Acceptance Criteria:**
- [ ] Toast notifications for errors
- [ ] Descriptive error text
- [ ] Retry option when applicable

---

### US-19: Dark Theme
**As a** user  
**I want to** use a dark theme  
**So that** the app is easier on my eyes

**Acceptance Criteria:**
- [ ] Dark color scheme
- [ ] Consistent styling
- [ ] Good contrast

---

### US-20: Smooth Animations
**As a** user  
**I want to** see smooth animations  
**So that** the app feels polished

**Acceptance Criteria:**
- [ ] Transitions between states
- [ ] Micro-interactions on buttons
- [ ] No janky animations

---

## Technical

### US-21: Health Check
**As a** developer  
**I want to** have a health endpoint  
**So that** I can monitor the API

**Acceptance Criteria:**
- [ ] GET /health returns 200
- [ ] Response includes status
- [ ] Fast response time

---

### US-22: Docker Deployment
**As a** developer  
**I want to** deploy with Docker  
**So that** setup is consistent

**Acceptance Criteria:**
- [ ] docker-compose up works
- [ ] All services start
- [ ] App accessible on ports

---

### US-23: Audio Conversion
**As a** system  
**I want to** convert audio formats  
**So that** YAMNet can process them

**Acceptance Criteria:**
- [ ] WebM converted to WAV
- [ ] 16kHz sample rate
- [ ] Mono channel

---

### US-24: API CORS
**As a** frontend  
**I want to** access the API  
**So that** cross-origin requests work

**Acceptance Criteria:**
- [ ] CORS headers set
- [ ] Allows localhost origins
- [ ] Preflight requests handled

---

### US-25: Environment Configuration
**As a** developer  
**I want to** configure the app  
**So that** I can customize settings

**Acceptance Criteria:**
- [ ] Environment variables support
- [ ] Default values work
- [ ] Documented configuration
