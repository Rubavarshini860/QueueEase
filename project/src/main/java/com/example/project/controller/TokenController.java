package com.example.project.controller;

import com.example.project.entity.Token;
import com.example.project.service.TokenService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tokens")
public class TokenController {

    private final TokenService tokenService;

    public TokenController(TokenService tokenService) {
        this.tokenService = tokenService;
    }

    // Generate a token
    @PostMapping
    public ResponseEntity<Token> generateToken(
            @RequestParam Long doctorId,
            @RequestParam Long patientId,
            @RequestParam(defaultValue = "false") Boolean priority) {

        return ResponseEntity.ok(
                tokenService.generateToken(
                        doctorId,
                        patientId,
                        priority
                )
        );
    }

    // Advance the queue
    @PutMapping("/doctors/{doctorId}/next")
    public ResponseEntity<Token> advanceQueue(
            @PathVariable Long doctorId) {

        return ResponseEntity.ok(
                tokenService.advanceQueue(doctorId)
        );
    }

    // View current waiting queue
    @GetMapping("/doctors/{doctorId}/queue")
    public ResponseEntity<List<Token>> getQueue(
            @PathVariable Long doctorId) {

        return ResponseEntity.ok(
                tokenService.getQueue(doctorId)
        );
    }

    // View today's token history
    @GetMapping("/doctors/{doctorId}/history")
    public ResponseEntity<List<Token>> getHistory(
            @PathVariable Long doctorId) {

        return ResponseEntity.ok(
                tokenService.getDailyHistory(doctorId)
        );
    }

    // Get token by ID
    @GetMapping("/{id}")
    public ResponseEntity<Token> getToken(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                tokenService.getTokenById(id)
        );
    }

    // Cancel token
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Token> cancelToken(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                tokenService.cancelToken(id)
        );
    }
}