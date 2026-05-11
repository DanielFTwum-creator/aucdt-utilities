package com.example.techbridge_ict.services;


import com.example.techbridge_ict.dto.staff.StaffDto;
import com.example.techbridge_ict.model.Staff;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface StaffService {
    Staff createStaff(StaffDto staffDto);
    Staff updateStaff(Long id , StaffDto staffDto);
    void deleteStaff(Long id);
    Staff findStaffById(Long id);
    public Page<StaffDto> findAllStaff(Pageable pageable);

}
