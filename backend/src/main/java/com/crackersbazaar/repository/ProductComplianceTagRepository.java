package com.crackersbazaar.repository;

import com.crackersbazaar.entity.ProductComplianceTag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductComplianceTagRepository extends JpaRepository<ProductComplianceTag, String> {

    @Query("SELECT t FROM ProductComplianceTag t WHERE t.product.id = :productId")
    List<ProductComplianceTag> findByProductId(String productId);

    @Query("SELECT t FROM ProductComplianceTag t WHERE t.tagType = :tagType")
    List<ProductComplianceTag> findByTagType(String tagType);
}


