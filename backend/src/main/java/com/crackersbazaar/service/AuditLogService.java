package com.crackersbazaar.service;

import com.crackersbazaar.entity.AuditLog;
import com.crackersbazaar.entity.User;
import com.crackersbazaar.repository.AuditLogRepository;
import com.crackersbazaar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class AuditLogService {

    @Autowired
    private AuditLogRepository repo;

    @Autowired
    private UserRepository userRepository;

    public AuditLog log(String userId, String action, String entityType, String entityId, String details, String ip, String ua) {
        AuditLog log = new AuditLog();
        log.setId(UUID.randomUUID().toString());
        if (userId != null) {
            userRepository.findById(userId).ifPresent(log::setUser);
        }
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setDetails(details);
        log.setIpAddress(ip);
        log.setUserAgent(ua);
        return repo.save(log);
    }

    public List<AuditLog> export(LocalDateTime from, LocalDateTime to) {
        return repo.findBetween(from, to);
    }
}


