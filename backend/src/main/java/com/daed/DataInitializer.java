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

        // ===================================================================
        // 1. CREATE USERS (Admin + Faculty + Students)
        // ===================================================================

        // --- Admin ---
        User adminUser = createUserIfNotExists("admin", "admin@daed.com", "Administrator", "password123",
                User.Role.ADMIN);

        // --- Faculty Users ---
        User facUser1 = createUserIfNotExists("faculty", "faculty@daed.com", "Dr. Smith", "password123",
                User.Role.FACULTY);
        User facUser2 = createUserIfNotExists("prof.johnson", "johnson@daed.com", "Prof. Sarah Johnson", "password123",
                User.Role.FACULTY);
        User facUser3 = createUserIfNotExists("dr.kumar", "kumar@daed.com", "Dr. Rajesh Kumar", "password123",
                User.Role.FACULTY);
        User facUser4 = createUserIfNotExists("prof.nair", "nair@daed.com", "Prof. Anitha Nair", "password123",
                User.Role.FACULTY);

        // --- Student Users ---
        User stuUser1 = createUserIfNotExists("student", "student@daed.com", "John Doe", "password123",
                User.Role.STUDENT);
        User stuUser2 = createUserIfNotExists("arun.cs", "arun@daed.com", "Arun Krishnan", "password123",
                User.Role.STUDENT);
        User stuUser3 = createUserIfNotExists("meera.r", "meera@daed.com", "Meera Rajendran", "password123",
                User.Role.STUDENT);
        User stuUser4 = createUserIfNotExists("rahul.ec", "rahul@daed.com", "Rahul Menon", "password123",
                User.Role.STUDENT);
        User stuUser5 = createUserIfNotExists("priya.s", "priya@daed.com", "Priya Suresh", "password123",
                User.Role.STUDENT);
        User stuUser6 = createUserIfNotExists("vishnu.m", "vishnu@daed.com", "Vishnu Mohan", "password123",
                User.Role.STUDENT);
        User stuUser7 = createUserIfNotExists("anjali.p", "anjali@daed.com", "Anjali Pillai", "password123",
                User.Role.STUDENT);
        User stuUser8 = createUserIfNotExists("deepak.k", "deepak@daed.com", "Deepak Karthik", "password123",
                User.Role.STUDENT);
        User stuUser9 = createUserIfNotExists("sneha.ee", "sneha@daed.com", "Sneha Nambiar", "password123",
                User.Role.STUDENT);
        User stuUser10 = createUserIfNotExists("arjun.me", "arjun@daed.com", "Arjun Balakrishnan", "password123",
                User.Role.STUDENT);

        // ===================================================================
        // 2. CREATE FACULTY PROFILES
        // ===================================================================
        Faculty fac1 = createFacultyIfNotExists(facUser1, "Computer Science", "Associate Professor");
        Faculty fac2 = createFacultyIfNotExists(facUser2, "Computer Science", "Professor");
        Faculty fac3 = createFacultyIfNotExists(facUser3, "ECE", "Associate Professor");
        Faculty fac4 = createFacultyIfNotExists(facUser4, "EEE", "Assistant Professor");

        // ===================================================================
        // 3. CREATE STUDENT PROFILES
        // ===================================================================
        Student stu1 = createStudentIfNotExists(stuUser1, "2024CS001", "Computer Science", 6, "2021-2025");
        Student stu2 = createStudentIfNotExists(stuUser2, "2024CS002", "Computer Science", 6, "2021-2025");
        Student stu3 = createStudentIfNotExists(stuUser3, "2024CS003", "Computer Science", 6, "2021-2025");
        Student stu4 = createStudentIfNotExists(stuUser4, "2024EC001", "ECE", 6, "2021-2025");
        Student stu5 = createStudentIfNotExists(stuUser5, "2024EC002", "ECE", 6, "2021-2025");
        Student stu6 = createStudentIfNotExists(stuUser6, "2024CS004", "Computer Science", 4, "2022-2026");
        Student stu7 = createStudentIfNotExists(stuUser7, "2024EC003", "ECE", 4, "2022-2026");
        Student stu8 = createStudentIfNotExists(stuUser8, "2024CS005", "Computer Science", 4, "2022-2026");
        Student stu9 = createStudentIfNotExists(stuUser9, "2024EE001", "EEE", 6, "2021-2025");
        Student stu10 = createStudentIfNotExists(stuUser10, "2024ME001", "Mechanical", 6, "2021-2025");

        // ===================================================================
        // 4. CREATE SUBJECTS (CS, ECE, EEE departments)
        // ===================================================================

        // -- Computer Science Sem 6 --
        Subject cs601 = createSubjectIfNotExists("CS601", "Data Structures & Algorithms", "Computer Science", 6, fac1);
        Subject cs602 = createSubjectIfNotExists("CS602", "Database Management Systems", "Computer Science", 6, fac1);
        Subject cs603 = createSubjectIfNotExists("CS603", "Computer Networks", "Computer Science", 6, fac2);
        Subject cs604 = createSubjectIfNotExists("CS604", "Operating Systems", "Computer Science", 6, fac2);

        // -- Computer Science Sem 4 --
        Subject cs401 = createSubjectIfNotExists("CS401", "Object Oriented Programming", "Computer Science", 4, fac1);
        Subject cs402 = createSubjectIfNotExists("CS402", "Discrete Mathematics", "Computer Science", 4, fac2);

        // -- ECE Sem 6 --
        Subject ec601 = createSubjectIfNotExists("EC601", "Digital Signal Processing", "ECE", 6, fac3);
        Subject ec602 = createSubjectIfNotExists("EC602", "VLSI Design", "ECE", 6, fac3);
        Subject ec603 = createSubjectIfNotExists("EC603", "Communication Systems", "ECE", 6, fac3);

        // -- ECE Sem 4 --
        Subject ec401 = createSubjectIfNotExists("EC401", "Analog Circuits", "ECE", 4, fac3);

        // -- EEE Sem 6 --
        Subject ee601 = createSubjectIfNotExists("EE601", "Power Electronics", "EEE", 6, fac4);
        Subject ee602 = createSubjectIfNotExists("EE602", "Control Systems", "EEE", 6, fac4);

        // ===================================================================
        // 5. CREATE MARKS FOR ALL STUDENTS
        // ===================================================================

        // --- Student 1: John Doe (CS, Sem 6) - Top Performer ---
        if (stu1 != null && marksRepository.findByStudentId(stu1.getId()).isEmpty()) {
            createMarks(stu1, cs601, 38, 52); // 90 → A+
            createMarks(stu1, cs602, 32, 43); // 75 → B
            createMarks(stu1, cs603, 28, 37); // 65 → C
            createMarks(stu1, cs604, 35, 47); // 82 → A
            System.out.println("✅ Marks created for: John Doe");
        }

        // --- Student 2: Arun Krishnan (CS, Sem 6) - Good ---
        if (stu2 != null && marksRepository.findByStudentId(stu2.getId()).isEmpty()) {
            createMarks(stu2, cs601, 35, 48); // 83 → A
            createMarks(stu2, cs602, 30, 40); // 70 → B
            createMarks(stu2, cs603, 33, 45); // 78 → B+
            createMarks(stu2, cs604, 37, 50); // 87 → A+
            System.out.println("✅ Marks created for: Arun Krishnan");
        }

        // --- Student 3: Meera Rajendran (CS, Sem 6) - Excellent ---
        if (stu3 != null && marksRepository.findByStudentId(stu3.getId()).isEmpty()) {
            createMarks(stu3, cs601, 40, 55); // 95 → A+
            createMarks(stu3, cs602, 38, 50); // 88 → A+
            createMarks(stu3, cs603, 36, 48); // 84 → A
            createMarks(stu3, cs604, 39, 53); // 92 → A+
            System.out.println("✅ Marks created for: Meera Rajendran");
        }

        // --- Student 4: Rahul Menon (ECE, Sem 6) - Average ---
        if (stu4 != null && marksRepository.findByStudentId(stu4.getId()).isEmpty()) {
            createMarks(stu4, ec601, 25, 30); // 55 → C
            createMarks(stu4, ec602, 28, 35); // 63 → C
            createMarks(stu4, ec603, 30, 38); // 68 → C+
            System.out.println("✅ Marks created for: Rahul Menon");
        }

        // --- Student 5: Priya Suresh (ECE, Sem 6) - Good ---
        if (stu5 != null && marksRepository.findByStudentId(stu5.getId()).isEmpty()) {
            createMarks(stu5, ec601, 34, 46); // 80 → A
            createMarks(stu5, ec602, 36, 49); // 85 → A
            createMarks(stu5, ec603, 32, 43); // 75 → B
            System.out.println("✅ Marks created for: Priya Suresh");
        }

        // --- Student 6: Vishnu Mohan (CS, Sem 4) ---
        if (stu6 != null && marksRepository.findByStudentId(stu6.getId()).isEmpty()) {
            createMarks(stu6, cs401, 33, 44); // 77 → B+
            createMarks(stu6, cs402, 29, 39); // 68 → C+
            System.out.println("✅ Marks created for: Vishnu Mohan");
        }

        // --- Student 7: Anjali Pillai (ECE, Sem 4) ---
        if (stu7 != null && marksRepository.findByStudentId(stu7.getId()).isEmpty()) {
            createMarks(stu7, ec401, 37, 50); // 87 → A+
            System.out.println("✅ Marks created for: Anjali Pillai");
        }

        // --- Student 8: Deepak Karthik (CS, Sem 4) ---
        if (stu8 != null && marksRepository.findByStudentId(stu8.getId()).isEmpty()) {
            createMarks(stu8, cs401, 22, 28); // 50 → D
            createMarks(stu8, cs402, 18, 22); // 40 → F
            System.out.println("✅ Marks created for: Deepak Karthik");
        }

        // --- Student 9: Sneha Nambiar (EEE, Sem 6) ---
        if (stu9 != null && marksRepository.findByStudentId(stu9.getId()).isEmpty()) {
            createMarks(stu9, ee601, 35, 47); // 82 → A
            createMarks(stu9, ee602, 33, 44); // 77 → B+
            System.out.println("✅ Marks created for: Sneha Nambiar");
        }

        // --- Student 10: Arjun Balakrishnan (Mechanical, Sem 6) ---
        if (stu10 != null && marksRepository.findByStudentId(stu10.getId()).isEmpty()) {
            createMarks(stu10, cs601, 30, 40); // 70 → B (cross-dept elective)
            System.out.println("✅ Marks created for: Arjun Balakrishnan");
        }

        // ===================================================================
        // 6. CREATE ATTENDANCE FOR ALL STUDENTS
        // ===================================================================

        // --- Student 1: John Doe ---
        if (stu1 != null && attendanceRepository.findByStudentId(stu1.getId()).isEmpty()) {
            createAttendance(stu1, cs601, 50, 45); // 90%
            createAttendance(stu1, cs602, 50, 42); // 84%
            createAttendance(stu1, cs603, 50, 38); // 76%
            createAttendance(stu1, cs604, 50, 47); // 94%
            System.out.println("✅ Attendance created for: John Doe");
        }

        // --- Student 2: Arun Krishnan ---
        if (stu2 != null && attendanceRepository.findByStudentId(stu2.getId()).isEmpty()) {
            createAttendance(stu2, cs601, 50, 48); // 96%
            createAttendance(stu2, cs602, 50, 44); // 88%
            createAttendance(stu2, cs603, 50, 40); // 80%
            createAttendance(stu2, cs604, 50, 46); // 92%
            System.out.println("✅ Attendance created for: Arun Krishnan");
        }

        // --- Student 3: Meera Rajendran ---
        if (stu3 != null && attendanceRepository.findByStudentId(stu3.getId()).isEmpty()) {
            createAttendance(stu3, cs601, 50, 50); // 100%
            createAttendance(stu3, cs602, 50, 48); // 96%
            createAttendance(stu3, cs603, 50, 47); // 94%
            createAttendance(stu3, cs604, 50, 49); // 98%
            System.out.println("✅ Attendance created for: Meera Rajendran");
        }

        // --- Student 4: Rahul Menon ---
        if (stu4 != null && attendanceRepository.findByStudentId(stu4.getId()).isEmpty()) {
            createAttendance(stu4, ec601, 50, 35); // 70%
            createAttendance(stu4, ec602, 50, 32); // 64%
            createAttendance(stu4, ec603, 50, 37); // 74%
            System.out.println("✅ Attendance created for: Rahul Menon");
        }

        // --- Student 5: Priya Suresh ---
        if (stu5 != null && attendanceRepository.findByStudentId(stu5.getId()).isEmpty()) {
            createAttendance(stu5, ec601, 50, 46); // 92%
            createAttendance(stu5, ec602, 50, 43); // 86%
            createAttendance(stu5, ec603, 50, 45); // 90%
            System.out.println("✅ Attendance created for: Priya Suresh");
        }

        // --- Student 6: Vishnu Mohan ---
        if (stu6 != null && attendanceRepository.findByStudentId(stu6.getId()).isEmpty()) {
            createAttendance(stu6, cs401, 45, 40); // 89%
            createAttendance(stu6, cs402, 45, 38); // 84%
            System.out.println("✅ Attendance created for: Vishnu Mohan");
        }

        // --- Student 7: Anjali Pillai ---
        if (stu7 != null && attendanceRepository.findByStudentId(stu7.getId()).isEmpty()) {
            createAttendance(stu7, ec401, 45, 43); // 96%
            System.out.println("✅ Attendance created for: Anjali Pillai");
        }

        // --- Student 8: Deepak Karthik ---
        if (stu8 != null && attendanceRepository.findByStudentId(stu8.getId()).isEmpty()) {
            createAttendance(stu8, cs401, 45, 28); // 62%
            createAttendance(stu8, cs402, 45, 25); // 56%
            System.out.println("✅ Attendance created for: Deepak Karthik");
        }

        // --- Student 9: Sneha Nambiar ---
        if (stu9 != null && attendanceRepository.findByStudentId(stu9.getId()).isEmpty()) {
            createAttendance(stu9, ee601, 50, 44); // 88%
            createAttendance(stu9, ee602, 50, 41); // 82%
            System.out.println("✅ Attendance created for: Sneha Nambiar");
        }

        // --- Student 10: Arjun Balakrishnan ---
        if (stu10 != null && attendanceRepository.findByStudentId(stu10.getId()).isEmpty()) {
            createAttendance(stu10, cs601, 50, 36); // 72%
            System.out.println("✅ Attendance created for: Arjun Balakrishnan");
        }

        System.out.println("========================================");
        System.out.println("  DAED Data Initialization Complete!");
        System.out.println("  → 1 Admin, 4 Faculty, 10 Students");
        System.out.println("  → 12 Subjects across 4 departments");
        System.out.println("  → Marks & Attendance records seeded");
        System.out.println("========================================");
    }

    // ===== HELPER: Create User =====
    private User createUserIfNotExists(String username, String email, String fullName, String password,
            User.Role role) {
        if (!userRepository.existsByUsername(username)) {
            User user = new User();
            user.setUsername(username);
            user.setEmail(email);
            user.setFullName(fullName);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            user = userRepository.save(user);
            System.out.println("✅ User Created: " + username + " (" + role + ")");
            return user;
        }
        return userRepository.findByUsername(username).orElse(null);
    }

    // ===== HELPER: Create Faculty Profile =====
    private Faculty createFacultyIfNotExists(User user, String department, String designation) {
        if (user == null)
            return null;
        if (!facultyRepository.findByUserId(user.getId()).isPresent()) {
            Faculty faculty = new Faculty();
            faculty.setUser(user);
            faculty.setDepartment(department);
            faculty.setDesignation(designation);
            faculty = facultyRepository.save(faculty);
            System.out.println("✅ Faculty Profile: " + user.getFullName() + " (" + department + ")");
            return faculty;
        }
        return facultyRepository.findByUserId(user.getId()).orElse(null);
    }

    // ===== HELPER: Create Student Profile =====
    private Student createStudentIfNotExists(User user, String rollNumber, String department, int semester,
            String batch) {
        if (user == null)
            return null;
        if (!studentRepository.findByUserId(user.getId()).isPresent()) {
            Student student = new Student();
            student.setUser(user);
            student.setRollNumber(rollNumber);
            student.setDepartment(department);
            student.setSemester(semester);
            student.setBatch(batch);
            student = studentRepository.save(student);
            System.out.println("✅ Student Profile: " + user.getFullName() + " (" + rollNumber + ")");
            return student;
        }
        return studentRepository.findByUserId(user.getId()).orElse(null);
    }

    // ===== HELPER: Create Subject =====
    private Subject createSubjectIfNotExists(String code, String name, String dept, int sem, Faculty faculty) {
        if (!subjectRepository.existsBySubjectCode(code)) {
            Subject subject = new Subject();
            subject.setSubjectCode(code);
            subject.setSubjectName(name);
            subject.setDepartment(dept);
            subject.setSemester(sem);
            subject.setFaculty(faculty);
            subject = subjectRepository.save(subject);
            System.out.println("✅ Subject: " + code + " - " + name);
            return subject;
        }
        return subjectRepository.findBySubjectCode(code).orElse(null);
    }

    // ===== HELPER: Create Marks =====
    private void createMarks(Student student, Subject subject, double internal, double external) {
        if (subject == null)
            return;
        Marks marks = new Marks();
        marks.setStudent(student);
        marks.setSubject(subject);
        marks.setInternalMarks(internal);
        marks.setExternalMarks(external);
        marksRepository.save(marks);
    }

    // ===== HELPER: Create Attendance =====
    private void createAttendance(Student student, Subject subject, int total, int attended) {
        if (subject == null)
            return;
        Attendance attendance = new Attendance();
        attendance.setStudent(student);
        attendance.setSubject(subject);
        attendance.setTotalClasses(total);
        attendance.setAttendedClasses(attended);
        attendanceRepository.save(attendance);
    }
}
