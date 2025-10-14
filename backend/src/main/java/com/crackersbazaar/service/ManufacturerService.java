package com.crackersbazaar.service;

import com.crackersbazaar.dto.ManufacturerRequest;
import com.crackersbazaar.dto.ManufacturerResponse;
import com.crackersbazaar.dto.ManufacturerVerificationRequest;
import com.crackersbazaar.entity.Manufacturer;
import com.crackersbazaar.entity.ManufacturerStatus;
import com.crackersbazaar.entity.Role;
import com.crackersbazaar.entity.User;
import com.crackersbazaar.repository.ManufacturerRepository;
import com.crackersbazaar.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class ManufacturerService {
    
    @Autowired
    private ManufacturerRepository manufacturerRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private ManufacturerUserService manufacturerUserService;
    
    public ManufacturerResponse createManufacturer(ManufacturerRequest request) {
        // Validate password confirmation
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Password and confirm password do not match");
        }
        
        // Check if manufacturer with same email already exists
        if (manufacturerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Manufacturer with email " + request.getEmail() + " already exists");
        }
        
        // Check if user with same username already exists
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username " + request.getUsername() + " is already taken");
        }
        
        // Check if user with same email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("User with email " + request.getEmail() + " already exists");
        }
        
        // Create user account for the manufacturer first
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        // Extract first and last name from contact person
        String[] nameParts = request.getContactPerson().split(" ", 2);
        user.setFirstName(nameParts[0]);
        user.setLastName(nameParts.length > 1 ? nameParts[1] : "");
        
        user.setRole(Role.MANUFACTURER);
        user.setActive(true);
        
        User savedUser = userRepository.save(user);
        
        // Create manufacturer and link to user
        Manufacturer manufacturer = new Manufacturer();
        setManufacturer(request, manufacturer);
        manufacturer.setStatus(ManufacturerStatus.PENDING);
        manufacturer.setVerified(false);
        manufacturer.setUser(savedUser);  // Link the user to manufacturer
        
        Manufacturer savedManufacturer = manufacturerRepository.save(manufacturer);
        
        System.out.println("Manufacturer and User account created:");
        System.out.println("Manufacturer ID: " + savedManufacturer.getId());
        System.out.println("User ID: " + savedUser.getId());
        System.out.println("Username: " + savedUser.getUsername());
        System.out.println("Email: " + savedUser.getEmail());
        System.out.println("Status: PENDING (awaiting admin approval)");
        System.out.println("User linked to Manufacturer via user_id: " + savedUser.getId());
        
        return new ManufacturerResponse(savedManufacturer);
    }
    
    public ManufacturerResponse getManufacturerById(Long id) {
        Manufacturer manufacturer = manufacturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with id: " + id));
        return new ManufacturerResponse(manufacturer);
    }
    
    public ManufacturerResponse getManufacturerByEmail(String email) {
        Manufacturer manufacturer = manufacturerRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with email: " + email));
        return new ManufacturerResponse(manufacturer);
    }
    
    public List<ManufacturerResponse> getAllManufacturers() {
        List<Manufacturer> manufacturers = manufacturerRepository.findAll();
        return manufacturers.stream()
                .map(ManufacturerResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ManufacturerResponse> getAllManufacturers(Pageable pageable) {
        Page<Manufacturer> manufacturers = manufacturerRepository.findAll(pageable);
        return manufacturers.map(ManufacturerResponse::new);
    }
    
    public List<ManufacturerResponse> getManufacturersByStatus(ManufacturerStatus status) {
        List<Manufacturer> manufacturers = manufacturerRepository.findByStatus(status);
        return manufacturers.stream()
                .map(ManufacturerResponse::new)
                .collect(Collectors.toList());
    }
    
    public Page<ManufacturerResponse> getManufacturersByStatus(ManufacturerStatus status, Pageable pageable) {
        Page<Manufacturer> manufacturers = manufacturerRepository.findByStatus(status, pageable);
        return manufacturers.map(ManufacturerResponse::new);
    }
    
    public List<ManufacturerResponse> searchManufacturersByCompanyName(String companyName) {
        List<Manufacturer> manufacturers = manufacturerRepository.findByCompanyNameContaining(companyName);
        return manufacturers.stream()
                .map(ManufacturerResponse::new)
                .collect(Collectors.toList());
    }
    
    public List<ManufacturerResponse> getManufacturersByCity(String city) {
        List<Manufacturer> manufacturers = manufacturerRepository.findByCity(city);
        return manufacturers.stream()
                .map(ManufacturerResponse::new)
                .collect(Collectors.toList());
    }
    
    public List<ManufacturerResponse> getManufacturersByState(String state) {
        List<Manufacturer> manufacturers = manufacturerRepository.findByState(state);
        return manufacturers.stream()
                .map(ManufacturerResponse::new)
                .collect(Collectors.toList());
    }
    
    public ManufacturerResponse updateManufacturer(Long id, ManufacturerRequest request) {
        Manufacturer manufacturer = manufacturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with id: " + id));
        
        // Check if email is being changed and if new email already exists
        if (!manufacturer.getEmail().equals(request.getEmail())) {
            if (manufacturerRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Manufacturer with email " + request.getEmail() + " already exists");
            }
        }

        setManufacturer(request, manufacturer);
        
        Manufacturer savedManufacturer = manufacturerRepository.save(manufacturer);
        return new ManufacturerResponse(savedManufacturer);
    }
    
    public ManufacturerResponse verifyManufacturer(Long id, ManufacturerVerificationRequest request, Long adminId) {
        Manufacturer manufacturer = manufacturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with id: " + id));
        
        manufacturer.setStatus(request.getStatus());
        manufacturer.setVerificationNotes(request.getVerificationNotes());
        manufacturer.setVerifiedBy(adminId);
        manufacturer.setVerifiedAt(LocalDateTime.now());
        
        // Set verified to true if status is APPROVED or ACTIVE
        manufacturer.setVerified(request.getStatus() == ManufacturerStatus.APPROVED || request.getStatus() == ManufacturerStatus.ACTIVE);
        
        Manufacturer savedManufacturer = manufacturerRepository.save(manufacturer);
        
        // Update user account status based on manufacturer verification
        User user = userRepository.findByEmail(manufacturer.getEmail()).orElse(null);
        if (user != null) {
            if (request.getStatus() == ManufacturerStatus.APPROVED || request.getStatus() == ManufacturerStatus.ACTIVE) {
                user.setActive(true);
                System.out.println("User account activated for approved manufacturer: " + manufacturer.getCompanyName());
            } else if (request.getStatus() == ManufacturerStatus.REJECTED || request.getStatus() == ManufacturerStatus.SUSPENDED) {
                user.setActive(false);
                System.out.println("User account deactivated for manufacturer: " + manufacturer.getCompanyName());
            }
            userRepository.save(user);
        }
        
        return new ManufacturerResponse(savedManufacturer);
    }
    
    public void deleteManufacturer(Long id) {
        Manufacturer manufacturer = manufacturerRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found with id: " + id));
        
        // Get user before deleting (for logging)
        User user = manufacturer.getUser();
        
        // Delete manufacturer (cascade will delete user due to CascadeType.REMOVE)
        manufacturerRepository.delete(manufacturer);
        
        System.out.println("Manufacturer deleted: " + manufacturer.getCompanyName());
        if (user != null) {
            System.out.println("Associated user account also deleted: " + user.getUsername());
        }
    }
    
    public Long getManufacturerCountByStatus(ManufacturerStatus status) {
        return manufacturerRepository.countByStatus(status);
    }
    
    public Long getVerifiedManufacturerCount() {
        return manufacturerRepository.countByVerified(true);
    }
    
    public Long getUnverifiedManufacturerCount() {
        return manufacturerRepository.countByVerified(false);
    }
    
    public ManufacturerResponse getManufacturerByUserId(Long userId) {
        Manufacturer manufacturer = manufacturerRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Manufacturer not found for user id: " + userId));
        return new ManufacturerResponse(manufacturer);
    }
    
    public ManufacturerResponse getManufacturerByUserEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        Manufacturer manufacturer = manufacturerRepository.findByUser(user)
                .orElseThrow(() -> new RuntimeException("Manufacturer profile not found for user: " + email));
        return new ManufacturerResponse(manufacturer);
    }

    private void setManufacturer(ManufacturerRequest request, Manufacturer manufacturer) {
        manufacturer.setCompanyName(request.getCompanyName());
        manufacturer.setContactPerson(request.getContactPerson());
        manufacturer.setEmail(request.getEmail());
        manufacturer.setPhoneNumber(request.getPhoneNumber());
        manufacturer.setAddress(request.getAddress());
        manufacturer.setCity(request.getCity());
        manufacturer.setState(request.getState());
        manufacturer.setPincode(request.getPincode());
        manufacturer.setCountry(request.getCountry());
        manufacturer.setGstNumber(request.getGstNumber());
        manufacturer.setPanNumber(request.getPanNumber());
        manufacturer.setLicenseNumber(request.getLicenseNumber());

        // Parse license validity if provided
        if (request.getLicenseValidity() != null && !request.getLicenseValidity().isEmpty()) {
            try {
                DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSX");
                LocalDateTime licenseValidity = LocalDateTime.parse(request.getLicenseValidity(), formatter);
                manufacturer.setLicenseValidity(licenseValidity);
            } catch (Exception e) {
                e.printStackTrace();
                throw new RuntimeException("Invalid license validity date format");
            }
        }
    }
}
