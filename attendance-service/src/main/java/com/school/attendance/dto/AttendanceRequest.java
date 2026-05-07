package com.school.attendance.dto;

import com.school.attendance.entity.Attendance;
import jakarta.validation.constraints.NotNull;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class AttendanceRequest {
    @NotNull private Long studentId;
    private String rollNumber;
    private String studentName;
    private String className;
    private String section;
    private LocalDate date = LocalDate.now();
    @NotNull private Attendance.Status status;
    private String remarks;
}