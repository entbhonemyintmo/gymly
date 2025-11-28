# Gymly

A gym membership management system with member check-ins, subscription management, and push notifications.

## Tech Stack

**Frontend:** React 19, TypeScript, Vite, TailwindCSS, React Query  
**Backend:** NestJS, Prisma, PostgreSQL  
**Services:** AWS S3, Firebase Cloud Messaging

## Features

-   JWT authentication with role-based access (admin, staff, member)
-   Member check-in tracking with subscription validation
-   Subscription requests with payment receipt uploads
-   Real-time push notifications via FCM
-   Mobile-first responsive design

## Development Setup

### Prerequisites

-   Docker & Docker Compose
-   AWS S3 bucket (for file uploads)
-   Firebase project (for notifications)

### Quick Start

1. **Configure environment variables**

    ```bash
    cp backend/.env.example backend/.env
    cp frontend/.env.example frontend/.env
    ```

    Edit both `.env` files with your credentials.

2. **Start services**

    ```bash
    docker compose up
    ```

3. **Seed database**

    ```bash
    docker compose exec backend npm run prisma:seed
    ```

    | Account | Email            | Password    |
    | ------- | ---------------- | ----------- |
    | Admin   | admin@gymly.com  | admin123    |
    | Member  | john@example.com | password123 |
    | Member  | jane@example.com | password123 |
    | Member  | mike@example.com | password123 |

4. **Access the app**

    - Frontend: http://localhost:5173
    - Backend: http://localhost:8001
    - Swagger: http://localhost:8001/api
