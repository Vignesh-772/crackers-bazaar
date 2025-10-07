package com.crackersbazaar.dto;

import com.crackersbazaar.entity.ManufacturerStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class ManufacturerVerificationRequest {
    
    @NotNull(message = "Status is required")
    private ManufacturerStatus status;
    
    @Size(max = 1000, message = "Verification notes must not exceed 1000 characters")
    private String verificationNotes;
    
    // Constructors
    public ManufacturerVerificationRequest() {}
    
    public ManufacturerVerificationRequest(ManufacturerStatus status, String verificationNotes) {
        this.status = status;
        this.verificationNotes = verificationNotes;
    }
    
    // Getters and Setters
    public ManufacturerStatus getStatus() {
        return status;
    }
    
    public void setStatus(ManufacturerStatus status) {
        this.status = status;
    }
    
    public String getVerificationNotes() {
        return verificationNotes;
    }
    
    public void setVerificationNotes(String verificationNotes) {
        this.verificationNotes = verificationNotes;
    }
}
