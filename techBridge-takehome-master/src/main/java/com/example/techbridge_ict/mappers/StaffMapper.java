package com.example.techbridge_ict.mappers;

import com.example.techbridge_ict.dto.staff.StaffDto;
import com.example.techbridge_ict.model.Staff;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface StaffMapper extends EntityMapper<StaffDto, Staff>{
    @Mapping(source = "employeeCode", target = "employeeCode")
    @Mapping(source = "user.id", target = "userId")
    @Mapping(expression = "java(staff.getUser() != null ? staff.getUser().getFullName() : null)", target = "fullName")
    @Mapping(source = "user.email", target = "email")
    @Mapping(source = "user.phone", target = "phone")
    StaffDto toDto(Staff staff);

    @Mapping(target = "user", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    Staff toEntity(StaffDto staffDto);
    Set<StaffDto> toDtoSet(Set<Staff> staffSet);
    Set<Staff> toEntity(Set<StaffDto> staffDtoSet);
}
