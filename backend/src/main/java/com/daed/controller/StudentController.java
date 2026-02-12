package com.daed.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.daed.model.Attendance;
import com.daed.model.Marks;
import com.daed.model.Student;
import com.daed.repository.StudentRepository;
import com.daed.service.StudentService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasRole('STUDENT')")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    @GetMapping("/profile/{userId}")
    public ResponseEntity<?> getStudentProfile(@PathVariable Long userId) {
        System.out.println("Fetching profile for User ID: " + userId);
        Optional<Student> student = studentRepository.findByUserId(userId);
        if (student.isPresent()) {
            System.out.println("Student found: " + student.get().getId());
            return ResponseEntity.ok(student.get());
        }
        System.out.println("Student NOT found for User ID: " + userId);
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/marks/{studentId}")
    public List<Marks> getMarks(@PathVariable Long studentId) {
        return studentService.getStudentMarks(studentId);
    }

    @GetMapping("/attendance/{studentId}")
    public List<Attendance> getAttendance(@PathVariable Long studentId) {
        return studentService.getStudentAttendance(studentId);
    }
}
