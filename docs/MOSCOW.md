# MoSCoW Prioritization

## Overview

This document outlines the priority of features for SONIQUE using the MoSCoW method.

---

## Must Have (M)

Essential features required for the minimum viable product.

| ID | Feature | Description |
|----|---------|-------------|
| M1 | Audio Recording | Capture audio from browser microphone |
| M2 | Sound Classification | Classify audio using YAMNet ML model |
| M3 | Location Tracking | Capture GPS coordinates with recordings |
| M4 | Results Display | Show classification results to user |
| M5 | Basic Map View | Display location on interactive map |
| M6 | REST API | Backend endpoints for audio processing |
| M7 | Database Storage | Persist classification results |

---

## Should Have (S)

Important features that add significant value.

| ID | Feature | Description |
|----|---------|-------------|
| S1 | Sound History | View past recordings and classifications |
| S2 | Heatmap Visualization | Aggregate sound data on map |
| S3 | Real-time Feedback | Live waveform during recording |
| S4 | Docker Deployment | Containerized application |
| S5 | Responsive Design | Mobile-friendly interface |
| S6 | Error Handling | Graceful error messages |

---

## Could Have (C)

Desirable features if time permits.

| ID | Feature | Description |
|----|---------|-------------|
| C1 | Sound Filtering | Filter history by sound type |
| C2 | Time-based Analysis | Trends over time |
| C3 | Export Data | Download history as CSV |
| C4 | Custom Markers | Different icons per sound type |
| C5 | Notifications | Alerts for specific sounds |
| C6 | Dark Mode | Theme toggle |

---

## Won't Have (W)

Features explicitly out of scope for this version.

| ID | Feature | Reason |
|----|---------|--------|
| W1 | User Authentication | Not required for MVP |
| W2 | Cloud Deployment | Local-first approach |
| W3 | Mobile App | Web-only for now |
| W4 | Multi-language | English only |
| W5 | Real-time Streaming | Batch processing only |

---

## Summary

| Priority | Count | Percentage |
|----------|-------|------------|
| Must Have | 7 | 30% |
| Should Have | 6 | 26% |
| Could Have | 6 | 26% |
| Won't Have | 5 | 18% |
