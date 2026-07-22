# RentEase Portal - Property Rental Management System

[![Angular Version](https://img.shields.io/badge/Angular-21-red?style=for-the-badge&logo=angular)](https://angular.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.1.0-brightgreen?style=for-the-badge&logo=springboot)](https://spring.io/projects/spring-boot)
[![MongoDB](https://img.shields.io/badge/MongoDB-NoSQL-green?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Razorpay](https://img.shields.io/badge/Razorpay-Payment-blue?style=for-the-badge&logo=razorpay)](https://razorpay.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media%20CDN-cyan?style=for-the-badge&logo=cloudinary)](https://cloudinary.com/)

RentEase Portal is a comprehensive, full-stack real estate platform engineered to automate property onboarding, lease contract signatures, automated invoice billing, online payment gateway settlement, and tenant maintenance ticketing. The system integrates a robust **Spring Boot 3 REST API Engine** (Java 21) with a highly responsive, standalone **Angular 21 Web Application** backed by a reactive **NgRx global state store**.

---

## 🌐 Live Demos & Deployment Links
* **Live Web App (Production):** []()
* **Backend API Swagger Interface:** [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html) *(Only accessible while local backend is running)*
* **OpenAPI Specification File:** [http://localhost:8080/v3/api-docs](http://localhost:8080/v3/api-docs) *(Only accessible while local backend is running)*

---

## 📌 Table of Contents
1. [Screenshots & User Interface Walkthrough](#-screenshots--user-interface-walkthrough)
2. [Project Overview & Philosophy](#-project-overview--philosophy)
3. [Full-Stack Architecture Topology](#-full-stack-architecture-topology)
4. [Role-Based Feature Matrix](#-role-based-feature-matrix)
5. [Role-Based Use Case Diagrams](#-role-based-use-case-diagrams)
6. [Core System Workflows](#-core-system-workflows)
   - [Lease E-Signature Workflow](#lease-e-signature-workflow)
   - [Razorpay Rent Payment Lifecycle](#razorpay-rent-payment-lifecycle)
   - [Reactive NgRx State Transition Loop](#reactive-ngrx-state-transition-loop)
   - [Maintenance Repair Ticket Lifecycle](#maintenance-repair-ticket-lifecycle)
7. [Database Schema & ERD Overview](#-database-schema--erd-overview)
8. [Technology Stack & Rationales](#-technology-stack--rationales)
9. [Detailed REST API Endpoints Summary](#-detailed-rest-api-endpoints-summary)
10. [Local Environment Setup & Configuration](#-local-environment-setup--configuration)
    - [Parent Workspace Setup (.env)](#parent-workspace-setup-env)
    - [Backend Service Setup](#backend-service-setup)
    - [Frontend Web App Setup](#frontend-web-app-setup)
11. [Detailed Documentation Modules](#-detailed-documentation-modules)
12. [Contact & Support](#-contact--support)

---

## 📸 Screenshots & User Interface Walkthrough

Below are high-fidelity user interface previews demonstrating the application's key modules, designed with a premium HSL color palette, custom glassmorphism, responsive dashboard grids, and complete light/dark theme adaptation.

### Main UI Preview
![Dashboard Preview]()

> **Looking for screenshots?**
> Please check out the `/docs/screenshots/` folder in this repository for complete visual steps. Click to expand the sections below to see previews of the Tenant and Landlord workspaces.

<div style="overflow-x: auto;">
<details>
<summary><b>Click to expand: Tenant (Customer) Panel Walkthrough</b></summary>
<br>

* **Property Filter Catalog:** Browse listings with real-time budget sliders, room filters, locality searches, and availability toggles.
  ![Property Catalog](https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80)
* **Property Detail & Reviews:** Extended descriptions, geographic details, reviews, and average rating computations.
  ![Property Detail](https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80)
* **Rental Application Form:** Onboarding portal where applicants upload document proof (managed by Cloudinary) and state move-in preferences.
  ![Rental Application](https://images.unsplash.com/photo-1560185893-a55cbc8c57e8?auto=format&fit=crop&w=800&q=80)
* **Digital Lease signing:** Interactive base64 canvas capture designed for tenants to read contract text and attach sign proof.
  ![Lease Agreement](https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=800&q=80)
* **Rent Transactions Ledger:** Monthly ledger checking payment histories and triggering online Razorpay checkouts.
  ![Rent Tracking](https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=800&q=80)
* **Submit Maintenance Request:** Reporting portal for issues with photograph attachments.
  ![Maintenance Request](https://images.unsplash.com/photo-1581094288338-2314dddb7ecc?auto=format&fit=crop&w=800&q=80)

</details>
</div>

<div style="overflow-x: auto;">
<details>
<summary><b>Click to expand: Landlord / Admin Panel Walkthrough</b></summary>
<br>

* **Property Inventory Management:** Listing creator, editor, and availability toggles.
  ![Property Listings](https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80)
* **Tenant Applications Verification:** Document inspector and status resolver.
  ![Application Reviews](https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80)
* **Lease Agreements Registry:** Database tracker of active leases and signed contracts.
  ![Tenant Leases](https://images.unsplash.com/photo-1549923746-c502d488f3aa?auto=format&fit=crop&w=800&q=80)
* **Rent Billing Scheduler:** Manual invoice creator for tenant accounts.
  ![Rent Invoicing](https://images.unsplash.com/photo-1563013544-824ae1d704d3?auto=format&fit=crop&w=800&q=80)
* **Maintenance Issues Resolution:** Dispatched contractor coordinator and note logger.
  ![Issue Resolutions](https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80)

</details>
</div>

---

## 💡 Project Overview

The project is architected around the core goal of eliminating operational bottlenecks in residential and commercial leasing. RentEase Portal provides a secure, fully automated path from a tenant's initial search query to moving in and settling rent bills.

---

## 🔄 Architecture Topology

The application utilizes a classic Spring 3-Tier Layered Architecture (Controller -> Service -> Repository) coupled with custom Servlet security filters and third-party SaaS engines on the backend, communicating with an Angular 21 Single Page Application via REST.

```mermaid
graph TD
    classDef client fill:#38bdf8,stroke:#0369a1,stroke-width:2px,color:#0f172a;
    classDef gateway fill:#a78bfa,stroke:#6d28d9,stroke-width:2px,color:#0f172a;
    classDef security fill:#fb7185,stroke:#be123c,stroke-width:2px,color:#0f172a;
    classDef logic fill:#34d399,stroke:#047857,stroke-width:2px,color:#0f172a;
    classDef db fill:#facc15,stroke:#a16207,stroke-width:2px,color:#0f172a;
    classDef external fill:#f472b6,stroke:#be185d,stroke-width:2px,color:#0f172a;

    A[Client Web App / Angular SPA]:::client -->|HTTP Request| B(API Entrypoint / Port 8080):::gateway
    B --> C{Security Context Filter}:::security
    C -->|Bearer JWT Validated| D[Protected REST Controllers]:::logic
    C -->|Public / Open Routes| E[Public REST Controllers]:::logic
    
    D --> F[Business Service Layer]:::logic
    E --> F
    
    F --> G[(MongoDB Database Store)]:::db
    F --> H[Cloudinary CDN API]:::external
    F --> I[Razorpay Payment API]:::external
    F --> J[OpenPDF Printing Engine]:::external
```

---

## 🏢 Role-Based Feature Matrix

The platform dynamically adjusts UI capabilities based on active JSON Web Token roles.

| Feature Module | Guest User | Tenant (Customer) | Landlord / Admin |
| :--- | :---: | :---: | :---: |
| **Interactive Landing Page** | Read Only | View & Navigate | Dashboard Access |
| **Property Directory Catalog** | Browse / Filter | Search / Add to Wishlist | Full Inventory Control |
| **Property Review Ratings** | Read Reviews | Write & Submit Reviews | Delete / Audit Reviews |
| **Authentication & Registration** | Create Account | Read Profile Details | Audit Registered Tenants |
| **Rental Application Submission** | ✘ | Submit Forms & Income Proof | Approve / Reject Applications |
| **Digital Lease Contracts** | ✘ | Read & Sign on Canvas Pad | Create / Edit Agreement Terms |
| **Online Rent Payments** | ✘ | Razorpay Payments & Mock | View Ledger / Create Bills |
| **PDF Invoices Download** | ✘ | Download Invoice PDFs | Track and Audit Payments |
| **Maintenance Tickets** | ✘ | Raise Tickets & Upload photos | Update Status & Add notes |
| **Notification Center** | ✘ | Read personal alerts | Receive system-wide alerts |
| **Admin Stats & Charts** | ✘ | View personal expenses | Revenue & maintenance graphs |

---

## 👥 Role-Based Use Case Diagrams

The following diagrams illustrate system capabilities separated by role to ensure clean, readable layout structures:

### Guest User Use Cases
```mermaid
flowchart TD
    Guest[👤 Guest User] -->|Explore| Landing["Landing Page / Hero Section"]
    Guest -->|Browse| Search["Property Catalog & Advanced Filters"]
    Guest -->|Register & Login| Auth["Authentication & Registration Module"]
```

### Tenant (Customer) Use Cases
```mermaid
flowchart TD
    Customer[🔑 Authenticated Tenant] -->|Apply| AppSubmit["Submit Rental Application"]
    Customer -->|Review & Sign| LeaseSign["E-Signature on Lease Canvas"]
    Customer -->|Pay Bills| PayRent["Razorpay Online Rent Checkout"]
    Customer -->|Report Problems| MainReq["Raise Maintenance Ticket"]
    Customer -->|Read Alerts| Alerts["Notifications Center"]
    Customer -->|Preferences| Profile["Manage Profile & Wishlist"]
```

### Landlord / Admin Use Cases
```mermaid
flowchart TD
    Admin[🏢 Administrator / Landlord] -->|Monitor| AdminDash["Analytics & Revenue Graphs"]
    Admin -->|Control Listings| PropertyCRUD["Property Listings CRUD"]
    Admin -->|Verify Docs| AppAudit["Approve/Reject Applications"]
    Admin -->|Draft Leases| LeaseGen["Generate Lease Agreements"]
    Admin -->|Invoice Management| RentBill["Create/Manage Rent Invoices"]
    Admin -->|Dispatch Repairs| ResolveMain["Update Maintenance Tickets"]
```

---

## 🗄️ Database Schema & ERD Overview

The database structure is document-oriented (MongoDB), mapping to the following schemas:

```mermaid
erDiagram
    USER {
        string id PK
        string name
        string email
        string password
        string role "customer | admin"
        string phone
        string city
        list preferredLocations
        int budgetMin
        int budgetMax
        string createdAt
        boolean emailAlerts
        boolean smsAlerts
        set wishlist "propertyIds"
    }

    PROPERTY {
        string id PK
        string title
        string city
        string locality
        string type
        int bedrooms
        int bathrooms
        double rent
        double deposit
        string furnishing
        boolean available
        string availableFrom
        int area
        string description
        list amenities
        list images
        string ownerId FK
        string postedAt
        double averageRating
        int totalReviews
    }

    REVIEW {
        string id PK
        string propertyId FK
        string userId FK
        string userName
        int rating
        string comment
        string createdAt
    }

    RENTAL_APPLICATION {
        string id PK
        string applicantName
        string applicantEmail
        string applicantPhone
        string moveInDate
        double monthlyIncome
        int occupants
        string message
        string propertyId FK
        string customerId FK
        list documents
        string status "under_review | approved | rejected"
        string appliedAt
    }

    LEASE {
        string id PK
        string applicationId FK
        string propertyId FK
        string tenantId FK
        string startDate
        string endDate
        double monthlyRent
        double deposit
        string status "pending_signature | active | terminated"
        string conditions
        string propertyTitle
        string signatureImage "base64"
        string contractText
        string createdAt
    }

    RENT {
        string id PK
        string leaseId FK
        string tenantId FK
        string month "e.g., June 2026"
        double amount
        string dueDate
        string paidDate
        string status "pending | paid | overdue"
        string transactionId
        string razorpayOrderId
        string razorpayPaymentId
        string razorpaySignature
    }

    MAINTENANCE_REQUEST {
        string id PK
        string category
        string description
        string urgency "low | medium | high | emergency"
        string propertyId FK
        string tenantId FK
        string status "raised | in progress | resolved"
        string raisedAt
        string resolvedAt
        string adminNote
        list images
    }

    NOTIFICATION {
        string id PK
        string userId FK
        string title
        string message
        string type "success | info | warning | alert | error"
        boolean isRead
        string createdAt
    }

    USER ||--o{ PROPERTY : "owns"
    USER ||--o{ REVIEW : "writes"
    USER ||--o{ RENTAL_APPLICATION : "submits"
    USER ||--o{ LEASE : "enters"
    USER ||--o{ RENT : "settles"
    USER ||--o{ MAINTENANCE_REQUEST : "reports"
    USER ||--o{ NOTIFICATION : "receives"
    PROPERTY ||--o{ REVIEW : "hosts"
    PROPERTY ||--o{ RENTAL_APPLICATION : "receives"
    PROPERTY ||--o{ LEASE : "binds"
    RENTAL_APPLICATION ||--o| LEASE : "converts_to"
    LEASE ||--o{ RENT : "invoices"
```

---

## 🛠️ Technology Stack & Rationales

### Frontend Technology Stack
<div style="overflow-x: auto;">

| Library/Framework | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- |
| **Angular 21** | `21.2.0` | Core Web Architecture | Standalone elements, fast change detection, and native route structures. |
| **NgRx Store/Effects** | `21.1.1` | Global State Container | Unified event loops for clean, predictable page modifications. |
| **TypeScript** | `5.9` | Strongly Typed Script | Reduces runtime object errors and provides seamless type validation. |
| **ngx-sonner** | `3.1.0` | Alert Notification Toasts | Highly responsive visual messages without blocking UI interactions. |
| **CSS** | Standard | Visual Design | Maximum control over HSL tokens, animations, and custom theme switches. |
| **Vitest** | `4.0.8` | Component Testing runner | Sub-second testing execution speeds compared to standard Karma/Jasmine. |

</div>

### Backend Technology Stack
<div style="overflow-x: auto;">

| Library/Framework | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- |
| **Java Platform** | `21` (LTS) | Runtime Environment | High concurrency handling with virtual threads, pattern matching, and record models. |
| **Spring Boot** | `4.1.0` | REST API Server Engine | Configures MVC servlet bindings, dependency injection, and automatic configuration mapping. |
| **Spring Security** | Included | Authorization & Filter Pipelines | Handles CORS permissions, CSRF blocks, and parses incoming stateless JWT tokens. |
| **MongoDB Driver** | Included | NoSQL Database Client | High performance data retrieval with flexible schemas. |
| **JJWT (JJWT-API)** | `0.13.0` | Token Sign & Parse | Standardized cryptographic claims verification for secure API route controls. |
| **Razorpay Java SDK**| `1.4.8` | Payment Gateway Adapter | Integrates checkout processing and calculates signature checksum verifications. |
| **Cloudinary SDK** | `2.4.0` | Image Storage CDN | Dynamic asset uploads, CDN file mapping, and custom sizing features. |
| **OpenPDF** | `3.0.5` | Document PDF Drawer | Programmatic layout designer rendering styled transactional PDF invoice sheets. |
| **Lombok** | Runtime | Compile-Time Boilerplate | Automatically generates constructors, getter methods, and builder patterns. |
| **SpringDoc OpenApi**| `2.8.5` | Swagger UI Document Generator | Generates dynamic endpoint documentation pages and interactive execution testers. |

</div>

---

## Detailed REST API Endpoints Summary

### Authentication Module (`/auth`)
<div style="overflow-x: auto;">

| HTTP Method | API Path | Access Role | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/auth/register` | Public / Anonymous | Creates a new user profile inside database (defaults as `customer`). |
| `POST` | `/auth/login` | Public / Anonymous | Validates password matching and issues client JWT tokens. |

</div>

### User Module (`/users`)
<div style="overflow-x: auto;">

| HTTP Method | API Path | Access Role | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/users` | `ADMIN` only | Retrieves a list of users filtered by query param role. |
| `GET` | `/users/{id}` | Account Owner / `ADMIN` | Retrieves specific profile properties excluding credential hash. |
| `PATCH` | `/users/{id}` | Account Owner only | Partially updates settings, preferred locations, or alerts preferences. |
| `POST` | `/users/{userId}/wishlist/{propertyId}` | Account Owner only | Appends a property item to the user's saved wishlist set. |
| `DELETE` | `/users/{userId}/wishlist/{propertyId}` | Account Owner only | Removes a property item from the user's saved wishlist set. |

</div>

### Property Module (`/properties`)
<div style="overflow-x: auto;">

| HTTP Method | API Path | Access Role | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/properties` | Public / Anonymous | Searches properties using query filters (min/max budget, city, type). |
| `GET` | `/properties/{id}` | Public / Anonymous | Retrieves specific details of a property listing. |
| `POST` | `/properties` | `ADMIN` only | Inserts a new real estate inventory post with image endpoints. |
| `PATCH` | `/properties/{id}` | `ADMIN` only | Updates specifications, prices, availability, or images. |
| `DELETE` | `/properties/{id}` | `ADMIN` only | Purges a property listing record from database. |
| `GET` | `/properties/{id}/reviews` | Public / Anonymous | Fetches reviews and rating grades for the property. |
| `POST` | `/properties/{id}/reviews` | Authenticated Users | Inserts a new review rating and triggers property average recalculation. |

</div>

### Rental Application Module (`/applications`)
<div style="overflow-x: auto;">

| HTTP Method | API Path | Access Role | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/applications` | Authenticated Users | Lists applications filtered by customerId (tenant view) or propertyId (admin view). |
| `GET` | `/applications/{id}` | Authenticated Users | Retrieves detailed application variables. |
| `POST` | `/applications` | Authenticated Users | Submits a new tenancy application, flagging status as `under_review`. |
| `PATCH` | `/applications/{id}` | `ADMIN` only | Updates status (`approved` / `rejected`). Automatically toggles property availability. |
| `DELETE` | `/applications/{id}` | Authenticated Users | Deletes application records. |

</div>

### Leases Module (`/leases`)
<div style="overflow-x: auto;">

| HTTP Method | API Path | Access Role | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/leases` | Authenticated Users | Retrieves active/pending leases filtered by tenantId. |
| `GET` | `/leases/{id}` | Authenticated Users | Fetches contract text, signature files, and dates. |
| `POST` | `/leases` | `ADMIN` only | Drafts a lease agreement based on an approved application. |
| `PATCH` | `/leases/{id}` | `ADMIN` only | Modifies conditions, dates, or lease terms. |
| `POST` | `/leases/{id}/sign` | Lease Tenant only | Appends a base64 signature image, updates status to `active`, and bills rent. |

</div>

### Rent & Billing Module (`/rents`)
<div style="overflow-x: auto;">

| HTTP Method | API Path | Access Role | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/rents` | Authenticated Users | Returns a list of rent invoices filtered by tenantId and status. |
| `POST` | `/rents` | `ADMIN` / System | Creates a manual rent invoice. |
| `PATCH` | `/rents/{id}` | `ADMIN` / System | Modifies rent invoice amounts, dates, or status fields. |
| `POST` | `/rents/{id}/pay` | Authenticated Tenant | Quick mock payment endpoint flagging rents as `paid` and creating dummy `TXN-` logs. |
| `POST` | `/rents/{id}/order` | Authenticated Tenant | Binds a Razorpay transaction order ID to the rent billing record. |
| `POST` | `/rents/{id}/verify` | Authenticated Tenant | Validates HMAC-SHA-256 signatures from Razorpay and marks status as `paid`. |
| `GET` | `/rents/{id}/invoice` | Authenticated Tenant | Generates and downloads a custom styled PDF receipt file. |

</div>

### Maintenance Module (`/maintenanceRequests`)
<div style="overflow-x: auto;">

| HTTP Method | API Path | Access Role | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/maintenanceRequests` | Authenticated Users | Returns maintenance tickets filtered by tenantId. |
| `POST` | `/maintenanceRequests` | Authenticated Tenant | Files a ticket with attachments (photos), categorizing the issue. |
| `PATCH` | `/maintenanceRequests/{id}` | `ADMIN` only | Resolves tickets, updates status, and appends admin resolution notes. |

</div>

### Notifications Module (`/notifications`)
<div style="overflow-x: auto;">

| HTTP Method | API Path | Access Role | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/notifications` | Authenticated Users | Fetches system notifications matching the user ID. |
| `POST` | `/notifications` | System / `ADMIN` | Dispatches new warning/alert objects. |
| `PATCH` | `/notifications/{id}` | Authenticated Users | Toggles notification status from unread to read (`isRead` = true). |

</div>

### Media Upload Module (`/upload`)
<div style="overflow-x: auto;">

| HTTP Method | API Path | Access Role | Description |
| :--- | :--- | :---: | :--- |
| `POST` | `/upload` | Authenticated Users | Uploads files to Cloudinary and returns a secure image/file CDN URL. |

</div>

### Analytics Module (`/analytics`)
<div style="overflow-x: auto;">

| HTTP Method | API Path | Access Role | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/analytics/admin` | `ADMIN` only | Returns portal metrics (revenues, properties, maintenance, active tenants). |
| `GET` | `/analytics/customer/{userId}`| User / `ADMIN` | Returns tenant stats (total paid, active leases, complaints, expenses). |

</div>

---

## Local Environment Setup & Configuration

### Parent Workspace Setup (.env)
The project is configured to read credential imports directly from a parent folder configuration. In the **root workspace directory** (parent folder of both backend and frontend projects), create a `.env` file containing the environment settings shown below:

```properties
# System Server Port
PORT=8080

# Database Bindings
MONGODB_URI=mongodb://localhost:27017
MONGODB_DATABASE=rental_portal

# JSON Web Token Secret (Provide a secure string at least 256 bits long)
SECURITY_JWT_SECRET=YourStrongAndSecure256BitSecretKeyHereMustBeLongEnough
JWT_EXPIRATION_MS=86400000

# Cloudinary CDN Configuration (Optional: Empty fallback triggers mock Unsplash images)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Razorpay Payment Gateway Keys (Use test keys for development)
RAZORPAY_KEY_ID=rzp_test_YourKeyIdHere
RAZORPAY_KEY_SECRET=YourRazorpayKeySecretHere

# Multipart Files Constraints
MAX_FILE_SIZE=10MB
MAX_REQUEST_SIZE=10MB

# CORS Allowed Client Domain (Matches your frontend development URL)
FRONTEND_URL=http://localhost:4200
```

---

### 🐳 Setup Option A: Unified Containerized Setup (Docker Compose - Recommended)
You can build and spin up the database, backend services, and frontend client in a single command. 

Ensure you have created the parent `.env` file and installed Docker, then execute the following in the root workspace folder:
```bash
# Build and launch all services in the background
docker-compose up -d --build
```
This starts the following:
* **MongoDB Container:** Exposed on port `27017` with persistent volume mappings.
* **Spring Boot API Backend:** Running on host port `8080`.
* **Angular Web App:** Running on host port `4200`.

---

### 🛠️ Setup Option B: Manual Local Setup (Step-by-Step)

#### 1. Backend Service Setup

##### Prerequisites
- **JDK 21** or later installed.
- **Apache Maven 3.8+** (or use the included `./mvnw` script wrapper).
- **MongoDB** instance running locally on port `27017` (or Atlas cloud link).

##### Database Launch (Fast Docker option)
To run a local MongoDB container in the background, navigate to the parent workspace and run:
```bash
docker run -d -p 27017:27017 --name local-mongo mongo:latest
```

##### Build and Start Backend
Navigate to the backend module folder:
```bash
cd rental-portal-backend
```

Run using the Maven Wrapper:
```bash
# Windows
mvnw.cmd spring-boot:run

# Linux / MacOS
./mvnw spring-boot:run
```

On start, the backend console prints a confirmation log validating the database link:
```text
=================================================
Validating MongoDB connection...
MongoDB Connection Status: SUCCESSFUL!
=================================================
```

The server will boot on port `8080`.

#### 2. Frontend Web App Setup

##### Prerequisites
- **Node.js** v20+ or v22+ installed.
- **npm** (comes packaged with Node).

##### Install Dependencies & Start
Navigate to the frontend module folder:
```bash
cd rental-portal-frontend
npm install
```

Start the local webpack development server:
```bash
npm start
```
The application compiles and runs on [http://localhost:4200](http://localhost:4200). (Communicates with the backend API target configured in `src/app/core/global/api-service.ts`).

---

## 📁 Detailed Documentation Modules

For module-specific architecture summaries, component breakdowns, dependencies configurations, and execution guides, explore the sub-project documentation modules:

* **Backend API Engine Documentation:** See [README.md](rental-portal-backend/README.md)
* **Frontend Web Client Documentation:** See [README.md](rental-portal-frontend/README.md)

---

## 🙌 Contributing
Contributions are welcome! If you have suggestions or want to fix bugs, feel free to open a Pull Request.

## 🔗 Contact & Support
- **Developer Name:** Saksham Agrahari
- **Email:** [agrahari0899@gmail.com](mailto:agrahari0899@gmail.com)
- **GitHub Profile:** [@saksham2882](https://github.com/saksham2882)
- **LinkedIn Profile:** [@saksham-agrahari](https://www.linkedin.com/in/saksham-agrahari/)
- **Portfolio Website:** [saksham-agrahari.vercel.app](https://saksham-agrahari.vercel.app)

---
<br>

<p align="center">
  Made with ❤️ by Saksham Agrahari
</p>
