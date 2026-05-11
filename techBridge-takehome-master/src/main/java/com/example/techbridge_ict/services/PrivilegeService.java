package com.example.techbridge_ict.services;



import com.example.techbridge_ict.dto.RolesAndPrivileges.PrivilegeDto;
import com.example.techbridge_ict.model.Privilege;

import java.util.List;

public interface PrivilegeService {
    List<Privilege> findAll();

    Privilege findById(Long id);

    List<Privilege> findAllById(List<Long> ids);

    Privilege create(Privilege privilege);

    Privilege update(Long id, PrivilegeDto privilegeDto);

    void deleteById(Long id);
}

