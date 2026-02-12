# Digital Academic Evaluation Dashboard (DAED)

## Project Abstract
The **Digital Academic Evaluation Dashboard (DAED)** is a comprehensive full-stack web application designed to streamline academic management processes. It facilitates role-based access for Administrators, Faculty, and Students, allowing efficiently managing profiles, subjects, marks, and attendance. The system provides real-time visualization of student performance through interactive dashboards.

## System Architecture
The project follows the **MVC (Model-View-Controller)** architecture pattern:
- **Frontend (View)**: Built with **Vanilla HTML5, CSS3, and JavaScript**. It uses **Bootstrap 5** for responsive design and **Chart.js** for analytics. It communicates with the backend via REST APIs using the Fetch API.
- **Backend (Controller & Model)**: Powered by **Java Spring Boot**. It handles business logic, security (JWT Authentication), and API requests.
- **Database**: **MySQL** is used for persistent storage of user data, academic records, and configuration.

## Modules

### 1. Authentication Module
- Secure Login with JWT validation.
- Role-based redirection (Admin -> Admin Dashboard, Faculty -> Faculty Dashboard, etc.).

### 2. Admin Module
- **Manage Students**: Add new student profiles.
- **Manage Faculty**: Add new faculty profiles.
- **Manage Subjects**: Create subjects and assign faculty to them.

### 3. Faculty Module
- **View Subjects**: See assigned subjects.
- **Grading**: Enter internal and external marks for students.
- **Attendance**: Update student attendance records.

### 4. Student Module
- **View Results**: Check marks and pass/fail status for subjects.
- **Attendance**: View attendance percentage via bar charts.

## Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript, Bootstrap 5, Chart.js
- **Backend**: Java, Spring Boot, Spring Security, Spring Data JPA
- **Database**: MySQL
- **Tools**: Postman (for API testing), Maven

## Setup & Run Instructions

### Prerequisites
- JDK 17 or higher
- Maven
- MySQL Server

### Database Setup
1. Open MySQL Workbench or Command Line.
2. Run the script located at `DAED/database/db_schema.sql` to create the database and tables.
3. Update `DAED/backend/src/main/resources/application.properties` with your MySQL username and password.

### Backend Setup
1. Navigate to the `DAED/backend` directory.
2. Run the application:
   ```sh
   mvn spring-boot:run
   ```
3. The server will start on `http://localhost:8080`.

### Frontend Setup
1. Navigate to the `DAED/frontend` directory.
2. Open `index.html` in any web browser.
3. Alternatively, use a local server (e.g., Live Server in VS Code) for better experience.

## API Documentation (Postman)

**Base URL**: `http://localhost:8080/api`

### Auth
- `POST /auth/signin` - Body: `{username, password}`
- `POST /auth/signup` - Body: `{username, email, password, fullName, role}`

### Admin
- `POST /admin/student/{userId}` - Add Student Profile
- `POST /admin/faculty/{userId}` - Add Faculty Profile
- `POST /admin/subject` - Add Subject
- `GET /admin/students` - List Students

### Faculty
- `POST /faculty/marks` - Add Marks
- `POST /faculty/attendance` - Add Attendance

### Student
- `GET /student/marks/{studentId}` - Get Results

## Screenshots Description
1. **Login Page**: Clean card-based layout with username/password fields.
2. **Admin Dashboard**: Tabs for managing Students, Faculty, and Subjects. Tables listing current records.
3. **Student Dashboard**: A results table showing grades and a bar chart visualizing attendance.
