// ============================================================
//  DAED Faculty Dashboard — Enhanced JS
// ============================================================

const FACULTY_API = `${window.DAED_CONFIG.API_BASE_URL}/faculty`;

// Session counters
let sessionMarksCount = 0;
let sessionAttCount = 0;

// ===== PARTICLES =====
function initFacParticles() {
    const canvas = document.getElementById('fac-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.35,
        dy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.4 + 0.1
    }));
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(16, 185, 129, ${p.alpha})`;
            ctx.fill();
            p.x += p.dx; p.y += p.dy;
            if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
        });
        requestAnimationFrame(draw);
    }
    draw();
    window.addEventListener('resize', () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; });
}

// ===== TOAST =====
function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const icon = type === 'success' ? '✅' : '❌';
    const toast = document.createElement('div');
    toast.className = `toast-pill ${type}`;
    toast.innerHTML = `<span style="font-size:1.2rem;">${icon}</span><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => {
        toast.style.animation = 'toastOut 0.4s ease forwards';
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// ===== ACTIVITY LOG =====
const activityLog = [];
function addActivity(icon, text, color = '#6ee7b7') {
    const log = document.getElementById('activityLog');
    activityLog.unshift({ icon, text, color, time: new Date().toLocaleTimeString() });
    if (activityLog.length > 6) activityLog.pop();
    log.innerHTML = activityLog.map(a => `
        <div class="activity-item">
            <div class="activity-dot" style="background:${a.color};box-shadow:0 0 6px ${a.color};"></div>
            <div>
                <div style="font-size:0.88rem;color:#f1f5f9;">${a.icon} ${a.text}</div>
                <div style="font-size:0.75rem;color:#94a3b8;">${a.time}</div>
            </div>
        </div>`).join('');
}

// ===== LIVE MARKS CALC =====
function calcLiveTotal() {
    const internal = parseFloat(document.getElementById('m_int').value) || 0;
    const external = parseFloat(document.getElementById('m_ext').value) || 0;
    const total = internal + external;

    const totalEl = document.getElementById('liveTotalDisplay');
    const gradeEl = document.getElementById('liveGradeDisplay');
    const statusEl = document.getElementById('liveStatusDisplay');

    if (internal === 0 && external === 0) {
        if (totalEl) totalEl.textContent = '—';
        if (gradeEl) gradeEl.textContent = '';
        if (statusEl) statusEl.textContent = '';
        return;
    }

    if (totalEl) totalEl.textContent = total;

    // Grade logic
    let grade, gColor;
    if (total >= 90) { grade = 'A+'; gColor = '#34d399'; }
    else if (total >= 80) { grade = 'A'; gColor = '#34d399'; }
    else if (total >= 70) { grade = 'B+'; gColor = '#60a5fa'; }
    else if (total >= 60) { grade = 'B'; gColor = '#60a5fa'; }
    else if (total >= 50) { grade = 'C'; gColor = '#fbbf24'; }
    else if (total >= 40) { grade = 'D'; gColor = '#f97316'; }
    else { grade = 'F'; gColor = '#f87171'; }

    if (gradeEl) { gradeEl.textContent = grade; gradeEl.style.color = gColor; }
    if (statusEl) {
        statusEl.textContent = total >= 40 ? 'PASS ✓' : 'FAIL ✗';
        statusEl.style.color = total >= 40 ? '#34d399' : '#f87171';
    }
}

// ===== LIVE ATTENDANCE CALC =====
function calcLiveAttendance() {
    const total = parseFloat(document.getElementById('a_total').value) || 0;
    const attended = parseFloat(document.getElementById('a_attended').value) || 0;

    const pctEl = document.getElementById('liveAttPct');
    const statusEl = document.getElementById('liveAttStatus');
    const barEl = document.getElementById('liveAttBar');

    if (total === 0) {
        if (pctEl) pctEl.textContent = '—%';
        if (barEl) barEl.style.width = '0%';
        return;
    }

    const pct = Math.min(100, Math.round((attended / total) * 100));
    if (pctEl) pctEl.textContent = pct + '%';
    if (barEl) barEl.style.width = pct + '%';

    if (statusEl) {
        if (pct >= 85) { statusEl.textContent = '🟢 Excellent'; statusEl.style.color = '#34d399'; }
        else if (pct >= 75) { statusEl.textContent = '🟡 Adequate'; statusEl.style.color = '#fbbf24'; }
        else { statusEl.textContent = '🔴 Low — Risk of defaulter'; statusEl.style.color = '#f87171'; }

        if (barEl) {
            barEl.style.background = pct >= 85 ? 'linear-gradient(90deg,#10b981,#34d399)' :
                pct >= 75 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' :
                    'linear-gradient(90deg,#ef4444,#f87171)';
        }
    }
}

// ===== DATETIME =====
function updateDateTime() {
    const el = document.getElementById('currentDateTime');
    if (!el) return;
    const now = new Date();
    el.textContent = now.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

// ===== ASSIGNED SUBJECTS =====
async function loadAssignedSubjects(userId) {
    const container = document.getElementById('assignedSubjects');
    try {
        // Try to load from admin subjects endpoint (visible to all authenticated)
        const res = await fetch(`${window.DAED_CONFIG.API_BASE_URL}/admin/subjects`, {
            headers: getAuthHeaders()
        });
        if (res.ok) {
            const subjects = await res.json();
            const statEl = document.getElementById('fStatSubjectCount');
            if (statEl) statEl.textContent = subjects.length;
            if (subjects.length === 0) {
                container.innerHTML = `<span style="color:#94a3b8;font-size:0.88rem;"><i class="bi bi-info-circle me-1"></i>No subjects assigned yet.</span>`;
                return;
            }
            container.innerHTML = subjects.map(s =>
                `<span class="subject-tag">
                    <i class="bi bi-book-half"></i>
                    [${s.id}] ${s.subjectName} <span style="opacity:0.6">(${s.department})</span>
                </span>`
            ).join('');
        } else {
            container.innerHTML = `<span style="color:#94a3b8;font-size:0.88rem;"><i class="bi bi-info-circle me-1"></i>Please enter Subject IDs in the forms below.</span>`;
        }
    } catch (e) {
        container.innerHTML = `<span style="color:#94a3b8;font-size:0.88rem;"><i class="bi bi-info-circle me-1"></i>Enter Subject IDs in forms below.</span>`;
    }
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'ROLE_FACULTY') {
        window.location.href = '../index.html';
        return;
    }

    initFacParticles();
    updateDateTime();

    // Avatar initials from username
    const name = user.username || 'Faculty';
    const avatarEl = document.getElementById('facAvatar');
    if (avatarEl) avatarEl.textContent = name.substring(0, 2).toUpperCase();

    loadAssignedSubjects(user.id);

    // ===== MARKS FORM =====
    document.getElementById('marksForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const studId = document.getElementById('m_stud_id').value;
        const subId = document.getElementById('m_sub_id').value;
        const internal = document.getElementById('m_int').value;
        const external = document.getElementById('m_ext').value;

        if (!studId || !subId || !internal || !external) {
            showToast('Please fill in all fields.', 'error');
            return;
        }

        try {
            const res = await fetch(
                `${FACULTY_API}/marks?studentId=${studId}&subjectId=${subId}&internal=${internal}&external=${external}`,
                { method: 'POST', headers: getAuthHeaders() }
            );
            if (res.ok) {
                showToast(`✏️ Marks submitted: Student ${studId}, Subject ${subId}`, 'success');
                sessionMarksCount++;
                const el = document.getElementById('fStatMarksEntered');
                if (el) el.textContent = sessionMarksCount;
                addActivity('✏️', `Marks for Student #${studId} (Subject #${subId}) — ${parseInt(internal) + parseInt(external)}/100`, '#34d399');
                document.getElementById('marksForm').reset();
                document.getElementById('liveTotalDisplay').textContent = '—';
                document.getElementById('liveGradeDisplay').textContent = '';
                document.getElementById('liveStatusDisplay').textContent = '';
            } else {
                showToast('Failed to submit marks. Check IDs.', 'error');
            }
        } catch (err) {
            showToast('Network error. Is the backend running?', 'error');
        }
    });

    // ===== ATTENDANCE FORM =====
    document.getElementById('attendanceForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const studId = document.getElementById('a_stud_id').value;
        const subId = document.getElementById('a_sub_id').value;
        const total = document.getElementById('a_total').value;
        const attended = document.getElementById('a_attended').value;

        if (!studId || !subId || !total || !attended) {
            showToast('Please fill in all fields.', 'error');
            return;
        }
        if (parseInt(attended) > parseInt(total)) {
            showToast('Attended cannot exceed total classes!', 'error');
            return;
        }

        try {
            const res = await fetch(
                `${FACULTY_API}/attendance?studentId=${studId}&subjectId=${subId}&total=${total}&attended=${attended}`,
                { method: 'POST', headers: getAuthHeaders() }
            );
            if (res.ok) {
                const pct = Math.round((attended / total) * 100);
                showToast(`📅 Attendance updated: Student ${studId} — ${pct}%`, 'success');
                sessionAttCount++;
                const el = document.getElementById('fStatAttUpdated');
                if (el) el.textContent = sessionAttCount;
                addActivity('📅', `Attendance for Student #${studId} (Subject #${subId}) — ${pct}%`, '#60a5fa');
                document.getElementById('attendanceForm').reset();
                document.getElementById('liveAttPct').textContent = '—%';
                document.getElementById('liveAttBar').style.width = '0%';
                document.getElementById('liveAttStatus').textContent = '';
            } else {
                showToast('Failed to update attendance. Check IDs.', 'error');
            }
        } catch (err) {
            showToast('Network error. Is the backend running?', 'error');
        }
    });

    // ===== DELETE MARKS FORM =====
    const deleteMarksForm = document.getElementById('deleteMarksForm');
    if (deleteMarksForm) {
        deleteMarksForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const studId = document.getElementById('dm_stud_id').value;
            const subId = document.getElementById('dm_sub_id').value;

            if (!studId || !subId) {
                showToast('Please fill in Student ID and Subject ID.', 'error');
                return;
            }

            if (!confirm(`Are you sure you want to delete marks for Student #${studId}, Subject #${subId}?`)) return;

            try {
                const res = await fetch(
                    `${FACULTY_API}/marks?studentId=${studId}&subjectId=${subId}`,
                    { method: 'DELETE', headers: getAuthHeaders() }
                );
                if (res.ok) {
                    showToast(`🗑️ Marks deleted: Student #${studId}, Subject #${subId}`, 'success');
                    addActivity('🗑️', `Deleted marks for Student #${studId} (Subject #${subId})`, '#f87171');
                    deleteMarksForm.reset();
                } else {
                    showToast('Failed to delete marks. Check IDs.', 'error');
                }
            } catch (err) {
                showToast('Network error. Is the backend running?', 'error');
            }
        });
    }

    // ===== DELETE ATTENDANCE FORM =====
    const deleteAttForm = document.getElementById('deleteAttendanceForm');
    if (deleteAttForm) {
        deleteAttForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const studId = document.getElementById('da_stud_id').value;
            const subId = document.getElementById('da_sub_id').value;

            if (!studId || !subId) {
                showToast('Please fill in Student ID and Subject ID.', 'error');
                return;
            }

            if (!confirm(`Are you sure you want to delete attendance for Student #${studId}, Subject #${subId}?`)) return;

            try {
                const res = await fetch(
                    `${FACULTY_API}/attendance?studentId=${studId}&subjectId=${subId}`,
                    { method: 'DELETE', headers: getAuthHeaders() }
                );
                if (res.ok) {
                    showToast(`🗑️ Attendance deleted: Student #${studId}, Subject #${subId}`, 'success');
                    addActivity('🗑️', `Deleted attendance for Student #${studId} (Subject #${subId})`, '#f87171');
                    deleteAttForm.reset();
                } else {
                    showToast('Failed to delete attendance. Check IDs.', 'error');
                }
            } catch (err) {
                showToast('Network error. Is the backend running?', 'error');
            }
        });
    }
});

