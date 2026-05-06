# Software Requirements Specification (SRS)
## Project: Gemini Slingshot - Tactical AI Co-Pilot

### 1. Introduction
#### 1.1 Purpose
This document specifies the software requirements for the "Gemini Slingshot" application, a gesture-controlled browser game integrating real-time computer vision and Large Language Model (LLM) strategic analysis.

#### 1.2 Scope
The system provides a bubble-shooter game interface where players interact using webcam-based hand gestures (pinch and pull). A "Strategic Co-pilot" powered by Google Gemini 3 Flash analyzes the board state via visual input and provides real-time tactical advice.

#### 1.3 Definitions, Acronyms, and Abbreviations
- **HUD**: Heads-Up Display.
- **MediaPipe**: Cross-platform framework for building multimodal applied machine learning pipelines.
- **Gemini**: Google's multimodal generative AI model.
- **SRS**: Software Requirements Specification.

### 2. Overall Description
#### 2.1 Product Perspective
The application is a standalone web-based experience. It leverages the client's GPU for vision processing (MediaPipe) and the Google GenAI API for strategic reasoning.

#### 2.2 Product Functions
- **Hand Tracking**: Real-time detection of hand landmarks to simulate slingshot mechanics.
- **Physics Engine**: 2D bubble physics including wall bouncing, collision detection, and cluster matching.
- **Vision AI Analysis**: Snapshot capture of the board state for LLM processing.
- **Strategic Hinting**: Real-time UI overlays and text-based tactical directives from Gemini.
- **Debugging Suite**: Visual feedback of AI vision, prompt context, and API latency.

#### 2.3 User Classes and Characteristics
- **Players**: Users seeking an interactive, AI-enhanced casual gaming experience.

#### 2.4 Constraints
- Requires a desktop-class browser and a webcam.
- Requires internet connectivity for Gemini API calls.

### 3. Specific Requirements
#### 3.1 External Interface Requirements
- **User Interface**: Material Design 3 aesthetics, high-contrast dark theme, responsive canvas.
- **Hardware Interfaces**: Standard web camera for gesture input.

#### 3.2 System Features
- **Feature 1: Gesture Control**:
  - The system shall detect a "pinch" gesture (index finger and thumb) to grab the slingshot.
  - The system shall detect "pull" and "release" to launch projectiles.
- **Feature 2: Strategic AI**:
  - The system shall send a board snapshot to Gemini 3 Flash after every scoring event.
  - The AI shall return a recommended color and target coordinates.
  - The UI shall display a "Flash Strategy" directive and rationale.

#### 3.3 Performance Requirements
- **Tracking Latency**: Hand tracking must operate at >24 FPS.
- **AI Latency**: Tactical hints should be provided within 3 seconds of board change.

### 4. Non-Functional Requirements
- **Security**: API keys must be handled as environment variables.
- **Accessibility**: ARIA labels for game status; clear visual indicators for all actions.

---
**PHASE 1 COMPLETE - READY FOR PHASE 2**
