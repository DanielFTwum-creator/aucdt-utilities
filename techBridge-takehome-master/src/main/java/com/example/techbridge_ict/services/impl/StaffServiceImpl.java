package com.example.techbridge_ict.services.impl;

import com.example.techbridge_ict.dto.staff.StaffDto;
import com.example.techbridge_ict.enums.ResponseMessageEnum;
import com.example.techbridge_ict.exception.BusinessException;
import com.example.techbridge_ict.mappers.StaffMapper;
import com.example.techbridge_ict.model.Staff;
import com.example.techbridge_ict.model.User;
import com.example.techbridge_ict.repository.StaffRepository;
import com.example.techbridge_ict.services.StaffService;
import com.example.techbridge_ict.services.UserService;
import lombok.AllArgsConstructor;
import org.apache.commons.lang3.StringUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.Year;

@Service
@AllArgsConstructor
public class StaffServiceImpl implements StaffService {
    private final StaffRepository staffRepository;
    private final UserService userService;
    private final StaffMapper staffMapper;
    @Override
    public Staff createStaff(StaffDto staffDto) {
        User user = userService.findById(staffDto.getUserId());
        if (staffRepository.existsByUserId(staffDto.getUserId())) {
            throw new BusinessException("Staff already exists for this user");
        }

        Staff staff = new Staff();
        staff.setUser(user);
        staff.setDepartment(staffDto.getDepartment());
        staff.setJobTitle(staffDto.getJobTitle());
        staff.setUnit(staffDto.getUnit());

        staff = staffRepository.save(staff);

        String code = generateStaffId(staff.getId(), user.getFirstName(), user.getLastName(), staffDto.getDepartment());
        staff.setEmployeeCode(code);

        return staffRepository.save(staff);
    }

    @Override
    public Staff updateStaff(Long id, StaffDto staffDto) {
        Staff staff = staffRepository.findById(id).get();
        if(StringUtils.isNotEmpty(staff.getDepartment())){
            staff.setDepartment(staffDto.getDepartment());
        }
        if(StringUtils.isNotEmpty(staff.getJobTitle())){
            staff.setJobTitle(staffDto.getJobTitle());
        }
        if(StringUtils.isNotEmpty(staff.getUnit())){
            staff.setUnit(staffDto.getUnit());
        }

        return staffRepository.save(staff);
    }

    @Override
    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }

    @Override
    public Staff findStaffById(Long id) {
        return staffRepository.findById(id).orElseThrow(()->  new BusinessException(ResponseMessageEnum.BACK_STAFF_MSG_01));
    }

    @Override
    public Page<StaffDto> findAllStaff(Pageable pageable) {
        return staffRepository.findAllWithUser(pageable).map(staffMapper::toDto);
    }


    public String generateStaffNumber(Long seq, String name) {
        return String.format("USR-%s-%06d", name.substring(0, 3), seq);
    }


    public String generateStaffId(Long seq, String firstName, String lastName, String dept) {
        return String.format(
                "%s-%s-%s-%06d",
                yearTwoDigits(),
                generateInitials(firstName, lastName),
                dept.substring(0, 2).toUpperCase(),
                seq
        );
    }



    private String yearTwoDigits() {
        return String.valueOf(Year.now().getValue()).substring(2);
    }


    private String initialOf(String value) {
        return (value != null && !value.isBlank())
                ? value.substring(0, 1).toUpperCase()
                : "X";
    }

    private String generateInitials(String firstName, String lastName) {
        return initialOf(firstName) + initialOf(lastName);
    }
}
