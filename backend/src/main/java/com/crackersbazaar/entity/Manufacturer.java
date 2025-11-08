package com.crackersbazaar.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "manufacturers")
public class Manufacturer {
    
    @Id
    @Column(columnDefinition = "VARCHAR(36)")
    private String id;
    
    @NotBlank
    @Size(max = 100)
    @Column(name = "company_name")
    private String companyName;
    
    @Size(max = 200)
    @Column(name = "company_legal_name")
    private String companyLegalName;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "contact_person")
    private String contactPerson;
    
    @NotBlank
    @Size(max = 100)
    @Email
    @Column(name = "email", unique = true)
    private String email;
    
    @NotBlank
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @NotBlank
    @Size(max = 500)
    @Column(name = "address", length = 500)
    private String address;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "city")
    private String city;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "state")
    private String state;
    
    @NotBlank
    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
    @Column(name = "pincode")
    private String pincode;
    
    @NotBlank
    @Size(max = 50)
    @Column(name = "country")
    private String country;
    
    @Size(max = 20)
    @Column(name = "gst_number")
    private String gstNumber;
    
    @Size(max = 20)
    @Column(name = "pan_number")
    private String panNumber;
    
    @Size(max = 20)
    @Column(name = "license_number")
    private String licenseNumber;
    
    @Column(name = "license_validity")
    private LocalDateTime licenseValidity;
    
    @Column(name = "latitude", precision = 10, scale = 8)
    private java.math.BigDecimal latitude;
    
    @Column(name = "longitude", precision = 11, scale = 8)
    private java.math.BigDecimal longitude;
    
    @Size(max = 50)
    @Column(name = "peso_license_number")
    private String pesoLicenseNumber;
    
    @Column(name = "peso_license_expiry")
    private LocalDateTime pesoLicenseExpiry;
    
    @Size(max = 50)
    @Column(name = "factory_license_number")
    private String factoryLicenseNumber;
    
    @Column(name = "factory_license_expiry")
    private LocalDateTime factoryLicenseExpiry;
    
    @Size(max = 500)
    @Column(name = "fire_noc_url")
    private String fireNocUrl;
    
    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.REMOVE)
    @JoinColumn(name = "user_id", unique = true)
    private User user;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "status", length = 20)
    private ManufacturerStatus status = ManufacturerStatus.PENDING;
    
    @Column(name = "is_verified")
    private Boolean verified = false;
    
    @Column(name = "verification_notes", length = 1000)
    private String verificationNotes;
    
    @Column(name = "verified_by", columnDefinition = "VARCHAR(36)")
    private String verifiedBy;
    
    @Column(name = "verified_at")
    private LocalDateTime verifiedAt;
    
    @CreationTimestamp
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // Constructors
    public Manufacturer() {}
    
    public Manufacturer(String companyName, String contactPerson, String email, String phoneNumber, 
                      String address, String city, String state, String pincode, String country) {
        this.companyName = companyName;
        this.contactPerson = contactPerson;
        this.email = email;
        this.phoneNumber = phoneNumber;
        this.address = address;
        this.city = city;
        this.state = state;
        this.pincode = pincode;
        this.country = country;
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }
    
    public String getCompanyLegalName() {
        return companyLegalName;
    }
    
    public void setCompanyLegalName(String companyLegalName) {
        this.companyLegalName = companyLegalName;
    }
    
    public String getContactPerson() {
        return contactPerson;
    }
    
    public void setContactPerson(String contactPerson) {
        this.contactPerson = contactPerson;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPhoneNumber() {
        return phoneNumber;
    }
    
    public void setPhoneNumber(String phoneNumber) {
        this.phoneNumber = phoneNumber;
    }
    
    public String getAddress() {
        return address;
    }
    
    public void setAddress(String address) {
        this.address = address;
    }
    
    public String getCity() {
        return city;
    }
    
    public void setCity(String city) {
        this.city = city;
    }
    
    public String getState() {
        return state;
    }
    
    public void setState(String state) {
        this.state = state;
    }
    
    public String getPincode() {
        return pincode;
    }
    
    public void setPincode(String pincode) {
        this.pincode = pincode;
    }
    
    public String getCountry() {
        return country;
    }
    
    public void setCountry(String country) {
        this.country = country;
    }
    
    public String getGstNumber() {
        return gstNumber;
    }
    
    public void setGstNumber(String gstNumber) {
        this.gstNumber = gstNumber;
    }
    
    public String getPanNumber() {
        return panNumber;
    }
    
    public void setPanNumber(String panNumber) {
        this.panNumber = panNumber;
    }
    
    public String getLicenseNumber() {
        return licenseNumber;
    }
    
    public void setLicenseNumber(String licenseNumber) {
        this.licenseNumber = licenseNumber;
    }
    
    public LocalDateTime getLicenseValidity() {
        return licenseValidity;
    }
    
    public void setLicenseValidity(LocalDateTime licenseValidity) {
        this.licenseValidity = licenseValidity;
    }
    
    public java.math.BigDecimal getLatitude() {
        return latitude;
    }
    
    public void setLatitude(java.math.BigDecimal latitude) {
        this.latitude = latitude;
    }
    
    public java.math.BigDecimal getLongitude() {
        return longitude;
    }
    
    public void setLongitude(java.math.BigDecimal longitude) {
        this.longitude = longitude;
    }
    
    public String getPesoLicenseNumber() {
        return pesoLicenseNumber;
    }
    
    public void setPesoLicenseNumber(String pesoLicenseNumber) {
        this.pesoLicenseNumber = pesoLicenseNumber;
    }
    
    public LocalDateTime getPesoLicenseExpiry() {
        return pesoLicenseExpiry;
    }
    
    public void setPesoLicenseExpiry(LocalDateTime pesoLicenseExpiry) {
        this.pesoLicenseExpiry = pesoLicenseExpiry;
    }
    
    public String getFactoryLicenseNumber() {
        return factoryLicenseNumber;
    }
    
    public void setFactoryLicenseNumber(String factoryLicenseNumber) {
        this.factoryLicenseNumber = factoryLicenseNumber;
    }
    
    public LocalDateTime getFactoryLicenseExpiry() {
        return factoryLicenseExpiry;
    }
    
    public void setFactoryLicenseExpiry(LocalDateTime factoryLicenseExpiry) {
        this.factoryLicenseExpiry = factoryLicenseExpiry;
    }
    
    public String getFireNocUrl() {
        return fireNocUrl;
    }
    
    public void setFireNocUrl(String fireNocUrl) {
        this.fireNocUrl = fireNocUrl;
    }
    
    public ManufacturerStatus getStatus() {
        return status;
    }
    
    public void setStatus(ManufacturerStatus status) {
        this.status = status;
    }
    
    public Boolean getVerified() {
        return verified;
    }
    
    public void setVerified(Boolean verified) {
        this.verified = verified;
    }
    
    public String getVerificationNotes() {
        return verificationNotes;
    }
    
    public void setVerificationNotes(String verificationNotes) {
        this.verificationNotes = verificationNotes;
    }
    
    public String getVerifiedBy() {
        return verifiedBy;
    }
    
    public void setVerifiedBy(String verifiedBy) {
        this.verifiedBy = verifiedBy;
    }
    
    public LocalDateTime getVerifiedAt() {
        return verifiedAt;
    }
    
    public void setVerifiedAt(LocalDateTime verifiedAt) {
        this.verifiedAt = verifiedAt;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
    
    public User getUser() {
        return user;
    }
    
    public void setUser(User user) {
        this.user = user;
    }
}
