package com.daed.repository;

import com.daed.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
        Optional<Subject> findBySubjectCode(String subjectCode);
        Boolean existsBySubjectCode(String subjectCode);
        List<Subject> findByFacultyId(Long facultyId);
        List<Subject> findByDepartmentAndSemester(String department, int semester);
}
