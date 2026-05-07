package com.school.auth.dto;

import com.school.auth.entity.User;
import jakarta.validation.constraints.*;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SignupRequest {
    @NotBlank private String username;
    @NotBlank private String password;
    @Email @NotBlank private String email;
    @NotBlank private String fullName;
    private User.Role role = User.Role.STUDENT;
}