package com.example.project.repository;

import com.example.project.entity.Token;
import com.example.project.entity.TokenStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TokenRepository extends JpaRepository<Token, Long> {

    // Get the latest token number for a doctor today
    Optional<Token> findTopByDoctorDoctorIdAndTokenDateOrderByTokenNumberDesc(
            Long doctorId,
            LocalDate tokenDate
    );

    // Get all tokens for a doctor today
    List<Token> findByDoctorDoctorIdAndTokenDateOrderByTokenNumberAsc(
            Long doctorId,
            LocalDate tokenDate
    );

    // Get tokens by doctor, date and status
    List<Token> findByDoctorDoctorIdAndTokenDateAndStatus(
            Long doctorId,
            LocalDate tokenDate,
            TokenStatus status
    );

    // Check for a priority token that is currently waiting
    Optional<Token> findFirstByDoctorDoctorIdAndTokenDateAndStatusAndPriorityTrue(
            Long doctorId,
            LocalDate tokenDate,
            TokenStatus status
    );

    // Check for ANY active priority token
    // This catches both WAITING and SERVING priority tokens.
    Optional<Token> findFirstByDoctorDoctorIdAndTokenDateAndPriorityTrue(
            Long doctorId,
            LocalDate tokenDate
    );

    // Get the next waiting tokens.
    // Priority tokens come before normal tokens.
    @Query("""
            SELECT t FROM Token t
            WHERE t.doctor.doctorId = :doctorId
            AND t.tokenDate = :tokenDate
            AND t.status = com.example.project.entity.TokenStatus.WAITING
            ORDER BY t.priority DESC, t.tokenNumber ASC
            """)
    List<Token> findNextWaitingTokens(
            Long doctorId,
            LocalDate tokenDate
    );
}