# SpendWise - Personal Expense Tracker

"Understand your money. Build better habits."

A complete full-stack web application designed for teenagers and young adults to track expenses, visualize spending, and receive simple suggestions for better money management.

## Features

- **Authentication**: Secure JWT-based registration and login (bcrypt password hashing).
- **Dashboard**: Visual overview of income, expenses, remaining balance, and savings.
- **Charts**: Interactive Recharts pie and line charts showing category breakdown and 6-month trends.
- **Transactions**: Add, edit, and delete transactions. Automatically calculates running balance.
- **Budgets**: Set monthly limits per category and visually track your progress. Over-budget warnings.
- **Savings Goals**: Create goals and track progress visually.
- **Insights Engine**: AI-like simple rule-based suggestions to promote positive financial habits without judgment.
- **Responsive UI**: Fully mobile-responsive modern design built with Tailwind CSS.

## Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS 4, React Router, Recharts, Axios, Lucide React.
- **Backend**: Node.js, Express, bcrypt, jsonwebtoken, express-validator.
- **Database**: Supabase PostgreSQL.

## Prerequisites

- Node.js (v18+ recommended)
- A Supabase account and project

## Installation & Setup

1. **Clone the repository** (or navigate to the directory):
   ```bash
   cd expense-tracker
   ```

2. **Supabase Database Setup**:
   - Go to your Supabase project dashboard -> SQL Editor.
   - Copy the contents of `database_schema.sql` (found in the root folder).
   - Run the SQL script to create the required tables and indexes.

3. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file based on `.env.example`:
     ```env
     PORT=5000
     NODE_ENV=development
     SUPABASE_URL=your_supabase_project_url
     SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
     JWT_SECRET=your_jwt_secret_key_at_least_32_characters_long
     JWT_EXPIRES_IN=7d
     FRONTEND_URL=http://localhost:5173
     ```
   - **Crucial Note**: Ensure you use the `service_role` key from Supabase on the backend. This key is securely kept away from the frontend.

4. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
   - Ensure the `.env` file contains:
     ```env
     VITE_API_URL=http://localhost:5000/api
     ```

5. **Run the Application**:
   - Go back to the root folder `expense-tracker`.
   - Start both the frontend and backend concurrently:
     ```bash
     npm run dev
     ```
   - The backend runs on `http://localhost:5000`.
   - The frontend runs on `http://localhost:5173`.

## Security Implementations

- **Password Hashing**: Passwords are never stored in plaintext (using `bcrypt`).
- **Authorization**: JSON Web Tokens (JWT) are used for stateless API protection.
- **Service Role Isolation**: Supabase service-role keys are securely kept within the backend process. The frontend makes standard REST API calls.
- **Data Ownership**: The backend enforces that users can only access their own transactions, budgets, and goals using the decoded `req.user.id`.
- **Validation**: Strict backend request validation using `express-validator` to prevent malformed queries and injection.

## Project Structure

```
expense-tracker/
|-- database_schema.sql  (Run in Supabase)
|-- package.json         (Root scripts)
|-- backend/
|   |-- config/          (Database config)
|   |-- controllers/     (Route handlers)
|   |-- middleware/      (Auth & error handlers)
|   |-- models/          (Database logic/queries)
|   |-- routes/          (API endpoints)
|   |-- services/        (Business logic)
|   |-- validators/      (Input validation)
|   |-- app.js           (Express configuration)
|   |-- server.js        (Entry point)
|
|-- frontend/
|   |-- src/
|       |-- components/
|       |-- context/     (AuthContext)
|       |-- layouts/     (DashboardLayout)
|       |-- pages/       (React routes)
|       |-- services/    (Axios API setup)
|       |-- App.jsx      (Routing)
```

## API Endpoints

- **Auth**: `/api/auth/register`, `/api/auth/login`, `/api/auth/me`, `/api/auth/logout`
- **Transactions**: `/api/transactions` (GET, POST), `/api/transactions/:id` (GET, PUT, DELETE)
- **Categories**: `/api/categories` (GET)
- **Budgets**: `/api/budgets` (GET, POST), `/api/budgets/:id` (PUT, DELETE)
- **Goals**: `/api/goals` (GET, POST), `/api/goals/:id` (PUT, DELETE)
- **Dashboard**: `/api/dashboard`, `/api/dashboard/insights`
