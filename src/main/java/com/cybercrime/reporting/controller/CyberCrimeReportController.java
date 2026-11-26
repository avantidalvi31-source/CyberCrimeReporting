package com.cybercrime.reporting.controller;

import com.cybercrime.reporting.model.CyberCrimeReport;
import com.cybercrime.reporting.service.CyberCrimeReportService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * REST API controller that handles HTTP requests for cyber crime reports.
 */
@RestController
@RequestMapping("/api/reports")
public class CyberCrimeReportController {

    private final CyberCrimeReportService reportService;

    public CyberCrimeReportController(CyberCrimeReportService reportService) {
        this.reportService = reportService;
    }

    @PostMapping
    public ResponseEntity<CyberCrimeReport> createReport(@Valid @RequestBody CyberCrimeReport report) {
        CyberCrimeReport savedReport = reportService.createReport(report);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedReport);
    }

    @GetMapping
    public List<CyberCrimeReport> getAllReports(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String crimeType) {
        return reportService.getReports(status, crimeType);
    }

    @GetMapping("/{id}")
    public CyberCrimeReport getReportById(@PathVariable String id) {
        return reportService.getReportById(id);
    }

    @GetMapping("/track/{id}")
    public Map<String, Object> trackReport(@PathVariable String id) {
        return reportService.getReportStatusForTracking(id);
    }

    @PatchMapping("/{id}/status")
    public CyberCrimeReport updateReportStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body) {
        String status = body != null ? body.get("status") : null;
        return reportService.updateReportStatus(id, status);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReport(@PathVariable String id) {
        reportService.deleteReport(id);
        return ResponseEntity.noContent().build();
    }
}
