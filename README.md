# FreshCheck - Hotel Food Quality Monitoring System

FreshCheck is a comprehensive, full-stack application designed to streamline food quality inspections in hotels. It empowers Inspectors, Kitchen Managers, and Hotel Management to maintain high standards through digital reporting, real-time analytics, and AI-powered insights.

## ✨ Key Features

- **Role-Based Access Control (RBAC)**: secure portals for Admins, Inspectors, Kitchen Managers, and Hotel Management.
- **AI-Powered Summaries**:
  - Integrates with **Google Gemini AI** to automatically analyze inspection reports.
  - Generates concise summaries and "Good/Average/Poor" evaluations based on report data.
  - Graceful fallback to mock logic if AI service is unavailable.
- **Digital Inspection Forms**: Dynamic forms created by admins, filled by inspectors.
- **Advanced Reporting**:
  - Paginated and searchable report listings.
  - Detailed view panels with AI insights.
  - Approval/Rejection workflows for Admins.
- **User Management**: Full CRUD capabilities for managing system users with search and pagination.
- **Modern UI/UX**: Built with Next.js, Tailwind CSS, and Shadcn UI for a premium, responsive experience.

## 🛠️ Technology Stack

### Backend

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MySQL (via Prisma ORM)
- **Language**: TypeScript
- **AI Service**: Google Generative AI (Gemini)

### Frontend

- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Components**: Shadcn UI
- **Language**: TypeScript
- **State Management**: React Hooks

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MySQL Server
- Google Gemini API Key (Optional, for real AI features)

### 1. Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment Variables:
    - Create a `.env` file in the `backend` folder.
    - Add the following variables:
      ```env
      DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/freshcheck"
      JWT_SECRET="your_jwt_secret_key"
      PORT=3001
      GEMINI_API_KEY="your_google_gemini_api_key" # Optional
      ```
4.  Run Database Migrations & Seed:
    ```bash
    npx prisma migrate dev --name init
    npm run seed
    ```
5.  Start the Development Server:
    ```bash
    npm run dev
    ```

### 2. Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Development Server:
    ```bash
    npm run dev
    ```
4.  Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🤖 AI Integration Logic

The system uses `gemini-2.5-flash` to process inspection notes.

- **Trigger**: Occurs automatically when an inspector submits a report.
- **Output**: A concise summary and a text-based evaluation stored in the `aiSummary` field.
- **Fallback**: If `GEMINI_API_KEY` is missing or the external API is down, the system falls back to a deterministic mock summary to ensure the app never crashes.

## 👤 Default Credentials (from Seed)

- **Admin**: `admin@freshcheck.com` / `admin123`
- **Inspector**: `inspector@freshcheck.com` / `inspector123`
- **Kitchen Manager**: `kitchen@freshcheck.com` / `manager123`
- **Hotel Management**: `management@freshcheck.com` / `management123`

---

_Built for the Google Deepmind Advanced Agentic Coding Challenge._
