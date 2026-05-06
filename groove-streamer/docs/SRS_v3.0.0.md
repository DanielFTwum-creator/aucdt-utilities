# Software Requirements Specification (SRS) - Groove Streamer v3.0.0

## 1. Introduction
Groove Streamer is a high-performance web application designed to generate, stream, and manage groove-based music using the Google Gemini Lyria model. This document outlines the functional and non-functional requirements for version 3.0.0.

## 2. Overall Description
The application provides a robust user interface for:
- **Music Generation**: Generating custom grooves with adjustable BPM (40–300 BPM).
- **Admin Management**: A password-protected administrative dashboard for system monitoring and testing.
- **Testing**: An integrated E2E testing suite using Playwright.

## 3. Functional Requirements

### 3.1 Music Generation Service
- **Input**: User-defined BPM (clamped to 40-300).
- **Processing**: Streams audio data from Gemini Lyria model.
- **Output**: Playable, memory-managed Blob URL.
- **Error Handling**: Robust handling of streaming errors, cancellation (AbortSignal), and base64 decoding.

### 3.2 Administrative Dashboard (`/admin`)
- **Access Control**: Password-protected access.
- **Audit Logging**: All administrative actions are logged to the console for traceability.
- **Test Dashboard**: Interactive interface to trigger E2E tests and capture screenshots.

### 3.3 Testing Framework
- **E2E Testing**: Automated test suite using Playwright for core user flows.
- **Diagnostics**: Internal diagnostic tools accessible via the admin dashboard.

## 4. System Architecture and Data Flow

### 4.1 System Architecture
![System Architecture](./SystemArchitecture.svg)

### 4.2 Data Flow
![Data Flow](./DataFlow.svg)

## 5. Non-Functional Requirements

### 5.1 Security
- **Admin Security**: Password protection for the admin section.
- **API Security**: Secure handling of the Gemini API key via environment variables.

### 5.2 Performance
- **Streaming**: Efficient streaming of audio data to minimize latency.
- **Memory Management**: Proper revocation of Blob URLs to prevent memory leaks.

### 5.3 Accessibility
- **ARIA Compliance**: 100% ARIA coverage for all interactive components.
- **Tooltips**: Comprehensive tooltips for all administrative controls.

### 5.4 Themes
- **Theming**: Support for Light, Dark, and High-Contrast themes.

## 6. Compliance
- **Techbridge University College Standards**: Adheres to the master project directive and shared standards.
- **Version Compliance**: Strictly uses React 19.2.4.
- **Documentation**: All guides and diagrams are maintained in the `/docs` directory.
