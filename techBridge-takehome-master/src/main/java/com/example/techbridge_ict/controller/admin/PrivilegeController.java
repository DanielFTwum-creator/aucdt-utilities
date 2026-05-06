package com.example.techbridge_ict.controller.admin;


import com.example.techbridge_ict.dto.BaseResponseDto;
import com.example.techbridge_ict.dto.RolesAndPrivileges.PrivilegeDto;
import com.example.techbridge_ict.enums.ResponseMessageEnum;
import com.example.techbridge_ict.mappers.PrivilegeMapper;
import com.example.techbridge_ict.services.PrivilegeService;
import lombok.extern.slf4j.Slf4j;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Slf4j
@RestController
@RequestMapping("/api/admin/privilege")
public class PrivilegeController {

    @Autowired
    private PrivilegeService service;

    @Autowired
    private PrivilegeMapper mapper;

    @GetMapping
    public ResponseEntity<List<PrivilegeDto>> findAll() {
        return ResponseEntity.ok(mapper.toDto(service.findAll()));
    }

    @PostMapping
    public ResponseEntity<PrivilegeDto> create(@RequestBody PrivilegeDto privilegeDto) {
        return ResponseEntity.ok(mapper.toDto(service.create(mapper.toEntity(privilegeDto))));
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<PrivilegeDto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(mapper.toDto(service.findById(id)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PrivilegeDto> update(@PathVariable Long id, @RequestBody PrivilegeDto privilegeDto) {
        return ResponseEntity.ok(mapper.toDto(service.update(id, privilegeDto)));
    }

    @DeleteMapping(path = "/{id}")
    public ResponseEntity<BaseResponseDto> delete(@PathVariable Long id) {
        service.deleteById(id);
        return ResponseEntity.ok(BaseResponseDto.builder().message(ResponseMessageEnum.BACK_PRIVILEGE_MSG_004.message()).messageDetail(ResponseMessageEnum.BACK_PRIVILEGE_MSG_004.messageDetail()).build());
    }
}
