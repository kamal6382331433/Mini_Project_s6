package com.daed.repository;

import com.daed.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByStudentId(Long studentId);
    List<Attendance> findBySubjectId(Long subjectId);
    Optional<Attendance> findByStudentIdAndSubjectId(Long studentId, Long subjectId);
}
