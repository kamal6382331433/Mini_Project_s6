const STUDENT_API = `${window.DAED_CONFIG.API_BASE_URL}/student`;

let studentId = null;

document.addEventListener('DOMContentLoaded', async () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'ROLE_STUDENT') {
        window.location.href = '../index.html';
        return;
    }

    // Fetch student profile using the new secure endpoint
    const url = `${STUDENT_API}/profile/${user.id}`;
    console.log("Fetching User Profile from:", url); // DEBUG LOG

    try {
        const response = await fetch(url, {
            headers: getAuthHeaders()
        });

        if (response.status === 401 || response.status === 403) {
            alert('Session expired. Please login again.');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '../index.html';
            return;
        }

        if (!response.ok) {
            throw new Error(`Server returned ${response.status} ${response.statusText}. Ensure Backend is restarted.`);
        }

        const studentRecord = await response.json();

        if (studentRecord) {
            studentId = studentRecord.id;
            loadResults(studentId);
            loadAttendance(studentId);
        }
    } catch (e) {
        console.error('Error fetching profile:', e);
        document.getElementById('resultsTable').innerHTML = `<tr><td colspan="6" class="text-center text-danger">Error: ${e.message}</td></tr>`;
    }
});

async function loadResults(studentId) {
    try {
        const response = await fetch(`${STUDENT_API}/marks/${studentId}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch marks');
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            document.getElementById('resultsTable').innerHTML = '<tr><td colspan="6" class="text-center text-muted">No marks available yet. Please check back later.</td></tr>';
            return;
        }

        let html = '';
        const getGradeColor = (grade) => {
            if (!grade) return 'bg-secondary';
            if (grade.startsWith('A')) return 'bg-success';
            if (grade.startsWith('B')) return 'bg-info';
            if (grade.startsWith('C')) return 'bg-warning text-dark';
            if (grade.startsWith('D')) return 'bg-warning text-dark';
            return 'bg-danger';
        };

        data.forEach(m => {
            html += `<tr>
                <td class="text-white">${m.subject.subjectName}</td>
                <td>${m.internalMarks}</td>
                <td>${m.externalMarks}</td>
                <td><strong class="text-primary-custom" style="font-size: 1rem;">${m.totalMarks}</strong></td>
                <td><span class="badge ${getGradeColor(m.grade)}">${m.grade}</span></td>
                <td class="${m.status === 'PASS' ? 'text-success' : 'text-danger'}">
                    <i class="bi bi-${m.status === 'PASS' ? 'check-circle-fill' : 'x-circle-fill'} me-1"></i>
                    <strong>${m.status}</strong>
                </td>
            </tr>`;
        });
        document.getElementById('resultsTable').innerHTML = html;
    } catch (e) {
        console.error('Error loading results:', e);
        document.getElementById('resultsTable').innerHTML = '<tr><td colspan="6" class="text-center text-danger">Error loading marks. Please try again.</td></tr>';
    }
}

async function loadAttendance(studentId) {
    try {
        const response = await fetch(`${STUDENT_API}/attendance/${studentId}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error('Failed to fetch attendance');
        }

        const data = await response.json();

        if (!data || data.length === 0) {
            console.log('No attendance data available');
            return;
        }

        // Prepare Chart Data
        const labels = data.map(a => a.subject.subjectName);
        const percentages = data.map(a => a.percentage);

        // Define colors based on attendance percentage
        const backgroundColors = percentages.map(p => {
            if (p >= 85) return 'rgba(16, 185, 129, 0.8)'; // Green
            if (p >= 75) return 'rgba(245, 158, 11, 0.8)'; // Orange
            return 'rgba(239, 68, 68, 0.8)'; // Red
        });

        const ctx = document.getElementById('attendanceChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Attendance %',
                    data: percentages,
                    backgroundColor: backgroundColors,
                    borderColor: backgroundColors.map(c => c.replace('0.8', '1')),
                    borderWidth: 2,
                    borderRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: '#f1f5f9'
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    },
                    x: {
                        ticks: {
                            color: '#cbd5e1'
                        },
                        grid: {
                            color: 'rgba(255, 255, 255, 0.1)'
                        }
                    }
                }
            }
        });

    } catch (e) {
        console.error('Error loading attendance:', e);
    }
}

async function downloadReport() {
    if (!studentId) {
        alert('Student profile not loaded. Please refresh the page.');
        return;
    }

    try {
        const response = await fetch(`${window.DAED_CONFIG.API_BASE_URL}/reports/student/${studentId}`, {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });

        if (response.ok) {
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `student_report_${studentId}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } else {
            alert("Failed to download report. Please try again.");
        }
    } catch (e) {
        console.error('Error downloading report:', e);
        alert("Error downloading report. Please try again.");
    }
}
