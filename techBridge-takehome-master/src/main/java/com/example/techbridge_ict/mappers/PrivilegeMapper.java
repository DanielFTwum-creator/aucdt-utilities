package com.example.techbridge_ict.mappers;


import com.example.techbridge_ict.dto.RolesAndPrivileges.PrivilegeDto;
import com.example.techbridge_ict.model.Privilege;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PrivilegeMapper extends EntityMapper<PrivilegeDto, Privilege> {
    PrivilegeDto toDto(Privilege privilege);

    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    Privilege toEntity(PrivilegeDto privilegeDto);

    Set<Privilege> toEntity(Set<PrivilegeDto> privilegeDtoList);

    Set<PrivilegeDto> toDto(Set<Privilege> privilegeList);
}

