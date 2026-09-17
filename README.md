# 📰 NewsroomOS

> **Centralized digital workspace for modern journalists — monitor, collaborate, analyze, publish, and follow live information from one platform.**

**NewsroomOS** is a full-stack web platform designed as a **centralized workstation for journalists and newsroom teams**.

The main goal of NewsroomOS is to reduce the fragmentation of tools used daily in a newsroom by bringing multiple essential features together into a single interface.

The platform allows users to:

* 📰 view and manage journalistic content;
* 📺 monitor multiple streams through a **TV Wall**;
* 🤖 use artificial intelligence-based tools;
* ✍️ create and manage publications;
* 💬 communicate with other newsroom members;
* 👤 manage users and profiles;
* 🌍 follow live content and information;
* 🔐 secure access to different features;
* ⚡ centralize the tools required for journalistic work.

NewsroomOS is designed as a true **Newsroom Operating Workspace**: a unified environment where journalists can monitor information, collaborate, analyze content, and work more efficiently.

The project is built around a clearly separated architecture:

* **Angular** for the frontend;
* **Node.js / Express** for the backend;
* **MongoDB / Mongoose** for the database;
* **JWT / bcrypt** for authentication and security;
* **GitHub Actions** for continuous integration;
* integrated **AI-powered features** inside the workspace.

---

# 📸 Application Preview

## 🔐 Login

<p align="center">
  <img src="docs/screenshots/login.png" alt="NewsroomOS Login" width="900">
</p>

The login screen allows authorized users to securely access their NewsroomOS environment.

Authentication is based on JWT tokens used to secure communication between the Angular frontend and the backend API.

---

## ✍️ Signup

<p align="center">
  <img src="docs/screenshots/signup.png" alt="NewsroomOS Signup" width="900">
</p>

The signup interface allows new users to create an account and access the features available on the platform.

---

## 📰 News Feed

<p align="center">
  <img src="docs/screenshots/feed.png" alt="NewsroomOS News Feed" width="900">
</p>

The **News Feed** is one of the central areas of NewsroomOS.

It allows users to browse available publications and centralize journalistic content directly inside the workspace.

---

## 📺 TV Wall

<p align="center">
  <img src="docs/screenshots/live-tv.png" alt="NewsroomOS TV Wall" width="900">
</p>

The **TV Wall** allows users to monitor multiple video sources or live content streams from a centralized interface.

This feature is particularly useful in a newsroom environment where several information sources may need to be monitored simultaneously.

The TV Wall helps transform NewsroomOS into a true **journalistic monitoring center**.

---

## 💬 Messages

<p align="center">
  <img src="docs/screenshots/messages.png" alt="NewsroomOS Messaging" width="900">
</p>

The internal messaging system allows users to communicate directly from NewsroomOS without leaving their working environment.

---

# 🎯 NewsroomOS Concept

NewsroomOS is designed as a centralized system that brings together multiple components of a modern newsroom.

```text
                             ┌─────────────────────────────┐
                             │         NewsroomOS          │
                             │                             │
                             │ Centralized Newsroom Hub    │
                             └──────────────┬──────────────┘
                                            │
             ┌──────────────────────────────┼──────────────────────────────┐
             │                              │                              │
             ▼                              ▼                              ▼
      ┌──────────────┐              ┌──────────────┐               ┌──────────────┐
      │  📰 News     │              │  📺 TV Wall │               │   🤖 AI      │
      │     Feed     │              │              │               │  Workspace   │
      └──────┬───────┘              └──────┬───────┘               └──────┬───────┘
             │                              │                              │
             └──────────────────────┬───────┴──────────────┬───────────────┘
                                    │                      │
                                    ▼                      ▼
                              ┌──────────────┐       ┌──────────────┐
                              │ 💬 Messaging │       │ ✍️ Publishing│
                              └──────┬───────┘       └──────┬───────┘
                                     │                      │
                                     └──────────┬───────────┘
                                                │
                                                ▼
                                      ┌──────────────────┐
                                      │ 👤 User Workspace │
                                      └──────────────────┘
```

The idea is to provide an environment where journalists can remain connected to their main sources, monitor information, use AI tools, communicate with their team, and manage content from a single application.

