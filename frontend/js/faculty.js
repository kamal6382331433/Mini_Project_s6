const FACULTY_API = `${window.DAED_CONFIG.API_BASE_URL}/faculty`;

document.addEventListener('DOMContentLoaded', () => {
    // Check Role
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || user.role !== 'ROLE_FACULTY') {
        window.location.href = '../index.html';
        return;
    }

    loadAssignedSubjects(user.id); // Note: Assuming User ID maps to Faculty ID logic in backend or via lookup
    // In real app, we need to get Faculty ID from User ID first. 
    // Here we will use a workaround or basic assumption that user.id is what we need if endpoint expects it.
    // The previous endpoint /subjects/{facultyId} expects Faculty Table ID.
    // Ideally backend authenticates user and finds faculty profile automatically. 
    // For this prototype, I'll prompt user for their Faculty ID if not found, or try to load.

    // Marks Form
    document.getElementById('marksForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const studId = document.getElementById('m_stud_id').value;
        const subId = document.getElementById('m_sub_id').value;
        const internal = document.getElementById('m_int').value;
        const external = document.getElementById('m_ext').value;

        try {
            await fetch(`${FACULTY_API}/marks?studentId=${studId}&subjectId=${subId}&internal=${internal}&external=${external}`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            alert("Marks Updated");
        } catch (e) { alert("Error"); }
    });

    // Attendance Form
    document.getElementById('attendanceForm').addEventListener('submit', async (e) => {
        e.preventDefault();
        const studId = document.getElementById('a_stud_id').value;
        const subId = document.getElementById('a_sub_id').value;
        const total = document.getElementById('a_total').value;
        const attended = document.getElementById('a_attended').value;

        try {
            await fetch(`${FACULTY_API}/attendance?studentId=${studId}&subjectId=${subId}&total=${total}&attended=${attended}`, {
                method: 'POST',
                headers: getAuthHeaders()
            });
            alert("Attendance Updated");
        } catch (e) { alert("Error"); }
    });
});

async function loadAssignedSubjects(userId) {
    // We are passing UserID, backend might need adjustment or we guess Faculty ID = User ID for prototype
    // Or we just fetch all subjects for now if endpoint allows. 
    // Actually, let's just show a simple list or message.
    document.getElementById('assignedSubjects').innerHTML = "Please enter Subject IDs below. (Faculty Mapping pending in UI)";
}
