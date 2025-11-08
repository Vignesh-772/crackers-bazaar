package com.crackersbazaar.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;

public class ManufacturerRequest {
    
    @NotBlank(message = "Company name is required")
    @Size(max = 100, message = "Company name must not exceed 100 characters")
    private String companyName;
    
    @NotBlank(message = "Contact person is required")
    @Size(max = 50, message = "Contact person name must not exceed 50 characters")
    private String contactPerson;
    
    @NotBlank(message = "Email is required")
    @Size(max = 100, message = "Email must not exceed 100 characters")
    @Email(message = "Email should be valid")
    private String email;
    
    @NotBlank(message = "Phone number is required")
    @Pattern(regexp = "^[0-9]{10}$", message = "Phone number must be 10 digits")
    private String phoneNumber;
    
    @NotBlank(message = "Address is required")
    @Size(max = 500, message = "Address must not exceed 500 characters")
    private String address;
    
    @NotBlank(message = "City is required")
    @Size(max = 50, message = "City name must not exceed 50 characters")
    private String city;
    
    @NotBlank(message = "State is required")
    @Size(max = 50, message = "State name must not exceed 50 characters")
    private String state;
    
    @NotBlank(message = "Pincode is required")
    @Pattern(regexp = "^[0-9]{6}$", message = "Pincode must be 6 digits")
    private String pincode;
    
    @NotBlank(message = "Country is required")
    @Size(max = 50, message = "Country name must not exceed 50 characters")
    private String country;
    
    @Size(max = 20, message = "GST number must not exceed 20 characters")
    private String gstNumber;
    
    @Size(max = 20, message = "PAN number must not exceed 20 characters")
    private String panNumber;
    
    @Size(max = 20, message = "License number must not exceed 20 characters")
    private String licenseNumber;
    
    private String licenseValidity;
    
    @Size(max = 200, message = "Company legal name must not exceed 200 characters")
    private String companyLegalName;
    
    @Size(max = 50, message = "PESO license number must not exceed 50 characters")
    private String pesoLicenseNumber;
    
    private String pesoLicenseExpiry;
    
    @Size(max = 50, message = "Factory license number must not exceed 50 characters")
    private String factoryLicenseNumber;
    
    private String factoryLicenseExpiry;
    
    @Size(max = 500, message = "Fire NOC URL must not exceed 500 characters")
    private String fireNocUrl;
    
    private java.math.BigDecimal latitude;
    
    private java.math.BigDecimal longitude;
    
    // User credentials
    @NotBlank(message = "Username is required")
    @Size(min = 3, max = 50, message = "Username must be between 3 and 50 characters")
    private String username;
    
    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
    
    @NotBlank(message = "Confirm password is required")
    private String confirmPassword;
    
    // Constructors
    public ManufacturerRequest() {}
    
    public ManufacturerRequest(String companyName, String contactPerson, String email, String phoneNumber,
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
    
    public String getLicenseValidity() {
        return licenseValidity;
    }
    
    public void setLicenseValidity(String licenseValidity) {
        this.licenseValidity = licenseValidity;
    }
    
    public String getCompanyLegalName() {
        return companyLegalName;
    }
    
    public void setCompanyLegalName(String companyLegalName) {
        this.companyLegalName = companyLegalName;
    }
    
    public String getPesoLicenseNumber() {
        return pesoLicenseNumber;
    }
    
    public void setPesoLicenseNumber(String pesoLicenseNumber) {
        this.pesoLicenseNumber = pesoLicenseNumber;
    }
    
    public String getPesoLicenseExpiry() {
        return pesoLicenseExpiry;
    }
    
    public void setPesoLicenseExpiry(String pesoLicenseExpiry) {
        this.pesoLicenseExpiry = pesoLicenseExpiry;
    }
    
    public String getFactoryLicenseNumber() {
        return factoryLicenseNumber;
    }
    
    public void setFactoryLicenseNumber(String factoryLicenseNumber) {
        this.factoryLicenseNumber = factoryLicenseNumber;
    }
    
    public String getFactoryLicenseExpiry() {
        return factoryLicenseExpiry;
    }
    
    public void setFactoryLicenseExpiry(String factoryLicenseExpiry) {
        this.factoryLicenseExpiry = factoryLicenseExpiry;
    }
    
    public String getFireNocUrl() {
        return fireNocUrl;
    }
    
    public void setFireNocUrl(String fireNocUrl) {
        this.fireNocUrl = fireNocUrl;
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
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public String getConfirmPassword() {
        return confirmPassword;
    }
    
    public void setConfirmPassword(String confirmPassword) {
        this.confirmPassword = confirmPassword;
    }
}
