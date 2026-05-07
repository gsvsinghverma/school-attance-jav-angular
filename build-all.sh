#!/bin/bash
set -e

echo "=========================================="
echo "  School Attendance System - Build Script"
echo "=========================================="

echo ""
echo "[1/3] Building Auth Service..."
cd auth-service
mvn clean package -DskipTests
echo "Auth Service JAR: $(ls target/*.jar)"
cd ..

echo ""
echo "[2/3] Building Student Service..."
cd student-service
mvn clean package -DskipTests
echo "Student Service JAR: $(ls target/*.jar)"
cd ..

echo ""
echo "[3/3] Building Attendance Service..."
cd attendance-service
mvn clean package -DskipTests
echo "Attendance Service JAR: $(ls target/*.jar)"
cd ..

echo ""
echo "=========================================="
echo "  All Services Built Successfully!"
echo "=========================================="
echo ""
echo "To run individually:"
echo "  java -jar auth-service/target/auth-service-1.0.0.jar       (Port 8081)"
echo "  java -jar student-service/target/student-service-1.0.0.jar   (Port 8082)"
echo "  java -jar attendance-service/target/attendance-service-1.0.0.jar (Port 8083)"
echo ""
echo "To run with Docker:"
echo "  docker-compose up --build"
