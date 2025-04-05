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

## 9. Development Checklist (Server-Side Export Focus)

**Backend:**

*   [ ] **API Endpoints:** Create `/api/export/csv` and `/api/export/pdf` endpoints.
*   [ ] **Authentication Middleware:** Secure export endpoints with JWT middleware.
*   [ ] **Authorization Logic:** Implement checks to ensure users request valid data.
*   [ ] **Input Validation:** Validate filter parameters (dates, property IDs, etc.).
*   [ ] **Data Fetching Logic:** Implement database queries for export data.
*   [ ] **CSV Generation:** Integrate `fast-csv` or similar; implement formatting.
*   [ ] **PDF Generation:** Integrate `pdfkit` or `puppeteer`; design PDF layout.
*   [ ] **Export Job Management:**
    *   [ ] Choose sync vs. async approach based on expected data size.
    *   [ ] (If Async) Implement job queue or background process.
    *   [ ] (If Async) Implement notification mechanism (WebSockets, polling endpoint, etc.).
*   [ ] **Temporary File Storage:** Configure temporary storage location.
*   [ ] **Secure Link Generation:** (If applicable) Implement secure URL generation.
*   [ ] **Cleanup Mechanism:** Implement logic to delete old temporary files.
*   [ ] **Error Handling:** Robust error handling for database, file generation, etc.
*   [ ] **Logging:** Log export requests, errors, and completion status.
*   [ ] **Rate Limiting:** Implement rate limiting on export endpoints.
*   [ ] **Unit/Integration Tests:** Test export logic thoroughly.

**Frontend:**

*   [ ] **UI Elements:** Add "Export CSV/PDF" buttons/options.
*   [ ] **API Calls:** Implement fetch/axios calls to the new export endpoints.
*   [ ] **Parameter Handling:** Send filter parameters correctly.
*   [ ] **Handle Responses:**
    *   [ ] Process direct download responses.
    *   [ ] (If Async) Display "Export in progress" message.
    *   [ ] (If Async) Handle notifications/poll status endpoint.
    *   [ ] Present download links or trigger downloads.
*   [ ] **Error Handling:** Display user-friendly error messages from the API.

**General:**

*   [ ] **Dependency Installation:** Add necessary CSV/PDF libraries to `package.json`.
*   [ ] **Configuration:** Manage temporary storage paths, potential API keys via environment variables.
*   [ ] **Documentation:** Update API documentation for new endpoints.