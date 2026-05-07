#!/bin/bash
echo "Starting all services..."

# Start Auth Service
java -jar auth-service/target/auth-service-1.0.0.jar &
AUTH_PID=$!
echo "Auth Service started (PID: $AUTH_PID) on port 8081"
sleep 3

# Start Student Service
java -jar student-service/target/student-service-1.0.0.jar &
STUDENT_PID=$!
echo "Student Service started (PID: $STUDENT_PID) on port 8082"
sleep 3

# Start Attendance Service
java -jar attendance-service/target/attendance-service-1.0.0.jar &
ATTEND_PID=$!
echo "Attendance Service started (PID: $ATTEND_PID) on port 8083"

echo ""
echo "All services started!"
echo "Auth:       http://localhost:8081"
echo "Students:   http://localhost:8082"
echo "Attendance: http://localhost:8083"
echo ""
echo "Press Ctrl+C to stop all services"

trap "kill $AUTH_PID $STUDENT_PID $ATTEND_PID; echo 'All services stopped'" EXIT
wait
