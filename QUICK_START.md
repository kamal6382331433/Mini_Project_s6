# DAED - Quick Start Guide

## 🚀 Running the Complete Application

### Method 1: Using Eclipse (Recommended)

1. **Start MySQL Server**
   - Open Services (Win + R → `services.msc`)
   - Find "MySQL80" and ensure it's Running
   - Or run in Command Prompt: `net start MySQL80`

2. **Start Backend in Eclipse**
   - Open Eclipse
   - Navigate to: `src/main/java → com.daed → DaedBackendApplication.java`
   - Right-click → Run As → Java Application
   - Wait for: "Started DaedBackendApplication in X seconds"

3. **Start Frontend**
   - Double-click: `DAED/frontend/START_FRONTEND.bat`
   - Or manually open: `DAED/frontend/index.html`

4. **Login**
   - Username: `admin`
   - Password: `password123`

---

## 📋 Pre-configured Users

| Role | Username | Password | Access |
|------|----------|----------|--------|
| Admin | admin | password123 | Full system access |
| Faculty | faculty | password123 | Enter marks & attendance |
| Student | student | password123 | View results & reports |

---

## 🧪 Testing the Complete Workflow

### Test 1: Admin Creates Subject
1. Login as `admin`
2. Go to "Subjects" tab
3. Fill in:
   - Subject Code: `CS101`
   - Subject Name: `Data Structures`
   - Credits: `4`
   - Faculty ID: `1`
4. Click "Add Subject"
5. Subject appears in the table below

### Test 2: Faculty Enters Marks
1. Logout and login as `faculty`
2. Enter marks:
   - Student ID: `1`
   - Subject ID: `1`
   - Internal Marks: `40`
   - External Marks: `55`
3. Click "Submit Marks"
4. System calculates: Total = 95, Grade = A, Status = PASS

### Test 3: Faculty Updates Attendance
1. Still logged in as `faculty`
2. Enter attendance:
   - Student ID: `1`
   - Subject ID: `1`
   - Total Classes: `100`
   - Attended Classes: `85`
3. Click "Update Attendance"
4. System calculates: Percentage = 85%

### Test 4: Student Views Results
1. Logout and login as `student`
2. View results table showing:
   - Subject name
   - Internal, External, Total marks
   - Grade (A)
   - Status (PASS)
3. View attendance bar chart showing 85%
4. Click "Download PDF Report"
5. PDF downloads with complete performance summary

---

## 🔧 Troubleshooting

### Issue: "Failed to fetch"
**Solution:**
- Ensure backend is running in Eclipse
- Check Eclipse Console for errors
- Verify backend is on port 8080

### Issue: "Unauthorized"
**Solution:**
- This is normal before login
- Login with correct credentials
- Check browser console (F12) for errors

### Issue: Database connection error
**Solution:**
- Verify MySQL is running
- Check `application.properties`:
  - Username: `root`
  - Password: `kamal123`
- Ensure `daed_db` database exists

### Issue: Blank page after login
**Solution:**
- Check browser console (F12)
- Verify backend is running
- Check Network tab for failed requests

---

## 📊 API Endpoints Summary

### Authentication
- POST `/api/auth/signin` - Login
- POST `/api/auth/signup` - Register new user

### Admin
- POST `/api/admin/student/{userId}` - Create student profile
- POST `/api/admin/faculty/{userId}` - Create faculty profile
- POST `/api/admin/subject` - Create subject
- GET `/api/admin/students` - List all students
- GET `/api/admin/faculty` - List all faculty
- GET `/api/admin/subjects` - List all subjects

### Faculty
- POST `/api/faculty/marks` - Enter marks
- POST `/api/faculty/attendance` - Update attendance
- GET `/api/faculty/subjects/{facultyId}` - Get assigned subjects

### Student
- GET `/api/student/marks/{studentId}` - Get marks
- GET `/api/student/attendance/{studentId}` - Get attendance

### Reports
- GET `/api/reports/student/{studentId}` - Download PDF report

---

## 📁 Important Files

### Backend
- Main Application: `backend/src/main/java/com/daed/DaedBackendApplication.java`
- Configuration: `backend/src/main/resources/application.properties`

### Frontend
- Login Page: `frontend/index.html`
- Admin Dashboard: `frontend/pages/admin.html`
- Faculty Dashboard: `frontend/pages/faculty.html`
- Student Dashboard: `frontend/pages/student.html`

### Database
- Schema: `database/db_schema.sql`

---

## ✅ Project Status

**ALL FEATURES IMPLEMENTED AND TESTED:**
- ✅ User Authentication (JWT)
- ✅ Role-based Access Control
- ✅ Admin Module (User/Subject Management)
- ✅ Faculty Module (Marks/Attendance Entry)
- ✅ Student Module (Results/Reports Viewing)
- ✅ Automatic Grade Calculation
- ✅ PDF Report Generation
- ✅ Data Visualization (Charts)
- ✅ Responsive Design

**The project is 100% complete and ready for demonstration!**
