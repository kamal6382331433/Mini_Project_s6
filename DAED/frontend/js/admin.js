// ============================================================
//  DAED Admin Dashboard — Enhanced JS
// ============================================================

const ADMIN_API = `${window.DAED_CONFIG.API_BASE_URL}/admin`;
const AUTH_API = `${window.DAED_CONFIG.API_BASE_URL}/auth`;

// ===== PARTICLES =====
function initAdmParticles() {
    const canvas = document.getElementById('adm-particles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth; canvas.height = window.innerHeight;
    const particles = Array.from({ length: 40 }, () => ({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.5,
        dx: (Math.random() - 0.5) * 0.35, dy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.4 + 0.1
    }));
    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(99, 102, 241, ${p.alpha})`; ctx.fill();
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
    if (!container) return;
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

// ===== TABS =====
function switchTab(tabId, btn) {
    document.querySelectorAll('.tab-pane-custom').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById('pane-' + tabId).classList.add('active');
    btn.classList.add('active');
}

// ===== SEARCH FILTER =====
function filterList(containerId, query) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const items = container.querySelectorAll('[data-search]');
    const q = query.toLowerCase();
    items.forEach(item => {
        const text = (item.getAttribute('data-search') || '').toLowerCase();
        item.style.display = text.includes(q) ? '' : 'none';
    });
}

// ===== DATETIME =====
function updateAdmDate() {
    const el = document.getElementById('admCurrentDate');
    if (el) el.textContent = new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
}

// ===== COLOR HELPERS =====
function stringToColor(str) {
    const colors = ['#6366f1', '#8b5cf6', '#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#06b6d4', '#ec4899'];
    let hash = 0;
    for (let i = 0; i < str.length; i++) { hash = str.charCodeAt(i) + ((hash << 5) - hash); }
    return colors[Math.abs(hash) % colors.length];
}
function getInitials(name = '') {
    const parts = name.trim().split(' ');
    return parts.length >= 2 ? parts[0][0] + parts[parts.length - 1][0] : name.substring(0, 2);
}

// ===== LOAD STUDENTS =====
async function loadStudents() {
    const container = document.getElementById('studentListContainer');
    try {
        const res = await fetch(`${ADMIN_API}/students`, { headers: getAuthHeaders() });
        const data = await res.json();

        const statEl = document.getElementById('admStatStudents');
        if (statEl) statEl.textContent = data.length;

        // Dept count
        const depts = new Set(data.map(s => s.department));
        const deptEl = document.getElementById('admStatDepts');
        if (deptEl) deptEl.textContent = depts.size;

        if (data.length === 0) {
            container.innerHTML = `<div class="empty-state"><i class="bi bi-people"></i>No students registered yet.</div>`;
            return;
        }

        container.innerHTML = data.map(s => {
            const name = s.user ? s.user.fullName || s.user.username : 'Unknown';
            const initials = getInitials(name).toUpperCase();
            const color = stringToColor(name);
            const searchKey = `${name} ${s.rollNumber} ${s.department} ${s.semester}`;
            return `
            <div class="person-card" data-search="${searchKey}">
                <div class="person-mini-avatar" style="background:${color}22;color:${color};border:1px solid ${color}44">${initials}</div>
                <div style="flex:1;min-width:0;">
                    <div class="person-card-name">${name}</div>
                    <div class="person-card-meta">
                        <i class="bi bi-hash"></i>${s.rollNumber}
                        &nbsp;·&nbsp;<i class="bi bi-building"></i> ${s.department}
                        &nbsp;·&nbsp;<i class="bi bi-calendar3"></i> Sem ${s.semester}
                    </div>
                </div>
                <div>
                    <span class="person-card-badge" style="background:rgba(99,102,241,0.12);border:1px solid rgba(99,102,241,0.25);color:#a5b4fc;font-size:0.75rem;font-weight:600;">
                        ID: ${s.id}
                    </span>
                    <button class="btn btn-outline-danger btn-sm ms-2" onclick="deleteStudent(${s.id}, '${name.replace(/'/g, "\\'")}')" title="Delete Student">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>`;
        }).join('');

    } catch (e) {
        container.innerHTML = `<div class="empty-state" style="color:#f87171;"><i class="bi bi-exclamation-triangle"></i>Failed to load students.</div>`;
    }
}

