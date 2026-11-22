# TeamUp — Project Collaboration Network

TeamUp is a full-stack platform built for students, developers, and builders to discover project ideas, assemble engineering teams with complementary skills, and ship software together.

---

## ⚡ Overview

Students and developers frequently have ambitious project ideas but lack teammates with complementary skill sets. TeamUp bridges this gap by providing an open discovery canvas where creators can publish project specifications, define exact technical competencies needed, and recruit teammates through structured collaboration requests.

---

## 🎨 Visual Design System

Built on a **Midnight + Electric Lime** design language inspired by modern developer products like Linear, Raycast, and Vercel:

- **Main Background:** `#101412`
- **Secondary Surfaces & Cards:** `#202923`
- **Elevated Surfaces:** `#34443A`
- **Primary Accent:** `#C5F467` (Electric Lime)
- **Primary Text:** `#F3F5EF`
- **Secondary Text:** `#A5ADA3`
- **Borders:** `#34443A` (subtle 1px precision borders)
- **Typography:** Manrope (Headings) & Inter (Body)

---

## ✨ Core Features

- **Project Discovery & Search:** Dynamic live search across project titles, descriptions, skills, and target roles with category filters.
- **Project Specifications:** Detailed project view highlighting required technical skills, open team roles, time commitment, and status.
- **Collaboration Workflow:** Structured "Request to Join" flow allowing developers to pitch their skills and experience directly to creators.
- **Project Publishing:** Interactive creation form with tag inputs for skills and roles, connected directly to MongoDB Atlas.
- **Responsive Architecture:** Crafted for optimal experience across desktop, tablet, and mobile viewports.

---

## 🛠️ Technology Stack

### Frontend
- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Typography:** Manrope & Inter (Google Fonts)

### Backend
- **Runtime:** Node.js
- **Server Framework:** Express.js
- **Database:** MongoDB Atlas (Mongoose ODM)
- **Environment Management:** dotenv
- **CORS:** Enabled for frontend integration

---

## 📁 Repository Structure

```text
teamup/
├── client/                     # Frontend application (React + Vite + TS)
│   ├── public/                 # Static assets & icons
│   ├── src/
│   │   ├── assets/             # Brand graphics & vectors
│   │   ├── pages/
│   │   │   ├── CreateProject.tsx   # Project publication form
│   │   │   ├── Explore.tsx         # Search & discovery directory
│   │   │   └── ProjectDetails.tsx  # Project specification & join modal
│   │   ├── services/
│   │   │   └── api.ts          # Axios API client & TypeScript interfaces
│   │   ├── App.css             # Midnight + Lime Design System stylesheet
│   │   ├── App.tsx             # Main routing & landing experience
│   │   ├── index.css           # Global typography & root variables
│   │   └── main.tsx            # React application entry point
│   ├── package.json
│   └── vite.config.ts
│
├── server/                     # Backend REST API (Node.js + Express)
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js           # MongoDB Atlas connection setup
│   │   ├── controllers/
│   │   │   └── projectController.js # CRUD & search logic
│   │   ├── models/
│   │   │   └── Project.js      # Mongoose Schema
│   │   ├── routes/
│   │   │   └── projectRoutes.js# REST endpoints
│   │   └── server.js           # Server bootstrap & health check
│   ├── .env.example            # Environment variables template
│   └── package.json
│
├── .gitignore                  # Root Git exclusions (keeps secrets safe)
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/)
- MongoDB Atlas account (or a local MongoDB instance)

---

### 1. Clone the Repository
```bash
git clone https://github.com/dilip-01-spec/teamup.git
cd teamup
```

---

### 2. Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` file using the example template:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your MongoDB connection string and preferred port:
   ```env
   PORT=5001
   MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/teamup
   JWT_SECRET=your_jwt_secret_key
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```
   *The API will start at `http://localhost:5001`.*

---

### 3. Frontend Setup
1. Open a new terminal and navigate to the client folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The application will be live at `http://localhost:5173`.*

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health status & database connection check |
| `GET` | `/api/projects` | Fetch all projects (supports query params: `search`, `category`, `skill`, `status`) |
| `GET` | `/api/projects/:id` | Fetch detailed specification for a single project |
| `POST` | `/api/projects` | Create and publish a new project |
| `PUT` | `/api/projects/:id` | Update project details |
| `DELETE` | `/api/projects/:id` | Delete a project |

---

## 🔒 Security Best Practices

- Environment secrets (`.env`) and database credentials are excluded from source control.
- Sample environment variables are documented in `server/.env.example`.
- Production build validation (`tsc -b && vite build`) ensures strict type safety.

---

## 📄 License

This project is licensed under the ISC License.
