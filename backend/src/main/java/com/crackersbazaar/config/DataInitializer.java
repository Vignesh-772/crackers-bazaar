package com.crackersbazaar.config;

import com.crackersbazaar.entity.Role;
import com.crackersbazaar.entity.User;
import com.crackersbazaar.entity.Manufacturer;
import com.crackersbazaar.entity.Product;
import com.crackersbazaar.repository.UserRepository;
import com.crackersbazaar.repository.ManufacturerRepository;
import com.crackersbazaar.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ManufacturerRepository manufacturerRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Create default admin user if not exists
        if (!userRepository.existsByUsername("admin")) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setEmail("admin@crackersbazaar.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setFirstName("System");
            admin.setLastName("Administrator");
            admin.setRole(Role.ADMIN);
            admin.setActive(true);
            userRepository.save(admin);
            System.out.println("Default admin user created: admin/admin123");
        }

        // Create default dashboard admin user if not exists
        if (!userRepository.existsByUsername("dashboard_admin")) {
            User dashboardAdmin = new User();
            dashboardAdmin.setUsername("dashboard_admin");
            dashboardAdmin.setEmail("dashboard@crackersbazaar.com");
            dashboardAdmin.setPassword(passwordEncoder.encode("dashboard123"));
            dashboardAdmin.setFirstName("Dashboard");
            dashboardAdmin.setLastName("Administrator");
            dashboardAdmin.setRole(Role.DASHBOARD_ADMIN);
            dashboardAdmin.setActive(true);
            userRepository.save(dashboardAdmin);
            System.out.println("Default dashboard admin user created: dashboard_admin/dashboard123");
        }

        // Create sample manufacturer
        if (!manufacturerRepository.findByEmail("manufacturer@example.com").isPresent()) {
            Manufacturer manufacturer = new Manufacturer();
            manufacturer.setCompanyName("Sample Fireworks Co.");
            manufacturer.setContactPerson("John Doe");
            manufacturer.setEmail("manufacturer@example.com");
            manufacturer.setPhoneNumber("9876543210");
            manufacturer.setAddress("123 Fireworks Street, Mumbai, Maharashtra");
            manufacturer.setCity("Mumbai");
            manufacturer.setState("Maharashtra");
            manufacturer.setPincode("400001");
            manufacturer.setCountry("India");
            manufacturer.setGstNumber("27ABCDE1234F1Z5");
            manufacturer.setStatus(com.crackersbazaar.entity.ManufacturerStatus.APPROVED);
            manufacturer.setVerified(true);
            manufacturerRepository.save(manufacturer);
            System.out.println("Sample manufacturer created");

            // Create sample products
            createSampleProducts(manufacturer);
        }
    }

    private void createSampleProducts(Manufacturer manufacturer) {
        // Sample Product 1: Firecrackers
        Product product1 = new Product();
        product1.setName("Premium Firecrackers Pack");
        product1.setDescription("High-quality firecrackers with excellent sound and visual effects");
        product1.setPrice(new BigDecimal("299.00"));
        product1.setCategory("Firecrackers");
        product1.setSubcategory("Standard");
        product1.setStockQuantity(100);
        product1.setMinOrderQuantity(1);
        product1.setMaxOrderQuantity(50);
        product1.setWeight(new BigDecimal("0.5"));
        product1.setDimensions("10x5x5 cm");
        product1.setColor("Red");
        product1.setMaterial("Paper");
        product1.setBrand("Premium");
        product1.setSku("FC-001");
        product1.setBarcode("1234567890123");
        product1.setIsActive(true);
        product1.setIsFeatured(true);
        product1.setTags("firecrackers,premium,diwali");
        product1.setWarrantyPeriod("1 year");
        product1.setReturnPolicy("7 days return");
        product1.setShippingInfo("Free shipping on orders above ₹500");
        product1.setManufacturer(manufacturer);
        productRepository.save(product1);

        // Sample Product 2: Sparklers
        Product product2 = new Product();
        product2.setName("Colorful Sparklers Set");
        product2.setDescription("Beautiful sparklers with multiple colors and effects");
        product2.setPrice(new BigDecimal("199.00"));
        product2.setCategory("Sparklers");
        product2.setSubcategory("Colorful");
        product2.setStockQuantity(150);
        product2.setMinOrderQuantity(1);
        product2.setMaxOrderQuantity(100);
        product2.setWeight(new BigDecimal("0.2"));
        product2.setDimensions("20x1x1 cm");
        product2.setColor("Multi-color");
        product2.setMaterial("Metal");
        product2.setBrand("Sparkle");
        product2.setSku("SP-001");
        product2.setBarcode("1234567890124");
        product2.setIsActive(true);
        product2.setIsFeatured(false);
        product2.setTags("sparklers,colorful,diwali");
        product2.setWarrantyPeriod("6 months");
        product2.setReturnPolicy("7 days return");
        product2.setShippingInfo("Free shipping on orders above ₹500");
        product2.setManufacturer(manufacturer);
        productRepository.save(product2);

        // Sample Product 3: Fountains
        Product product3 = new Product();
        product3.setName("Garden Fountain Fireworks");
        product3.setDescription("Safe and beautiful fountain fireworks for outdoor use");
        product3.setPrice(new BigDecimal("399.00"));
        product3.setCategory("Fountains");
        product3.setSubcategory("Garden");
        product3.setStockQuantity(75);
        product3.setMinOrderQuantity(1);
        product3.setMaxOrderQuantity(25);
        product3.setWeight(new BigDecimal("1.0"));
        product3.setDimensions("15x15x20 cm");
        product3.setColor("Gold");
        product3.setMaterial("Cardboard");
        product3.setBrand("Garden");
        product3.setSku("FT-001");
        product3.setBarcode("1234567890125");
        product3.setIsActive(true);
        product3.setIsFeatured(true);
        product3.setTags("fountains,garden,safe");
        product3.setWarrantyPeriod("1 year");
        product3.setReturnPolicy("7 days return");
        product3.setShippingInfo("Free shipping on orders above ₹500");
        product3.setManufacturer(manufacturer);
        productRepository.save(product3);

        System.out.println("Sample products created");
    }
}
