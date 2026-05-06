# Deployment Guide

This guide provides instructions for deploying the **full-stack** Lecturer Assessment & Evaluation Portal to a live environment.

## 1. Architecture Overview

This application follows a **three-tier architecture**:
1.  **Frontend (React SPA):** A static single-page application that serves as the user interface.
2.  **Backend (Java Spring Boot):** A RESTful API server that handles all business logic, data processing, and database interactions.
3.  **Database (MySQL):** The persistent data store for the application.

Deploying this application requires setting up each of these components and ensuring they can communicate with each other.

---

## 2. Backend Deployment (Java Spring Boot)

The backend is the core of the application and must be deployed first.

### 2.1 Prerequisites
-   A server environment (e.g., Ubuntu 22).
-   Java (JRE) version 17 or higher installed.
-   Access to the LEMS MySQL database.

### 2.2 Building the Application
From the Spring Boot project's root directory, build the executable `.jar` file:
```bash
./mvnw clean package
```
This will generate a file in the `target/` directory, such as `lems-api-0.0.1-SNAPSHOT.jar`.

### 2.3 Configuration
The Spring Boot application is configured via `src/main/resources/application.properties`. For production, it's best to override these settings with environment variables or a separate configuration file.

**Key properties to configure:**
```properties
# Server Port
server.port=8080

# Database Connection
spring.datasource.url=jdbc:mysql://<your_database_host>:3306/lems
spring.datasource.username=<your_db_user>
spring.datasource.password=<your_db_password>
spring.jpa.hibernate.ddl-auto=update

# Google Gemini API Key
gemini.api.key=<your_google_gemini_api_key>
```

**Security Best Practice:** Do not hardcode credentials. Use environment variables on your server.
```bash
export SPRING_DATASOURCE_USERNAME="db_user"
export SPRING_DATASOURCE_PASSWORD="db_password"
export GEMINI_API_KEY="your_gemini_key"
```

### 2.4 Running the Application
1.  Copy the built `.jar` file to your server.
2.  Set the required environment variables for the database and API key.
3.  Run the application:
    ```bash
    java -jar lems-api-0.0.1-SNAPSHOT.jar
    ```

It is highly recommended to run the application as a systemd service for automatic restarts and process management.

---

## 3. Frontend Deployment (React SPA)

The frontend is a static application that communicates with the backend API.

### 3.1 Configuring the API Endpoint
Before building, you must configure the frontend to know where the backend API is located.
1.  Create a `.env.production` file in the root of the React project.
2.  Add the following variable, pointing to your deployed backend's URL:
    ```
    VITE_API_BASE_URL=https://your-backend-api.aucdt.edu.gh
    ```
The application code is set up to use this environment variable when making API calls.

### 3.2 Building the Static Files
Run the build command to generate the static HTML, CSS, and JS files.
```bash
npm run build
```
This will create a `dist/` directory containing all the files needed for deployment.

### 3.3 Hosting
You can host the contents of the `dist/` directory on any static web hosting provider.
-   Vercel
-   Netlify
-   A traditional web server like Nginx or Apache.

**Example Nginx Configuration:**
A simple Nginx configuration would serve the static files and could also act as a reverse proxy to your Spring Boot backend to avoid CORS issues.

### 3.4 API Key Management
**The Google Gemini API key is now managed exclusively by the backend.** It is never exposed to the frontend. The frontend makes requests to the backend, and the backend securely adds the key before calling the Google API. This is the most secure and recommended approach.

---

## 4. Pre-Deployment Quality Assurance

Before deploying, it is crucial to run the project's test suite to ensure application quality. In a CI/CD pipeline, add steps to run tests for both the backend and frontend.

**Backend (Maven):**
```bash
./mvnw test
```

**Frontend (Vitest):**
```bash
npm install
npm test
```

If any tests fail, the pipeline should stop the deployment.