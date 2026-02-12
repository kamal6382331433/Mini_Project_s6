package com.daed.controller;

import com.daed.model.Faculty;
import com.daed.model.Student;
import com.daed.model.Subject;
import com.daed.payload.response.MessageResponse;
import com.daed.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @PostMapping("/student/{userId}")
    public ResponseEntity<?> addStudent(@PathVariable Long userId, @RequestBody Student student) {
        adminService.addStudent(userId, student);
        return ResponseEntity.ok(new MessageResponse("Student profile created successfully!"));
    }

    @PostMapping("/faculty/{userId}")
    public ResponseEntity<?> addFaculty(@PathVariable Long userId, @RequestBody Faculty faculty) {
        adminService.addFaculty(userId, faculty);
        return ResponseEntity.ok(new MessageResponse("Faculty profile created successfully!"));
    }
    
    @GetMapping("/students")
    public List<Student> getAllStudents() {
        return adminService.getAllStudents();
    }
    
    @GetMapping("/faculties")
    public List<Faculty> getAllFaculty() {
        return adminService.getAllFaculty();
    }

    @PostMapping("/subject")
    public ResponseEntity<?> addSubject(@RequestBody Subject subject) {
        adminService.addSubject(subject);
        return ResponseEntity.ok(new MessageResponse("Subject created successfully!"));
    }
    
    @GetMapping("/subjects")
    public List<Subject> getAllSubjects() {
        return adminService.getAllSubjects();
    }
    
    @PostMapping("/assign-subject")
    public ResponseEntity<?> assignFaculty(@RequestParam Long subjectId, @RequestParam Long facultyId) {
        adminService.assignFacultyToSubject(subjectId, facultyId);
        return ResponseEntity.ok(new MessageResponse("Faculty assigned to subject successfully!"));
    }
}
