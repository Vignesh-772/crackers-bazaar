package com.crackersbazaar.service;

import com.crackersbazaar.entity.Product;
import com.crackersbazaar.entity.ProductComplianceTag;
import com.crackersbazaar.entity.User;
import com.crackersbazaar.repository.ProductComplianceTagRepository;
import com.crackersbazaar.repository.ProductRepository;
import com.crackersbazaar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class ProductComplianceTagService {

    @Autowired
    private ProductComplianceTagRepository tagRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    public ProductComplianceTag addTag(String productId, String tagType, String tagValue, String createdByUserId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found: " + productId));

        ProductComplianceTag tag = new ProductComplianceTag();
        tag.setId(UUID.randomUUID().toString());
        tag.setProduct(product);
        tag.setTagType(tagType);
        tag.setTagValue(tagValue);

        if (createdByUserId != null) {
            userRepository.findById(createdByUserId).ifPresent(tag::setCreatedBy);
        }

        return tagRepository.save(tag);
    }

    public List<ProductComplianceTag> getTagsByProduct(String productId) {
        return tagRepository.findByProductId(productId);
    }

    public List<ProductComplianceTag> getTagsByType(String tagType) {
        return tagRepository.findByTagType(tagType);
    }

    public void deleteTag(String id) {
        tagRepository.deleteById(id);
    }
}


