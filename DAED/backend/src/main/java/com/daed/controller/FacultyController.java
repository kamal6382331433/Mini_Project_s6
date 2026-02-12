package com.daed.controller;

import com.daed.model.Attendance;
import com.daed.model.Marks;
import com.daed.model.Subject;
import com.daed.payload.response.MessageResponse;
import com.daed.service.FacultyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
}
