package com.school.attendance.service;

import com.school.attendance.dto.*;
import com.school.attendance.entity.Attendance;
import com.school.attendance.repository.AttendanceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AttendanceService {

    private final AttendanceRepository repo;

    public Attendance markAttendance(AttendanceRequest req, String markedBy) {
        Optional<Attendance> existing = repo.findByStudentIdAndDate(req.getStudentId(), req.getDate());
        if (existing.isPresent()) {
            Attendance a = existing.get();
            a.setStatus(req.getStatus());
            a.setRemarks(req.getRemarks());
            a.setMarkedBy(markedBy);
            return repo.save(a);
        }
        return repo.save(Attendance.builder()
                .studentId(req.getStudentId())
                .rollNumber(req.getRollNumber())
                .studentName(req.getStudentName())
                .className(req.getClassName())
                .section(req.getSection())
                .date(req.getDate())
                .status(req.getStatus())
                .markedBy(markedBy)
                .remarks(req.getRemarks())
                .build());
    }

    public List<Attendance> markBulkAttendance(BulkAttendanceRequest req, String markedBy) {
        List<Attendance> results = new ArrayList<>();
        for (AttendanceRequest ar : req.getAttendances()) {
            if (ar.getDate() == null) ar.setDate(req.getDate());
            if (ar.getClassName() == null) ar.setClassName(req.getClassName());
            if (ar.getSection() == null) ar.setSection(req.getSection());
            results.add(markAttendance(ar, markedBy));
        }
        return results;
    }

    public List<Attendance> getAttendanceByStudentAndDateRange(Long id, LocalDate from, LocalDate to) {
        return repo.findByStudentIdAndDateBetween(id, from, to);
    }

    public List<Attendance> getAttendanceByClassAndDate(String cn, String sec, LocalDate date) {
        if (sec != null && !sec.isEmpty()) return repo.findByClassNameAndSectionAndDate(cn, sec, date);
        return repo.findByClassNameAndDate(cn, date);
    }

    public List<Attendance> getAttendanceByDate(LocalDate date) { return repo.findByDate(date); }

    public List<Attendance> getAllAttendanceByStudent(Long id) { return repo.findByStudentId(id); }

    public AttendanceSummaryDto getStudentSummary(Long id, LocalDate from, LocalDate to) {
        List<Attendance> records = repo.findByStudentIdAndDateBetween(id, from, to);
        long total = records.size();
        long present = records.stream().filter(a -> a.getStatus() == Attendance.Status.PRESENT).count();
        long absent = records.stream().filter(a -> a.getStatus() == Attendance.Status.ABSENT).count();
        long late = records.stream().filter(a -> a.getStatus() == Attendance.Status.LATE).count();
        double pct = total > 0 ? Math.round((double)(present + late) / total * 10000.0) / 100.0 : 0.0;
        String name = records.isEmpty() ? "" : records.get(0).getStudentName();
        String roll = records.isEmpty() ? "" : records.get(0).getRollNumber();
        return AttendanceSummaryDto.builder()
                .studentId(id).studentName(name).rollNumber(roll)
                .totalDays(total).presentDays(present).absentDays(absent)
                .lateDays(late).attendancePercentage(pct).build();
    }
}