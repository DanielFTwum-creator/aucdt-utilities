# Architecture Overview

## System Architecture
The application follows a client-side SPA architecture using React 19.2.4, Vite, and Tailwind CSS. Firebase is used for authentication and Firestore for data storage.

```mermaid
graph TD
    User[User] -->|Interacts| UI[React UI]
    UI -->|Auth| Auth[Firebase Auth]
    UI -->|Data| DB[Firestore]
    UI -->|Flight Data| API[OpenSky API]
```

## Database Architecture
The database structure is defined in `firebase-blueprint.json` and uses Firestore.

```mermaid
graph TD
    Cards[cards collection] -->|Schema| AircraftCard[AircraftCard Entity]
    Users[users collection] -->|Schema| UserProfile[UserProfile Entity]
```
