# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Rophe Patient Management System (RPMS)** is a comprehensive healthcare management platform built from Google AI Studio. It provides Electronic Health Records (EHR), AI-assisted clinical intelligence via Gemini 3, real-time vital sign monitoring with alerts, and HIPAA-compliant telehealth video consultations.

**Organization**: Rophe Specialist Care, Baiden Ave 1st St, Accra, Ghana
**Contact**: 020 152 9933
**Standards**: IEEE 830-1998, HIPAA compliant
**AI Studio URL**: https://ai.studio/apps/drive/1f-4iEokRUkQGzHENXshGrU8SyUO6QJZU

## Technology Stack

- **React 19.2.3** with TypeScript 5.9.3
- **Vite 7.3.1** for build tooling
- **Recharts 3.6.0** for vital signs visualization
- **@google/genai 1.35.0** for Gemini 3 integration
- **WebRTC** for peer-to-peer telehealth video
- **localStorage** for data persistence (frontend-only system)

## Common Development Commands

```bash
# Install dependencies
npm install

# Development server (default port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Set `GEMINI_API_KEY` in [.env.local](.env.local) before running:
```
GEMINI_API_KEY=your_api_key_here
```

The app accesses it via `process.env.GEMINI_API_KEY` (configured in vite.config.ts).

## High-Level Architecture

This is a **client-side only** application with no backend server. All data is stored in localStorage and browser state.

### Component Structure

```
components/
├── Layout.tsx              # Main app shell with navigation tabs
├── Login.tsx               # Authentication with role selection
├── Dashboard.tsx           # Clinical dashboard with metrics
├── PatientRegistry.tsx     # Patient CRUD, encounter management
├── ClinicalAssistance.tsx  # Gemini-powered ICD-10 suggestions
├── VideoCall.tsx           # WebRTC telehealth with recording
├── AdminPanel.tsx          # Threshold config, audit logs
├── AlertSettings.tsx       # Vital sign threshold configuration
└── SelfTest.tsx            # Automated system testing

