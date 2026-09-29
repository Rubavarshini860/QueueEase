package com.example.project.service;

import com.example.project.entity.Patient;
import com.example.project.repository.PatientRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    public Patient createPatient(Patient patient) {

        if (patient.getName() == null || patient.getName().isBlank()) {
            throw new IllegalArgumentException("Patient name is required");
        }

        if (patient.getPhone() == null || patient.getPhone().isBlank()) {
            throw new IllegalArgumentException("Patient phone is required");
        }

        return patientRepository.save(patient);
    }

    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    public Patient getPatientById(Long id) {

        return patientRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Patient not found with ID: " + id
                        ));
    }

    public Patient updatePatient(
            Long id,
            Patient updatedPatient) {

        Patient patient = getPatientById(id);

        patient.setName(updatedPatient.getName());
        patient.setPhone(updatedPatient.getPhone());

        return patientRepository.save(patient);
    }

    public void deletePatient(Long id) {

        if (!patientRepository.existsById(id)) {
            throw new RuntimeException(
                    "Patient not found with ID: " + id
            );
        }

        patientRepository.deleteById(id);
    }
}