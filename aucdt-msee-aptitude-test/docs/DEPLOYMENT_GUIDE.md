# Deployment Guide

This guide provides step-by-step instructions to deploy the AUCDT MSEE Mathematics Aptitude Test application, which features a Node.js backend and a MySQL database.

## Prerequisites
*   A server or hosting environment that can run Node.js and MySQL (e.g., a Linux server like Ubuntu).
*   Node.js and npm installed on your deployment server.
*   A MySQL server installed and running.
*   A Google GenAI API Key.

## Step 1: Set Up the MySQL Database

1.  **Create a Database:**
    *   Log in to your MySQL server.
    *   Create a new database for the application. For example:
        ```sql
        CREATE DATABASE msee_test_db;
        ```
2.  **Create a Database User:**
    *   Create a dedicated user and grant it permissions to the new database. Replace `'your_password'` with a strong, secure password.
        ```sql
        CREATE USER 'msee_user'@'localhost' IDENTIFIED BY 'your_password';
        GRANT ALL PRIVILEGES ON msee_test_db.* TO 'msee_user'@'localhost';
        FLUSH PRIVILEGES;
        ```
3.  **Initialize the Schema:**
    *   The project includes a schema file at `db/init.sql`. Run this script against your newly created database to create all the necessary tables (`users`, `exams`, etc.).
        ```bash
        mysql -u msee_user -p msee_test_db < db/init.sql
        ```
4.  **Create the First Admin User:**
    *   To access the admin panel, you must manually create an administrator user.
    *   First, you need a hashed password. You can generate one using an online bcrypt generator or a simple Node.js script.
    *   Then, insert the admin user into your database:
        ```sql
        INSERT INTO users (email, password_hash, role) VALUES ('admin@example.com', 'your_generated_bcrypt_hash_here', 'admin');
        ```

## Step 2: Configure the Application Server

The backend server (`server.js`) requires several environment variables to run correctly. These contain sensitive credentials and should never be hardcoded.

1.  **Create a `.env` File:**
    *   In the root of your project directory on the server, create a file named `.env`.
    *   Add the following variables to the file, replacing the placeholder values with your actual credentials from Step 1 and your Google GenAI API key.
    ```
    # Database Configuration
    DB_HOST="localhost"
    DB_USER="msee_user"
    DB_PASSWORD="your_password"
    DB_NAME="msee_test_db"

    # Application Secrets
    JWT_SECRET="a_very_long_and_secure_random_string_for_jwt"
    API_KEY="your_google_genai_api_key_here"
    ```
    *   **IMPORTANT**: Ensure the `.gitignore` file contains `.env` to prevent committing secrets to version control.

## Step 3: Deploy and Run the Server

You will deploy the entire application directory to your server and run it as a Node.js process.

### Example: Deploying to an Ubuntu Server

1.  **Transfer Files:** Copy your entire project directory to the server (e.g., using `scp` or `git clone`).

2.  **Install Dependencies:**
    *   SSH into your server and navigate to the project directory.
    *   Install the required Node.js packages from `package.json`:
    ```bash
    npm install
    ```

3.  **Start the Server:**
    *   From the project directory, run the start command:
    ```bash
    npm start
    ```
    *   This will start the Express server, which will begin listening on port 3000 by default.

4.  **Keep the Server Running (Production):**
    *   For a real deployment, you must use a process manager like `pm2` to keep the Node.js application running continuously.
    *   **Install pm2 globally:**
    ```bash
    npm install pm2 -g
    ```
    *   **Start the app with pm2:**
    ```bash
    pm2 start server.js --name "msee-app"
    ```
    *   You can monitor the app with `pm2 list` and view logs with `pm2 logs msee-app`.

5.  **Configure a Reverse Proxy (Recommended):**
    *   It is best practice to run a web server like Nginx in front of your Node.js application. Nginx can handle incoming traffic on port 80 (HTTP) or 443 (HTTPS) and forward it to your app running on port 3000. This also simplifies setting up SSL/TLS for a secure `https://` connection.

Your application is now live and accessible through your server's IP address or domain name.