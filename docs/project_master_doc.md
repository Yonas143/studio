# Cultural Ambassador Award - Master Project Documentation

Welcome to the official technical documentation for the **Cultural Ambassador Award** platform. This project is a comprehensive web application designed to recognize and celebrate Ethiopian cultural excellence through a secure voting and nomination system.

## 1. Project Overview

The Cultural Ambassador Award platform serves three primary roles:
- **Participants**: View nominees, learn about cultural heritage, and cast votes.
- **Submitters**: Public users who can nominate themselves or others for various award categories.
- **Administrators/Judges**: Manage the entire lifecycle of categories, nominees, votes, and submissions through a secure admin dashboard.

## 2. Technical Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Runtime** | Node.js |
| **Styling** | Tailwind CSS + ShadCN UI |
| **Database** | PostgreSQL |
| **ORM** | Prisma |
| **Authentication** | Supabase Auth (JWT) |
| **File Storage** | Supabase Storage |
| **AI Integration** | Google Genkit (Gemini 2.5 Flash) |
| **Error Tracking** | Sentry |
| **Deployment** | Vercel |

## 3. Project Architecture

### 3.1 Folder Structure
- `src/app/`: Next.js App Router routes, layouts, and API endpoints (`api/`).
- `src/components/`: Modular React components.
  - `admin/`: Admin-specific UI components.
  - `ads/`: Marketing banner components.
  - `layout/`: Global site structure (Header, Footer).
  - `ui/`: Reusable ShadCN primitive components.
  - `voting/`: Components for the voting engine (Leaderboard, VoteButton).
- `src/hooks/`: Custom hooks for user state (`useUser`) and common UI logic.
- `src/lib/`: Backend utilities, database clients (`prisma.ts`), and global types (`types.ts`).
- `src/ai/`: Configuration and logic for Genkit-powered AI features.
- `prisma/`: Database schema definitions and migration tracking.
- `scripts/`: Data seeding and verification scripts for local/production setup.
- `public/`: Static assets including videos, images, and fonts.

## 4. Database Schema (Prisma)

The application uses a relational PostgreSQL database managed through Prisma.

### Core Models:
- **User**: Stores profile metadata and roles (`admin`, `judge`, `participant`).
- **Category**: Defines award categories (e.g., Traditional Dance, Cultural Music).
- **Nominee**: The entities eligible for voting, linked to a Category.
- **Vote**: Records a single relationship between a User and a Nominee. Enforces unique voting constraints.
- **Submission**: Public data for new nomination requests.
- **Popup**: Controls dynamic marketing modals on the landing page.
- **TimelineEvent**: Data for the program roadmap displayed on the homepage.
- **AdConfig**: Global settings for sidebar advertisements.

## 5. Key Features

### 5.1 Secure Voting Engine
- **Constraint**: One vote per user, per nominee.
- **Verification**: Enforced via Prisma unique constraints (`userId`, `nomineeId`) and server-side authentication checks.
- **Real-time Stats**: Vote counts are updated and displayed via a dynamic Leaderboard component.

### 5.2 Content Management System (Admin Panel)
- **Nominee Management**: Admins can add/edit nominees, including bio, images, and categorized media galleries.
- **Submission Processing**: Workflow for reviewing and approving public nominations.
- **Site Controls**: Manage popups, timeline events, and ad banners without code changes.

### 5.3 Cultural Insights & AI
- **Insights**: A publishing platform for articles on Ethiopian culture.
- **AI (Genkit)**: Infrastructure ready for generating descriptions or suggesting cultural content using Gemini.

### 5.4 Dynamic Layout & Ads
- **Side Ads**: Hovering banners on large screens, configurable via the admin dashboard.
- **Custom Typography**: Uses **Lemon Milk** font for a premium, stylized aesthetic tailored to the brand.

## 6. Security Implementation

### 6.1 Authentication
Hosted by **Supabase Auth**. It handles session persistence, email verification, and secure password hashing.

### 6.2 Authorization (RBAC)
Role-Based Access Control is implemented via:
- `isAdmin()` helper: Checks the user's role in the database.
- `requireAdmin()` middleware: Protects sensitive API routes and pages.
- `middleware.ts`: Handles session updates and basic route guards.

### 6.3 Input Validation
- All API request bodies are validated using **Zod** to prevent malformed data injections.
- **Prisma** ensures protection against SQL injection through safe parameterized queries.

## 7. Development Workflow

### 7.1 Setup
1. Clone the repository.
2. Install dependencies: `npm install`.
3. Set up environment variables in `.env` (refer to `env.example`).
4. Initialize the database: `npx prisma migrate dev`.
5. Seed initial data: `npm run seed:local`.

### 7.2 Commands
- `npm run dev`: Start local development server on port 9002.
- `npm run build`: Generate Prisma client and build for production.
- `npx prisma studio`: UI for manual database entry management.

## 8. Deployment

The project is optimized for **Vercel**.
- **Build Step**: `prisma generate && next build`.
- **Environment**: Requires `DATABASE_URL`, `NEXT_PUBLIC_SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`.

---
## 9. Contact Information

For technical inquiries or project management:
- **Project Lead & Developer**: Yonas Mulugeta - [yoni.win.yw@gmail.com](mailto:yoni.win.yw@gmail.com)

---
*Document Version: 1.0.0*
*Last Updated: December 2025*
