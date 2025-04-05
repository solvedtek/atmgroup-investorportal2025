# ATMG Investor Portal: Architecture & Development Plan

This document outlines the proposed architecture and development plan for the ATMG Investor Portal, based on the requirements detailed in the 'Design & Functionality Concept' and 'UI and UX Analysis' documents.

## 1. Guiding Principles

*   **User-Centric:** Prioritize intuitive navigation, clear data presentation, and personalized experiences.
*   **Data-Driven:** Ensure accurate, real-time (or near real-time) data display and robust reporting capabilities.
*   **Secure:** Implement industry-standard security practices for authentication, authorization, and data protection. **No hardcoded secrets.**
*   **Scalable:** Design the system to handle potential growth in users, data volume, and feature complexity.
*   **Modular:** Build components and services independently for better maintainability and testability.
*   **Mobile-First:** Ensure a responsive and seamless experience across all device sizes.

## 2. Demo Mode

### 2.1 Concept

A "Demo Mode" will be implemented to allow prospective users or visitors to explore the Investor Portal's user interface and features using realistic, pre-populated dummy data without needing to register or log in. This provides a frictionless way to showcase the platform's capabilities.

### 2.2 Access

Users will access Demo Mode via a dedicated link or button prominently displayed on the login/landing page (e.g., "Try Demo" or "Explore without Signup"). This will redirect the user to a specific route (e.g., `/demo`) within the application, initializing the demo session.

### 2.3 Dummy Data Strategy

To provide a realistic experience, the Demo Mode will rely on dummy data that mirrors the structure of real user data. Several strategies exist:

*   **Frontend Mock Data:** Embedding static JSON data directly within the frontend code. Simple for basic demos but harder to maintain and less realistic for dynamic features.
*   **Database Seeding:** Creating a dedicated "demo" user account in the database and populating it with sample data via scripts. Requires careful separation to avoid mixing demo and real data, and potential cleanup.
*   **Dedicated Demo API Endpoints (Recommended):** Creating specific backend API endpoints (e.g., `/api/v1/demo/dashboard`, `/api/v1/demo/properties`) that return static or dynamically generated dummy data.

**Recommendation:** We recommend using **Dedicated Demo API Endpoints**. This approach keeps the frontend focused on presentation, isolates demo data from the production database, and allows the backend to serve consistent, structured dummy data that closely mimics the real API responses. The dummy data can be stored as static JSON files on the backend or generated on-the-fly.

## 3. High-Level Architecture

```mermaid
graph TD
    A[User Browser (React Frontend)] --> B{Backend API (Node.js/Express)};
    B --> C[(MongoDB Database)];
    B --> D[External Services (e.g., Market Data API)];
    A --> E{Authentication Service};
    E --> B;
    A --> F[/api/v1/demo/...];
    F --> B;
```

*   **Frontend:** Single Page Application (SPA) built with React. Handles UI rendering, user interactions, and client-side state. Can operate in normal or demo mode.
*   **Backend API:** RESTful API built with Node.js and Express. Handles business logic, data processing, database interactions, authentication, and serving demo data.
*   **Database:** MongoDB (NoSQL) stores real user data, property information, financial records, etc. Demo data is served separately by the API.
*   **External Services:** Potential integration with third-party APIs for market data, mapping, etc. (Likely not used in Demo Mode).

## 4. Frontend Architecture (React)

*   **Technology Stack:** React, Vite, Tailwind CSS, Chart.js, React-Chartjs-2, Leaflet, React-Leaflet, xlsx, pdf-lib, ESLint.
*   **Component Structure:** Organize components by feature (e.g., `Dashboard`, `Properties`, `Financials`, `Auth`) and reuse common UI elements (`components/common`).
*   **State Management:** Utilize React Context API for global state (e.g., user authentication, demo mode status) and component-level state (`useState`, `useReducer`) for local UI state. Consider Zustand or Redux Toolkit if complexity grows significantly.
*   **Routing:** Use `react-router-dom` for client-side navigation, including a dedicated route for demo mode (e.g., `/demo`).
*   **Demo Mode Integration:** Implement conditional logic to detect demo mode (e.g., based on route or a global state flag). Fetch data from dedicated demo API endpoints when in demo mode. Ensure UI elements related to user-specific actions (e.g., settings, adding data, logout) are disabled or hidden.
*   **Key Modules:**
    *   `Auth`: Login, registration, password recovery flows, "Try Demo" link.
    *   `Dashboard`: Overview of portfolio, key metrics, alerts (fetches real or demo data).
    *   `Properties`: List view, detail view (map, financials, documents), search/filter (fetches real or demo data).
    *   `Financials`: Performance charts, transaction history, income/expense tracking (fetches real or demo data).
    *   `Reporting`: Generate and download PDF/CSV/Excel reports (likely disabled in Demo Mode).
    *   `Settings`: User profile management, notification preferences (disabled in Demo Mode).

