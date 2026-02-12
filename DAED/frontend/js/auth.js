const API_URL = `${window.DAED_CONFIG.API_BASE_URL}/auth`;

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const errorMessage = document.getElementById('errorMessage');
    const loading = document.getElementById('loading');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            // Show loading
            loading.classList.remove('d-none');
            errorMessage.classList.add('d-none');

            try {
                const response = await fetch(`${API_URL}/signin`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username, password })
                });

                const data = await response.json();

                if (response.ok) {
                    // Save Token and User Info
                    localStorage.setItem('token', data.token);
                    localStorage.setItem('user', JSON.stringify(data));

                    // Redirect based on role
                    if (data.role === 'ROLE_ADMIN') {
                        window.location.href = 'pages/admin.html';
                    } else if (data.role === 'ROLE_FACULTY') {
                        window.location.href = 'pages/faculty.html';
                    } else if (data.role === 'ROLE_STUDENT') {
                        window.location.href = 'pages/student.html';
                    } else {
                        throw new Error("Unknown Role");
                    }
                } else {
                    throw new Error(data.message || 'Login failed');
                }
            } catch (error) {
                const errorText = document.getElementById('errorText');
                if (errorText) {
                    errorText.textContent = error.message;
                } else {
                    errorMessage.textContent = error.message;
                }
                errorMessage.classList.remove('d-none');
            } finally {
                loading.classList.add('d-none');
            }
        });
    }
});

// Logout Function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '../index.html';
}

// Check Auth Header helper
function getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + token
    };
}
