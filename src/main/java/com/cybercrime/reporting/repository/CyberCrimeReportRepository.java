package com.cybercrime.reporting.repository;

import com.cybercrime.reporting.model.CyberCrimeReport;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

/**
 * MongoDB repository for CyberCrimeReport documents.
 * Extending MongoRepository gives us built-in save, find, and delete methods automatically.
 */
public interface CyberCrimeReportRepository extends MongoRepository<CyberCrimeReport, String> {

    List<CyberCrimeReport> findByStatus(String status);

    List<CyberCrimeReport> findByCrimeTypeIgnoreCase(String crimeType);

    List<CyberCrimeReport> findByStatusAndCrimeTypeIgnoreCase(String status, String crimeType);
}