---

# ✨ Features

## 🔐 Authentication & Security

* User registration
* Secure login
* JWT-based authentication
* Password hashing with bcrypt
* Backend route protection
* Authentication middleware
* Frontend token management
* Angular Route Guards
* Angular HTTP Interceptor
* Environment variables for sensitive data
* `.env` file excluded from the repository

---

## 📰 News Feed & Publications

* Create publications
* Browse publications
* Manage journalistic content
* Centralized news feed
* Interact with content
* Manage data through the REST API

---

## 📺 TV Wall

The **TV Wall** centralizes the monitoring of live content.

It is one of the main components of NewsroomOS and introduces a **live monitoring** capability into the journalist's workspace.

### Objectives

* Centralize multiple streams
* Reduce the need to use multiple windows
* Simplify live content monitoring
* Provide a global overview from a single dashboard
* Improve newsroom team responsiveness

---

## 🤖 Artificial Intelligence

NewsroomOS also integrates artificial intelligence-based features designed to assist journalistic work.

Depending on the tools available in the workspace, AI can support tasks such as:

* content analysis;
* text summarization;
* writing assistance;
* rephrasing;
* information extraction;
* content processing;
* research assistance;
* rapid information organization.

The goal is not to replace journalists, but to provide tools capable of accelerating repetitive or analytical tasks.

---

## 💬 Messaging

* Communication between users
* Message management
* Dedicated REST API
* Protected routes
* Direct integration into the workspace

---

## 👤 User Management

* View user profiles
* Edit user information
* Profile management
* Protection of routes requiring authentication
* Identification of connected users

---

## 🌍 Live / News

* Dedicated interface for live content
* Centralized information
* Integration with the NewsroomOS environment
* Navigation from the main workspace

---

# 🏗️ Architecture

NewsroomOS uses a **Frontend / Backend / Database** architecture.

```text
                         ┌──────────────────────┐
                         │         User         │
                         │      Web Browser     │
                         └──────────┬───────────┘
                                    │
                               HTTP / HTTPS
                                    │
                                    ▼
                    ┌─────────────────────────────┐
                    │          Angular            │
                    │          Frontend           │
                    │                             │
                    │ • Components                │
                    │ • Pages                     │
                    │ • Services                  │
                    │ • Guards                    │
                    │ • HTTP Interceptors         │
                    │ • News Feed                 │
                    │ • TV Wall                   │
                    │ • AI Workspace              │
                    └──────────────┬──────────────┘
                                   │
                                REST API
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │      Node.js / Express      │
                    │           Backend           │
                    │                             │
                    │ • Routes                    │
                    │ • Middleware                │
                    │ • Authentication            │
                    │ • Business Logic            │
                    │ • API Services              │
                    └──────────────┬──────────────┘
                                   │
                                Mongoose
                                   │
                                   ▼
                    ┌─────────────────────────────┐
                    │           MongoDB           │
                    │                             │
                    │ • Users                     │
                    │ • Posts                     │
                    │ • Messages                  │
                    └─────────────────────────────┘
```

---

# 📁 Project Structure

```text
NewsroomOS/
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── docs/
│   └── screenshots/
│       ├── login.png
│       ├── signup.png
│       ├── feed.png
│       ├── live-tv.png
│       └── messages.png
│
├── backend/
│   ├── package.json
│   ├── package-lock.json
│   ├── print.py
│   │
│   └── src/
│       ├── config/
│       │   └── db.js
│       │
│       ├── middleware/
│       │   └── auth.middleware.js
│       │
│       ├── models/
│       │   ├── Message.js
│       │   ├── Post.js
│       │   └── User.js
│       │
│       ├── routes/
│       │   ├── auth.routes.js
│       │   ├── message.routes.js
│       │   ├── post.routes.js
│       │   └── user.routes.js
│       │
│       └── server.js
│
├── frontend/
│   └── journalist-frontend/
│       ├── public/
│       │
│       ├── src/
│       │   └── app/
│       │       ├── guards/
│       │       ├── interceptors/
│       │       ├── pages/
│       │       └── services/
│       │
│       ├── angular.json
│       ├── package.json
│       ├── package-lock.json
│       ├── tsconfig.json
│       ├── tsconfig.app.json
│       └── tsconfig.spec.json
│
├── .gitignore
└── README.md
```

