package com.daed.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.daed.model.Attendance;
import com.daed.model.Faculty;
import com.daed.model.Marks;
import com.daed.model.Student;
import com.daed.model.Subject;
import com.daed.model.User;
import com.daed.repository.AttendanceRepository;
import com.daed.repository.FacultyRepository;
import com.daed.repository.MarksRepository;
import com.daed.repository.StudentRepository;
import com.daed.repository.SubjectRepository;
import com.daed.repository.UserRepository;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private FacultyRepository facultyRepository;
    @Autowired
    private SubjectRepository subjectRepository;
    @Autowired
    private MarksRepository marksRepository;
    @Autowired
    private AttendanceRepository attendanceRepository;

    @Transactional
    public Student addStudent(Long userId, Student student) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        student.setUser(user);
        return studentRepository.save(student);
    }

    @Transactional
    public Faculty addFaculty(Long userId, Faculty faculty) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        faculty.setUser(user);
        return facultyRepository.save(faculty);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<Faculty> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public Subject addSubject(Subject subject) {
        return subjectRepository.save(subject);
    }

    public List<Subject> getAllSubjects() {
        return subjectRepository.findAll();
    }

    public void assignFacultyToSubject(Long subjectId, Long facultyId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));
        subject.setFaculty(faculty);
        subjectRepository.save(subject);
    }

    @Transactional
    public void deleteStudent(Long studentId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        // Delete associated marks
        List<Marks> marks = marksRepository.findByStudentId(studentId);
        marksRepository.deleteAll(marks);

        // Delete associated attendance
        List<Attendance> attendance = attendanceRepository.findByStudentId(studentId);
        attendanceRepository.deleteAll(attendance);

        Long userId = student.getUser().getId();

        // Delete student record
        studentRepository.delete(student);

        // Delete associated user record
        userRepository.deleteById(userId);
    }

    @Transactional
    public void deleteSubject(Long subjectId) {
        Subject subject = subjectRepository.findById(subjectId)
                .orElseThrow(() -> new RuntimeException("Subject not found"));

        // Delete associated marks
        List<Marks> marks = marksRepository.findBySubjectId(subjectId);
        marksRepository.deleteAll(marks);

        // Delete associated attendance
        List<Attendance> attendance = attendanceRepository.findBySubjectId(subjectId);
        attendanceRepository.deleteAll(attendance);

        // Delete subject record
        subjectRepository.delete(subject);
    }

    @Transactional
    public void deleteFaculty(Long facultyId) {
        Faculty faculty = facultyRepository.findById(facultyId)
                .orElseThrow(() -> new RuntimeException("Faculty not found"));

        // Unassign faculty from subjects
        List<Subject> subjects = subjectRepository.findByFacultyId(facultyId);
        for (Subject subject : subjects) {
            subject.setFaculty(null);
            subjectRepository.save(subject);
        }

        Long userId = faculty.getUser().getId();

        // Delete faculty record
        facultyRepository.delete(faculty);

        // Delete associated user record
        userRepository.deleteById(userId);
    }
}
