package com.school.attendance.repository;
import com.school.attendance.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.*;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentIdAndDateBetween(Long studentId, LocalDate from, LocalDate to);
    List<Attendance> findByClassNameAndDate(String className, LocalDate date);
    List<Attendance> findByClassNameAndSectionAndDate(String className, String section, LocalDate date);
    Optional<Attendance> findByStudentIdAndDate(Long studentId, LocalDate date);
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findByDate(LocalDate date);
    @Query("SELECT a.className, COUNT(a), SUM(CASE WHEN a.status='PRESENT' THEN 1 ELSE 0 END) FROM Attendance a WHERE a.date=:date GROUP BY a.className")
    List<Object[]> getClassSummaryByDate(LocalDate date);
}