---

# 🛠️ Tech Stack

## Frontend

* **Angular**
* **TypeScript**
* HTML5
* SCSS
* Angular Router
* Angular Services
* Angular HTTP Client
* Angular Route Guards
* HTTP Interceptors

---

## Backend

* **Node.js**
* **Express.js**
* JavaScript
* REST API
* JWT
* bcrypt
* dotenv

---

## Database

* **MongoDB**
* **Mongoose**

---

## DevOps & Version Control

* **Git**
* **GitHub**
* **GitHub Actions**
* npm
* Continuous Integration

---

# 🔄 General Workflow

The main NewsroomOS workflow follows this process:

```text
User
    │
    ▼
NewsroomOS Frontend
    │
    │ HTTP Request
    ▼
Angular Services
    │
    ▼
Express REST API
    │
    ├── Authentication
    │
    ├── Users
    │
    ├── Posts
    │
    ├── Messages
    │
    └── Services
    │
    ▼
MongoDB
    │
    ▼
Response
    │
    ▼
Angular Frontend
    │
    ▼
NewsroomOS Interface
    │
    ▼
User
```

---

# 🔑 Authentication

When a user logs in, the authentication system follows this process:

```text
User
    │
    ▼
Login Form
    │
    ▼
Angular
    │
    │ POST /auth/login
    ▼
Express API
    │
    ▼
Credential Verification
    │
    ▼
bcrypt
    │
    ▼
JWT Generated
    │
    ▼
Angular Receives Token
    │
    ▼
Token Storage / Management
    │
    ▼
HTTP Interceptor
    │
    ▼
Authorization: Bearer <token>
    │
    ▼
Authentication Middleware
    │
    ▼
Protected Route
```

The authentication middleware verifies the JWT before granting access to protected resources.

---

# 🔐 Security

Security is based on several mechanisms.

## Password Management

Passwords are not stored directly.

They are hashed using:

```text
bcrypt
```

---

## JSON Web Token

After successful authentication, the backend generates a JWT token.

The token is then used for requests sent to protected routes.

```text
Client
  │
  │ Authorization: Bearer JWT
  ▼
Express Middleware
  │
  ├── Valid Token
  │       │
  │       ▼
  │   Route Authorized
  │
  └── Invalid Token
          │
          ▼
      Access Denied
```

---

# 🌱 Environment Variables

Sensitive information is stored inside a `.env` file.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

The `.env` file must never be committed to the repository.

Example `.gitignore`:

```gitignore
# Dependencies
node_modules/

# Environment
.env
.env.*

# Angular
.angular/
dist/

# Logs
*.log

# OS
.DS_Store
Thumbs.db
```

> ⚠️ Real values for `MONGO_URI`, `JWT_SECRET`, API keys, and other secrets must remain private.

---

# 📡 REST API

The backend exposes several groups of REST routes.

| Domain         | Route         | Description            |
| -------------- | ------------- | ---------------------- |
| Authentication | `/auth/*`     | Registration and login |
| Users          | `/users/*`    | User management        |
| Posts          | `/posts/*`    | Publication management |
| Messages       | `/messages/*` | Message management     |

Endpoints may evolve as NewsroomOS continues to develop.

---

# 🔄 Continuous Integration — CI

NewsroomOS uses **GitHub Actions** to automate project verification.

The CI workflow runs automatically when configured repository events occur.

```text
Developer
    │
    │ git push
    ▼
GitHub Repository
    │
    ▼
GitHub Actions
    │
    ├── Checkout Repository
    │
    ├── Setup Node.js
    │
    ├── Install Dependencies
    │
    ├── Run Checks
    │
    ├── Run Tests
    │
    └── Build Project
    │
    ▼
CI Validation
```

## CI Objectives

* Automate project verification
* Verify dependency installation
* Detect errors quickly
* Run available tests
* Verify that the frontend can be compiled
* Reduce errors before integration
* Improve project quality

---

# 🧪 Testing

