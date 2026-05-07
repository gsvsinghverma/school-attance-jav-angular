package com.school.attendance.dto;

import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BulkAttendanceRequest {
    private String className;
    private String section;
    private LocalDate date = LocalDate.now();
    private List<AttendanceRequest> attendances;
}