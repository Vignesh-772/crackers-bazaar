package com.crackersbazaar.service;

import com.crackersbazaar.entity.Manufacturer;
import com.crackersbazaar.entity.Role;
import com.crackersbazaar.entity.User;
import com.crackersbazaar.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class ManufacturerUserService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    /**
     * Create a User account for an approved manufacturer
     * This allows the manufacturer to login to the system
     */
    public User createManufacturerUser(Manufacturer manufacturer) {
        // Check if user already exists for this manufacturer
        if (userRepository.existsByEmail(manufacturer.getEmail())) {
            throw new RuntimeException("User account already exists for manufacturer email: " + manufacturer.getEmail());
        }
        
        // Generate a temporary password
        String tempPassword = generateTemporaryPassword();
        
        // Create user account
        User user = new User();
        user.setUsername(generateUsername(manufacturer));
        user.setEmail(manufacturer.getEmail());
        user.setPassword(passwordEncoder.encode(tempPassword));
        user.setFirstName(manufacturer.getContactPerson().split(" ")[0]); // First name from contact person
        user.setLastName(manufacturer.getContactPerson().contains(" ") ? 
            manufacturer.getContactPerson().substring(manufacturer.getContactPerson().indexOf(" ") + 1) : "");
        user.setRole(Role.MANUFACTURER);
        user.setActive(true);
        
        User savedUser = userRepository.save(user);
        
        // Log the credentials for admin reference
        System.out.println("Manufacturer User Account Created:");
        System.out.println("Username: " + savedUser.getUsername());
        System.out.println("Email: " + savedUser.getEmail());
        System.out.println("Temporary Password: " + tempPassword);
        System.out.println("Manufacturer ID: " + manufacturer.getId());
        
        return savedUser;
    }
    
    /**
     * Generate a unique username for the manufacturer
     */
    private String generateUsername(Manufacturer manufacturer) {
        String baseUsername = manufacturer.getCompanyName()
            .toLowerCase()
            .replaceAll("[^a-z0-9]", "")
            .substring(0, Math.min(manufacturer.getCompanyName().length(), 10));
        
        String username = baseUsername;
        int counter = 1;
        
        // Ensure username is unique
        while (userRepository.existsByUsername(username)) {
            username = baseUsername + counter;
            counter++;
        }
        
        return username;
    }
    
    /**
     * Generate a temporary password for the manufacturer
     */
    private String generateTemporaryPassword() {
        // Generate a secure temporary password
        return "TempPass" + java.util.UUID.randomUUID().toString().substring(0, 8);
    }
    
    /**
     * Reset password for a manufacturer user
     */
    public String resetManufacturerPassword(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        
        if (user.getRole() != Role.MANUFACTURER) {
            throw new RuntimeException("User is not a manufacturer");
        }
        
        String newPassword = generateTemporaryPassword();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
        
        System.out.println("Password reset for manufacturer:");
        System.out.println("Username: " + user.getUsername());
        System.out.println("Email: " + user.getEmail());
        System.out.println("New Password: " + newPassword);
        
        return newPassword;
    }
    
    /**
     * Check if a manufacturer has a user account
     */
    public boolean hasUserAccount(String email) {
        return userRepository.existsByEmail(email);
    }
    
    /**
     * Get user account for a manufacturer
     */
    public User getManufacturerUser(String email) {
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User account not found for manufacturer email: " + email));
    }
}
