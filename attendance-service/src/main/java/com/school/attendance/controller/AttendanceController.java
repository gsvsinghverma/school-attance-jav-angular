package com.school.attendance.controller;

import com.school.attendance.dto.*;
import com.school.attendance.entity.Attendance;
import com.school.attendance.service.AttendanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AttendanceController {

    private final AttendanceService svc;

    @GetMapping("/health")
    public ResponseEntity<?> health() {
        return ResponseEntity.ok(Map.of("status", "UP", "service", "attendance-service"));
    }

    @PostMapping("/mark")
    public ResponseEntity<?> mark(@Valid @RequestBody AttendanceRequest req, Authentication auth) {
        try {
            String markedBy = auth != null ? auth.getName() : "system";
            return ResponseEntity.ok(svc.markAttendance(req, markedBy));
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("message", e.getMessage())); }
    }

    @PostMapping("/mark-bulk")
    public ResponseEntity<?> markBulk(@RequestBody BulkAttendanceRequest req, Authentication auth) {
        try {
            String markedBy = auth != null ? auth.getName() : "system";
            return ResponseEntity.ok(svc.markBulkAttendance(req, markedBy));
        } catch (Exception e) { return ResponseEntity.badRequest().body(Map.of("message", e.getMessage())); }
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<List<Attendance>> getByStudent(@PathVariable Long id,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        if (from != null && to != null) return ResponseEntity.ok(svc.getAttendanceByStudentAndDateRange(id, from, to));
        return ResponseEntity.ok(svc.getAllAttendanceByStudent(id));
    }

    @GetMapping("/student/{id}/summary")
    public ResponseEntity<AttendanceSummaryDto> getSummary(@PathVariable Long id,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        return ResponseEntity.ok(svc.getStudentSummary(id, from, to));
    }

    @GetMapping("/class/{cn}")
    public ResponseEntity<List<Attendance>> getByClass(@PathVariable String cn,
            @RequestParam(required = false) String section,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(svc.getAttendanceByClassAndDate(cn, section, date != null ? date : LocalDate.now()));
    }

    @GetMapping("/date")
    public ResponseEntity<List<Attendance>> getByDate(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return ResponseEntity.ok(svc.getAttendanceByDate(date));
    }

    @GetMapping("/today")
    public ResponseEntity<List<Attendance>> getToday() {
        return ResponseEntity.ok(svc.getAttendanceByDate(LocalDate.now()));
    }
}
