package com.crackersbazaar.service;

import com.crackersbazaar.entity.GeofencingRule;
import com.crackersbazaar.entity.User;
import com.crackersbazaar.repository.GeofencingRuleRepository;
import com.crackersbazaar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class GeofencingRuleService {

    @Autowired
    private GeofencingRuleRepository repo;

    @Autowired
    private UserRepository userRepository;

    public GeofencingRule create(GeofencingRule rule, String userId) {
        rule.setId(UUID.randomUUID().toString());
        if (userId != null) {
            userRepository.findById(userId).ifPresent(rule::setCreatedBy);
        }
        return repo.save(rule);
    }

    public GeofencingRule update(String id, GeofencingRule updated) {
        GeofencingRule existing = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Geofencing rule not found: " + id));
        existing.setName(updated.getName());
        existing.setDescription(updated.getDescription());
        existing.setZoneType(updated.getZoneType());
        existing.setLatitude(updated.getLatitude());
        existing.setLongitude(updated.getLongitude());
        existing.setRadiusMeters(updated.getRadiusMeters());
        existing.setIsActive(updated.getIsActive());
        return repo.save(existing);
    }

    public List<GeofencingRule> getAll() {
        return repo.findAll();
    }

    public List<GeofencingRule> getActive() { return repo.findActive(); }

    public void delete(String id) {
        repo.deleteById(id);
    }
}


