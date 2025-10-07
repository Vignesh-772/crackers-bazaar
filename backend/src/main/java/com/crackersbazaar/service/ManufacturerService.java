package com.crackersbazaar.service;

import com.crackersbazaar.dto.ManufacturerRequest;
import com.crackersbazaar.dto.ManufacturerResponse;
import com.crackersbazaar.dto.ManufacturerVerificationRequest;
import com.crackersbazaar.entity.Manufacturer;
import com.crackersbazaar.entity.ManufacturerStatus;
import com.crackersbazaar.repository.ManufacturerRepository;
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
    
    public ManufacturerResponse createManufacturer(ManufacturerRequest request) {
        // Check if manufacturer with same email already exists
        if (manufacturerRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Manufacturer with email " + request.getEmail() + " already exists");
        }
        
        Manufacturer manufacturer = new Manufacturer();
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
                LocalDateTime licenseValidity = LocalDateTime.parse(request.getLicenseValidity());
                manufacturer.setLicenseValidity(licenseValidity);
            } catch (Exception e) {
                throw new RuntimeException("Invalid license validity date format");
            }
        }
        
        manufacturer.setStatus(ManufacturerStatus.PENDING);
        manufacturer.setVerified(false);
        
        Manufacturer savedManufacturer = manufacturerRepository.save(manufacturer);
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
                LocalDateTime licenseValidity = LocalDateTime.parse(request.getLicenseValidity());
                manufacturer.setLicenseValidity(licenseValidity);
            } catch (Exception e) {
                throw new RuntimeException("Invalid license validity date format");
            }
        }
        
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
        if (request.getStatus() == ManufacturerStatus.APPROVED || request.getStatus() == ManufacturerStatus.ACTIVE) {
            manufacturer.setVerified(true);
        } else {
            manufacturer.setVerified(false);
        }
        
        Manufacturer savedManufacturer = manufacturerRepository.save(manufacturer);
        return new ManufacturerResponse(savedManufacturer);
    }
    
    public void deleteManufacturer(Long id) {
        if (!manufacturerRepository.existsById(id)) {
            throw new RuntimeException("Manufacturer not found with id: " + id);
        }
        manufacturerRepository.deleteById(id);
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
}