The Angular frontend contains a dedicated testing configuration.

To run tests:

```bash
npm test
```

or:

```bash
ng test
```

Tests can also be executed automatically through GitHub Actions.

---

# 🚀 Installation

## Prerequisites

Install the following tools:

* Node.js
* npm
* MongoDB
* Git
* Angular CLI if required

Check installed versions:

```bash
node --version
npm --version
git --version
```

---

# 📥 Clone NewsroomOS

```bash
git clone https://github.com/NameRami/NewsroomOS.git
```

Then:

```bash
cd NewsroomOS
```

---

# ⚙️ Backend Configuration

Enter the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a file named:

```text
.env
```

Add:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_jwt_secret
```

Start the backend:

```bash
npm start
```

Server:

```text
http://localhost:5000
```

---

# 💻 Frontend Configuration

In another terminal:

```bash
cd frontend/journalist-frontend
```

Install dependencies:

```bash
npm install
```

Start Angular:

```bash
npm start
```

or:

```bash
ng serve
```

Frontend:

```text
http://localhost:4200
```

---

# 🔄 Request Lifecycle

```text
┌───────────────┐
│     User      │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Angular Page  │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Angular       │
│ Service       │
└───────┬───────┘
        │ HTTP
        ▼
┌───────────────┐
│ Express Route │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Middleware    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│ Business      │
│ Logic         │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│   Mongoose    │
└───────┬───────┘
        │
        ▼
┌───────────────┐
│    MongoDB    │
└───────┬───────┘
        │
        ▼
     Response
```

---

# 🧠 AI Positioning

Artificial intelligence is an important extension of the NewsroomOS concept.

```text
                      ┌──────────────────────┐
                      │     Journalist       │
                      └──────────┬───────────┘
                                 │
                                 ▼
                     ┌─────────────────────────┐
                     │       NewsroomOS        │
                     └────────────┬────────────┘
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
             ▼                    ▼                    ▼
        News Content          AI Tools             Live Data
             │                    │                    │
             │             ┌──────┴──────┐             │
             │             │             │             │
             ▼             ▼             ▼             ▼
        Monitoring      Analysis       Assist.      TV Wall
                           │           Writing
                           │
                           ▼
                      Journalist
                      Decision
```

AI acts as an assistance layer integrated into the workspace, while final validation and editorial decisions remain under the journalist's control.

---

# 📊 Project Status

| Feature                       | Status |
| ----------------------------- | ------ |
| Frontend/backend architecture | ✅      |
| Angular                       | ✅      |
| Node.js / Express             | ✅      |
| MongoDB / Mongoose            | ✅      |
| Authentication                | ✅      |
| JWT                           | ✅      |
| bcrypt                        | ✅      |
| User management               | ✅      |
| Publications                  | ✅      |
| News Feed                     | ✅      |
| Messaging                     | ✅      |
| User profile                  | ✅      |
| TV Wall                       | ✅      |
| AI features                   | ✅      |
| Angular Guards                | ✅      |
| HTTP Interceptors             | ✅      |
| Environment variables         | ✅      |
| Git / GitHub                  | ✅      |
| GitHub Actions                | ✅      |
| Continuous Integration        | ✅      |
| Advanced testing              | 🚧     |
| Complete API documentation    | 🚧     |
| Docker                        | 🚧     |
| Docker Compose                | 🚧     |
| Continuous Deployment         | 🚧     |
| Production deployment         | 🚧     |
| Monitoring                    | 🚧     |
| Structured logging            | 🚧     |

---

# 🗺️ Roadmap

## Phase 1 — Core Platform

* [x] Frontend/backend architecture
* [x] Angular
* [x] Express API
* [x] MongoDB
* [x] Authentication
* [x] User management
* [x] Publications
* [x] Messaging
* [x] User profiles

---

## Phase 2 — Newsroom Workspace

* [x] News Feed
* [x] Live interface
* [x] TV Wall
* [x] Centralized tools
* [x] Integrated messaging
* [x] User workspace

---

## Phase 3 — Artificial Intelligence

* [x] AI feature integration
* [x] Integrated workspace assistance
* [ ] Expand analysis tools
* [ ] Advanced automatic summarization
* [ ] Intelligent information extraction
* [ ] Automatic content classification
* [ ] AI-assisted research

---

## Phase 4 — Quality & CI

* [x] Git
* [x] GitHub
* [x] GitHub Actions
* [x] CI pipeline
* [x] Automated verification
* [ ] Increase test coverage
* [ ] Automated code quality analysis
* [ ] Additional backend tests

---

## Phase 5 — Containerization

* [ ] Docker backend
* [ ] Docker frontend
* [ ] Docker Compose
* [ ] Image optimization
* [ ] Reproducible environment

---

## Phase 6 — Deployment

* [ ] Continuous Deployment
* [ ] VPS / Cloud deployment
* [ ] Staging environment
* [ ] Production environment
* [ ] Centralized secret management

---

## Phase 7 — Observability

* [ ] Structured logs
* [ ] Monitoring
* [ ] Metrics
* [ ] Dashboards
* [ ] Alerting

---

# 🎯 DevOps Vision

The long-term objective is to transform NewsroomOS into a platform with a complete DevOps pipeline.

```text
                ┌──────────────┐
                │     Git      │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │    GitHub    │
                └──────┬───────┘
                       │
                       ▼
             ┌───────────────────┐
             │   GitHub Actions  │
             │        CI         │
             └─────────┬─────────┘
                       │
                       ▼
                ┌──────────────┐
                │     Tests    │
                └──────┬───────┘
                       │
                       ▼
                 ┌─────────────┐
                 │    Build    │
                 └──────┬──────┘
                        │
                        ▼
                  [ Coming Soon ]
                        │
               ┌────────┴────────┐
               ▼                 ▼
            Docker              CD
               │                 │
               └────────┬────────┘
                        ▼
                   Deployment
                        │
                        ▼
                   Monitoring
