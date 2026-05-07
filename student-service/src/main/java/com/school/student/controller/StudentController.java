package com.school.student.controller;

import com.school.student.dto.StudentRequest;
import com.school.student.entity.Student;
import com.school.student.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class StudentController {

    private final StudentService svc;

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "student-service"));
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody StudentRequest r) {
        try { return ResponseEntity.ok(svc.createStudent(r)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("message", e.getMessage())); }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> update(@PathVariable Long id, @Valid @RequestBody StudentRequest r) {
        try { return ResponseEntity.ok(svc.updateStudent(id, r)); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("message", e.getMessage())); }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        try { svc.deleteStudent(id); return ResponseEntity.ok(Map.of("message", "Student deactivated")); }
        catch (RuntimeException e) { return ResponseEntity.badRequest().body(Map.of("message", e.getMessage())); }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try { return ResponseEntity.ok(svc.getStudentById(id)); }
        catch (RuntimeException e) { return ResponseEntity.notFound().build(); }
    }

    @GetMapping("/roll/{roll}")
    public ResponseEntity<?> getByRoll(@PathVariable String roll) {
        try { return ResponseEntity.ok(svc.getStudentByRollNumber(roll)); }
        catch (RuntimeException e) { return ResponseEntity.notFound().build(); }
    }

    @GetMapping
    public ResponseEntity<List<Student>> getAll() { return ResponseEntity.ok(svc.getAllStudents()); }

    @GetMapping("/active")
    public ResponseEntity<List<Student>> getActive() { return ResponseEntity.ok(svc.getActiveStudents()); }

    @GetMapping("/class/{cn}")
    public ResponseEntity<List<Student>> getByClass(@PathVariable String cn,
                                                     @RequestParam(required = false) String section) {
        if (section != null) return ResponseEntity.ok(svc.getStudentsByClassAndSection(cn, section));
        return ResponseEntity.ok(svc.getStudentsByClass(cn));
    }
}
