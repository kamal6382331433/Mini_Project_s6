// ============================================================
//  DAED Student Dashboard — Enhanced JS
// ============================================================

const STUDENT_API = `${window.DAED_CONFIG.API_BASE_URL}/student`;

let studentId = null;
let studentName = '';

// ===== MOTIVATIONAL QUOTES =====
const QUOTES = [
    "🚀 The secret of getting ahead is getting started. – Mark Twain",
    "📚 Education is the most powerful weapon you can use to change the world. – Mandela",
    "💡 Believe you can and you're halfway there. – Theodore Roosevelt",
    "🎯 Don't watch the clock; do what it does. Keep going. – Sam Levenson",
    "🌟 Hard work beats talent when talent doesn't work hard.",
    "🏆 Success is the sum of small efforts repeated day in and day out.",
    "🔥 Push yourself, because no one else is going to do it for you.",
    "📖 An investment in knowledge pays the best interest. – Benjamin Franklin"
];

// ===== FLOATING PARTICLES =====
function initParticles() {
    const canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = Array.from({ length: 55 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.5 + 0.1
    }));

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(139, 92, 246, ${p.alpha})`;
            ctx.fill();
            p.x += p.dx;
            p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        });
        requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

// ===== QUOTE TICKER =====
function startQuoteTicker() {
    const el = document.getElementById('quoteText');
    if (!el) return;
    const q = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    el.textContent = q;
}

// ===== PROFILE DISPLAY =====
function displayProfile(record) {
    const name = record.studentName || record.name || (record.user && record.user.fullName) || 'Student';
    studentName = name;

    // Navbar
    const navEl = document.getElementById('navStudentName');
    if (navEl) navEl.textContent = name;

    // Hero
    const heroName = document.getElementById('heroStudentName');
    if (heroName) heroName.textContent = name;

    const heroId = document.getElementById('heroStudentId');
    if (heroId) heroId.textContent = `ID: ${record.id || '—'}`;

    const heroDept = document.getElementById('heroDept');
    if (heroDept) heroDept.textContent = record.department || record.dept || 'CSE';

    const heroSem = document.getElementById('heroSem');
    if (heroSem) heroSem.textContent = record.semester || record.sem || '6';

    // Avatar initials
    const parts = name.trim().split(' ');
    const initials = parts.length >= 2
        ? parts[0][0] + parts[parts.length - 1][0]
        : name.substring(0, 2);
    const avatarEl = document.getElementById('avatarInitials');
    if (avatarEl) avatarEl.textContent = initials.toUpperCase();
}

// ===== STAT PILLS =====
function updateStatPills(marksData, attendanceData) {
    // Overall average score
    if (marksData && marksData.length > 0) {
        const avg = marksData.reduce((s, m) => s + (m.totalMarks || 0), 0) / marksData.length;
        const statCGPA = document.getElementById('statCGPA');
        if (statCGPA) statCGPA.textContent = avg.toFixed(1);

        // Pass rate
        const passes = marksData.filter(m => m.status === 'PASS').length;
        const passRate = Math.round((passes / marksData.length) * 100);
        const statPassRate = document.getElementById('statPassRate');
        if (statPassRate) statPassRate.textContent = passRate + '%';

        // Best subject score
        const best = Math.max(...marksData.map(m => m.totalMarks || 0));
        const statBest = document.getElementById('statBestSubject');
        if (statBest) statBest.textContent = best;

        // Subject progress bars
        renderSubjectProgressBars(marksData);

        // Badges
        renderBadges(marksData, passRate, avg);

        // Grade Pie + Radar charts
        renderGradesPie(marksData);
        renderRadarChart(marksData);
    }

    // Avg attendance
    if (attendanceData && attendanceData.length > 0) {
        const avgAtt = attendanceData.reduce((s, a) => s + (a.percentage || 0), 0) / attendanceData.length;
        const statAtt = document.getElementById('statAttendance');
        if (statAtt) statAtt.textContent = avgAtt.toFixed(0) + '%';

        // Low attendance warning
        checkLowAttendance(attendanceData);
    }

    // Study tips (uses both data sources)
    renderStudyTips(marksData, attendanceData);
}


// ===== ACHIEVEMENT BADGES =====
function renderBadges(marksData, passRate, avg) {
    const strip = document.getElementById('badgesStrip');
    if (!strip) return;

    const badges = [];

    if (passRate === 100) badges.push({ label: 'Perfect Pass', icon: '🎯', cls: 'gold' });
    if (passRate >= 80) badges.push({ label: 'High Achiever', icon: '⭐', cls: 'blue' });
    if (avg >= 80) badges.push({ label: 'Distinction Star', icon: '🌟', cls: 'gold' });
    if (avg >= 60 && avg < 80) badges.push({ label: 'Merit Student', icon: '🏅', cls: 'blue' });

    const best = Math.max(...marksData.map(m => m.totalMarks || 0));
    if (best >= 90) badges.push({ label: 'Subject Topper', icon: '🏆', cls: 'purple' });
    if (marksData.length >= 5) badges.push({ label: 'Full Semester', icon: '📚', cls: 'green' });

    const hasA = marksData.some(m => m.grade && m.grade.startsWith('A'));
    if (hasA) badges.push({ label: 'Grade A Earner', icon: '💎', cls: 'purple' });

    const hasFail = marksData.some(m => m.status === 'FAIL');
    if (!hasFail) badges.push({ label: 'No Backlogs', icon: '✅', cls: 'green' });
    if (hasFail) badges.push({ label: 'Needs Improvement', icon: '📈', cls: 'red' });

    if (badges.length === 0) {
        badges.push({ label: 'Keep Going!', icon: '🔥', cls: 'blue' });
    }

    strip.innerHTML = badges.map((b, i) =>
        `<span class="badge-chip ${b.cls}" style="animation-delay:${i * 0.08}s">
            ${b.icon} ${b.label}
        </span>`
    ).join('');
}

// ===== SUBJECT PROGRESS BARS =====
function renderSubjectProgressBars(marksData) {
    const container = document.getElementById('subjectProgressBars');
    if (!container) return;

    const maxScore = 100; // assuming total is out of 100

    container.innerHTML = marksData.map((m, i) => {
        const pct = Math.min(100, Math.round(((m.totalMarks || 0) / maxScore) * 100));
        const cls = pct >= 70 ? 'high' : pct >= 50 ? 'mid' : 'low';
        return `
        <div class="subject-bar-wrap" style="animation-delay:${i * 0.07}s">
            <div class="subject-bar-label">
                <span>${m.subject ? m.subject.subjectName : 'Subject'}</span>
                <span class="pct" style="color:${cls === 'high' ? '#34d399' : cls === 'mid' ? '#fbbf24' : '#f87171'}">${m.totalMarks}/${maxScore}</span>
            </div>
            <div class="subject-bar-track">
                <div class="subject-bar-fill ${cls}" id="bar-${i}" style="width:0%"></div>
            </div>
        </div>`;
    }).join('');

    // Animate bars after a tick
    setTimeout(() => {
        marksData.forEach((m, i) => {
            const pct = Math.min(100, Math.round(((m.totalMarks || 0) / maxScore) * 100));
            const bar = document.getElementById(`bar-${i}`);
            if (bar) bar.style.width = pct + '%';
        });
    }, 100);
}

// ===== GAUGE (Circular) =====
function setGauge(pct) {
    const circumference = 2 * Math.PI * 65; // r=65 → 408.41
    const offset = circumference - (pct / 100) * circumference;
    const fill = document.getElementById('gaugeFill');
    if (fill) fill.style.strokeDashoffset = offset;
    const txt = document.getElementById('gaugePercent');
    if (txt) txt.textContent = Math.round(pct) + '%';
}

// ===== ATTENDANCE SUBJECT BARS =====
function renderAttendanceSubjectBars(attendanceData) {
    const container = document.getElementById('attendanceSubjectBars');
    if (!container) return;

    container.innerHTML = attendanceData.map(a => {
        const pct = Math.min(100, Math.round(a.percentage || 0));
        const cls = pct >= 85 ? 'high' : pct >= 75 ? 'mid' : 'low';
        const subName = a.subject ? a.subject.subjectName : 'Subject';
        const subId = a.subject ? a.subject.id : 0;
        const studId = a.student ? a.student.id : studentId;
        return `
        <div class="att-subject-item">
            <div class="att-pct-badge ${cls}">${pct}%</div>
            <div class="att-subject-bar">
                <div style="font-size:0.82rem;color:#cbd5e1;margin-bottom:5px;font-weight:600;">${subName}</div>
                <div class="subject-bar-track">
                    <div class="subject-bar-fill ${cls}" style="width:${pct}%;transition:width 1s ease;"></div>
                </div>
            </div>
            <button class="btn btn-outline-danger btn-sm" onclick="deleteStudentAttendance(${studId}, ${subId}, '${subName.replace(/'/g, "\\\'")}')" title="Delete Attendance" style="flex-shrink:0;">
                <i class="bi bi-trash"></i>
            </button>
        </div>`;
    }).join('');
}

// ===== MARKS CHART =====
function renderMarksChart(marksData) {
    const labels = marksData.map(m => m.subject ? m.subject.subjectName : '');
    const internal = marksData.map(m => m.internalMarks || 0);
    const external = marksData.map(m => m.externalMarks || 0);
    const ctx = document.getElementById('attendanceChart');
    if (!ctx) return;
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [
                {
                    label: 'Internal',
                    data: internal,
                    backgroundColor: 'rgba(99,102,241,0.75)',
                    borderColor: '#6366f1',
                    borderWidth: 2,
                    borderRadius: 6
                },
                {
                    label: 'External',
                    data: external,
                    backgroundColor: 'rgba(139,92,246,0.75)',
                    borderColor: '#8b5cf6',
                    borderWidth: 2,
                    borderRadius: 6
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    labels: { color: '#f1f5f9', font: { size: 12 } }
                },
                tooltip: {
                    backgroundColor: '#1e293b',
                    borderColor: '#334155',
                    borderWidth: 1,
                    titleColor: '#f1f5f9',
                    bodyColor: '#cbd5e1'
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: { color: '#cbd5e1' },
                    grid: { color: 'rgba(255,255,255,0.07)' }
                },
                x: {
                    ticks: { color: '#cbd5e1', maxRotation: 30 },
                    grid: { color: 'rgba(255,255,255,0.07)' }
                }
            }
        }
    });
}

// ===== GRADE DISTRIBUTION PIE =====
function renderGradesPie(marksData) {
    const canvas = document.getElementById('gradesPieChart');
    if (!canvas || !marksData || marksData.length === 0) return;

    const gradeCounts = {};
    marksData.forEach(m => {
        const g = m.grade || 'N/A';
        gradeCounts[g] = (gradeCounts[g] || 0) + 1;
    });

    const gradeColorMap = {
        'A+': '#10b981', 'A': '#34d399',
        'B+': '#3b82f6', 'B': '#60a5fa',
        'C': '#f59e0b', 'D': '#f97316',
        'F': '#ef4444', 'N/A': '#64748b'
    };

    const labels = Object.keys(gradeCounts);
    const dataVals = Object.values(gradeCounts);
    const colors = labels.map(g => gradeColorMap[g] || '#818cf8');

    new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{ data: dataVals, backgroundColor: colors, borderColor: '#0f172a', borderWidth: 3, hoverOffset: 10 }]
        },
        options: {
            responsive: true,
            cutout: '65%',
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: 1,
                    titleColor: '#f1f5f9', bodyColor: '#cbd5e1'
                }
            }
        }
    });

    // Custom legend
    const legend = document.getElementById('gradesPieLegend');
    if (legend) {
        legend.innerHTML = labels.map((g, i) =>
            `<span style="display:inline-flex;align-items:center;gap:5px;font-size:0.8rem;font-weight:600;color:#cbd5e1;">
                <span style="width:10px;height:10px;border-radius:50%;background:${colors[i]};display:inline-block;"></span>
                ${g}: ${dataVals[i]}
            </span>`
        ).join('');
    }
}

// ===== RADAR CHART =====
function renderRadarChart(marksData) {
    const canvas = document.getElementById('radarChart');
    if (!canvas || !marksData || !marksData.length) return;

    const labels = marksData.map(m => m.subject ? m.subject.subjectName : 'Sub');
    const scores = marksData.map(m => m.totalMarks || 0);

    new Chart(canvas, {
        type: 'radar',
        data: {
            labels,
            datasets: [{
                label: 'Your Score',
                data: scores,
                backgroundColor: 'rgba(99,102,241,0.2)',
                borderColor: '#6366f1',
                borderWidth: 2,
                pointBackgroundColor: '#818cf8',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#6366f1',
                pointRadius: 5
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { labels: { color: '#f1f5f9', font: { size: 12 } } },
                tooltip: {
                    backgroundColor: '#1e293b', borderColor: '#334155', borderWidth: 1,
                    titleColor: '#f1f5f9', bodyColor: '#cbd5e1'
                }
            },
            scales: {
                r: {
                    min: 0, max: 100,
                    ticks: { color: '#94a3b8', font: { size: 10 }, backdropColor: 'transparent', stepSize: 20 },
                    grid: { color: 'rgba(255,255,255,0.08)' },
                    angleLines: { color: 'rgba(255,255,255,0.08)' },
                    pointLabels: { color: '#cbd5e1', font: { size: 11 } }
                }
            }
        }
    });
}

// ===== LOW ATTENDANCE WARNING =====
function checkLowAttendance(attendanceData) {
    if (!attendanceData || !attendanceData.length) return;
    const lowSubjects = attendanceData.filter(a => (a.percentage || 0) < 75);
    if (lowSubjects.length === 0) return;

    const warnDiv = document.getElementById('lowAttWarning');
    const listDiv = document.getElementById('lowAttList');
    if (!warnDiv || !listDiv) return;

    warnDiv.style.display = 'block';
    listDiv.innerHTML = lowSubjects.map(a => {
        const name = a.subject ? a.subject.subjectName : 'Subject';
        const pct = Math.round(a.percentage || 0);
        return `<span style="background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.35);color:#f87171;padding:5px 12px;border-radius:20px;font-size:0.82rem;font-weight:600;">
            ⚠️ ${name} — ${pct}%
        </span>`;
    }).join('');
}

// ===== PERSONALIZED STUDY TIPS =====
function renderStudyTips(marksData, attendanceData) {
    const tips = [];

    if (marksData) {
        const weakSubjects = marksData.filter(m => (m.totalMarks || 0) < 60);
        weakSubjects.forEach(m => {
            const name = m.subject ? m.subject.subjectName : 'a subject';
            tips.push({
                icon: '📖', color: '#f59e0b',
                text: `Focus more on <strong>${name}</strong> — your score of <strong>${m.totalMarks}/100</strong> needs improvement.`
            });
        });

        const hasF = marksData.some(m => m.status === 'FAIL');
        if (hasF) tips.push({ icon: '📝', color: '#ef4444', text: 'You have failing subjects. Consider attending extra classes or revision sessions.' });

        const excellent = marksData.filter(m => (m.totalMarks || 0) >= 90);
        excellent.forEach(m => {
            tips.push({ icon: '🌟', color: '#10b981', text: `Excellent work in <strong>${m.subject ? m.subject.subjectName : 'subject'}</strong>! Keep it up.` });
        });
    }

    if (attendanceData) {
        const lowAtt = attendanceData.filter(a => (a.percentage || 0) < 75);
        lowAtt.forEach(a => {
            tips.push({ icon: '🗓️', color: '#ef4444', text: `Your attendance in <strong>${a.subject ? a.subject.subjectName : 'a subject'}</strong> is critically low at <strong>${Math.round(a.percentage)}%</strong>. Attend all upcoming classes.` });
        });
    }

    if (tips.length === 0) {
        tips.push({ icon: '🎉', color: '#10b981', text: 'Great job! Keep maintaining your excellent academic performance.' });
    }

    const card = document.getElementById('studyTipsCard');
    const list = document.getElementById('studyTipsList');
    if (!card || !list) return;

    card.style.display = 'block';
    list.innerHTML = tips.map(t =>
        `<div style="display:flex;align-items:flex-start;gap:12px;padding:12px 16px;background:rgba(15,23,42,0.5);border:1px solid rgba(255,255,255,0.06);border-left:3px solid ${t.color};border-radius:10px;">
            <span style="font-size:1.2rem;flex-shrink:0;">${t.icon}</span>
            <span style="font-size:0.88rem;color:#cbd5e1;">${t.text}</span>
        </div>`
    ).join('');
}

// ===== RESULTS TABLE =====

function renderResultsTable(data) {
    const getGradeColor = (grade) => {
        if (!grade) return 'bg-secondary';
        if (grade.startsWith('A')) return 'bg-success';
        if (grade.startsWith('B')) return 'bg-info';
        if (grade.startsWith('C')) return 'bg-warning text-dark';
        if (grade.startsWith('D')) return 'bg-warning text-dark';
        return 'bg-danger';
    };

    if (!data || data.length === 0) {
        document.getElementById('resultsTable').innerHTML =
            '<tr><td colspan="7" class="text-center text-muted">No marks available yet. Please check back later.</td></tr>';
        return;
    }

    let html = '';
    data.forEach(m => {
        const pct = Math.min(100, Math.round(((m.totalMarks || 0) / 100) * 100));
        const ringColor = pct >= 70 ? '#10b981' : pct >= 50 ? '#f59e0b' : '#ef4444';
        const subName = m.subject ? m.subject.subjectName : '—';
        const subId = m.subject ? m.subject.id : 0;
        html += `<tr>
            <td class="text-white">${subName}</td>
            <td>${m.internalMarks}</td>
            <td>${m.externalMarks}</td>
            <td>
                <span style="font-family:'Space Grotesk',sans-serif;font-weight:800;font-size:1rem;color:${ringColor};">
                    ${m.totalMarks}
                </span>
            </td>
            <td><span class="badge ${getGradeColor(m.grade)}">${m.grade}</span></td>
            <td class="${m.status === 'PASS' ? 'text-success' : 'text-danger'}">
                <i class="bi bi-${m.status === 'PASS' ? 'check-circle-fill' : 'x-circle-fill'} me-1"></i>
                <strong>${m.status}</strong>
            </td>
            <td>
                <button class="btn btn-outline-danger btn-sm" onclick="deleteStudentMarks(${m.student ? m.student.id : studentId}, ${subId}, '${subName.replace(/'/g, "\\\'")}')" title="Delete Marks">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>`;
    });
    document.getElementById('resultsTable').innerHTML = html;
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', async () => {
    // Start visual effects immediately
    initParticles();
    startQuoteTicker();

    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'ROLE_STUDENT') {
        window.location.href = '../index.html';
        return;
    }

    const url = `${STUDENT_API}/profile/${user.id}`;

    try {
        const response = await fetch(url, { headers: getAuthHeaders() });

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
            displayProfile(studentRecord);
            // Load marks and attendance concurrently
            const [marksData, attendanceData] = await Promise.all([
                loadResults(studentId),
                loadAttendance(studentId)
            ]);
            updateStatPills(marksData, attendanceData);
        }

    } catch (e) {
        console.error('Error fetching profile:', e);
        document.getElementById('resultsTable').innerHTML =
            `<tr><td colspan="7" class="text-center text-danger">Error: ${e.message}</td></tr>`;
    }
});

