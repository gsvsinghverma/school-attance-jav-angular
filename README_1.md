# School Attendance System - Microservices

Full-stack school attendance management system with 3 Spring Boot microservices + Angular frontend.

## Architecture

```
Frontend (Angular)  :4200
    |
    |-- /api/auth/*      --> Auth Service      :8081
    |-- /api/students/*  --> Student Service   :8082
    |-- /api/attendance/*--> Attendance Service:8083
```

## Services

| Service            | Port | Description              |
|--------------------|------|--------------------------|
| Auth Service       | 8081 | Login, Signup, JWT token |
| Student Service    | 8082 | Student CRUD operations  |
| Attendance Service | 8083 | Mark/View attendance     |
| Frontend (Angular) | 4200 | Angular UI (via Docker)  |

## Prerequisites

- Java 17+
- Maven 3.6+
- Node.js 18+ & npm (for frontend local run)
- Docker & Docker Compose (for Docker run)

---

## Option 1: Run with Docker (Recommended)

```bash
# Clone/download and go to project root
cd school-attendance-system

# Build & run all 4 containers
docker-compose up --build

# Access at: http://localhost:4200
```

To stop:
```bash
docker-compose down
```

---

## Option 2: Run Locally (JAR files)

### Step 1 - Build all JARs
```bash
# Build everything at once
./build-all.sh

# OR build individually
cd auth-service       && mvn clean package -DskipTests && cd ..
cd student-service    && mvn clean package -DskipTests && cd ..
cd attendance-service && mvn clean package -DskipTests && cd ..
```

### Step 2 - Run JARs (3 terminals)
```bash
# Terminal 1 - Auth Service (Port 8081)
java -jar auth-service/target/auth-service-1.0.0.jar

# Terminal 2 - Student Service (Port 8082)
java -jar student-service/target/student-service-1.0.0.jar

# Terminal 3 - Attendance Service (Port 8083)
java -jar attendance-service/target/attendance-service-1.0.0.jar
```

OR run all with one script:
```bash
./run-local.sh
```

### Step 3 - Run Frontend
```bash
cd frontend
npm install
npm start      # Runs on http://localhost:4200
```

---

## Default Login Credentials

| Username  | Password     | Role    |
|-----------|-------------|---------|
| admin     | admin123    | ADMIN   |
| teacher1  | teacher123  | TEACHER |

---

## API Endpoints

### Auth Service (Port 8081)
| Method | URL                     | Description      |
|--------|-------------------------|------------------|
| POST   | /api/auth/login         | Login user       |
| POST   | /api/auth/signup        | Register user    |
| POST   | /api/auth/validate      | Validate token   |
| GET    | /api/auth/health        | Health check     |

### Student Service (Port 8082)
| Method | URL                          | Description        |
|--------|------------------------------|--------------------|
| GET    | /api/students                | Get all students   |
| GET    | /api/students/active         | Get active only    |
| GET    | /api/students/{id}           | Get by ID          |
| GET    | /api/students/roll/{roll}    | Get by roll no.    |
| GET    | /api/students/class/{class}  | Get by class       |
| POST   | /api/students                | Create student     |
| PUT    | /api/students/{id}           | Update student     |
| DELETE | /api/students/{id}           | Deactivate student |

### Attendance Service (Port 8083)
| Method | URL                              | Description         |
|--------|----------------------------------|---------------------|
| POST   | /api/attendance/mark             | Mark single         |
| POST   | /api/attendance/mark-bulk        | Mark bulk           |
| GET    | /api/attendance/today            | Today's records     |
| GET    | /api/attendance/date?date=       | By date             |
| GET    | /api/attendance/student/{id}     | Student records     |
| GET    | /api/attendance/student/{id}/summary?from=&to= | Summary |
| GET    | /api/attendance/class/{class}    | Class records       |

---

## Features

- JWT-based authentication
- Role-based access (ADMIN, TEACHER, STUDENT)
- Student CRUD with search & filter
- Bulk attendance marking per class
- Attendance reports with % calculation
- 75% attendance warning
- H2 in-memory DB (no external DB needed)
- All data pre-loaded with sample students
- CORS configured for cross-service calls
- Nginx reverse proxy in Docker
