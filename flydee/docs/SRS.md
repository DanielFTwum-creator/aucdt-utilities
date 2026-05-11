# Software Requirements Specification (SRS) for Flydee

## 1. Introduction
**1.1 Purpose:** This document outlines the software requirements for Flydee, a mobile application designed to identify overhead aircraft and gamify the plane-spotting experience through digital collectable cards.
**1.2 Scope:** The application will utilise device sensors and external flight data APIs to identify aircraft. It will allow users to capture photos, generate digital cards with flight statistics, and build a virtual collection based on rarity and aircraft type.
**1.3 Intended Audience:** Developers, project managers, UI/UX designers, and potential investors.
## 2. Overall Description
**2.1 Product Perspective:** Flydee is a standalone mobile application for iOS and Android, integrating augmented reality (AR) concepts with real-time aviation data tracking.
**2.2 User Classes:** Casual users seeking entertainment, aviation enthusiasts tracking specific models, and competitive players focused on building rare collections.
**2.3 Operating Environment:** Mobile devices running iOS 15.0+ and Android 10.0+. Active internet connection and location services are mandatory.
## 3. External Interface Requirements
**3.1 User Interfaces:** The primary interface will be a camera-first AR viewfinder. Secondary screens will include a digital binder for the card collection, a global map, and user profile settings.
**3.2 Hardware Interfaces:** The software must interface with the device camera, GPS module, compass, and gyroscope to calculate line-of-sight vectors.
**3.3 Communications Interfaces:** HTTPS RESTful APIs for fetching real-time flight data and connecting to the central backend server for user authentication and database synchronisation.
## 4. Core System Features
**4.1 Capture Mode:** The system shall provide a camera interface that overlays a targeting reticle, allowing users to "lock on" to an aircraft using spatial data.
**4.2 Flight Identification:** Upon capture, the app shall transmit spatial coordinates to the backend to match the vector with live ADS-B flight data, returning the flight number, aircraft type, route, and altitude.
**4.3 Card Generation:** The system shall overlay the retrieved flight statistics onto the user's captured photograph, formatting it as a digital collectable card.
## 5. Gamification and Social Features
**5.1 Rarity System:** Cards shall be assigned rarity tiers (e.g., Common, Uncommon, Rare, Legendary) based on the aircraft model, route frequency, and special liveries.
**5.2 Achievements:** Users shall unlock badges for specific milestones, such as spotting aircraft from ten different airlines or capturing international flights.
**5.3 Social Sharing:** The application shall provide native sharing functionalities to export cards to social media platforms like Instagram, X, and WhatsApp.
## 6. Performance Requirements
**6.1 API Latency:** Flight data retrieval and matching must occur within 2.5 seconds of the user pressing the capture button to maintain an engaging user experience.
**6.2 Battery Consumption:** The app must optimise camera and GPS usage to prevent excessive battery drain during extended plane-spotting sessions.
## 7. Security Requirements
**7.1 Data Privacy:** User location data must only be processed at the moment of capture for identification purposes and must not be stored long-term or sold to third parties, ensuring GDPR compliance.
**7.2 Authentication:** Standard OAuth 2.0 protocols (Google, Apple, email) must be used for secure user account creation and login.
## 8. Software Quality Attributes
**8.1 Usability:** The user interface must be intuitive, requiring zero technical knowledge of aviation or AR mechanics to successfully capture a plane.
**8.2 Reliability:** The application must gracefully handle scenarios where an aircraft cannot be identified, offering a clear error message and prompting the user to try again.
## 9. Database and Storage Requirements
**9.1 Cloud Storage:** User profiles, card inventories, and compressed photo assets must be stored in a scalable cloud database (e.g., Firebase or AWS S3) to allow cross-device syncing.
**9.2 Local Caching:** Recently viewed cards and the user's primary collection must be cached locally on the device to minimise load times and reduce data consumption.
## 10. Hardware and Device Requirements
**10.1 Minimum Specifications:** Devices must feature a functional rear-facing camera, accurate GPS tracking, and a magnetometer (compass) for spatial orientation.
**10.2 Permissions:** The app requires explicit user permission for Location (while using the app), Camera, and Local Storage.
## 11. APIs and Third-Party Integrations
**11.1 Flight Data Provider:** Integration with a robust aviation data provider, such as the FlightAware API or Flightradar24 API, for real-time ADS-B telemetry.
**11.2 Mapping Services:** Integration with Mapbox or Google Maps SDK to display the flight path of the captured aircraft on the back of the digital card.
## 12. Monetisation Strategy
**12.1 Freemium Model:** The core capture and collection loop will remain free.
**12.2 Premium Features:** A subscription or one-time purchase could offer features like detailed historical flight data, exclusive card borders, or an ad-free experience.
## 13. Assumptions and Dependencies
**13.1 Third-Party Uptime:** The app's core functionality is entirely dependent on the uptime and accuracy of the chosen third-party flight data API.
**13.2 Environmental Factors:** The system assumes the user has a clear line of sight to the sky; heavily overcast weather or severe light pollution may hinder the user's ability to spot targets.
## 16. Testing Framework
**16.1 E2E Testing:** Playwright-based end-to-end testing suite for critical user journeys.
**16.2 Admin Testing:** Interactive testing dashboard in the admin panel for running and monitoring test suites.
## 17. Documentation
**17.1 Architecture:** System and database architecture diagrams.
**17.2 Admin Guide:** Instructions for administrative tasks.
**17.3 Deployment Guide:** Steps for building and deploying the application.
**17.4 Testing Guide:** Instructions for running the E2E test suite.
