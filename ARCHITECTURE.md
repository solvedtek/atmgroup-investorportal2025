# Architecture Design: Investor Portal (Server-Side Export Focus)

## 1. Overview

This document outlines the architecture for the ATMG Investor Portal, focusing on the revised approach for data export functionality, which will now be handled server-side. The portal provides investors with access to property information, financial data, and reporting tools.

## 2. Goals

*   **Secure Data Access:** Ensure only authenticated investors can access relevant data.
*   **Scalability:** Design the system to handle a growing number of users and properties.
*   **Maintainability:** Use clear separation of concerns and modular design.
*   **Reliable Data Export:** Implement robust server-side generation and delivery of data exports (CSV, PDF).
*   **User Experience:** Provide an intuitive interface for viewing data and initiating exports.

## 3. Technology Stack

*   **Frontend:** React (Vite), Tailwind CSS
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB (using Mongoose ODM)
*   **Authentication:** JWT (JSON Web Tokens)
*   **Server-Side Export Libraries:**
    *   CSV: `fast-csv` or similar
    *   PDF: `pdfkit` or `puppeteer` (for more complex layouts)
*   **Deployment:** (To be determined - e.g., Docker, AWS, Heroku)

## 4. Architecture Diagram (Conceptual)

```
+-----------------+      +-----------------+      +-----------------+
|  React Frontend |----->|   Node/Express  |----->|    MongoDB      |
| (UI, Views)     |<-----|   API (JWT Auth)|<-----| (Data Storage)  |
+-----------------+      +-----------------+      +-----------------+
        |                      |
        | User Action          | API Request (e.g., /api/export/csv)
        | (Request Export)     |
        |                      v
        |                +------------------------+
        |                | Server-Side Export Job |
        |                | (Generate CSV/PDF)     |
        |                +------------------------+
        |                      |
        |                      | File Ready Notification / Download Link
        |                      v
        +<---------------------+
```

## 5. Core Components

*   **Frontend Application:**
    *   Handles user interface, routing, and state management.
    *   Makes API calls to the backend for data and to initiate export processes.
    *   Displays data visualizations.
    *   Provides UI elements to trigger exports and potentially show progress/completion status.
    *   Receives download links or notifications when exports are ready.
*   **Backend API:**
    *   Handles authentication and authorization (JWT).
    *   Provides RESTful endpoints for CRUD operations on properties and user data.
    *   **New:** Includes endpoints specifically for initiating data export requests (e.g., `/api/export/csv`, `/api/export/pdf`).
    *   Contains business logic for data retrieval and processing.
*   **Database:**
    *   Stores user credentials, property details, financial data, etc.
*   **Server-Side Export Module:**
    *   **Triggered by API:** Receives export requests from the API layer.
    *   **Data Fetching:** Queries the database for the required data based on the user's request (e.g., specific date ranges, properties).
    *   **File Generation:** Uses libraries (`fast-csv`, `pdfkit`/`puppeteer`) to format the fetched data into the desired file type (CSV, PDF). This might involve data transformation or aggregation.
    *   **Storage (Temporary):** Stores the generated file temporarily (e.g., server filesystem, cloud storage like S3).
    *   **Notification/Delivery:**
        *   Option A: Returns a direct download link to the frontend once generation is complete (suitable for smaller, quicker exports).
        *   Option B: Stores the file and notifies the user (e.g., via WebSocket, email, or an in-app notification) with a link when it's ready (better for larger, time-consuming exports). The link should ideally be secure and time-limited.

## 6. Data Flow: Server-Side Export

1.  **User Action:** Investor clicks "Export as CSV" or "Export as PDF" in the frontend UI, potentially specifying filters (date range, properties).
2.  **API Request:** Frontend sends a request to the backend API (e.g., `POST /api/export/csv`) including authentication token and any filter parameters.
3.  **Authentication & Authorization:** Backend verifies the JWT token and checks if the user has permission to export the requested data.
4.  **Initiate Export Job:** The API endpoint triggers the Server-Side Export Module, passing necessary parameters.
5.  **Data Retrieval:** The Export Module queries MongoDB for the relevant data.
6.  **File Generation:** The module uses appropriate libraries to generate the CSV or PDF file from the retrieved data.
7.  **File Storage (Temporary):** The generated file is saved to a temporary location.
8.  **Response/Notification:**
    *   *Synchronous (Small files):* The API might wait for generation and return a direct download response or a URL to the file.
    *   *Asynchronous (Large files):* The API immediately returns a "Job Accepted" response (e.g., `202 Accepted`). The Export Module, upon completion, notifies the frontend (e.g., WebSocket push, updates a status endpoint the frontend polls) with a secure download link.
9.  **Download:** Frontend presents the download link or initiates the download automatically.
10. **Cleanup:** A background process should clean up old temporary export files.

## 7. Security Considerations

