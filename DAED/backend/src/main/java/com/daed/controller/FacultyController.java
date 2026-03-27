package com.daed.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.daed.model.Subject;
import com.daed.payload.response.MessageResponse;
import com.daed.service.FacultyService;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/faculty")
@PreAuthorize("hasRole('FACULTY')")
public class FacultyController {

    @Autowired
    private FacultyService facultyService;

    @GetMapping("/subjects/{facultyId}")
    public List<Subject> getAssignedSubjects(@PathVariable Long facultyId) {
        return facultyService.getAssignedSubjects(facultyId);
    }

    @PostMapping("/marks")
    public ResponseEntity<?> addMarks(@RequestParam Long studentId,
            @RequestParam Long subjectId,
            @RequestParam double internal,
            @RequestParam double external) {
        facultyService.addOrUpdateMarks(studentId, subjectId, internal, external);
        return ResponseEntity.ok(new MessageResponse("Marks updated successfully!"));
    }

    @PostMapping("/attendance")
    public ResponseEntity<?> addAttendance(@RequestParam Long studentId,
            @RequestParam Long subjectId,
            @RequestParam int total,
            @RequestParam int attended) {
        facultyService.addOrUpdateAttendance(studentId, subjectId, total, attended);
        return ResponseEntity.ok(new MessageResponse("Attendance updated successfully!"));
    }

    @DeleteMapping("/marks")
    public ResponseEntity<?> deleteMarks(@RequestParam Long studentId, @RequestParam Long subjectId) {
        facultyService.deleteMarks(studentId, subjectId);
        return ResponseEntity.ok(new MessageResponse("Marks deleted successfully!"));
    }

    @DeleteMapping("/attendance")
    public ResponseEntity<?> deleteAttendance(@RequestParam Long studentId, @RequestParam Long subjectId) {
        facultyService.deleteAttendance(studentId, subjectId);
        return ResponseEntity.ok(new MessageResponse("Attendance deleted successfully!"));
    }
}
