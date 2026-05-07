package com.school.attendance.dto;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AttendanceSummaryDto {
    private Long studentId;
    private String studentName;
    private String rollNumber;
    private long totalDays;
    private long presentDays;
    private long absentDays;
    private long lateDays;
    private double attendancePercentage;
}