// ===== LOAD FACULTY =====
async function loadFaculty() {
    const container = document.getElementById('facultyListContainer');
    try {
        const res = await fetch(`${ADMIN_API}/faculties`, { headers: getAuthHeaders() });
        const data = await res.json();

        const statEl = document.getElementById('admStatFaculty');
        if (statEl) statEl.textContent = data.length;

        if (data.length === 0) {
            container.innerHTML = `<div class="empty-state"><i class="bi bi-person-badge"></i>No faculty registered yet.</div>`;
            return;
        }

        container.innerHTML = data.map(f => {
            const name = f.user ? f.user.fullName || f.user.username : 'Unknown';
            const initials = getInitials(name).toUpperCase();
            const color = stringToColor(name);
            const desig = f.designation || '—';
            const dept = f.department || '—';
            const searchKey = `${name} ${dept} ${desig}`;
            return `
            <div class="person-card" data-search="${searchKey}">
                <div class="person-mini-avatar" style="background:${color}22;color:${color};border:1px solid ${color}44">${initials}</div>
                <div style="flex:1;min-width:0;">
                    <div class="person-card-name">${name}</div>
                    <div class="person-card-meta">
                        <i class="bi bi-briefcase"></i> ${desig}
                        &nbsp;·&nbsp;<i class="bi bi-building"></i> ${dept}
                    </div>
                </div>
                <div class="d-flex align-items-center">
                    <span class="person-card-badge" style="background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;font-size:0.75rem;font-weight:600;">
                        ID: ${f.id}
                    </span>
                    <button class="btn btn-outline-danger btn-sm ms-2" onclick="deleteFaculty(${f.id}, '${name.replace(/'/g, "\\'")}')" title="Delete Faculty">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>`;
        }).join('');

    } catch (e) {
        container.innerHTML = `<div class="empty-state" style="color:#f87171;"><i class="bi bi-exclamation-triangle"></i>Failed to load faculty.</div>`;
    }
}

// ===== LOAD SUBJECTS =====
async function loadSubjects() {
    const container = document.getElementById('subjectListContainer');
    try {
        const res = await fetch(`${ADMIN_API}/subjects`, { headers: getAuthHeaders() });
        const data = await res.json();

        const statEl = document.getElementById('admStatSubjects');
        if (statEl) statEl.textContent = data.length;

        if (data.length === 0) {
            container.innerHTML = `<div class="empty-state"><i class="bi bi-book"></i>No subjects registered yet.</div>`;
            return;
        }

        container.innerHTML = data.map(s => {
            const faculty = s.faculty ? (s.faculty.user ? s.faculty.user.fullName : `Faculty #${s.faculty.id}`) : null;
            const searchKey = `${s.subjectCode} ${s.subjectName} ${s.department}`;
            return `
            <div class="subject-row" data-search="${searchKey}">
                <span class="sub-code-box">${s.subjectCode}</span>
                <div style="flex:1;min-width:0;">
                    <div style="font-weight:600;font-size:0.93rem;color:#f1f5f9;">${s.subjectName}</div>
                    <div style="font-size:0.78rem;color:#94a3b8;">
                        <i class="bi bi-building me-1"></i>${s.department}
                        &nbsp;·&nbsp;<i class="bi bi-calendar3 me-1"></i>Sem ${s.semester || '—'}
                    </div>
                </div>
                <div class="d-flex align-items-center gap-2">
                    <span style="font-size:0.8rem;padding:4px 12px;border-radius:20px;font-weight:600;
                        ${faculty
                    ? 'background:rgba(16,185,129,0.12);border:1px solid rgba(16,185,129,0.25);color:#34d399;'
                    : 'background:rgba(239,68,68,0.12);border:1px solid rgba(239,68,68,0.25);color:#f87171;'}">
                        ${faculty ? `<i class="bi bi-person-check me-1"></i>${faculty}` : '<i class="bi bi-person-dash me-1"></i>Unassigned'}
                    </span>
                    <button class="btn btn-outline-danger btn-sm" onclick="deleteSubject(${s.id}, '${s.subjectName.replace(/'/g, "\\\'")}')" title="Delete Subject">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </div>`;
        }).join('');

    } catch (e) {
        container.innerHTML = `<div class="empty-state" style="color:#f87171;"><i class="bi bi-exclamation-triangle"></i>Failed to load subjects.</div>`;
    }
}

