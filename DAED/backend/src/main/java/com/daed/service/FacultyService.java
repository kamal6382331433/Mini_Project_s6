package com.daed.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.daed.model.Attendance;
import com.daed.model.Marks;
import com.daed.model.Subject;
import com.daed.repository.AttendanceRepository;
import com.daed.repository.MarksRepository;
import com.daed.repository.StudentRepository;
import com.daed.repository.SubjectRepository;

@Service
public class FacultyService {
    @Autowired
    private MarksRepository marksRepository;
    @Autowired
    private AttendanceRepository attendanceRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private StudentRepository studentRepository;

    public List<Subject> getAssignedSubjects(Long facultyId) {
        return subjectRepository.findByFacultyId(facultyId);
    }

    public Marks addOrUpdateMarks(Long studentId, Long subjectId, double internal, double external) {
        Optional<Marks> existingMarks = marksRepository.findByStudentIdAndSubjectId(studentId, subjectId);
        Marks marks;
        if (existingMarks.isPresent()) {
            marks = existingMarks.get();
        } else {
            marks = new Marks();
            marks.setStudent(studentRepository.findById(studentId).orElseThrow());
            marks.setSubject(subjectRepository.findById(subjectId).orElseThrow());
        }
        marks.setInternalMarks(internal);
        marks.setExternalMarks(external);
        return marksRepository.save(marks);
    }

    public Attendance addOrUpdateAttendance(Long studentId, Long subjectId, int total, int attended) {
        Optional<Attendance> existingAtt = attendanceRepository.findByStudentIdAndSubjectId(studentId, subjectId);
        Attendance attendance;
        if (existingAtt.isPresent()) {
            attendance = existingAtt.get();
        } else {
            attendance = new Attendance();
            attendance.setStudent(studentRepository.findById(studentId).orElseThrow());
            attendance.setSubject(subjectRepository.findById(subjectId).orElseThrow());
        }
        attendance.setTotalClasses(total);
        attendance.setAttendedClasses(attended);
        return attendanceRepository.save(attendance);
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
