package com.daed.repository;

import com.daed.model.Marks;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface MarksRepository extends JpaRepository<Marks, Long> {
    List<Marks> findByStudentId(Long studentId);
    List<Marks> findBySubjectId(Long subjectId);
    Optional<Marks> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
}
