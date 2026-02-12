package com.daed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.daed.model.User;
import com.daed.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create Admin
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@daed.com");
            admin.setFullName("Administrator");
            admin.setPassword(passwordEncoder.encode("password123"));
            admin.setRole(User.Role.ADMIN);
            userRepository.save(admin);
            System.out.println("Admin User Created: admin/password123");
        }

        // Create Faculty
        if (!userRepository.existsByUsername("faculty")) {
            User faculty = new User();
            faculty.setUsername("faculty");
            faculty.setEmail("faculty@daed.com");
            faculty.setFullName("Dr. Smith");
            faculty.setPassword(passwordEncoder.encode("password123"));
            faculty.setRole(User.Role.FACULTY);
            userRepository.save(faculty);
            System.out.println("Faculty User Created: faculty/password123");
        }

        // Create Student
        if (!userRepository.existsByUsername("student")) {
            User student = new User();
            student.setUsername("student");
            student.setEmail("student@daed.com");
            student.setFullName("John Doe");
            student.setPassword(passwordEncoder.encode("password123"));
            student.setRole(User.Role.STUDENT);
            userRepository.save(student);
            System.out.println("Student User Created: student/password123");
        }
    }
}
