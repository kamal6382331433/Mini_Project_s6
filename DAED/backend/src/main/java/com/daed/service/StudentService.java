package com.daed.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daed.model.Attendance;
import com.daed.model.Marks;
import com.daed.repository.AttendanceRepository;
import com.daed.repository.MarksRepository;

@Service
public class StudentService {
    @Autowired
    private MarksRepository marksRepository;
    @Autowired
    private AttendanceRepository attendanceRepository;

    public List<Marks> getStudentMarks(Long studentId) {
        return marksRepository.findByStudentId(studentId);
    }

    public List<Attendance> getStudentAttendance(Long studentId) {
        return attendanceRepository.findByStudentId(studentId);
    }

    public void deleteMarks(Long studentId, Long subjectId) {
        Optional<Marks> marks = marksRepository.findByStudentIdAndSubjectId(studentId, subjectId);
        marks.ifPresent(marksRepository::delete);
    }

    public void deleteAttendance(Long studentId, Long subjectId) {
        Optional<Attendance> attendance = attendanceRepository.findByStudentIdAndSubjectId(studentId, subjectId);
        attendance.ifPresent(attendanceRepository::delete);
    }
}
