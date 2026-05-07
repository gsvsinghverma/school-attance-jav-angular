package com.school.student.repository;
import com.school.student.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByRollNumber(String rollNumber);
    boolean existsByRollNumber(String rollNumber);
    List<Student> findByClassName(String className);
    List<Student> findByClassNameAndSection(String className, String section);
    List<Student> findByStatus(Student.Status status);
}