```

### Current Status

```text
Git
 │
 ▼
GitHub
 │
 ▼
GitHub Actions
 │
 ▼
Continuous Integration
 │
 ▼
Build / Verification
 │
 ▼
✅ Current DevOps Stage


Docker
 │
 ▼
Continuous Deployment
 │
 ▼
Production
 │
 ▼
Monitoring
 │
 ▼
🚧 Next Stages
```

---

# 🌐 Overall NewsroomOS Vision

```text
                               NEWSROOMOS
                                   │
             ┌─────────────────────┼─────────────────────┐
             │                     │                     │
             ▼                     ▼                     ▼
        INFORMATION           COLLABORATION          PRODUCTIVITY
             │                     │                     │
      ┌──────┴──────┐        ┌─────┴─────┐         ┌─────┴─────┐
      │             │        │           │         │           │
      ▼             ▼        ▼           ▼         ▼           ▼
 News Feed       TV Wall   Messages    Users       AI       Publishing
      │             │        │           │         │           │
      └─────────────┴────────┴─────┬─────┴─────────┴───────────┘
                                   │
                                   ▼
                         ┌──────────────────┐
                         │ Journalist Desk  │
                         │ Unified Workspace│
                         └──────────────────┘
```

The vision of NewsroomOS is to provide a single interface that brings together the essential tools required for the daily operation of a modern digital newsroom.

---

# 🤝 Contributing

To contribute to the project:

1. Fork the repository
2. Create a branch
3. Make your changes
4. Add or update tests
5. Commit your changes
6. Push the branch
7. Create a Pull Request

Create a branch:

```bash
git checkout -b feature/new-feature
```

Commit:

```bash
git add .
git commit -m "feat: add new feature"
```

Push:

```bash
git push origin feature/new-feature
```

---

# 👨‍💻 Author

**YOUR NAME**

Computer Engineering Student — **DevOps & MLOps**

🇹🇳 Tunisia

### GitHub

```text
https://github.com/NameRami
```

### Repository

```text
https://github.com/NameRami/NewsroomOS
```

---

# 📄 License

NewsroomOS is currently being developed for **academic, experimental, and demonstration purposes**.

An open-source license may be added later depending on the evolution of the project.

---

# 📰 NewsroomOS

**Monitor. Analyze. Collaborate. Publish.**

> One workspace for the modern newsroom.
