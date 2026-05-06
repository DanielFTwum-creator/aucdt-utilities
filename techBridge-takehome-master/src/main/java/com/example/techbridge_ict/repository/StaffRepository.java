package com.example.techbridge_ict.repository;

import com.example.techbridge_ict.model.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StaffRepository extends JpaRepository<Staff, Long> {
    Optional<Staff> findByUserId(Long userId);
    boolean existsByUserId(Long userId);
    @Query("""
    select s from Staff s
    join fetch s.user u
""")
    Page<Staff> findAllWithUser(Pageable pageable);


}
