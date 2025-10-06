package com.crackersbazaar.config;

import com.crackersbazaar.entity.Role;
import com.crackersbazaar.entity.User;
import com.crackersbazaar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

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
    }
}
