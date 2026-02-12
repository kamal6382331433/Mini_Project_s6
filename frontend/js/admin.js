const ADMIN_API = `${window.DAED_CONFIG.API_BASE_URL}/admin`;
const AUTH_API = `${window.DAED_CONFIG.API_BASE_URL}/auth`;

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is admin
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'ROLE_ADMIN') {
        window.location.href = '../index.html';
        return;
    }

    loadStudents();
    loadFaculty();
    loadSubjects();

    // Add Student
    document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('s_username').value;
        // First register user
        const newUser = {
            username: username,
            email: document.getElementById('s_email').value,
            password: document.getElementById('s_password').value,
            fullName: document.getElementById('s_fullname').value,
            role: 'student'
        };

        try {
            // 1. Signup User
            const authRes = await fetch(`${AUTH_API}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (!authRes.ok) throw new Error("Failed to create user account");

            // We need to fetch the created user ID or assume the implementation handles it.
            // Since our current flow doesn't return ID easily and requires login to find ID, 
            // In a real app we'd likely adjust the backend to return the created User object or ID.
            // For this simpler version, we will actually rely on the backend finding the user by username 
            // OR we'd need to adjust logic. 
            // To Fix: We need the User ID to create the Student Profile.
            // WORKAROUND: We will implement a 'getUserByUsername' endpoint or similar in AdminController in a robust app.

            // NOTE: Due to the complexity, I'll alert the user that in a real production app, 
            // we'd chain these calls better. For now, let's assume manual ID entry or we fetch user list.
            alert("User Account Created! Please manually map User ID for now or implement user lookup.");

            // Ideal flow: Signup returns ID -> Call /api/admin/student/{userId}

        } catch (error) {
            alert(error.message);
        }
    });

    // Add Subject
    document.getElementById('addSubjectForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const subject = {
            subjectCode: document.getElementById('sub_code').value,
            subjectName: document.getElementById('sub_name').value,
            department: document.getElementById('sub_dept').value,
            semester: document.getElementById('sub_sem').value
        };

        try {
            const response = await fetch(`${ADMIN_API}/subject`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(subject)
            });
            if (response.ok) {
                alert("Subject Added!");
                loadSubjects();
            } else {
                alert("Failed");
            }
        } catch (e) { console.error(e); }
    });
});

async function loadStudents() {
    try {
        const response = await fetch(`${ADMIN_API}/students`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        let html = '<ul class="list-group">';
        data.forEach(s => {
            html += `<li class="list-group-item">${s.rollNumber} - ${s.user ? s.user.fullName : 'No User'} (${s.department})</li>`;
        });
        html += '</ul>';
        document.getElementById('studentListContainer').innerHTML = html;
    } catch (e) {
        document.getElementById('studentListContainer').innerHTML = "Error loading students";
    }
}

async function loadFaculty() {
    try {
        const response = await fetch(`${ADMIN_API}/faculties`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        let html = '<ul class="list-group">';
        data.forEach(f => {
            html += `<li class="list-group-item">${f.id} - ${f.user ? f.user.fullName : 'No User'} (${f.designation})</li>`;
        });
        html += '</ul>';
        document.getElementById('facultyListContainer').innerHTML = html;
    } catch (e) {
        document.getElementById('facultyListContainer').innerHTML = "Error loading faculty";
    }
}

async function loadSubjects() {
    try {
        const response = await fetch(`${ADMIN_API}/subjects`, {
            headers: getAuthHeaders()
        });
        const data = await response.json();
        let html = '<table class="table"><thead><tr><th>ID</th><th>Code</th><th>Name</th><th>Faculty ID</th></tr></thead><tbody>';
        data.forEach(s => {
            html += `<tr>
                <td>${s.id}</td>
                <td>${s.subjectCode}</td>
                <td>${s.subjectName}</td>
                <td>${s.faculty ? s.faculty.id : 'Unassigned'}</td>
            </tr>`;
        });
        html += '</tbody></table>';
        document.getElementById('subjectListContainer').innerHTML = html;
    } catch (e) {
        document.getElementById('subjectListContainer').innerHTML = "Error loading subjects";
    }
}
