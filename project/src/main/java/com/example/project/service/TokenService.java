package com.example.project.service;

import com.example.project.entity.Doctor;
import com.example.project.entity.Patient;
import com.example.project.entity.Token;
import com.example.project.entity.TokenStatus;
import com.example.project.repository.DoctorRepository;
import com.example.project.repository.PatientRepository;
import com.example.project.repository.TokenRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class TokenService {

    private final TokenRepository tokenRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;

    public TokenService(
            TokenRepository tokenRepository,
            DoctorRepository doctorRepository,
            PatientRepository patientRepository) {

        this.tokenRepository = tokenRepository;
        this.doctorRepository = doctorRepository;
        this.patientRepository = patientRepository;
    }

    // Generate a new token
    public Token generateToken(
            Long doctorId,
            Long patientId,
            Boolean priority) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException("Doctor not found"));

        Patient patient = patientRepository.findById(patientId)
                .orElseThrow(() ->
                        new RuntimeException("Patient not found"));

        LocalDate today = LocalDate.now();

        if (priority == null) {
            priority = false;
        }

        /*
         * BUSINESS RULE:
         * Only one priority token can be active
         * for a doctor at a time.
         *
         * Active means WAITING or SERVING.
         */
        if (priority) {

            boolean priorityAlreadyActive =
                    tokenRepository
                            .findFirstByDoctorDoctorIdAndTokenDateAndPriorityTrue(
                                    doctorId,
                                    today
                            )
                            .filter(token ->
                                    token.getStatus() == TokenStatus.WAITING
                                            || token.getStatus() == TokenStatus.SERVING
                            )
                            .isPresent();

            if (priorityAlreadyActive) {

                throw new IllegalStateException(
                        "A priority token is already active for this doctor today"
                );
            }
        }

        // Generate today's next token number
        int nextTokenNumber = tokenRepository
                .findTopByDoctorDoctorIdAndTokenDateOrderByTokenNumberDesc(
                        doctorId,
                        today
                )
                .map(token -> token.getTokenNumber() + 1)
                .orElse(1);

        Token token = new Token();

        token.setTokenNumber(nextTokenNumber);
        token.setTokenDate(today);
        token.setStatus(TokenStatus.WAITING);
        token.setPriority(priority);
        token.setDoctor(doctor);
        token.setPatient(patient);
        token.setEstimatedWaitTime(0);

        Token savedToken = tokenRepository.save(token);

        updateWaitingTimes(doctorId, today);

        return savedToken;
    }

    // Advance the queue
    public Token advanceQueue(Long doctorId) {

        LocalDate today = LocalDate.now();

        // Complete currently serving token
        List<Token> servingTokens =
                tokenRepository.findByDoctorDoctorIdAndTokenDateAndStatus(
                        doctorId,
                        today,
                        TokenStatus.SERVING
                );

        for (Token token : servingTokens) {

            token.setStatus(TokenStatus.COMPLETED);

            tokenRepository.save(token);
        }

        // Find next waiting token
        List<Token> waitingTokens =
                tokenRepository.findNextWaitingTokens(
                        doctorId,
                        today
                );

        if (waitingTokens.isEmpty()) {

            throw new RuntimeException(
                    "No waiting tokens for this doctor today"
            );
        }

        // Priority tokens are already sorted first
        Token nextToken = waitingTokens.get(0);

        nextToken.setStatus(TokenStatus.SERVING);
        nextToken.setEstimatedWaitTime(0);

        Token savedToken =
                tokenRepository.save(nextToken);

        updateWaitingTimes(doctorId, today);

        return savedToken;
    }

    // Get current waiting queue
    public List<Token> getQueue(Long doctorId) {

        return tokenRepository.findNextWaitingTokens(
                doctorId,
                LocalDate.now()
        );
    }

    // Get today's history
    public List<Token> getDailyHistory(Long doctorId) {

        return tokenRepository
                .findByDoctorDoctorIdAndTokenDateOrderByTokenNumberAsc(
                        doctorId,
                        LocalDate.now()
                );
    }

    // Get token by ID
    public Token getTokenById(Long id) {

        return tokenRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Token not found with ID: " + id
                        ));
    }

    // Cancel a token
    public Token cancelToken(Long id) {

        Token token = getTokenById(id);

        if (token.getStatus() != TokenStatus.WAITING) {

            throw new IllegalStateException(
                    "Only waiting tokens can be cancelled"
            );
        }

        token.setStatus(TokenStatus.CANCELLED);

        Token cancelledToken =
                tokenRepository.save(token);

        updateWaitingTimes(
                token.getDoctor().getDoctorId(),
                token.getTokenDate()
        );

        return cancelledToken;
    }

    // Update estimated waiting times
    private void updateWaitingTimes(
            Long doctorId,
            LocalDate date) {

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Doctor not found"
                        ));

        List<Token> waitingTokens =
                tokenRepository.findNextWaitingTokens(
                        doctorId,
                        date
                );

        int position = 0;

        // If someone is currently being served,
        // waiting patients have at least one consultation ahead.
        List<Token> servingTokens =
                tokenRepository.findByDoctorDoctorIdAndTokenDateAndStatus(
                        doctorId,
                        date,
                        TokenStatus.SERVING
                );

        if (!servingTokens.isEmpty()) {
            position = 1;
        }

        for (Token token : waitingTokens) {

            token.setEstimatedWaitTime(
                    position *
                            doctor.getAverageConsultationTime()
            );

            tokenRepository.save(token);

            position++;
        }
    }
}