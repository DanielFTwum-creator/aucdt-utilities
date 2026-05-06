package com.example.techbridge_ict.controller.admin;

import com.example.techbridge_ict.dto.staff.StaffDto;
import com.example.techbridge_ict.mappers.StaffMapper;
import com.example.techbridge_ict.services.StaffService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/admin/staff")
public class StaffController {
    @Autowired
    private StaffService staffService;
    @Autowired
    private StaffMapper staffMapper;

    @PostMapping
    public ResponseEntity<StaffDto> create(@RequestBody StaffDto staffDto) {
        return ResponseEntity.ok(staffMapper.toDto(staffService.createStaff(staffDto)));
    }

    @GetMapping
    public ResponseEntity< Page<StaffDto>> getAllStaff(
           Pageable pageable) {
        return ResponseEntity.ok(staffService.findAllStaff(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<StaffDto> updateStaff(@PathVariable Long id ,@RequestBody StaffDto staffDto) {
        return ResponseEntity.ok(staffMapper.toDto(staffService.updateStaff(id, staffDto)));

    }

    @GetMapping("/{id}")
    public ResponseEntity<StaffDto> getStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(staffMapper.toDto(staffService.findStaffById(id)));
    }






}