// ============================================================
async function loadResults(studentId) {
    try {
        const response = await fetch(`${STUDENT_API}/marks/${studentId}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to fetch marks');
        const data = await response.json();
        renderResultsTable(data);
        if (data && data.length > 0) renderMarksChart(data);
        return data;
    } catch (e) {
        console.error('Error loading results:', e);
        document.getElementById('resultsTable').innerHTML =
            '<tr><td colspan="7" class="text-center text-danger">Error loading marks. Please try again.</td></tr>';
        return [];
    }
}

async function loadAttendance(studentId) {
    try {
        const response = await fetch(`${STUDENT_API}/attendance/${studentId}`, {
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error('Failed to fetch attendance');
        const data = await response.json();

        if (!data || data.length === 0) {
            console.log('No attendance data available');
            return [];
        }

        // Average attendance gauge
        const avg = data.reduce((s, a) => s + (a.percentage || 0), 0) / data.length;
        setGauge(avg);

        // Per-subject bars
        renderAttendanceSubjectBars(data);

        return data;
    } catch (e) {
        console.error('Error loading attendance:', e);
        return [];
    }
}

// ============================================================
async function downloadReport() {
    if (!studentId) {
        alert('Student profile not loaded. Please refresh the page.');
        return;
    }
    try {
        const response = await fetch(`${window.DAED_CONFIG.API_BASE_URL}/reports/student/${studentId}`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
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
            alert('Failed to download report. Please try again.');
        }
    } catch (e) {
        console.error('Error downloading report:', e);
        alert('Error downloading report. Please try again.');
    }
}

// ===== DELETE MARKS (Student Portal) =====
async function deleteStudentMarks(studId, subjectId, subjectName) {
    if (!confirm(`Are you sure you want to delete marks for "${subjectName}"?`)) return;

    try {
        const res = await fetch(`${STUDENT_API}/marks/${studId}/${subjectId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            alert(`Marks for "${subjectName}" deleted successfully.`);
            window.location.reload();
        } else {
            alert('Failed to delete marks. Please try again.');
        }
    } catch (err) {
        alert('Network error. Is the backend running?');
    }
}

// ===== DELETE ATTENDANCE (Student Portal) =====
async function deleteStudentAttendance(studId, subjectId, subjectName) {
    if (!confirm(`Are you sure you want to delete attendance record for "${subjectName}"?`)) return;

    try {
        const res = await fetch(`${STUDENT_API}/attendance/${studId}/${subjectId}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            alert(`Attendance for "${subjectName}" deleted successfully.`);
            window.location.reload();
        } else {
            alert('Failed to delete attendance. Please try again.');
        }
    } catch (err) {
        alert('Network error. Is the backend running?');
    }
}
