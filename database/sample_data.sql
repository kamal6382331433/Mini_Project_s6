-- DAED Sample Data Insertion Script (UPDATED - 9 Subjects Total)
-- This script adds total 9 subjects for the student dashboard

USE daed_db;

-- 1. Setup IDs
SET @faculty_user_id = (SELECT id FROM users WHERE username = 'faculty' LIMIT 1);
SET @student_user_id = (SELECT id FROM users WHERE username = 'student' LIMIT 1);

-- Ensure profiles exist
INSERT IGNORE INTO faculty (user_id, department, designation) VALUES (@faculty_user_id, 'Computer Science', 'Professor');
INSERT IGNORE INTO students (user_id, roll_number, department, semester) VALUES (@student_user_id, '2024001', 'Computer Science', 3);

SET @faculty_id = (SELECT id FROM faculty WHERE user_id = @faculty_user_id LIMIT 1);
SET @student_id = (SELECT id FROM students WHERE user_id = @student_user_id LIMIT 1);

-- 2. Insert Subjects (Total 9)
INSERT IGNORE INTO subjects (subject_code, subject_name, department, semester, faculty_id) VALUES
('CS101', 'Data Structures', 'Computer Science', 3, @faculty_id),
('CS102', 'Database Management Systems', 'Computer Science', 3, @faculty_id),
('CS103', 'Operating Systems', 'Computer Science', 3, @faculty_id),
('CS104', 'Computer Networks', 'Computer Science', 3, @faculty_id),
('CS105', 'Software Engineering', 'Computer Science', 3, @faculty_id),
('CS106', 'Theory of Computation', 'Computer Science', 3, @faculty_id),
('CS107', 'Artificial Intelligence', 'Computer Science', 3, @faculty_id),
('CS108', 'Web Technology', 'Computer Science', 3, @faculty_id),
('CS109', 'Cybersecurity', 'Computer Science', 3, @faculty_id);

-- 3. Get all subject IDs
SET @s1 = (SELECT id FROM subjects WHERE subject_code = 'CS101' LIMIT 1);
SET @s2 = (SELECT id FROM subjects WHERE subject_code = 'CS102' LIMIT 1);
SET @s3 = (SELECT id FROM subjects WHERE subject_code = 'CS103' LIMIT 1);
SET @s4 = (SELECT id FROM subjects WHERE subject_code = 'CS104' LIMIT 1);
SET @s5 = (SELECT id FROM subjects WHERE subject_code = 'CS105' LIMIT 1);
SET @s6 = (SELECT id FROM subjects WHERE subject_code = 'CS106' LIMIT 1);
SET @s7 = (SELECT id FROM subjects WHERE subject_code = 'CS107' LIMIT 1);
SET @s8 = (SELECT id FROM subjects WHERE subject_code = 'CS108' LIMIT 1);
SET @s9 = (SELECT id FROM subjects WHERE subject_code = 'CS109' LIMIT 1);

-- 4. Insert Marks (Total 9)
INSERT IGNORE INTO marks (student_id, subject_id, internal_marks, external_marks, total_marks, grade, status) VALUES
(@student_id, @s1, 45, 50, 95, 'A+', 'PASS'),
(@student_id, @s2, 40, 45, 85, 'A', 'PASS'),
(@student_id, @s3, 35, 40, 75, 'B', 'PASS'),
(@student_id, @s4, 38, 42, 80, 'A', 'PASS'),
(@student_id, @s5, 42, 48, 90, 'A+', 'PASS'),
(@student_id, @s6, 30, 35, 65, 'C', 'PASS'),
(@student_id, @s7, 48, 49, 97, 'A+', 'PASS'),
(@student_id, @s8, 44, 46, 90, 'A+', 'PASS'),
(@student_id, @s9, 39, 41, 80, 'A', 'PASS');

-- 5. Insert Attendance (Total 9)
INSERT IGNORE INTO attendance (student_id, subject_id, total_classes, attended_classes, percentage) VALUES
(@student_id, @s1, 50, 46, 92.0),
(@student_id, @s2, 50, 42, 84.0),
(@student_id, @s3, 50, 39, 78.0),
(@student_id, @s4, 50, 44, 88.0),
(@student_id, @s5, 50, 47, 94.0),
(@student_id, @s6, 50, 40, 80.0),
(@student_id, @s7, 50, 49, 98.0),
(@student_id, @s8, 50, 45, 90.0),
(@student_id, @s9, 50, 41, 82.0);

SELECT '✅ Total 9 subjects and records inserted successfully!' as Status;
