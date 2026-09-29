package com.example.project.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "doctors")
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long doctorId;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String specialization;

    @Column(nullable = false)
    private Integer averageConsultationTime;

    public Doctor() {
    }

    public Doctor(String name, String specialization, Integer averageConsultationTime) {
        this.name = name;
        this.specialization = specialization;
        this.averageConsultationTime = averageConsultationTime;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }

    public Integer getAverageConsultationTime() {
        return averageConsultationTime;
    }

    public void setAverageConsultationTime(Integer averageConsultationTime) {
        this.averageConsultationTime = averageConsultationTime;
    }
}