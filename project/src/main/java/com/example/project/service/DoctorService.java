package com.example.project.service;

import com.example.project.entity.Doctor;
import com.example.project.repository.DoctorRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    private final DoctorRepository doctorRepository;

    public DoctorService(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    public Doctor createDoctor(Doctor doctor) {

        if (doctor.getName() == null || doctor.getName().isBlank()) {
            throw new IllegalArgumentException("Doctor name is required");
        }

        if (doctor.getSpecialization() == null ||
                doctor.getSpecialization().isBlank()) {
            throw new IllegalArgumentException(
                    "Doctor specialization is required"
            );
        }

        if (doctor.getAverageConsultationTime() == null ||
                doctor.getAverageConsultationTime() <= 0) {
            throw new IllegalArgumentException(
                    "Average consultation time must be greater than 0"
            );
        }

        return doctorRepository.save(doctor);
    }

    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    public Doctor getDoctorById(Long id) {

        return doctorRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found with ID: " + id
                        ));
    }

    public Doctor updateDoctor(
            Long id,
            Doctor updatedDoctor) {

        Doctor doctor = getDoctorById(id);

        doctor.setName(updatedDoctor.getName());
        doctor.setSpecialization(
                updatedDoctor.getSpecialization()
        );
        doctor.setAverageConsultationTime(
                updatedDoctor.getAverageConsultationTime()
        );

        return doctorRepository.save(doctor);
    }

    public void deleteDoctor(Long id) {

        if (!doctorRepository.existsById(id)) {
            throw new RuntimeException(
                    "Doctor not found with ID: " + id
            );
        }

        doctorRepository.deleteById(id);
    }
}