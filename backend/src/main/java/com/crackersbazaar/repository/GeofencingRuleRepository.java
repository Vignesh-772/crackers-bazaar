package com.crackersbazaar.repository;

import com.crackersbazaar.entity.GeofencingRule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface GeofencingRuleRepository extends JpaRepository<GeofencingRule, String> {

    @Query("SELECT g FROM GeofencingRule g WHERE g.isActive = true")
    List<GeofencingRule> findActive();
}