services/
├── geminiService.ts        # Gemini 3 API integration
├── mockData.ts             # Initial patient/appointment data
└── testService.ts          # Automated test runner
```

### State Management

All state managed in [App.tsx](App.tsx) using React hooks - no Redux or external state library:
- `patients` - Patient registry with medical history
- `appointments` - Appointment scheduling and status
- `alerts` - Real-time vital sign alerts
- `auth` - User authentication state
- `auditLogs` - Immutable audit trail
- `theme` - Accessibility theme (light/dark/high-contrast)
- `alertThresholds` - Configurable vital sign limits

### Data Persistence

**localStorage keys**:
- `rophe_theme` - User theme preference
- `rophe_user` - Authenticated user session (JSON)

**No backend**: All data resets on browser clear. Production will need backend integration.

## Key Functional Requirements

### REQ-001: Clinical Intelligence (Gemini 3)

**File**: [components/ClinicalAssistance.tsx](components/ClinicalAssistance.tsx)
**Service**: [services/geminiService.ts](services/geminiService.ts)

Uses Google's Gemini 3 Pro to analyze symptoms and suggest ICD-10 codes:
- Model: `gemini-3-pro-preview` (not standard Gemini)
- Input: Free-text symptom description
- Output: AI-generated ICD-10 code suggestions with confidence
- **Critical**: PHI should be anonymized before submission (not yet implemented)
- All suggestions are advisory - physician must confirm

**Implementation Notes**:
- System prompt instructs AI to act as "Clinical Intelligence Engine"
- Streaming disabled for this use case (using `generateContent` not `generateContentStream`)
- Temperature: 0.3 for consistency
- Max tokens: 2000

### REQ-002: Safety Watchdog System

**Files**: [components/Dashboard.tsx](components/Dashboard.tsx), [components/PatientRegistry.tsx](components/PatientRegistry.tsx)

Real-time vital sign monitoring with three alert levels:
- **INFO**: Minor deviation from normal
- **WARNING**: Moderate concern requiring attention
- **CRITICAL**: Immediate clinical intervention needed

**Configurable Thresholds** (in [App.tsx](App.tsx)):
```typescript
alertThresholds: {
  bpSystolicMax: 140,      // mmHg
  bpDiastolicMax: 90,      // mmHg
  pulseMin: 60,            // BPM
  pulseMax: 100,           // BPM
  spo2Min: 94,             // %
  tempMax: 38.0            // Celsius
}
```

**Alert Generation Logic**:
1. Vitals entered in Patient Registry
2. System checks against institutional thresholds
3. Alert created with severity based on deviation
4. Alert displayed on Dashboard with color coding (red/yellow/blue)
5. `resolved` flag tracks acknowledgment

**Future Enhancement**: Escalation workflow (Nurse → Charge Nurse → Physician).

### REQ-003: Telehealth Video with Recording

**File**: [components/VideoCall.tsx](components/VideoCall.tsx)

Browser-native WebRTC for P2P video consultations:
- Uses `getUserMedia` for camera/microphone access
- `MediaRecorder` API for session recording
- Recordings saved as Blob URLs (in-memory only)
- Consent confirmation required before recording starts

**Recording Flow**:
1. Select patient and appointment
2. Confirm recording consent
3. Click "Start Call" → getUserMedia permission
4. Recording begins automatically
5. "End Call" stops recording
6. Blob URL attached to patient record as `PatientRecording`

**Current Limitations**:
- P2P signaling not implemented (single-client only)
- Recordings are in-memory Blobs (lost on refresh)
- No STUN/TURN server integration
- Production needs server-side recording storage

### REQ-004: Universal Accessibility

**Themes** (configured in [App.tsx](App.tsx)):
```typescript
type ThemeType = 'light' | 'dark' | 'high-contrast';
```

- **Light**: Default theme for standard use
- **Dark**: Low-light environments
- **High-Contrast**: Visual impairment support

Theme applied via CSS classes on `<html>` element. Tailwind CSS uses `dark:` and custom theme classes for styling.

**Accessibility Features**:
- Semantic HTML structure
- Color-coded alerts (not color-only)
- Keyboard navigation supported
- Form labels properly associated
- ARIA roles where needed

**Not yet implemented**: Full ARIA 1.2 landmarks, screen reader optimization.

## Authentication & Security

### User Roles

Defined in [types.ts](types.ts):
```typescript
enum UserRole {
  ADMIN = 'Administrator',
  DOCTOR = 'Doctor',
  NURSE = 'Nurse',
  RECEPTIONIST = 'Receptionist'
}
```

**Login Flow** ([components/Login.tsx](components/Login.tsx)):
- Username + password + role selection
- No real authentication - credentials checked against mock data
- User stored in localStorage (`rophe_user`)
- Session persists until logout or browser clear

**Admin Access** ([components/AdminPanel.tsx](components/AdminPanel.tsx)):
- Separate admin password: `rophe2024` (default)
- Required to modify alert thresholds or view audit logs
- Password stored in App state (ephemeral)

**Security Gaps** (Production TODO):
- No password hashing
- No session expiration
- No rate limiting
- No MFA
- Admin password in plain text

### Audit Logging

All actions logged to immutable audit trail:
```typescript
interface AuditLogEntry {
  id: string;
  timestamp: string;  // ISO 8601
  user: string;       // Username
  action: string;     // e.g., 'USER_LOGIN', 'VITAL_ENTRY'
  details: string;    // Descriptive text
}
```

**Logged Actions**:
- `USER_LOGIN` / `USER_LOGOUT`
- `ADMIN_AUTH_SUCCESS`
- `SAFETY_THRESHOLD_MODIFIED`
- `SECURITY_CREDENTIAL_CHANGE`
- `PATIENT_ADDED` / `PATIENT_UPDATED`
- `TELEHEALTH_ENGAGEMENT` / `RECORDING_ATTACHED`

Logs displayed in Admin Panel, no export functionality yet.

## Data Models

### Patient

**File**: [types.ts](types.ts) line 83-102

```typescript
interface Patient {
  id: string;               // Format: PT-xxxxx
  firstName: string;
  lastName: string;
  dob: string;             // YYYY-MM-DD
  gender: 'Male' | 'Female' | 'Other';
  phone: string;           // +233 format for Ghana
  email: string;
  address: string;
  emergencyContact: string;
  bloodGroup?: string;     // A+, O-, etc.
  allergies: string[];
  medicalHistory: string[];
  insuranceProvider?: string;
  insuranceId?: string;
  recordings?: PatientRecording[];
  status: 'Active' | 'Inactive';
  deactivationReason?: string;
}
```

### Appointment

**File**: [types.ts](types.ts) line 104-118

```typescript
interface Appointment {
  id: string;              // Format: APT-xxxxx
  patientId: string;
  providerId: string;      // Doctor's user ID
  date: string;            // YYYY-MM-DD
  time: string;            // HH:MM 24-hour
  duration: number;        // minutes
  type: 'Consultation' | 'Follow-up' | 'Procedure' | 'Video Consultation';
  status: AppointmentStatus;
  notes?: string;
  reasonForVisit?: string;
  cancellationReason?: string;
}
```

### Alert

**File**: [types.ts](types.ts) line 63-71

```typescript
interface Alert {
  id: string;
  patientId: string;
  message: string;
  severity: AlertSeverity;  // INFO | WARNING | CRITICAL
  type: AlertType;          // VITAL | LAB | SCHEDULE | CLINICAL
  timestamp: string;
  resolved: boolean;
}
```

## Important Implementation Patterns

### Gemini API Integration

**Pattern** (from [services/geminiService.ts](services/geminiService.ts)):
```typescript
import { GoogleGenAI } from '@google/genai';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const response = await ai.models.generateContent({
  model: 'gemini-3-pro-preview',
  contents: [{ role: 'user', parts: [{ text: prompt }] }],
  config: {
    systemInstruction: 'You are a Clinical Intelligence Engine...',
    temperature: 0.3,
    maxOutputTokens: 2000
  }
});
```

**Error Handling**: Try-catch with generic fallback message.

### WebRTC Video Call

**Pattern** (from [components/VideoCall.tsx](components/VideoCall.tsx)):
```typescript
// 1. Get media stream
const stream = await navigator.mediaDevices.getUserMedia({
  video: { width: 1280, height: 720 },
  audio: true
});

