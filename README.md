<div align="center">

# SOEN 🔥

**An AI-Powered Real-Time Collaborative Workspace**

[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socketdotio&logoColor=white)](https://socket.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

</div>

---

## 📖 Overview

**SOEN** is a full-stack web application that enables seamless real-time collaboration with deeply integrated artificial intelligence. Built on the **MERN** stack and powered by **Socket.io**, it provides an event-driven workspace where teams can authenticate securely, create and join project spaces, communicate instantly, and query an AI assistant for insights and content generation — all from a single, cohesive interface.

The architecture prioritises developer experience and end-user performance through an optimistic UI, isolated project rooms, and a backend AI pipeline that abstracts latency and credential management away from the client.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Secure Authentication** | JWT-based login and registration with Bcrypt password hashing |
| ⚡ **Real-Time Collaboration** | Instant messaging and project sync via Socket.io with per-project rooms |
| 🤖 **AI Assistant** | Integrated Google GenAI and Groq SDKs for intelligent, in-workspace responses |
| 🚀 **Optimistic UI** | Actions reflect immediately on the frontend before server confirmation |
| 📂 **Project Workspaces** | Isolated, dedicated environments per project and team |

---

## 🛠️ Technology Stack

### Frontend

| Technology | Purpose |
|---|---|
| React 19 + Vite | Component framework and ultra-fast build tooling |
| Tailwind CSS v4 | Utility-first responsive styling |
| Redux Toolkit | Centralised, scalable application state management |
| React Router v7 | Declarative client-side routing |
| Socket.io Client | Bidirectional real-time event handling |
| Axios | Configurable HTTP API communication |

### Backend

| Technology | Purpose |
|---|---|
| Node.js + Express 5.x | Runtime environment and REST API framework |
| MongoDB + Mongoose | Flexible document database with schema validation |
| Socket.io | Event-based WebSocket message broadcasting |
| Google GenAI SDK | Advanced AI content generation |
| Groq SDK | High-performance AI inference integration |
| jsonwebtoken + bcrypt | Authentication and password security |

---

## 📁 Project Structure

```
SOEN/
├── backend/
│   ├── controllers/        # Request handlers for AI, Projects, and Users
│   ├── db/                 # MongoDB connection and pooling setup
│   ├── middleware/         # Express middlewares (auth, socketAuth)
│   ├── models/             # Mongoose schemas and data models
│   ├── routes/             # API route definitions and endpoint mapping
│   ├── services/           # Business logic and external AI integrations
│   ├── app.js              # Express application configuration
│   └── server.js           # HTTP server and Socket.io initialisation
│
└── frontend/
    ├── src/
    │   ├── api/            # Axios instances and API wrappers
    │   ├── assets/         # Static assets (images, fonts)
    │   ├── components/     # Reusable atomic UI components
    │   ├── context/        # React Context for localised state
    │   ├── routes/         # Application routing configuration
    │   ├── screens/        # Page-level views (Home, Login, Register)
    │   └── store/          # Redux slices and centralised store
    ├── index.html          # HTML entry point
    └── vite.config.js      # Vite bundler configuration
```

---

## 🚀 Getting Started

### Prerequisites

Ensure the following are installed on your machine before proceeding:

- [Node.js](https://nodejs.org/en/) v18 or higher
- [MongoDB](https://www.mongodb.com/) — local instance or an [Atlas](https://www.mongodb.com/cloud/atlas) URI

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/your-username/SOEN.git
cd SOEN
```

#### 2. Configure and Start the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following variables:

```env
# Server
PORT=3000

# Database
MONGO_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_super_secret_jwt_key

# CORS
FRONTEND_URL=http://localhost:5173

# AI Services (optional)
GROQ_API_KEY=your_groq_api_key
GENAI_API_KEY=your_google_genai_api_key
```

Start the backend development server:

```bash
npm run dev
```

#### 3. Configure and Start the Frontend

Open a new terminal session:

```bash
cd frontend
npm install
npm run dev
```

> **Optional:** Create a `.env` file in `frontend/` to override any Vite environment variables.

#### 4. Open the Application

Navigate to [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🧠 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                        CLIENT                           │
│        React + Redux + Socket.io Client + Axios         │
└──────────────────────┬──────────────────────────────────┘
                       │ HTTP (REST) / WebSocket
┌──────────────────────▼──────────────────────────────────┐
│                       SERVER                            │
│              Express.js + Socket.io                     │
│                                                         │
│  ┌─────────────┐  ┌───────────────┐  ┌──────────────┐  │
│  │   REST API  │  │  Socket.io    │  │  AI Service  │  │
│  │  (CRUD ops) │  │  (Real-time)  │  │ (Groq/GenAI) │  │
│  └──────┬──────┘  └───────┬───────┘  └──────┬───────┘  │
│         │                 │                  │          │
│  ┌──────▼─────────────────▼──────────────────▼───────┐  │
│  │                    MongoDB                        │  │
│  │           Users  |  Projects  |  Messages         │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### Key Design Decisions

- **REST + WebSockets:** REST handles authenticated CRUD operations; Socket.io manages real-time events in isolated `project:<id>` rooms.
- **Optimistic UI:** Frontend state updates immediately on user action, then reconciles on server acknowledgement — providing a native-app feel.
- **AI Abstraction Layer:** All AI logic is encapsulated in `ai.service.js` on the backend. API keys, prompt formatting, and SDK-specific handling never reach the client.
- **Socket Authentication:** A custom `socketAuth` middleware validates JWT tokens on every WebSocket connection, keeping real-time channels as secure as REST endpoints.

---

## 🤝 Contributing

Contributions are welcome. Please follow the steps below:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Commit your changes with a descriptive message: `git commit -m "feat: add your feature"`
4. Push to your fork: `git push origin feature/your-feature-name`
5. Open a Pull Request against `main`

Please ensure your code passes any existing linting rules and that new features include appropriate documentation.

---

## 📄 License

This project is licensed under the [ISC License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ using the MERN stack</sub>
</div>