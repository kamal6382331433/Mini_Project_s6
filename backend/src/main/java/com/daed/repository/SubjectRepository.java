package com.daed.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.daed.model.Subject;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    Optional<Subject> findBySubjectCode(String subjectCode);

    Boolean existsBySubjectCode(String subjectCode);

    List<Subject> findByFacultyId(Long facultyId);

    List<Subject> findByDepartmentAndSemester(String department, int semester);
}