## 5. Backend Architecture (Node.js/Express)

*   **Technology Stack:** Node.js, Express, Mongoose, JWT (JSON Web Tokens) for authentication, bcrypt for password hashing.
*   **Structure:** Adopt an MVC-like pattern (Models, Controllers/Routes, Services).
    *   `config/`: Environment variables (using `dotenv`), database connection.
    *   `models/`: Mongoose schemas defining data structures (for real data).
    *   `routes/`: Define API endpoints (`/api/v1/auth`, `/api/v1/users`, etc., and `/api/v1/demo`) and link to controllers.
    *   `controllers/`: Handle request/response logic, call services (for real data) or return dummy data (for demo).
    *   `services/`: Encapsulate business logic (for real data).
    *   `middleware/`: Authentication checks (for protected routes), error handling, request validation.
    *   `utils/`: Helper functions, potentially dummy data generation/loading logic.
*   **API Design:** RESTful principles, clear versioning (e.g., `/api/v1/...`). Demo endpoints grouped under `/api/v1/demo/`.
*   **Security:**
    *   JWT-based stateless authentication for protected routes. Demo routes are public.
    *   Password hashing (bcrypt).
    *   Input validation (e.g., using `express-validator`) for authenticated routes.
    *   Rate limiting (apply to demo routes as well to prevent abuse).
    *   HTTPS enforcement.
    *   Environment variables for sensitive data (DB connection strings, JWT secrets) - **NO hardcoding**.
*   **Key Modules:**
    *   `Auth`: User registration, login, token generation/validation.
    *   `Users`: User profile management.
    *   `Properties`: CRUD operations for property data.
    *   `Financials`: Manage financial records, calculate metrics.
    *   `Reports`: Generate report data based on user criteria.
    *   `Demo`: Endpoints under `/api/v1/demo/` serving pre-defined or generated dummy data for properties, financials, dashboard summaries, etc., mimicking the structure of real data endpoints. These endpoints will not require authentication.

## 6. Database Schema (MongoDB - Conceptual)

*This schema represents real user data. Demo mode uses separate, non-persistent data served by the API.*

*   **`users`:** `userId`, `name`, `email`, `passwordHash`, `role`, `preferences`, `createdAt`, `updatedAt`.
*   **`properties`:** `propertyId`, `address`, `purchasePrice`, `currentValue`, `status`, `documents` (array of file refs), `ownerUserId`, `financialData` (embedded or ref), `location` (GeoJSON).
*   **`financialRecords`:** `recordId`, `propertyId`, `userId`, `type` (income/expense), `category`, `amount`, `date`, `description`.
*   **`reports`:** `reportId`, `userId`, `type`, `criteria`, `generatedAt`, `fileRef`.
*   **`alerts`:** `alertId`, `userId`, `type`, `message`, `triggeredAt`, `readStatus`.
*   **`goals`:** `goalId`, `userId`, `description`, `targetValue`, `currentValue`, `deadline`.

## 7. Data Flow Examples

*   **User Login:** (Unchanged)
    1.  Frontend sends email/password to `/api/v1/auth/login`.
    2.  Backend validates credentials, hashes password, compares with stored hash.
    3.  If valid, Backend generates JWT containing `userId` and `role`.
    4.  Backend sends JWT back to Frontend.
    5.  Frontend stores JWT (e.g., localStorage) and includes it in subsequent API request headers.
*   **Dashboard Data (Authenticated User):** (Unchanged)
    1.  Frontend (on Dashboard load) sends GET request to `/api/v1/dashboard` (with JWT).
    2.  Backend middleware verifies JWT.
    3.  Backend controller fetches relevant data (user properties, summary financials, alerts) from services.
    4.  Services query MongoDB via Mongoose models.
    5.  Backend aggregates data and sends JSON response to Frontend.
    6.  Frontend parses response and updates UI components (charts, lists, etc.).
*   **Dashboard Data (Demo Mode):**
    1.  Frontend (on navigating to `/demo/dashboard` or similar) detects demo mode.
    2.  Frontend sends GET request to `/api/v1/demo/dashboard` (no JWT needed).
    3.  Backend demo controller retrieves/generates dummy dashboard data.
    4.  Backend sends JSON response containing dummy data to Frontend.
    5.  Frontend parses response and updates UI components.

## 8. Deployment Considerations

