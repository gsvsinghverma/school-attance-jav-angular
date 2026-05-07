package com.school.student.service;

import com.school.student.dto.StudentRequest;
import com.school.student.entity.Student;
import com.school.student.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {

    private final StudentRepository repo;

    public Student createStudent(StudentRequest r) {
        if (repo.existsByRollNumber(r.getRollNumber()))
            throw new RuntimeException("Roll number already exists: " + r.getRollNumber());
        return repo.save(Student.builder()
                .rollNumber(r.getRollNumber())
                .fullName(r.getFullName())
                .className(r.getClassName())
                .section(r.getSection())
                .email(r.getEmail())
                .phone(r.getPhone())
                .dateOfBirth(r.getDateOfBirth())
                .address(r.getAddress())
                .guardianName(r.getGuardianName())
                .guardianPhone(r.getGuardianPhone())
                .build());
    }

    public Student updateStudent(Long id, StudentRequest r) {
        Student s = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
        s.setFullName(r.getFullName());
        s.setClassName(r.getClassName());
        s.setSection(r.getSection());
        s.setEmail(r.getEmail());
        s.setPhone(r.getPhone());
        s.setDateOfBirth(r.getDateOfBirth());
        s.setAddress(r.getAddress());
        s.setGuardianName(r.getGuardianName());
        s.setGuardianPhone(r.getGuardianPhone());
        return repo.save(s);
    }

    public void deleteStudent(Long id) {
        Student s = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Student not found: " + id));
        s.setStatus(Student.Status.INACTIVE);
        repo.save(s);
    }

    public Student getStudentById(Long id) {
        return repo.findById(id).orElseThrow(() -> new RuntimeException("Student not found: " + id));
    }

    public Student getStudentByRollNumber(String roll) {
        return repo.findByRollNumber(roll).orElseThrow(() -> new RuntimeException("Student not found: " + roll));
    }

    public List<Student> getAllStudents() { return repo.findAll(); }
    public List<Student> getStudentsByClass(String cn) { return repo.findByClassName(cn); }
    public List<Student> getStudentsByClassAndSection(String cn, String sec) { return repo.findByClassNameAndSection(cn, sec); }
    public List<Student> getActiveStudents() { return repo.findByStatus(Student.Status.ACTIVE); }
}