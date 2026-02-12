-- DAED Sample Data Insertion Script (EXTENDED VERSION)
-- This script adds 5 more subjects and records for testing

USE daed_db;

-- 1. Setup IDs
SET @faculty_user_id = (SELECT id FROM users WHERE username = 'faculty' LIMIT 1);
SET @student_user_id = (SELECT id FROM users WHERE username = 'student' LIMIT 1);

-- Ensure profiles exist
INSERT IGNORE INTO faculty (user_id, department, designation) VALUES (@faculty_user_id, 'Computer Science', 'Professor');
INSERT IGNORE INTO students (user_id, roll_number, department, semester) VALUES (@student_user_id, '2024001', 'Computer Science', 3);

SET @faculty_id = (SELECT id FROM faculty WHERE user_id = @faculty_user_id LIMIT 1);
SET @student_id = (SELECT id FROM students WHERE user_id = @student_user_id LIMIT 1);

-- 2. Insert 5 More Subjects
INSERT IGNORE INTO subjects (subject_code, subject_name, department, semester, faculty_id) VALUES
('CS105', 'Software Engineering', 'Computer Science', 3, @faculty_id),
('CS106', 'Theory of Computation', 'Computer Science', 3, @faculty_id),
('CS107', 'Artificial Intelligence', 'Computer Science', 3, @faculty_id),
('CS108', 'Web Technology', 'Computer Science', 3, @faculty_id),
('CS109', 'Cybersecurity', 'Computer Science', 3, @faculty_id);

-- 3. Get new subject IDs
SET @s5 = (SELECT id FROM subjects WHERE subject_code = 'CS105' LIMIT 1);
SET @s6 = (SELECT id FROM subjects WHERE subject_code = 'CS106' LIMIT 1);
SET @s7 = (SELECT id FROM subjects WHERE subject_code = 'CS107' LIMIT 1);
SET @s8 = (SELECT id FROM subjects WHERE subject_code = 'CS108' LIMIT 1);
SET @s9 = (SELECT id FROM subjects WHERE subject_code = 'CS109' LIMIT 1);

-- 4. Insert Marks for new subjects
INSERT IGNORE INTO marks (student_id, subject_id, internal_marks, external_marks, total_marks, grade, status) VALUES
(@student_id, @s5, 42, 48, 90, 'A+', 'PASS'),
(@student_id, @s6, 30, 35, 65, 'C', 'PASS'),
(@student_id, @s7, 48, 49, 97, 'A+', 'PASS'),
(@student_id, @s8, 44, 46, 90, 'A+', 'PASS'),
(@student_id, @s9, 39, 41, 80, 'A', 'PASS');

-- 5. Insert Attendance for new subjects
INSERT IGNORE INTO attendance (student_id, subject_id, total_classes, attended_classes, percentage) VALUES
(@student_id, @s5, 45, 42, 93.3),
(@student_id, @s6, 45, 38, 84.4),
(@student_id, @s7, 45, 44, 97.7),
(@student_id, @s8, 45, 40, 88.8),
(@student_id, @s9, 45, 41, 91.1);

SELECT '✅ 5 Additional sample records added successfully!' as Status;
SELECT 'Total subjects now: ', COUNT(*) FROM subjects;
