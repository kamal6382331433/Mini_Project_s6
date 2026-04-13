package com.daed;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

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

@Component
public class DataInitializer implements CommandLineRunner {

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

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {

        // ===== 1. Create Users =====
        User adminUser = null;
        User facultyUser = null;
        User studentUser = null;

        if (!userRepository.existsByUsername("admin")) {
            adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@daed.com");
            adminUser.setFullName("Administrator");
            adminUser.setPassword(passwordEncoder.encode("password123"));
            adminUser.setRole(User.Role.ADMIN);
            adminUser = userRepository.save(adminUser);
            System.out.println("✅ Admin User Created: admin/password123");
        } else {
            adminUser = userRepository.findByUsername("admin").orElse(null);
        }

        if (!userRepository.existsByUsername("faculty")) {
            facultyUser = new User();
            facultyUser.setUsername("faculty");
            facultyUser.setEmail("faculty@daed.com");
            facultyUser.setFullName("Dr. Smith");
            facultyUser.setPassword(passwordEncoder.encode("password123"));
            facultyUser.setRole(User.Role.FACULTY);
            facultyUser = userRepository.save(facultyUser);
            System.out.println("✅ Faculty User Created: faculty/password123");
        } else {
            facultyUser = userRepository.findByUsername("faculty").orElse(null);
        }

        if (!userRepository.existsByUsername("student")) {
            studentUser = new User();
            studentUser.setUsername("student");
            studentUser.setEmail("student@daed.com");
            studentUser.setFullName("John Doe");
            studentUser.setPassword(passwordEncoder.encode("password123"));
            studentUser.setRole(User.Role.STUDENT);
            studentUser = userRepository.save(studentUser);
            System.out.println("✅ Student User Created: student/password123");
        } else {
            studentUser = userRepository.findByUsername("student").orElse(null);
        }

        // ===== 2. Create Faculty Profile =====
        Faculty faculty = null;
        if (facultyUser != null && !facultyRepository.findByUserId(facultyUser.getId()).isPresent()) {
            faculty = new Faculty();
            faculty.setUser(facultyUser);
            faculty.setDepartment("Computer Science");
            faculty.setDesignation("Associate Professor");
            faculty = facultyRepository.save(faculty);
            System.out.println("✅ Faculty Profile Created for: " + facultyUser.getFullName());
        } else if (facultyUser != null) {
            faculty = facultyRepository.findByUserId(facultyUser.getId()).orElse(null);
        }

        // ===== 3. Create Student Profile =====
        Student student = null;
        if (studentUser != null && !studentRepository.findByUserId(studentUser.getId()).isPresent()) {
            student = new Student();
            student.setUser(studentUser);
            student.setRollNumber("2024CS001");
            student.setDepartment("Computer Science");
            student.setSemester(6);
            student.setBatch("2021-2025");
            student = studentRepository.save(student);
            System.out.println("✅ Student Profile Created for: " + studentUser.getFullName());
        } else if (studentUser != null) {
            student = studentRepository.findByUserId(studentUser.getId()).orElse(null);
        }

        // ===== 4. Create Subjects =====
        Subject sub1 = createSubjectIfNotExists("CS601", "Data Structures", "Computer Science", 6, faculty);
        Subject sub2 = createSubjectIfNotExists("CS602", "Database Systems", "Computer Science", 6, faculty);
        Subject sub3 = createSubjectIfNotExists("CS603", "Computer Networks", "Computer Science", 6, faculty);
        Subject sub4 = createSubjectIfNotExists("CS604", "Operating Systems", "Computer Science", 6, faculty);

        // ===== 5. Create Marks (only if student exists and no marks yet) =====
        if (student != null && marksRepository.findByStudentId(student.getId()).isEmpty()) {
            createMarks(student, sub1, 38, 52); // Total: 90 → A+
            createMarks(student, sub2, 32, 43); // Total: 75 → B
            createMarks(student, sub3, 28, 37); // Total: 65 → C
            createMarks(student, sub4, 35, 47); // Total: 82 → A
            System.out.println("✅ Sample Marks Created for student");
        }

        // ===== 6. Create Attendance (only if student exists and no attendance yet)
        // =====
        if (student != null && attendanceRepository.findByStudentId(student.getId()).isEmpty()) {
            createAttendance(student, sub1, 50, 45); // 90%
            createAttendance(student, sub2, 50, 42); // 84%
            createAttendance(student, sub3, 50, 38); // 76%
            createAttendance(student, sub4, 50, 47); // 94%
            System.out.println("✅ Sample Attendance Created for student");
        }

        System.out.println("========================================");
        System.out.println("  DAED Data Initialization Complete!");
        System.out.println("========================================");
    }

    private Subject createSubjectIfNotExists(String code, String name, String dept, int sem, Faculty faculty) {
        if (!subjectRepository.existsBySubjectCode(code)) {
            Subject subject = new Subject();
            subject.setSubjectCode(code);
            subject.setSubjectName(name);
            subject.setDepartment(dept);
            subject.setSemester(sem);
            subject.setFaculty(faculty);
            subject = subjectRepository.save(subject);
            System.out.println("✅ Subject Created: " + code + " - " + name);
            return subject;
        }
        return subjectRepository.findBySubjectCode(code).orElse(null);
    }

    private void createMarks(Student student, Subject subject, double internal, double external) {
        if (subject == null)
            return;
        Marks marks = new Marks();
        marks.setStudent(student);
        marks.setSubject(subject);
        marks.setInternalMarks(internal);
        marks.setExternalMarks(external);
        // totalMarks, grade, status are auto-calculated by @PrePersist
        marksRepository.save(marks);
    }

    private void createAttendance(Student student, Subject subject, int total, int attended) {
        if (subject == null)
            return;
        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setSubject(subject);
        attendance.setTotalClasses(total);
        attendance.setAttendedClasses(attended);
        // percentage is auto-calculated by @PrePersist
        attendanceRepository.save(attendance);
    }
}
