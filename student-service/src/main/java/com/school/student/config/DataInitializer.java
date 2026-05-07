package com.school.student.config;

import com.school.student.entity.Student;
import com.school.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final StudentRepository repo;

    @Override
    public void run(String... args) {
        if (repo.count() == 0) {
            repo.save(Student.builder().rollNumber("S001").fullName("Arjun Sharma")
                    .className("10th").section("A").email("arjun@school.com")
                    .phone("9876543210").guardianName("Ramesh Sharma").build());
            repo.save(Student.builder().rollNumber("S002").fullName("Priya Patel")
                    .className("10th").section("A").email("priya@school.com")
                    .phone("9876543211").guardianName("Suresh Patel").build());
            repo.save(Student.builder().rollNumber("S003").fullName("Rohit Verma")
                    .className("10th").section("B").email("rohit@school.com")
                    .phone("9876543212").guardianName("Mahesh Verma").build());
            repo.save(Student.builder().rollNumber("S004").fullName("Sneha Singh")
                    .className("9th").section("A").email("sneha@school.com")
                    .phone("9876543213").guardianName("Vikram Singh").build());
            repo.save(Student.builder().rollNumber("S005").fullName("Amit Gupta")
                    .className("9th").section("B").email("amit@school.com")
                    .phone("9876543214").guardianName("Rajesh Gupta").build());
        }
        System.out.println("=== Student Service Started on port 8082 ===");
    }
}