// ============================================================
//  INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'ROLE_ADMIN') {
        window.location.href = '../index.html';
        return;
    }

    initAdmParticles();
    updateAdmDate();
    loadStudents();
    loadFaculty();
    loadSubjects();

    // ===== ADD STUDENT =====
    document.getElementById('addStudentForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const newUser = {
            username: document.getElementById('s_username').value,
            email: document.getElementById('s_email').value,
            password: document.getElementById('s_password').value,
            fullName: document.getElementById('s_fullname').value,
            role: 'student'
        };
        try {
            const authRes = await fetch(`${AUTH_API}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newUser)
            });
            if (!authRes.ok) throw new Error('Failed to create user account');
            showToast(`Student "${newUser.fullName}" account created!`, 'success');
            document.getElementById('addStudentForm').reset();
            setTimeout(() => loadStudents(), 800);
        } catch (err) {
            showToast(err.message || 'Failed to add student.', 'error');
        }
    });

    // ===== ADD SUBJECT =====
    document.getElementById('addSubjectForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const subject = {
            subjectCode: document.getElementById('sub_code').value,
            subjectName: document.getElementById('sub_name').value,
            department: document.getElementById('sub_dept').value,
            semester: document.getElementById('sub_sem').value
        };
        try {
            const res = await fetch(`${ADMIN_API}/subject`, {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(subject)
            });
            if (res.ok) {
                showToast(`Subject "${subject.subjectName}" added!`, 'success');
                document.getElementById('addSubjectForm').reset();
                setTimeout(() => loadSubjects(), 800);
            } else {
                showToast('Failed to add subject.', 'error');
            }
        } catch (err) {
            showToast('Network error.', 'error');
        }
    });

    // ===== ASSIGN FACULTY =====
    const assignForm = document.getElementById('assignFacultyForm');
    if (assignForm) {
        assignForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const subId = document.getElementById('assign_sub_id').value;
            const facId = document.getElementById('assign_fac_id').value;
            try {
                const res = await fetch(`${ADMIN_API}/subject/${subId}/assign-faculty/${facId}`, {
                    method: 'PUT', headers: getAuthHeaders()
                });
                if (res.ok) {
                    showToast(`Faculty #${facId} assigned to Subject #${subId}!`, 'success');
                    assignForm.reset();
                    setTimeout(() => loadSubjects(), 800);
                } else {
                    showToast('Assignment failed. Check IDs.', 'error');
                }
            } catch (err) {
                showToast('Network error.', 'error');
            }
        });
    }

    // ===== ADD FACULTY (form) =====
    const addFacultyForm = document.getElementById('addFacultyForm');
    if (addFacultyForm) {
        addFacultyForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newUser = {
                username: document.getElementById('f_username').value,
                email: document.getElementById('f_email').value,
                password: document.getElementById('f_password').value,
                fullName: document.getElementById('f_fullname').value,
                role: 'faculty'
            };
            try {
                const authRes = await fetch(`${AUTH_API}/signup`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newUser)
                });
                if (!authRes.ok) throw new Error('Failed to create faculty account');
                showToast(`Faculty "${newUser.fullName}" account created!`, 'success');
                addFacultyForm.reset();
                setTimeout(() => loadFaculty(), 800);
            } catch (err) {
                showToast(err.message || 'Failed to add faculty.', 'error');
            }
        });
    }
});

// ===== DELETE STUDENT =====
async function deleteStudent(id, name) {
    if (!confirm(`Are you sure you want to delete student "${name}"? This will also delete all their marks and attendance records.`)) return;

    try {
        const res = await fetch(`${ADMIN_API}/student/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            showToast(`Student "${name}" deleted successfully.`, 'success');
            loadStudents();
        } else {
            showToast('Failed to delete student.', 'error');
        }
    } catch (err) {
        showToast('Network error.', 'error');
    }
}

// ===== DELETE FACULTY =====
async function deleteFaculty(id, name) {
    if (!confirm(`Are you sure you want to delete faculty "${name}"? They will be unassigned from all their subjects.`)) return;

    try {
        const res = await fetch(`${ADMIN_API}/faculty/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            showToast(`Faculty "${name}" deleted successfully.`, 'success');
            loadFaculty();
            loadSubjects(); // Update subjects to show unassigned
        } else {
            showToast('Failed to delete faculty.', 'error');
        }
    } catch (err) {
        showToast('Network error.', 'error');
    }
}

// ===== DELETE SUBJECT =====
async function deleteSubject(id, name) {
    if (!confirm(`Are you sure you want to delete subject "${name}"? All associated marks and attendance records will also be deleted.`)) return;

    try {
        const res = await fetch(`${ADMIN_API}/subject/${id}`, {
            method: 'DELETE',
            headers: getAuthHeaders()
        });
        if (res.ok) {
            showToast(`Subject "${name}" deleted successfully.`, 'success');
            loadSubjects();
        } else {
            showToast('Failed to delete subject.', 'error');
        }
    } catch (err) {
        showToast('Network error.', 'error');
    }
}
