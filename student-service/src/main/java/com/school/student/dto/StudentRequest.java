package com.school.student.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StudentRequest {
    @NotBlank private String rollNumber;
    @NotBlank private String fullName;
    @NotBlank private String className;
    private String section;
    private String email;
    private String phone;
    private String address;
    private String guardianName;
    private String guardianPhone;
    private LocalDate dateOfBirth;
}