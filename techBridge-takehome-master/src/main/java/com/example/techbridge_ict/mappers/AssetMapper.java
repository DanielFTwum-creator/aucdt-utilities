package com.example.techbridge_ict.mappers;

import com.example.techbridge_ict.dto.asset.AssetDto;
import com.example.techbridge_ict.model.Asset;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

import java.util.Set;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface AssetMapper extends EntityMapper<AssetDto, Asset>{
    @Mapping(source = "assignedStaff.id", target = "assignedStaffId")
    @Mapping(source = "assignedStaff.user.fullName", target = "assignedStaffName")
    AssetDto toDto(Asset asset);

    @Mapping(target = "assignedStaff", ignore = true)
    @Mapping(target = "createdBy", ignore = true)
    @Mapping(target = "createdDate", ignore = true)
    @Mapping(target = "deleted", ignore = true)
    @Mapping(target = "lastModifiedBy", ignore = true)
    @Mapping(target = "lastModifiedDate", ignore = true)
    Asset toEntity(AssetDto assetDto);
    Set<AssetDto> toDto(Set<Asset> assets);
    Set<Asset> toEntity(Set<Asset> assets);

}
