package com.crackersbazaar.dto;

import com.crackersbazaar.entity.Manufacturer;
import com.crackersbazaar.entity.ManufacturerStatus;

import java.time.LocalDateTime;

public class ManufacturerResponse {
    
    private String id;
    private String userId;
    private String companyName;
    private String contactPerson;
    private String email;
    private String phoneNumber;
    private String address;
    private String city;
    private String state;
    private String pincode;
    private String country;
    private String gstNumber;
    private String panNumber;
    private String licenseNumber;
    private LocalDateTime licenseValidity;
    private ManufacturerStatus status;
    private Boolean verified;
    private String verificationNotes;
    private String verifiedBy;
    private LocalDateTime verifiedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public ManufacturerResponse() {}
    
    public ManufacturerResponse(Manufacturer manufacturer) {
        this.id = manufacturer.getId();
        this.userId = manufacturer.getUser() != null ? manufacturer.getUser().getId() : null;
        this.companyName = manufacturer.getCompanyName();
        this.contactPerson = manufacturer.getContactPerson();
        this.email = manufacturer.getEmail();
        this.phoneNumber = manufacturer.getPhoneNumber();
        this.address = manufacturer.getAddress();
        this.city = manufacturer.getCity();
        this.state = manufacturer.getState();
        this.pincode = manufacturer.getPincode();
        this.country = manufacturer.getCountry();
        this.gstNumber = manufacturer.getGstNumber();
        this.panNumber = manufacturer.getPanNumber();
        this.licenseNumber = manufacturer.getLicenseNumber();
        this.licenseValidity = manufacturer.getLicenseValidity();
        this.status = manufacturer.getStatus();
        this.verified = manufacturer.getVerified();
        this.verificationNotes = manufacturer.getVerificationNotes();
        this.verifiedBy = manufacturer.getVerifiedBy();
        this.verifiedAt = manufacturer.getVerifiedAt();
        this.createdAt = manufacturer.getCreatedAt();
        this.updatedAt = manufacturer.getUpdatedAt();
    }
    
    // Getters and Setters
    public String getId() {
        return id;
    }
    
    public void setId(String id) {
        this.id = id;
    }
    
    public String getUserId() {
        return userId;
    }
    
    public void setUserId(String userId) {
        this.userId = userId;
    }
    
    public String getCompanyName() {
        return companyName;
    }
    
    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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
}
