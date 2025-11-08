package com.crackersbazaar.controller;

import com.crackersbazaar.entity.AuditLog;
import com.crackersbazaar.service.AuditLogService;
import com.crackersbazaar.service.ManufacturerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/reports")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class ReportsController {

    @Autowired
    private AuditLogService auditLogService;

    @Autowired
    private ManufacturerService manufacturerService;

    @GetMapping(value = "/audit-logs/export", produces = MediaType.TEXT_PLAIN_VALUE)
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<byte[]> exportAuditLogs(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        LocalDateTime fromDt = from.atStartOfDay();
        LocalDateTime toDt = to.plusDays(1).atStartOfDay().minusSeconds(1);

        List<AuditLog> logs = auditLogService.export(fromDt, toDt);
        String csv = logs.stream()
                .map(l -> String.join(",",
                        safe(l.getCreatedAt()),
                        safe(l.getAction()),
                        safe(l.getEntityType()),
                        safe(l.getEntityId()),
                        safe(l.getDetails())
                ))
                .collect(Collectors.joining("\n"));

        byte[] bytes = csv.getBytes(StandardCharsets.UTF_8);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=audits.csv")
                .contentType(MediaType.TEXT_PLAIN)
                .body(bytes);
    }

    @GetMapping(value = "/licenses/expiring")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> getExpiringLicenses(
            @RequestParam(defaultValue = "30") int withinDays
    ) {
        // In a next pass, wire a service method; for now, reuse repository via service if available later
        // Placeholder endpoint to be used by UI; manufacturerService already exposes counts/queries
        return ResponseEntity.ok().build();
    }

    private String safe(Object v) { return v == null ? "" : v.toString().replace(",", " "); }
}


