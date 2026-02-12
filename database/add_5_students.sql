-- DAED Script to Add 5 More Students
-- This script adds users, student profiles, and sample academic records

USE daed_db;

-- 1. Get the password hash from the existing 'student' user
SET @pwd = (SELECT password FROM users WHERE username = 'student' LIMIT 1);
SET @faculty_id = (SELECT id FROM faculty LIMIT 1);

-- 2. Insert 5 New Users (ROLE_STUDENT)
INSERT IGNORE INTO users (username, password, email, role, full_name, created_at) VALUES
('student1', @pwd, 'alice@example.com', 'STUDENT', 'Alice Johnson', NOW()),
('student2', @pwd, 'bob@example.com', 'STUDENT', 'Bob Williams', NOW()),
('student3', @pwd, 'charlie@example.com', 'STUDENT', 'Charlie Brown', NOW()),
('student4', @pwd, 'david@example.com', 'STUDENT', 'David Miller', NOW()),
('student5', @pwd, 'emma@example.com', 'STUDENT', 'Emma Davis', NOW());

-- 3. Insert Student Profiles
INSERT IGNORE INTO students (user_id, roll_number, department, semester)
SELECT id, CONCAT('202400', id), 'Computer Science', 3 FROM users 
WHERE username IN ('student1', 'student2', 'student3', 'student4', 'student5');

-- 4. Get Student IDs
SET @s1_id = (SELECT id FROM students WHERE roll_number LIKE '%student1%' OR user_id = (SELECT id FROM users WHERE username = 'student1') LIMIT 1);
SET @s2_id = (SELECT id FROM students WHERE user_id = (SELECT id FROM users WHERE username = 'student2' LIMIT 1) LIMIT 1);
SET @s3_id = (SELECT id FROM students WHERE user_id = (SELECT id FROM users WHERE username = 'student3' LIMIT 1) LIMIT 1);
SET @s4_id = (SELECT id FROM students WHERE user_id = (SELECT id FROM users WHERE username = 'student4' LIMIT 1) LIMIT 1);
SET @s5_id = (SELECT id FROM students WHERE user_id = (SELECT id FROM users WHERE username = 'student5' LIMIT 1) LIMIT 1);

-- 5. Link them to some subjects (Marks and Attendance)
-- We will use the subjects CS101 - CS109 created earlier
SET @sub1 = (SELECT id FROM subjects WHERE subject_code = 'CS101' LIMIT 1);
SET @sub2 = (SELECT id FROM subjects WHERE subject_code = 'CS102' LIMIT 1);
SET @sub3 = (SELECT id FROM subjects WHERE subject_code = 'CS103' LIMIT 1);

-- Alice (Student 1) - High Performer
INSERT IGNORE INTO marks (student_id, subject_id, internal_marks, external_marks, total_marks, grade, status) VALUES
(@s1_id, @sub1, 48, 49, 97, 'A+', 'PASS'),
(@s1_id, @sub2, 45, 47, 92, 'A+', 'PASS'),
(@s1_id, @sub3, 46, 48, 94, 'A+', 'PASS');

-- Bob (Student 2) - Average
INSERT IGNORE INTO marks (student_id, subject_id, internal_marks, external_marks, total_marks, grade, status) VALUES
(@s2_id, @sub1, 35, 40, 75, 'B', 'PASS'),
(@s2_id, @sub2, 32, 38, 70, 'B', 'PASS'),
(@s2_id, @sub3, 30, 35, 65, 'C', 'PASS');

-- Charlie (Student 3) - Struggling
INSERT IGNORE INTO marks (student_id, subject_id, internal_marks, external_marks, total_marks, grade, status) VALUES
(@s3_id, @sub1, 20, 25, 45, 'E', 'PASS'),
(@s3_id, @sub2, 18, 22, 40, 'E', 'PASS'),
(@s3_id, @sub3, 15, 20, 35, 'F', 'FAIL');

-- David (Student 4) - Good
INSERT IGNORE INTO marks (student_id, subject_id, internal_marks, external_marks, total_marks, grade, status) VALUES
(@s4_id, @sub1, 40, 42, 82, 'A', 'PASS'),
(@s4_id, @sub2, 38, 40, 78, 'B', 'PASS'),
(@s4_id, @sub3, 42, 44, 86, 'A', 'PASS');

-- Emma (Student 5) - Excellent
INSERT IGNORE INTO marks (student_id, subject_id, internal_marks, external_marks, total_marks, grade, status) VALUES
(@s5_id, @sub1, 49, 50, 99, 'A+', 'PASS'),
(@s5_id, @sub2, 47, 48, 95, 'A+', 'PASS'),
(@s5_id, @sub3, 48, 49, 97, 'A+', 'PASS');

-- 6. Add Attendance
INSERT IGNORE INTO attendance (student_id, subject_id, total_classes, attended_classes, percentage) VALUES
(@s1_id, @sub1, 50, 48, 96.0), (@s1_id, @sub2, 50, 47, 94.0),
(@s2_id, @sub1, 50, 40, 80.0), (@s2_id, @sub2, 50, 38, 76.0),
(@s3_id, @sub1, 50, 25, 50.0), (@s3_id, @sub2, 50, 20, 40.0),
(@s4_id, @sub1, 50, 44, 88.0), (@s4_id, @sub2, 50, 42, 84.0),
(@s5_id, @sub1, 50, 49, 98.0), (@s5_id, @sub2, 50, 50, 100.0);

SELECT '✅ 5 New Students and their records added successfully!' as Status;
SELECT 'New Usernames: student1, student2, student3, student4, student5' as Info;
SELECT 'Password for all: password123' as Info;