*   **Authentication:** Secure JWT implementation with appropriate expiration and refresh mechanisms.
*   **Authorization:** Ensure users can only access and export data they are permitted to see. Check permissions *before* initiating the export job.
*   **Input Validation:** Sanitize all inputs from the frontend (filters, parameters) to prevent injection attacks.
*   **Secure File Links:** If generating download links, ensure they are secure (e.g., signed URLs, short-lived) and not guessable.
*   **Rate Limiting:** Implement rate limiting on export endpoints to prevent abuse.
*   **Resource Management:** Monitor resource usage during file generation to prevent DoS scenarios. Handle large datasets efficiently (streaming if possible).
*   **Temporary File Security:** Ensure temporary storage location is secure and files are cleaned up promptly.

## 8. Scalability & Performance

*   **Asynchronous Exports:** Use asynchronous processing for large exports to avoid blocking API requests and improve user experience. Consider background job queues (e.g., BullMQ, Celery if using Python).
*   **Database Indexing:** Ensure proper indexing on MongoDB collections for efficient data retrieval.
*   **Efficient File Generation:** Optimize file generation logic. Use streaming APIs where possible for large datasets.
*   **Load Balancing:** If deployed in a multi-instance environment, ensure export jobs are handled appropriately (sticky sessions might be needed if storing files locally, or use shared storage like S3).

## 9. Comprehensive Development Checklist

**Phase 1: Foundation & Setup (Largely Complete)**

*   **General:**
    *   [x] Project Setup (Backend: Node/Express, Frontend: React/Vite)
    *   [x] Directory Structure Initialization
    *   [x] Version Control Setup (Git)
    *   [x] Basic Dependency Installation (Express, Mongoose, React, Vite, etc.)
    *   [x] Environment Variable Setup (`.env`)
    *   [x] Basic Linting/Formatting Configuration (ESLint, Prettier)
    *   [x] CI/CD Pipeline Setup (Basic)
*   **Backend:**
    *   [x] Database Connection Setup (MongoDB/Mongoose)
    *   [x] Basic Server Setup (Express app)
    *   [x] Core User Model (`models/User.js`)
    *   [x] Core Property Model (`models/Property.js`)
    *   [x] Basic Authentication Routes (`routes/auth.js` - placeholders/initial structure)
    *   [x] Basic Property Routes (`routes/properties.js` - placeholders/initial structure)
    *   [x] Global Error Handling Middleware
    *   [x] Request Logging Middleware
*   **Frontend:**
    *   [x] Basic React App Setup (`src/App.jsx`, `src/main.jsx`)
    *   [x] Basic Routing Setup (e.g., React Router)
    *   [x] Tailwind CSS Integration
    *   [x] Basic Component Structure (`components/`)
    *   [x] API Service Layer Setup (e.g., `services/api.js` for Axios/fetch)
    *   [x] Global State Management Setup (e.g., Context API, Redux)

**Phase 2: Core Feature Implementation**

*   **Authentication & Authorization:**
    *   **Backend:**
        *   [ ] User Registration Logic (Password Hashing)
        *   [ ] User Login Logic (JWT Generation)
        *   [ ] JWT Verification Middleware
        *   [ ] Password Reset Functionality (Token generation, email sending - requires mail service setup)
        *   [ ] Role-Based Access Control (RBAC) - Define roles (Investor, Admin?)
        *   [ ] Secure Authentication Endpoints (`/api/auth/register`, `/api/auth/login`, etc.)
        *   [ ] Unit/Integration Tests for Auth
    *   **Frontend:**
        *   [ ] Login Page/Form
        *   [ ] Registration Page/Form
        *   [ ] Handle JWT storage (localStorage/sessionStorage) and Axios interceptors
        *   [ ] Protected Routes Implementation
        *   [ ] Logout Functionality
        *   [ ] Password Reset Request Form
        *   [ ] Password Reset Confirmation Form
        *   [ ] Display Auth-related Error Messages
*   **User Profile Management:**
    *   **Backend:**
        *   [ ] API Endpoint to Get User Profile
        *   [ ] API Endpoint to Update User Profile (e.g., name, contact info, password change)
        *   [ ] Authorization checks for profile access/update
        *   [ ] Unit/Integration Tests for Profile
    *   **Frontend:**
        *   [ ] User Profile Display Page
        *   [ ] User Profile Edit Form
        *   [ ] Password Change Form within Profile
*   **Property Management:**
    *   **Backend:**
        *   [ ] API Endpoint to List Properties (with filtering/pagination based on user access)
        *   [ ] API Endpoint to Get Single Property Details
        *   [ ] (Admin Only?) API Endpoints for CRUD operations on Properties
        *   [ ] Data validation for property creation/update
        *   [ ] Authorization checks for property access
        *   [ ] Unit/Integration Tests for Properties
    *   **Frontend:**
        *   [ ] Property List View/Dashboard
        *   [ ] Property Detail View
        *   [ ] Filtering/Sorting/Pagination controls for Property List
        *   [ ] (Admin Only?) UI for Property CRUD operations
