package com.example.techbridge_ict.mappers;



import com.example.techbridge_ict.dto.RolesAndPrivileges.RoleDto;
import com.example.techbridge_ict.model.Role;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.Set;

@Mapper(componentModel = "spring", uses = {PrivilegeMapper.class}, unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface RoleMapper extends EntityMapper<RoleDto, Role> {

    RoleDto toDto(Role role);

    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    Role toEntity(RoleDto roleDto);

    Set<RoleDto> toDto(Set<Role> roleList);

    Set<Role> toEntity(Set<RoleDto> roleDtoList);
}

