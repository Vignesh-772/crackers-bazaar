package com.crackersbazaar.repository;

import com.crackersbazaar.entity.Manufacturer;
import com.crackersbazaar.entity.ManufacturerStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ManufacturerRepository extends JpaRepository<Manufacturer, Long> {
    
    Optional<Manufacturer> findByEmail(String email);
    
    List<Manufacturer> findByStatus(ManufacturerStatus status);
    
    Page<Manufacturer> findByStatus(ManufacturerStatus status, Pageable pageable);
    
    @Query("SELECT m FROM Manufacturer m WHERE m.companyName LIKE %:companyName%")
    List<Manufacturer> findByCompanyNameContaining(@Param("companyName") String companyName);
    
    @Query("SELECT m FROM Manufacturer m WHERE m.city = :city")
    List<Manufacturer> findByCity(@Param("city") String city);
    
    @Query("SELECT m FROM Manufacturer m WHERE m.state = :state")
    List<Manufacturer> findByState(@Param("state") String state);
    
    @Query("SELECT m FROM Manufacturer m WHERE m.verified = :verified")
    List<Manufacturer> findByVerified(@Param("verified") Boolean verified);
    
    @Query("SELECT m FROM Manufacturer m WHERE m.status IN :statuses")
    Page<Manufacturer> findByStatusIn(@Param("statuses") List<ManufacturerStatus> statuses, Pageable pageable);
    
    @Query("SELECT COUNT(m) FROM Manufacturer m WHERE m.status = :status")
    Long countByStatus(@Param("status") ManufacturerStatus status);
    
    @Query("SELECT COUNT(m) FROM Manufacturer m WHERE m.verified = :verified")
    Long countByVerified(@Param("verified") Boolean verified);
}