// 2. Start recording
const mediaRecorder = new MediaRecorder(stream);
const chunks: Blob[] = [];

mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
mediaRecorder.onstop = () => {
  const blob = new Blob(chunks, { type: 'video/webm' });
  const url = URL.createObjectURL(blob);
  // Save to patient record
};

mediaRecorder.start();
```

### Alert Generation

**Pattern** (from [components/PatientRegistry.tsx](components/PatientRegistry.tsx)):
```typescript
const checkVitals = (vitals: Record<string, string>) => {
  const alerts: Alert[] = [];

  const systolic = parseInt(vitals.bp?.split('/')[0] || '0');
  if (systolic > alertThresholds.bpSystolicMax) {
    alerts.push({
      id: generateId(),
      patientId: patient.id,
      message: `Blood pressure ${vitals.bp} exceeds limit`,
      severity: AlertSeverity.CRITICAL,
      type: AlertType.VITAL,
      timestamp: new Date().toISOString(),
      resolved: false
    });
  }

  // Similar checks for pulse, SpO2, temp...
  return alerts;
};
```

### Theme Switching

**Pattern** (from [App.tsx](App.tsx)):
```typescript
useEffect(() => {
  const root = window.document.documentElement;
  root.classList.remove('light', 'dark', 'high-contrast');
  root.classList.add(theme);
  localStorage.setItem('rophe_theme', theme);
}, [theme]);
```

## Testing

### Self-Test Suite

**File**: [components/SelfTest.tsx](components/SelfTest.tsx)

Automated browser-based tests:
1. **Gemini API Test**: Verifies AI service connectivity
2. **Theme Cycle Test**: Tests all three accessibility themes
3. **Data Integrity Test**: Validates mock data structure
4. **UI Navigation Test**: Checks tab switching
5. **Alert Logic Test**: Validates threshold checking

**Usage**: Navigate to Admin Panel → Self-Test tab → Run Tests

## Common Pitfalls & Best Practices

### 1. Gemini API Key
- **Never commit** `.env.local` to git (already in .gitignore)
- Check API key is set: `console.log(!!process.env.GEMINI_API_KEY)`
- Model name must be exactly `gemini-3-pro-preview`

### 2. localStorage Limitations
- Data lost on browser clear
- 5-10MB limit per domain
- Not suitable for production patient data
- **TODO**: Replace with backend database

### 3. WebRTC Recording
- Blob URLs are session-scoped (lost on refresh)
- `getUserMedia` requires HTTPS in production
- MediaRecorder codec support varies by browser
- **TODO**: Server-side recording with encryption

### 4. Alert Thresholds
- Changes are immediate but not persisted
- Page refresh resets to defaults
- **TODO**: Save to localStorage or backend

### 5. TypeScript Strict Mode
- Project uses TypeScript but not strict mode
- Optional chaining (`?.`) used extensively
- Type assertions (`as`) present in some places
- Consider enabling strict mode for production

## File Organization Best Practices

When adding new features:

```
components/
├── [Feature].tsx          # Main component
├── [Feature]Modal.tsx     # Related modals
└── [Feature]Card.tsx      # Reusable sub-components

