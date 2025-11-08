package com.crackersbazaar.controller;

import com.crackersbazaar.entity.ProductComplianceTag;
import com.crackersbazaar.service.ProductComplianceTagService;
import com.crackersbazaar.util.SecurityUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/compliance-tags")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:5173"})
public class ComplianceController {

    @Autowired
    private ProductComplianceTagService tagService;

    @Autowired
    private SecurityUtils securityUtils;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> addTag(@RequestParam String productId,
                                    @RequestParam String tagType,
                                    @RequestParam String tagValue) {
        try {
            String userId = securityUtils.getCurrentUserId();
            ProductComplianceTag tag = tagService.addTag(productId, tagType, tagValue, userId);
            return ResponseEntity.ok(tag);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/by-product/{productId}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> getByProduct(@PathVariable String productId) {
        try {
            List<ProductComplianceTag> tags = tagService.getTagsByProduct(productId);
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/by-type/{tagType}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> getByType(@PathVariable String tagType) {
        try {
            List<ProductComplianceTag> tags = tagService.getTagsByType(tagType);
            return ResponseEntity.ok(tags);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('DASHBOARD_ADMIN')")
    public ResponseEntity<?> deleteTag(@PathVariable String id) {
        try {
            tagService.deleteTag(id);
            Map<String, String> res = new HashMap<>();
            res.put("message", "Tag deleted");
            return ResponseEntity.ok(res);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}


