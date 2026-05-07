package com.school.attendance.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "attendance")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Attendance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false) private Long studentId;
    @Column(nullable = false) private String rollNumber;
    @Column(nullable = false) private String studentName;
    @Column(nullable = false) private String className;
    private String section;

    @Column(nullable = false) private LocalDate date;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    private String markedBy;
    private String remarks;

    public enum Status { PRESENT, ABSENT, LATE, HALF_DAY }
}