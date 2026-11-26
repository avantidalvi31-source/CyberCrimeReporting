package com.cybercrime.reporting.service;

import com.cybercrime.reporting.model.CyberCrimeReport;
import com.cybercrime.reporting.repository.CyberCrimeReportRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * Contains the business logic for creating, viewing, updating, and deleting cyber crime reports.
 */
@Service
public class CyberCrimeReportService {

    private final CyberCrimeReportRepository reportRepository;

    public CyberCrimeReportService(CyberCrimeReportRepository reportRepository) {
        this.reportRepository = reportRepository;
    }

    public CyberCrimeReport createReport(CyberCrimeReport report) {
        // Ensure MongoDB generates a fresh ID and default values are applied on creation.
        report.setId(null);
        if (report.getStatus() == null || report.getStatus().isBlank()) {
            report.setStatus("PENDING");
        }
        if (report.getCreatedAt() == null) {
            report.setCreatedAt(LocalDateTime.now());
        }
        return reportRepository.save(report);
    }

    public List<CyberCrimeReport> getReports(String status, String crimeType) {
        boolean hasStatus = status != null && !status.isBlank();
        boolean hasCrimeType = crimeType != null && !crimeType.isBlank();

        if (hasStatus && hasCrimeType) {
            return reportRepository.findByStatusAndCrimeTypeIgnoreCase(
                    status.trim().toUpperCase(), crimeType.trim());
        }
        if (hasStatus) {
            return reportRepository.findByStatus(status.trim().toUpperCase());
        }
        if (hasCrimeType) {
            return reportRepository.findByCrimeTypeIgnoreCase(crimeType.trim());
        }
        return reportRepository.findAll();
    }

    public CyberCrimeReport getReportById(String id) {
        return reportRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Report not found with id: " + id));
    }

    public Map<String, Object> getReportStatusForTracking(String id) {
        CyberCrimeReport report = getReportById(id);
        // Expose only non-personal tracking details to unauthenticated users.
        Map<String, Object> statusInfo = new LinkedHashMap<>();
        statusInfo.put("id", report.getId());
        statusInfo.put("crimeType", report.getCrimeType());
        statusInfo.put("status", report.getStatus());
        statusInfo.put("incidentDate", report.getIncidentDate());
        statusInfo.put("createdAt", report.getCreatedAt());
        return statusInfo;
    }

    public CyberCrimeReport updateReportStatus(String id, String status) {
        if (status == null || status.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Status is required");
        }
        CyberCrimeReport existingReport = getReportById(id);
        existingReport.setStatus(status.trim().toUpperCase());
        return reportRepository.save(existingReport);
    }

    public void deleteReport(String id) {
        if (!reportRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND, "Report not found with id: " + id);
        }
        reportRepository.deleteById(id);
    }
}
