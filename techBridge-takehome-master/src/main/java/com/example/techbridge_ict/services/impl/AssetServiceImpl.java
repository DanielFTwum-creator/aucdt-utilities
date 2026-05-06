package com.example.techbridge_ict.services.impl;

import com.example.techbridge_ict.config.CacheConfig;
import com.example.techbridge_ict.dto.asset.RegisterAsset;
import com.example.techbridge_ict.enums.AssetStaus;
import com.example.techbridge_ict.enums.ResponseMessageEnum;
import com.example.techbridge_ict.exception.BusinessException;
import com.example.techbridge_ict.model.Asset;
import com.example.techbridge_ict.model.Staff;
import com.example.techbridge_ict.repository.AssetRepository;
import com.example.techbridge_ict.services.AssetService;
import com.example.techbridge_ict.services.AuditLogService;
import com.example.techbridge_ict.services.StaffService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Slf4j
@AllArgsConstructor
@Transactional
public class AssetServiceImpl implements AssetService {
    @Autowired
    private AssetRepository assetRepository;
    @Autowired
    AuditLogService auditLogService;
    @Autowired
    StaffService staffService;

    @Override
    public Asset createAsset(RegisterAsset registerAsset) {
        log.info("Asset before save: serial={}, model={}, type={}, status={}",
                registerAsset.getSerialNumber(), registerAsset.getModel(), registerAsset.getType(), registerAsset.getStatus());

        if(assetRepository.existsBySerialNumber(registerAsset.getSerialNumber())) {
            throw new BusinessException(ResponseMessageEnum.BACK_ASSET_MSG_10);
        }
        Asset asset = new Asset();
        asset.setSerialNumber(registerAsset.getSerialNumber());

        asset.setModel(registerAsset.getModel());
        asset.setType(registerAsset.getType());
        asset.setStatus(registerAsset.getStatus());
        Asset savedAsset = assetRepository.save(asset);
        auditLogService.create(savedAsset.getId(), "CREATED");
        return savedAsset;
    }

    @Override
    public Asset AssignAsset(Long assetId, Long staffId) {
        Asset asset = findById(assetId);
        Staff staff = staffService.findStaffById(staffId);
        asset.setAssignedStaff(staff);
        asset.setStatus(AssetStaus.ASSIGNED);
        auditLogService.create(asset.getId(), "ASSIGNED");
        return assetRepository.save(asset);
    }

    @Override
    @Cacheable(cacheNames = CacheConfig.CACHE_ONE_MINUTE, keyGenerator = "keyGenerator", unless = CacheConfig.UNLESS_RESULT_NULL)
    public Page<Asset> search(String searchText, String serialNumber, String model, String type, Pageable pageable) {
        return assetRepository.search(searchText, serialNumber, model, type, pageable);
    }

    @Override
    public Asset findById(Long assetId) {
        return  assetRepository.findById(assetId).orElseThrow(() -> new BusinessException(ResponseMessageEnum.BACK_ASSET_MSG_10));
    }

    @Override
    public Asset markRepair(Long assetId) {
        Asset asset = findById(assetId);
        asset.setStatus(AssetStaus.REPAIR);
        Asset savedAsset = assetRepository.save(asset);
        auditLogService.create(asset.getId(),"MARKED_REPAIR");
        return savedAsset;
    }

    @Override
    public Asset markAvailable(Long assetId) {
        Asset asset = findById(assetId);
        asset.setStatus(AssetStaus.AVAILABLE);
        Asset savedAsset = assetRepository.save(asset);
        auditLogService.create(asset.getId(),"MARKED_AVAILABLE");
        return savedAsset;
    }




}
