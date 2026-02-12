# Quick Data Setup Guide

## 📊 Insert Sample Data

### Method 1: Using MySQL Workbench (Recommended)

1. **Open MySQL Workbench**
2. **Connect to your database**
3. **Open the script**:
   - File → Open SQL Script
   - Navigate to: `DAED/database/sample_data.sql`
4. **Execute the script**:
   - Click the lightning bolt icon (⚡) or press `Ctrl+Shift+Enter`
5. **Verify**:
   - You should see success messages and data counts

### Method 2: Using MySQL Command Line

```cmd
mysql -u root -pkamal123
```

Then run:
```sql
source c:/Users/kamal/OneDrive/Desktop/mini project s6/DAED/database/sample_data.sql
```

Or:
```cmd
mysql -u root -pkamal123 daed_db < "c:\Users\kamal\OneDrive\Desktop\mini project s6\DAED\database\sample_data.sql"
```

---

## 📋 What Gets Inserted

### ✅ 1 Student Profile
- **Name**: John Doe (linked to existing `student` user)
- **Roll Number**: 2024001
- **Department**: Computer Science
- **Semester**: 3

### ✅ 1 Faculty Profile
- **Name**: Dr. Smith (linked to existing `faculty` user)
- **Department**: Computer Science
- **Designation**: Professor

### ✅ 4 Subjects
1. **CS101** - Data Structures
2. **CS102** - Database Management Systems
3. **CS103** - Operating Systems
4. **CS104** - Computer Networks

### ✅ 4 Marks Records
| Subject | Internal | External | Total | Grade | Status |
|---------|----------|----------|-------|-------|--------|
| Data Structures | 45 | 50 | 95 | A | PASS |
| DBMS | 40 | 45 | 85 | B | PASS |
| OS | 35 | 40 | 75 | C | PASS |
| Networks | 38 | 42 | 80 | B | PASS |

### ✅ 4 Attendance Records
| Subject | Total | Attended | Percentage |
|---------|-------|----------|------------|
| Data Structures | 100 | 92 | 92% |
| DBMS | 100 | 85 | 85% |
| OS | 100 | 78 | 78% |
| Networks | 100 | 88 | 88% |

---

## 🎯 After Running the Script

### Test the Application:

1. **Ensure Backend is Running** (in Eclipse)

2. **Open Frontend**: `DAED/frontend/index.html`

3. **Login as Student**:
   - Username: `student`
   - Password: `password123`

4. **You Should See**:
   - ✅ Results table with 4 subjects
   - ✅ Grades (A, B, C, B)
   - ✅ All showing PASS status
   - ✅ Attendance bar chart with 4 bars
   - ✅ Download PDF Report button working

5. **Test PDF Download**:
   - Click "Download PDF Report"
   - PDF should download with all marks and student details

---

## 🔍 Troubleshooting

### If you see "No marks found":

**Check 1**: Verify data was inserted
```sql
USE daed_db;
SELECT COUNT(*) FROM marks;
SELECT COUNT(*) FROM attendance;
```

**Check 2**: Check student ID mapping
```sql
SELECT s.id, u.username, s.roll_number 
FROM students s 
JOIN users u ON s.user_id = u.id;
```

**Check 3**: Browser Console (F12)
- Look for API errors
- Check Network tab for failed requests

**Check 4**: Backend Console (Eclipse)
- Look for SQL errors
- Verify queries are executing

---

## 🚀 Quick Test Commands

After inserting data, verify in MySQL:

```sql
-- Check if marks exist
SELECT * FROM marks WHERE student_id = 1;

-- Check if attendance exists
SELECT * FROM attendance WHERE student_id = 1;

-- Check student-user mapping
SELECT u.id as user_id, u.username, s.id as student_id, s.roll_number
FROM users u
LEFT JOIN students s ON u.id = s.user_id
WHERE u.username = 'student';
```

---

**Run the `sample_data.sql` script now and then refresh your student dashboard!** 🎉
