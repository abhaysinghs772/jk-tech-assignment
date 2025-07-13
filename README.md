# 🔐 JK Tech Assignment – Backend API

This is a **NestJS**-based backend API for managing users, authentication, documents, and role-based access control. Built with **TypeORM**, **PostgreSQL**, and follows modular clean code practices.

---

## 📁 Project Structure

```bash
src/
├── deafault/
│ ├── auth/ # Login, registration, JWT, refresh tokens
│ ├── user/ # User CRUD, roles, permissions
│ ├── documents/ # Document upload & management
│
├── migrations/ # Database migration files
├── common/ # Guards, interceptors, decorators, utils
├── config/ # Environment & DB config
```

---

## 🚀 Features

- ✅ **User Registration & Login**
- 🔐 **JWT Auth with Refresh Token Support**
- 👥 **Role-Based & Permission-Based Access Control**
- 📄 **Document Upload and Management**
- 🧱 **TypeORM Migrations & PostgreSQL**
- 📦 **Modular NestJS Structure**
- ✅ **Unit Tests (Jest)**

---

## 🧪 Tech Stack

- **Backend:** NestJS (TypeScript)
- **ORM:** TypeORM
- **Database:** PostgreSQL
- **Auth:** JWT (Access & Refresh Tokens)
- **Validation:** class-validator & class-transformer
- **Testing:** Jest & Supertest
- **Linting:** ESLint, Prettier

---

## ⚙️ Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/abhaysinghs772/jk-tech-assignment.git
cd jk-tech-assignment
```

### 2. Install Dependencies
```bash
npm install
```

### 3.Environment Setup
```bash
PORT=4003
PROTOCOL=http
HOST=localhost
API_VERSION=1
APP_NAME="JK-TECH"
NODE_ENV=development
ENABLE_CONSOLE_LOG=true
SWAGGER_PATH=docs

# API Keys
API_KEY=asdsad
API_SECRET=asdfasdf
API_REFRESH_SECRET=afadf

# DB Options
DB_TYPE=postgres
# DB_TYPE=mysql
USE_MONGO_DB=false
USE_REDIS=true

# PostgreSQL Config
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
POSTGRES_USERNAME=postgres
POSTGRES_PASSWORD=12345678
POSTGRES_DATABASE=jk_tech

# MongoDB Config
MONGO_HOST=""
MONGO_PORT=27017
MONGO_DATABASE=""
MONGO_USERNAME=""
MONGO_PASSWORD=""
MONGO_LOCAL_URI="mongodb://127.0.0.1:27017/test_db"

REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=""
REDIS_TTL=3
```

### 4. Run Migrations
```bash 
npm run migration:run
```

### 5. Start the Application
```bash 
npm run start:dev
```

### 6. | Feature         | Endpoint              | Method |
```bash
| --------------- | ------------------- | ------ |
| Register        | /auth/register      | POST   |
| Login           | /auth/login         | POST   |
| Refresh Token   | /auth/refresh-token | POST   |
| Get Users       | /users              | GET    |
| Create Document | /documents          | POST   |
| Get Documents   | /documents          | GET    |
```

### 7. 🛡 Roles & Permissions
- Users have roles like: admin, editor, viewer
- Permissions are injected into JWT and checked via guards
- Custom decorators handle permission-based access per route

### 8. 🧪 Testing
```bash
npm run test
npm run test:watch
npm run test:cov
```
