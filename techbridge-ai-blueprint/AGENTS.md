# Techbridge AI Blueprint [TAB] - Agent Instructions

## Project Context
- **Institution**: Techbridge University College (TUC), Oyibi, Greater Accra, Ghana
- **Owner**: Daniel Frempong Twum, Head of ICT
- **Language**: UK British English mandatory in all UI and documentation
- **Code Standards**: Production-ready, no placeholders.

## Documentation Standards
- **IEEE Standard**: 830 / IEEE 29148
- **SRS Naming**: TUC-ICT-SRS-YYYY-NNN
- **Incident IDs**: TUC-INC-YYYY-NNN
- **Diagrams**: SVG format, embedded in SRS
- **Storage**: All documentation must be saved in the `/docs` directory

## Technical Stack
- **Frontend**: React 18, TypeScript, Tailwind CSS, Motion
- **Backend Node**: Express Node.js (for server-side functions like Export)
- **Database**: Cloud-native (Firebase Auth + Firestore)
- **Mobile**: Capacitor 8.3.3 integration for iOS/Android

## Persistence Rules
- Maintain Cloud-synced state in Firestore.
- Ensure all admin actions are logged to `audit_logs`.
- Maintain Zero-Trust Security Rules in `firestore.rules`.
- **Mandatory Authentication Gate**: All users must authenticate via Google before accessing any project blueprint data.
