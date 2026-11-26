# CyberShield — Cyber Crime Reporting & Awareness Portal

An educational Java Spring Boot + MongoDB college project that combines a **Cyber Security Awareness Portal** (18 cyber crime guides, safety tips, and rotating awareness quotes) with a **Cyber Crime Incident Reporting & Admin Management System**.

> **Educational Project Notice:** This website is an educational/college project portal and is **not** an official government portal.  
> **Emergency Notice (India):** If you are a victim of cyber financial fraud, call **1930** immediately and report the incident at **https://cybercrime.gov.in**.

---

## Tech Stack

- **Backend:** Java 21, Spring Boot `4.2.0`, Maven (with Maven Wrapper)
- **Database:** MongoDB (`mongodb://localhost:27017/cyber_crime_reporting`)
- **Spring Modules:** Spring Web (`spring-boot-starter-webmvc`), Spring Data MongoDB, Bean Validation, Spring Security, Spring Boot DevTools
- **Frontend:** Responsive HTML5, CSS3, and Vanilla JavaScript (`src/main/resources/static/`)

---

## Features

- **Cyber Awareness Center:** 18 detailed cyber crime categories (Phishing, UPI & Online Payment Fraud, Identity Theft, Malware & Ransomware, Cyberbullying, Fake Profiles, Online Shopping Fraud, OTP Fraud, Data Breaches, Job Scams, Investment Scams, Loan App Fraud, Sextortion, SIM Swapping, Cyberstalking, Email Spoofing, Website Hacking, Online Gaming Scams) with live keyword search and a **Read More** modal.
- **Safety Tips & Awareness Quotes:** Rotating cyber safety mindset quotes and 8 practical safety guides (Passwords, 2FA, UPI, Social Media Privacy, Safe Browsing, Public Wi-Fi, Email Security, Mobile Security).
- **Public Report Submission & Tracking:** Anyone can submit a cyber crime report (`POST /api/reports`) with field-level validation and track its status publicly using the generated Reference ID (`GET /api/reports/track/{id}`).
- **Admin / Officer Portal:** Protected by Spring Security (`ROLE_ADMIN`). Officers can log in to view summary statistics, search/filter reports, update report statuses (`PENDING`, `UNDER_REVIEW`, `RESOLVED`), and delete reports.
- **Citizen Portal UI:** Separate Citizen Login interface with validation and a separated integration point (`CITIZEN_AUTH_INTEGRATION` in `app.js`) ready for future citizen authentication endpoints.

---

## Project Structure

```text
CyberCrimeReporting/
├── pom.xml
├── mvnw / mvnw.cmd
└── src/
    ├── main/
    │   ├── java/com/cybercrime/reporting/
    │   │   ├── CyberCrimeReportingApplication.java
    │   │   ├── config/SecurityConfig.java
    │   │   ├── controller/
    │   │   │   ├── AuthController.java
    │   │   │   └── CyberCrimeReportController.java
    │   │   ├── exception/GlobalExceptionHandler.java
    │   │   ├── model/CyberCrimeReport.java
    │   │   ├── repository/CyberCrimeReportRepository.java
    │   │   └── service/CyberCrimeReportService.java
    │   └── resources/
    │       ├── application.properties
    │       └── static/
    │           ├── index.html
    │           ├── styles.css
    │           └── app.js
    └── test/java/com/cybercrime/reporting/
        └── CyberCrimeReportingApplicationTests.java
```

---

## Prerequisites

- **Java 21** (or newer JDK)
- **MongoDB** running locally on `localhost:27017`

---

## How to Run Locally

1. Start your local MongoDB server (`mongodb://localhost:27017`).
2. Run the Spring Boot application using the Maven Wrapper:
   ```powershell
   .\mvnw.cmd spring-boot:run
   ```
   *(On macOS/Linux, run `./mvnw spring-boot:run`.)*
3. Open **http://localhost:8080** in your browser.

### Default Admin / Officer Credentials
Configured in `src/main/resources/application.properties` (change these before any public deployment):
- **Username:** `admin`
- **Password:** `admin123`

---

## API Endpoints

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/reports` | Public | Submit a new cyber crime report |
| `GET` | `/api/reports/track/{id}` | Public | Track non-personal report status by Reference ID |
| `GET` | `/api/auth/status` | Public | Check current Admin session authentication status |
| `POST` | `/api/auth/login` | Public | Admin/Officer login (`username`, `password`) |
| `POST` | `/api/auth/logout` | Public | Log out current session |
| `GET` | `/api/reports` | Admin (`ROLE_ADMIN`) | List/filter reports (`?status=&crimeType=`) |
| `GET` | `/api/reports/{id}` | Admin (`ROLE_ADMIN`) | Get full report details by ID |
| `PATCH` | `/api/reports/{id}/status` | Admin (`ROLE_ADMIN`) | Update report status (`{"status": "UNDER_REVIEW"}`) |
| `DELETE` | `/api/reports/{id}` | Admin (`ROLE_ADMIN`) | Delete a report |

---

## Running Tests

```powershell
.\mvnw.cmd test
```
