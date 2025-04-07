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

*   **Asynchronous Exports:** Use asynchronous processing for large exports to avoid blocking API requests and improve user experience. Consider background job queues (e.g., BullMQ).
*   **Database Indexing:** Ensure proper indexing on MongoDB collections for efficient data retrieval.
*   **Efficient File Generation:** Optimize file generation logic. Use streaming APIs where possible for large datasets.
*   **Load Balancing:** If deployed in a multi-instance environment, ensure export jobs are handled appropriately (sticky sessions might be needed if storing files locally, or use shared storage like S3).

## 9. Comprehensive Development Checklist

### Security
- [x] Implement password hashing with bcrypt and sufficient salt rounds
- [x] Enforce strict input validation and sanitization on all endpoints
- [x] Enforce JWT authentication and RBAC on sensitive routes
- [ ] Implement refresh token flow and secure token storage
- [ ] Regularly perform security audits and penetration testing
- [x] Apply rate limiting and brute-force protection
- [x] Apply secure HTTP headers with Helmet
- [x] Secure export download links (signed, short-lived URLs)
- [x] Implement cleanup of expired export files

### Backend
- [x] Refactor to controller-service-repository pattern
- [x] Modularize export logic with async job queues (BullMQ)
- [x] Incrementally adopt TypeScript
- [x] Centralize error handling with consistent formats and logging
- [ ] Implement export notifications (WebSocket, email, polling)
- [ ] Complete service/repository extraction for export logic

### Frontend
- [x] Implement export initiation UI with async job status
- [ ] Integrate real user data and JWT handling
- [ ] Enforce RBAC in UI components
- [ ] Improve accessibility (ARIA live regions, focus management)
- [ ] Integrate live data into visualizations
- [ ] Enhance error handling and user feedback

### DevOps & Deployment
- [ ] Establish CI/CD pipelines for linting, testing, build, deploy
- [x] Containerize backend and frontend with Docker
- [ ] Use Infrastructure as Code (Terraform)
- [ ] Integrate monitoring (Sentry, Prometheus, Grafana)
- [ ] Use cloud secrets management
- [ ] Plan scalable, orchestrated deployment (Kubernetes, ECS)

### Testing
- [ ] Adopt TDD with Jest, React Testing Library, Supertest, Cypress
- [ ] Achieve >90% test coverage
- [ ] Use mocks/stubs for isolation

### Documentation & Developer Experience
- [x] Maintain comprehensive API docs (OpenAPI/Swagger)
- [ ] Expand Storybook UI documentation
- [ ] Provide onboarding and contribution guides
- [x] Provide `.env.example` files with instructions
- [ ] Automate linting, formatting, and testing in CI

---

# Progress Log (Q2 2025)
- ✅ Implemented password hashing in User model with bcrypt
- ✅ Added input validation and sanitization to auth routes using express-validator
- ✅ Integrated Helmet middleware for secure HTTP headers
- ✅ Applied global rate limiting middleware
- ✅ Refactored auth routes to use dedicated controller (controller-service pattern initiated)
- ✅ Incremental TypeScript adoption started
- ✅ Auth controller migrated to TypeScript
- ✅ Removed obsolete JavaScript auth controller
- ✅ Extended input validation to property routes
- ✅ Enhanced centralized error handling middleware
- ✅ Enforced JWT authentication and RBAC on export and property routes
- ✅ Created JWT + RBAC middleware
- ✅ Modularized export logic into dedicated controller
- ✅ Added input validation and sanitization to export initiation endpoint
- ✅ Implemented automated cleanup script for expired export files

---

# 10. Planned Enhancements & Refinements (Q2 2025)

### Security Hardening
- Implement password hashing with bcrypt and sufficient salt rounds. **(Done)**
- Enforce strict input validation using libraries like express-validator or Joi. **(Partially done for auth, done for export initiation)**
- Add rate limiting and brute-force protection. **(Done)**
- Apply secure HTTP headers with Helmet. **(Done)**
- Enforce JWT authentication and RBAC on all sensitive routes. **(Done)**
- Regularly perform security audits and penetration testing.

### Backend Architecture
- Complete refactor to a controller-service-repository pattern. **(Controller extraction done for export, service/repo layers planned)**
- Incrementally adopt TypeScript for type safety.
- Centralize error handling with consistent formats and logging.
- Modularize export logic with async job queues (BullMQ). **(Controller modularization done, service/repo layers planned)**

### Testing Excellence
- Adopt TDD with Jest, React Testing Library, Supertest, Cypress.
- Achieve >90% test coverage.
- Use mocks/stubs for isolation.

### Frontend Refinement
- Implement advanced data visualization with Chart.js, D3.js, Leaflet.
- Ensure accessibility (WCAG 2.1 compliance).
- Optimize performance with lazy loading, code splitting.
- Consider Redux Toolkit or Zustand for complex state.

### DevOps & Automation
- Establish CI/CD pipelines for linting, testing, deployment.
- Containerize with Docker.
- Use Infrastructure as Code (Terraform).
- Integrate monitoring (Sentry, Prometheus, Grafana).

### Documentation & Developer Experience
- Maintain comprehensive API docs (Swagger/OpenAPI).
- Use Storybook for UI components.
- Provide onboarding guides and `.env.example` files.

### Dependency Management
- Avoid beta dependencies in production.
- Regularly audit and update packages.
- Remove unused packages.

### Architecture Enhancements
- Use async processing and job queues for exports.
- Prepare for microservices extraction.
- Implement API versioning.

---

This section outlines the roadmap to elevate the ATMG Investor Portal to an exceptional, A+ standard, ensuring outstanding quality, clarity, security, and scalability.