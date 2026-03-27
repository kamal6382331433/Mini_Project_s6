package com.daed.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "marks")
public class Marks {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({ "user" })
    private Student student;

    @ManyToOne
    @JoinColumn(name = "subject_id", nullable = false)
    @JsonIgnoreProperties({ "faculty" })
    private Subject subject;

    @Column(name = "internal_marks")
    private double internalMarks;

    @Column(name = "external_marks")
    private double externalMarks;

    @Column(name = "total_marks")
    private double totalMarks;

    private String grade;

    private String status; // PASS / FAIL

    @PrePersist
    @PreUpdate
    public void calculateTotalAndGrade() {
        this.totalMarks = this.internalMarks + this.externalMarks;
        if (this.totalMarks >= 40) { // Simple logic
            this.status = "PASS";
            if (this.totalMarks >= 90)
                this.grade = "A+";
            else if (this.totalMarks >= 80)
                this.grade = "A";
            else if (this.totalMarks >= 70)
                this.grade = "B";
            else if (this.totalMarks >= 60)
                this.grade = "C";
            else if (this.totalMarks >= 50)
                this.grade = "D";
            else
                this.grade = "E";
        } else {
            this.status = "FAIL";
            this.grade = "F";
        }
    }

    public Marks() {
    }

    public Marks(Long id, Student student, Subject subject, double internalMarks, double externalMarks,
            double totalMarks, String grade, String status) {
        this.id = id;
        this.student = student;
        this.subject = subject;
        this.internalMarks = internalMarks;
        this.externalMarks = externalMarks;
        this.totalMarks = totalMarks;
        this.grade = grade;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Subject getSubject() {
        return subject;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public double getInternalMarks() {
        return internalMarks;
    }

    public void setInternalMarks(double internalMarks) {
        this.internalMarks = internalMarks;
    }

    public double getExternalMarks() {
        return externalMarks;
    }

    public void setExternalMarks(double externalMarks) {
        this.externalMarks = externalMarks;
    }

    public double getTotalMarks() {
        return totalMarks;
    }

    public void setTotalMarks(double totalMarks) {
        this.totalMarks = totalMarks;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
