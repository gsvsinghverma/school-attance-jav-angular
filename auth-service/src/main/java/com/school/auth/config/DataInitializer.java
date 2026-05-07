package com.school.auth.config;

import com.school.auth.entity.User;
import com.school.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByUsername("admin")) {
            userRepository.save(User.builder()
                    .username("admin")
                    .password(passwordEncoder.encode("admin123"))
                    .email("admin@school.com")
                    .fullName("System Administrator")
                    .role(User.Role.ADMIN)
                    .build());
        }
        if (!userRepository.existsByUsername("teacher1")) {
            userRepository.save(User.builder()
                    .username("teacher1")
                    .password(passwordEncoder.encode("teacher123"))
                    .email("teacher1@school.com")
                    .fullName("Rajesh Kumar")
                    .role(User.Role.TEACHER)
                    .build());
        }
        System.out.println("=== Auth Service Started on port 8081 ===");
        System.out.println("Default users: admin/admin123 | teacher1/teacher123");
    }
}