school-attendance-system/
├── auth-service/          ← Port 8081 (Login/Signup/JWT)
├── student-service/       ← Port 8082 (Student CRUD)
├── attendance-service/    ← Port 8083 (Attendance Mark/View)
├── frontend/              ← Angular UI (Port 4200/80)
├── docker-compose.yml     ← Ek command mein sab run
├── build-all.sh           ← Sab JAR build karta hai
└── README.md              ← Full instructions



🚀 Run Kaise Karein
# Browser mein: http://localhost:4200


cd school-attendance-system

# Extract new zip, then:
docker-compose down --remove-orphans

# Rebuild only (images change ho gayi)
docker-compose up --build -d

# Logs check karo
docker logs auth-service

# Option 2: JAR manually
cd auth-service       && mvn clean package -DskipTests
cd ../student-service && mvn clean package -DskipTests
cd ../attendance-service && mvn clean package -DskipTests

# Phir 3 terminals mein:
java -jar auth-service/target/auth-service-1.0.0.jar
java -jar student-service/target/student-service-1.0.0.jar
java -jar attendance-service/target/attendance-service-1.0.0.jar

# Frontend:
cd frontend && npm install && npm start