*   **Hosting:** Cloud platforms (AWS, Azure, Google Cloud, Vercel for frontend, Heroku/Render for backend).
*   **Database:** Managed MongoDB service (e.g., MongoDB Atlas) for production data.
*   **CI/CD:** Implement pipelines (e.g., GitHub Actions, GitLab CI) for automated testing, building, and deployment.
*   **Environment Management:** Separate configurations for development, staging, and production. Ensure demo endpoints are available in all environments but serve appropriate data.
*   **Dummy Data Management:** Store static dummy JSON files within the backend repository or implement a simple generation script.

## 9. Development Task Checklist

**Phase 1: Foundation & Setup**

*   [ ] Initialize Frontend (React/Vite) project structure.
*   [ ] Initialize Backend (Node.js/Express) project structure.
*   [ ] Setup `dotenv` for environment variable management (Backend).
*   [ ] Establish MongoDB connection (Backend).
*   [ ] Configure Tailwind CSS (Frontend).
*   [ ] Setup ESLint/Prettier for code consistency (Both).
*   [ ] Implement basic CI pipeline (e.g., linting checks).
*   [ ] Define core Mongoose Models (`users`, `properties`).
*   [ ] Setup basic routing (Frontend & Backend).

**Phase 2: Authentication & Core User Features**

*   [ ] Implement User Registration (Backend API & Frontend UI).
*   [ ] Implement User Login (Backend API & Frontend UI).
*   [ ] Implement JWT generation and validation (Backend).
*   [ ] Implement request authentication middleware (Backend).
*   [ ] Secure frontend routes based on auth state.
*   [ ] Implement User Profile view/edit (Backend API & Frontend UI).
*   [ ] Implement Password Hashing (Backend).
*   [ ] Implement basic error handling middleware (Backend).

**Phase 3: Property Management**

*   [ ] Implement Property Model (Backend).
*   [ ] Implement CRUD API endpoints for Properties (Backend).
*   [ ] Implement Property List view (Frontend).
*   [ ] Implement Property Detail view (Frontend).
*   [ ] Implement Property Search/Filtering (Frontend & Backend API).
*   [ ] Integrate Leaflet map for property location display (Frontend).

**Phase 4: Financials & Charting**

*   [ ] Implement Financial Record Model (Backend).
*   [ ] Implement API endpoints for adding/viewing financial records (Backend).
*   [ ] Implement UI for adding income/expenses (Frontend).
*   [ ] Implement Financial Summary/Dashboard view (Frontend).
*   [ ] Integrate Chart.js for displaying financial trends (Frontend).
*   [ ] Develop backend logic for calculating key financial metrics.

**Phase 5: Reporting & Export**

*   [ ] Implement Report Generation logic (Backend).
*   [ ] Implement API endpoint for triggering report generation (Backend).
*   [ ] Integrate `xlsx` (SheetJS) for CSV/Excel export (Backend/Frontend).
*   [ ] Integrate `pdf-lib` for PDF export (Backend/Frontend).
*   [ ] Implement UI for selecting report criteria and downloading (Frontend).

**Phase 6: Demo Mode Implementation**

*   [ ] Design structure for dummy data (properties, financials, user profile).
*   [ ] Create static JSON files or generation logic for dummy data (Backend).
*   [ ] Implement dedicated Demo API endpoints (`/api/v1/demo/...`) to serve dummy data (Backend).
*   [ ] Add "Try Demo" button/link to the Login/Landing page (Frontend).
*   [ ] Implement routing for Demo Mode (e.g., `/demo`) (Frontend).
*   [ ] Implement logic to detect Demo Mode in the frontend application state (e.g., global context/store).
*   [ ] Modify frontend components (Dashboard, Properties, Financials) to fetch data from demo endpoints when in Demo Mode.
*   [ ] Disable/hide user-specific actions (e.g., Settings, Add Property, Logout) in Demo Mode (Frontend).

**Phase 7: Advanced Features & Refinement**

*   [ ] Implement Goal Setting feature (Models, API, UI).
*   [ ] Implement Alert System (Models, API, UI).
*   [ ] Implement Document Upload/Management for properties (requires storage solution).
*   [ ] Refine UI/UX based on initial feedback.
*   [ ] Add comprehensive unit and integration tests.
*   [ ] Perform security audit.
*   [ ] Optimize database queries and API performance.

**Phase 8: Deployment**

*   [ ] Configure production environment variables.
*   [ ] Setup hosting for Frontend and Backend.
*   [ ] Setup managed database instance.
*   [ ] Configure domain names and HTTPS.
*   [ ] Finalize CI/CD pipeline for production deployment.
*   [ ] Perform load testing (optional).
*   [ ] Monitor application post-launch.