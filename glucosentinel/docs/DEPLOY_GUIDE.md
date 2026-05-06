# Deployment Guide

## Prerequisites
-   Node.js v18+
-   Docker (optional)
-   Git

## Local Deployment
1.  Clone the repository:
    ```bash
    git clone https://github.com/your-repo/gluco-sentinel.git
    cd gluco-sentinel
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  Access the application at `http://localhost:3000`.

## Production Deployment (Docker)
1.  Build the Docker image:
    ```bash
    docker build -t gluco-sentinel .
    ```
2.  Run the container:
    ```bash
    docker run -p 3000:3000 gluco-sentinel
    ```

## Environment Variables
-   `PORT`: The port to run the server on (default: 3000).
-   `NODE_ENV`: Set to `production` for production builds.
-   `DATABASE_URL`: Connection string for the database (if using external DB).
