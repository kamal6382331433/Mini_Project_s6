# 🔧 Troubleshooting: Sample Data Not Showing

## ✅ **SOLUTION - Follow These Steps:**

### **Step 1: Run the Updated Sample Data Script**

1. Open **MySQL Workbench**
2. Connect to your database
3. Open and execute: `DAED/database/sample_data.sql`
4. Check the output - you should see verification tables

### **Step 2: Verify Data Was Inserted**

Run this in MySQL:
```sql
USE daed_db;

-- Check user to student mapping
SELECT u.id as user_id, u.username, s.id as student_id, s.roll_number
FROM users u
LEFT JOIN students s ON u.id = s.user_id
WHERE u.username = 'student';

-- Check if marks exist
SELECT COUNT(*) as mark_count FROM marks;

-- Check if attendance exists  
SELECT COUNT(*) as attendance_count FROM attendance;
```

**Expected Results:**
- User ID: 3 (or similar)
- Student ID: 1 (or similar)
- Mark count: 4
- Attendance count: 4

### **Step 3: Restart Backend**

1. In Eclipse, **STOP** the application (red square button)
2. **Run** it again (Right-click `DaedBackendApplication.java` → Run As → Java Application)
3. Wait for "Started DaedBackendApplication"

### **Step 4: Clear Browser Cache and Login**

1. Open browser **Developer Tools** (F12)
2. Go to **Application** tab → **Storage** → **Clear site data**
3. Close and reopen `index.html`
4. Login with: `student` / `password123`

### **Step 5: Check Browser Console**

With Developer Tools open (F12):
1. Go to **Console** tab
2. Look for any errors (red text)
3. Go to **Network** tab
4. Look for API calls to `/api/student/marks/` and `/api/student/attendance/`

---

## 🔍 **Common Issues & Fixes**

### Issue 1: "No student profile found"
**Cause:** Student record not created for the user
**Fix:** Run the sample_data.sql script again

### Issue 2: "No marks available yet"
**Cause:** Marks not inserted or wrong student ID
**Fix:** 
```sql
-- Check if marks exist for your student
SELECT m.*, s.roll_number 
FROM marks m 
JOIN students s ON m.student_id = s.id;
```

### Issue 3: API returns 401 Unauthorized
**Cause:** Token expired or invalid
**Fix:** Logout and login again

### Issue 4: API returns 404 Not Found
**Cause:** Backend not running or wrong URL
**Fix:** 
- Check Eclipse console - backend should be running
- Verify URL is `http://localhost:8080`

### Issue 5: CORS Error
**Cause:** Browser security blocking requests
**Fix:** Make sure backend has CORS enabled (already configured in SecurityConfig.java)

---

## 📊 **Manual Data Verification**

Run these queries in MySQL to see your data:

```sql
USE daed_db;

-- See all marks with student details
SELECT 
    u.username,
    s.roll_number,
    sub.subject_name,
    m.internal_marks,
    m.external_marks,
    m.total_marks,
    m.grade,
    m.status
FROM marks m
JOIN students s ON m.student_id = s.id
JOIN users u ON s.user_id = u.id
JOIN subjects sub ON m.subject_id = sub.id;

-- See all attendance with student details
SELECT 
    u.username,
    s.roll_number,
    sub.subject_name,
    a.total_classes,
    a.attended_classes,
    a.percentage
FROM attendance a
JOIN students s ON a.student_id = s.id
JOIN users u ON s.user_id = u.id
JOIN subjects sub ON a.subject_id = sub.id;
```

---

## ✅ **After Following All Steps:**

You should see:
- ✅ 4 subjects in the results table
- ✅ Grades: A, B, C, B
- ✅ All showing PASS status
- ✅ Attendance chart with 4 colored bars
- ✅ Download PDF button working

---

## 🆘 **Still Not Working?**

**Check these files were updated:**
1. `frontend/js/student.js` - Should have new code to fetch student ID
2. `database/sample_data.sql` - Should use variables (@student_id, @subject_id)

**Share this information:**
1. Screenshot of MySQL query results
2. Screenshot of browser console (F12)
3. Screenshot of Eclipse console
4. What you see on the student dashboard

---

**The updated files fix the User ID vs Student ID mismatch issue!**