services/
└── [feature]Service.ts    # API/business logic

types.ts                   # Add new interfaces
```

**Component Naming**: PascalCase, descriptive
**Props Interfaces**: Inline or in types.ts
**State Hooks**: Descriptive names (not `data1`, `data2`)

## Production Readiness Checklist

- [ ] Replace localStorage with secure backend database
- [ ] Implement real authentication with JWT/OAuth
- [ ] Add password hashing (bcrypt/argon2)
- [ ] Implement session management with expiration
- [ ] Set up HTTPS with TLS 1.3
- [ ] Add rate limiting on Gemini API calls
- [ ] Implement PHI anonymization before AI submission
- [ ] Set up server-side WebRTC recording with encryption
- [ ] Add HIPAA-compliant audit logging
- [ ] Implement alert escalation workflow
- [ ] Add data encryption at rest (AES-256)
- [ ] Set up backup and disaster recovery
- [ ] Perform security audit and penetration testing
- [ ] Add comprehensive error boundaries
- [ ] Implement loading states for all async operations
- [ ] Add form validation on all inputs
- [ ] Set up continuous integration/deployment
- [ ] Add comprehensive unit and integration tests

## Documentation References

- Full SRS: `../SRS_RPMS_Final.md` (1,493 lines)
- Admin Guide: [AdministratorGuide.md](AdministratorGuide.md)
- Deployment Guide: [DeploymentGuide.md](DeploymentGuide.md)
- Architecture Diagram: [Architecture.svg](Architecture.svg)
- Database Schema: [Database.svg](Database.svg)

## Ghana-Specific Context

- **Phone Format**: +233 (Ghana country code)
- **Operating Hours**: 08:00 - 17:00 (clinic hours)
- **Language**: English (Akan/Twi support planned)
- **Payment Providers**: Paystack, Flutterwave, Hubtel, MTN Mobile Money
- **SMS Gateways**: Hubtel, Vodafone Ghana, MTN Ghana

## Known Limitations

1. **No Backend**: All data client-side only
2. **No Database**: localStorage for persistence
3. **Mock Authentication**: No real security
4. **Single Client**: No multi-user collaboration
5. **WebRTC P2P Only**: No TURN/STUN servers
6. **In-Memory Recordings**: Lost on refresh
7. **No Encryption**: PHI stored in plain text
8. **No Audit Export**: Logs view-only
9. **No Search**: Patient lookup is manual scan
10. **No Pagination**: All data loads at once

These are acceptable for prototype/demo but must be addressed before production use with real patient data.

## Debugging Tips

**Gemini API Issues**:
```javascript
// In browser console
console.log('API Key Set:', !!import.meta.env.GEMINI_API_KEY);
```

**localStorage Inspection**:
```javascript
// View all stored data
Object.keys(localStorage).filter(k => k.startsWith('rophe_'))
```

**Alert Debugging**:
```javascript
// Check current thresholds
console.log(alertThresholds);

// Manually trigger alert
const testAlert = {
  id: 'TEST-001',
  patientId: 'PT-00001',
  message: 'Test alert',
  severity: AlertSeverity.CRITICAL,
  type: AlertType.VITAL,
  timestamp: new Date().toISOString(),
  resolved: false
};
setAlerts(prev => [...prev, testAlert]);
```

## Contributing Guidelines

1. **Read the SRS first**: Understand the clinical requirements
2. **Test with realistic data**: Use Ghana phone numbers, real-world vitals
3. **Consider accessibility**: Test all themes, keyboard navigation
4. **Log all actions**: Add audit trail entries for state changes
5. **Handle errors gracefully**: Show user-friendly messages, log technical details
6. **Respect HIPAA principles**: Encrypt PHI, minimize data exposure, audit access
7. **Write defensive code**: Validate inputs, handle edge cases, add try-catch
8. **Comment medical logic**: ICD-10 codes, vital ranges, clinical workflows need context
9. **Test video on real devices**: WebRTC behavior varies across browsers/OS
10. **Keep it simple**: This is a prototype - avoid over-engineering

## Contact & Support

For questions about clinical workflows or HIPAA requirements, consult:
- Full SRS documentation
- [AdministratorGuide.md](AdministratorGuide.md) for institutional configuration
- [DeploymentGuide.md](DeploymentGuide.md) for technical setup

For Gemini API issues: https://ai.google.dev/docs
For WebRTC issues: https://www.w3.org/TR/webrtc/
