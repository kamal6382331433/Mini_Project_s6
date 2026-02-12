package com.daed.service;

import com.daed.model.Faculty;
import com.daed.model.Student;
import com.daed.model.Subject;
import com.daed.model.User;
import com.daed.repository.FacultyRepository;
import com.daed.repository.StudentRepository;
import com.daed.repository.SubjectRepository;
import com.daed.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

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
        Subject subject = subjectRepository.findById(subjectId).orElseThrow(() -> new RuntimeException("Subject not found"));
        Faculty faculty = facultyRepository.findById(facultyId).orElseThrow(() -> new RuntimeException("Faculty not found"));
        subject.setFaculty(faculty);
        subjectRepository.save(subject);
    }
}
