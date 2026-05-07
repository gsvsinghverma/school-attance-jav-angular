# 🎓 School Attendance System

A complete Microservices-based School Attendance Management System built using:

- Java 21
- Spring Boot
- Spring Security + JWT
- MySQL
- Angular
- Docker & Docker Compose
- Maven

---

# 📦 Project Structure

```bash
school-attendance-system/
├── auth-service/          # Port 8081 (Login / Signup / JWT)
├── student-service/       # Port 8082 (Student CRUD)
├── attendance-service/   # Port 8083 (Attendance Mark/View)
├── frontend/             # Angular UI (Port 4200 / 80)
├── docker-compose.yml    # Run complete project with one command
├── build-all.sh          # Build all microservices
└── README.md
```

---

# 🚀 Features

## 🔐 Auth Service
- User Registration
- User Login
- JWT Authentication
- Spring Security

## 👨‍🎓 Student Service
- Add Student
- Update Student
- Delete Student
- View Student List

## 📅 Attendance Service
- Mark Attendance
- View Attendance
- Daily Attendance Tracking

## 🌐 Frontend
- Angular UI
- Login Page
- Student Dashboard
- Attendance Management

---

# 🛠️ Technologies Used

| Technology | Version |
|------------|----------|
| Java | 21 |
| Spring Boot | 3.x |
| Angular | Latest |
| MySQL | 8 |
| Docker | Latest |
| Maven | 3.x |

---

# ⚙️ Run Using Docker Compose

## Step 1: Clone Project

```bash
git clone <your-github-repo-url>
cd school-attendance-system
```

---

## Step 2: Stop Old Containers

```bash
docker-compose down --remove-orphans
```

---

## Step 3: Build & Start All Services

```bash
docker-compose up --build -d
```

---

## Step 4: Check Running Containers

```bash
docker ps
```

---

## Step 5: Check Logs

```bash
docker logs auth-service
docker logs student-service
docker logs attendance-service
```

---

# 🌐 Access Application

| Service | URL |
|---------|-----|
| Frontend | http://localhost:4200 |
| Auth Service | http://localhost:8081 |
| Student Service | http://localhost:8082 |
| Attendance Service | http://localhost:8083 |

---

# 🧪 Run Services Manually

## Build All Services

```bash
cd auth-service && mvn clean package -DskipTests

cd ../student-service && mvn clean package -DskipTests

cd ../attendance-service && mvn clean package -DskipTests
```

---

## Run JAR Files

### Terminal 1

```bash
java -jar auth-service/target/auth-service-1.0.0.jar
```

### Terminal 2

```bash
java -jar student-service/target/student-service-1.0.0.jar
```

### Terminal 3

```bash
java -jar attendance-service/target/attendance-service-1.0.0.jar
```

---

# 🎨 Run Frontend

```bash
cd frontend

npm install

npm start
```

Frontend URL:

```bash
http://localhost:4200
```

---

# 🐳 Docker Commands

## Build Images

```bash
docker-compose build
```

## Start Containers

```bash
docker-compose up -d
```

## Stop Containers

```bash
docker-compose down
```

## View Logs

```bash
docker-compose logs -f
```

---

# 📸 Screenshots

Add screenshots here:

```bash
screenshots/login.png
screenshots/dashboard.png
screenshots/attendance.png
```

---

# 👨‍💻 Author

Developed by Gaurav Singh Verma

---

# 📄 License

This project is for learning and educational purposes.
