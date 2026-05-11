package com.example.techbridge_ict.mappers;

import com.example.techbridge_ict.dto.asset.AuditLogDto;
import com.example.techbridge_ict.model.AuditLog;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.List;
import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AuditLogMapper extends EntityMapper<AuditLogDto, AuditLog> {
    @Mapping(source = "asset.id", target = "assetId")
    @Mapping(source = "asset.serialNumber", target = "assetSerialNumber")
    @Mapping(target = "timestamp", ignore = true)
    AuditLogDto toDto(AuditLog log);
    @Mapping(target = "asset", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    AuditLog toEntity(AuditLogDto dto);
    Set<AuditLogDto> toDtos(Set<AuditLog> logs);
    Set<AuditLog> toEntities(Set<AuditLogDto> dtos);
    List<AuditLogDto> toDto(List<AuditLog> logs);
}
