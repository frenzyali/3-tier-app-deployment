# 3-Tier Application Deployment 

This project demonstrates a **basic 3-tier architecture** deployed using **Docker and Docker Compose**, with a focus on DevOps fundamentals such as containerization, reverse proxying, health checks, and clean project structure.

---

## 🧱 Architecture Overview

This is a **3-tier application** consisting of:

1. **Application Tier (App)**

   * Python Flask application
   * Handles business logic and API endpoints
   * Exposes REST endpoints for user management

2. **Web Tier (Web)**

   * Nginx reverse proxy
   * Routes external traffic to the application container
   * Exposes port `8080` to the host

3. **Database Tier (DB)**

   * MySQL database
   * Stores application data
   * Accessed internally by the application container

```
Client → Nginx (Web) → Flask App → MySQL DB
```

---

## 🛠️ Tech Stack

* Python (Flask)
* Nginx (Reverse Proxy)
* MySQL
* Docker & Docker Compose
* HTML / CSS / JavaScript (Frontend)

---

## 📦 Containers

### 1. App Container

* Runs the Flask application
* Uses a **slim Python base image** for optimization
* Connects to MySQL using environment variables
* Exposes internal port `3000`
* Includes a `/health` endpoint for health checks

### 2. Web Container

* Uses `nginx:alpine`
* Acts as a reverse proxy
* Forwards requests from `localhost:8080` to the app container

### 3. DB Container

* Uses MySQL image
* Stores user data
* Connected via Docker network

---

## 🔁 Reverse Proxy (Nginx)

Nginx routes incoming traffic to the Flask app:

* External access: `http://localhost:8080`
* Internal app access: `http://app:3000`

This simulates a real-world production setup where the app is not directly exposed.

---

## ❤️ Health Checks

Health checks were added to improve deployment reliability.

### Application Health Endpoint

```http
GET /health
```

Response:

```json
{ "status": "ok" }
```

### Docker Compose Healthcheck

Docker periodically checks the app container using:

```bash
curl http://localhost:3000/health
```

This ensures the container is marked **healthy** only when the app is running correctly.

---

## ⚙️ Application Features

* Add users to the database
* View users
* Delete users
* Toast notifications for actions
* Modal-based delete confirmation

These features were added to demonstrate **real database interaction** instead of a static app.

---

## 📂 Project Structure

```
.
├── app.py
├── Dockerfile
├── docker-compose.yml
├── nginx/
│   └── default.conf
├── templates/
│   └── users.html
├── static/
│   └── app.js
├── .env
├── .gitignore
└── README.md
```

---

## 🔐 Environment Variables

Sensitive configuration is stored in `.env` and excluded from Git using `.gitignore`:

```
.env
```
