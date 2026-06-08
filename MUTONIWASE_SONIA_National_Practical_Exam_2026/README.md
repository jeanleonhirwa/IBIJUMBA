# SwiftWheels PMS (Promotion & Marketing Subsystem)

## Candidate: MUTONIWASE SONIA

---

## Setup Instructions

### Prerequisites
- Node.js (v18+)
- MySQL (v8+)
- npm

### 1. Database Setup
1. Open MySQL CLI or workbench
2. Execute the SQL file:
   ```
   source database/pms.sql
   ```
3. This creates the `PMS` database with all tables and sample data.

### 2. Backend Setup
```bash
cd backend
npm install
npm start
```
The API runs on **http://localhost:5000**

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```
The app runs on **http://localhost:3000**

### 4. Login
- **Username:** admin
- **Password:** admin123
- **Username:** staff1
- **Password:** staff123

---

## Features
- Session-based authentication
- Full CRUD for Vehicles, Customers, Promotions
- Link promotions to vehicles with performance tracking
- Search records across all modules
- Responsive design (Bootstrap 5)
- Customer-Promotion report generation

## Database Tables
- Users
- Vehicle
- Customer
- Promotion
- Promotion_Vehicle (junction table)

## Tech Stack
- **Backend:** Node.js, Express, MySQL2, express-session, bcrypt
- **Frontend:** React 18, React Router, Axios, Bootstrap 5, React Toastify