*   **Financial Data Display:**
    *   **Backend:**
        *   [ ] Define Financial Data Models (e.g., Transactions, Summaries - linked to Properties/Users)
        *   [ ] API Endpoints to Fetch Financial Data (e.g., per property, portfolio summary, date ranges)
        *   [ ] Logic for calculating summaries/aggregations
        *   [ ] Authorization checks for financial data access
        *   [ ] Unit/Integration Tests for Financials
    *   **Frontend:**
        *   [ ] Display Financial Summaries (e.g., on Dashboard, Property Detail)
        *   [ ] Display Transaction History/Ledgers
        *   [ ] Basic Charts/Visualizations for Financial Data (requires charting library)
        *   [ ] Date Range Filters for Financial Views
*   **Document Management:**
    *   **Backend:**
        *   [ ] Define Document Model (linked to Properties/Users)
        *   [ ] File Storage Strategy (e.g., S3, local disk - configure)
        *   [ ] API Endpoint for Uploading Documents
        *   [ ] API Endpoint for Listing Documents (per property/user)
        *   [ ] API Endpoint for Downloading Documents (secure access)
        *   [ ] API Endpoint for Deleting Documents
        *   [ ] Authorization checks for document access/management
        *   [ ] Unit/Integration Tests for Documents
    *   **Frontend:**
        *   [ ] UI for Uploading Documents
        *   [ ] UI for Listing/Viewing Documents (e.g., in Property Detail)
        *   [ ] UI for Downloading/Deleting Documents

**Phase 3: Reporting, Advanced Features & Polish**

*   **Reporting & Data Export (Server-Side):**
    *   **Backend:**
        *   [ ] API Endpoints: Create `/api/export/csv` and `/api/export/pdf` endpoints.
        *   [ ] Authentication Middleware: Secure export endpoints with JWT middleware.
        *   [ ] Authorization Logic: Implement checks to ensure users request valid data they own/can access.
        *   [ ] Input Validation: Validate filter parameters (dates, property IDs, etc.).
        *   [ ] Data Fetching Logic: Implement database queries for export data (financials, property lists).
        *   [ ] CSV Generation: Integrate `fast-csv` or similar; implement formatting.
        *   [ ] PDF Generation: Integrate `pdfkit` or `puppeteer`; design PDF layout (e.g., property summaries, financial reports).
        *   [ ] Export Job Management:
            *   [ ] Choose sync vs. async approach based on expected data size.
            *   [ ] (If Async) Implement job queue or background process (e.g., BullMQ).
            *   [ ] (If Async) Implement notification mechanism (WebSockets, polling endpoint, email).
        *   [ ] Temporary File Storage: Configure temporary storage location (filesystem or cloud).
        *   [ ] Secure Link Generation: (If applicable) Implement secure, time-limited URL generation.
        *   [ ] Cleanup Mechanism: Implement logic to delete old temporary files.
        *   [ ] Error Handling: Robust error handling for database, file generation, etc.
        *   [ ] Logging: Log export requests, errors, and completion status.
        *   [ ] Rate Limiting: Implement rate limiting on export endpoints.
        *   [ ] Unit/Integration Tests: Test export logic thoroughly.
        *   [x] Dependency Installation: Add necessary CSV/PDF libraries to `package.json`. (Assuming this was done based on old checklist)
        *   [x] Configuration: Manage temporary storage paths, potential API keys via environment variables. (Assuming this was done)
        *   [ ] Documentation: Update API documentation for new endpoints. (Marking as TODO as it should reflect final implementation)
    *   **Frontend:**
        *   [ ] UI Elements: Add "Export CSV/PDF" buttons/options in relevant sections (e.g., Financials, Property List).
        *   [ ] API Calls: Implement fetch/axios calls to the new export endpoints.
        *   [ ] Parameter Handling: Send filter parameters correctly.
        *   [ ] Handle Responses:
            *   [ ] Process direct download responses.
            *   [ ] (If Async) Display "Export in progress..." message/status indicator.
            *   [ ] (If Async) Handle notifications/poll status endpoint.
            *   [ ] Present download links or trigger downloads.
        *   [ ] Error Handling: Display user-friendly error messages from the API.
*   **Demo Mode:**
    *   **Backend:**
        *   [ ] Strategy for Demo Data (separate DB, flagged data, in-memory?)
        *   [ ] Logic to serve demo data via existing endpoints based on user/mode.
        *   [ ] Prevent write operations in Demo Mode.
    *   **Frontend:**
        *   [ ] Entry point/toggle for Demo Mode.
        *   [ ] Visual indicator that Demo Mode is active.
*   **UI/UX Polish:**
    *   [ ] Consistent Styling and Theming
    *   [ ] Responsive Design Checks
    *   [ ] Loading States and Skeletons
    *   [ ] User Feedback Mechanisms (Toasts, Notifications)
    *   [ ] Accessibility Review (WCAG compliance)
*   **Testing:**
    *   [ ] Increase Unit Test Coverage (Backend & Frontend)
    *   [ ] Implement End-to-End (E2E) Tests (e.g., Cypress, Playwright)
*   **Deployment:**
    *   [ ] Finalize Deployment Strategy (Docker, Cloud Provider)
    *   [ ] Production Build Configuration (Frontend & Backend)
    *   [ ] Database Migration Strategy (if needed)
    *   [ ] Setup Monitoring and Logging for Production