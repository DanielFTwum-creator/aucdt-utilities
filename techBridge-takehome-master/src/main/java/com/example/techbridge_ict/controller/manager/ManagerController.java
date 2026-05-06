package com.example.techbridge_ict.controller.manager;
import com.example.techbridge_ict.dto.asset.AssetDto;
import com.example.techbridge_ict.dto.asset.AssignAssetRequest;
import com.example.techbridge_ict.dto.asset.AuditLogDto;
import com.example.techbridge_ict.dto.asset.RegisterAsset;
import com.example.techbridge_ict.mappers.AssetMapper;
import com.example.techbridge_ict.mappers.AuditLogMapper;
import com.example.techbridge_ict.model.Asset;
import com.example.techbridge_ict.services.AssetService;
import com.example.techbridge_ict.services.AuditLogService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/admin/manager")
public class ManagerController {
    @Autowired
    private AssetService assetService;
    @Autowired
    private AssetMapper assetMapper;
    @Autowired
    private AuditLogMapper auditLogMapper;
    @Autowired
    private AuditLogService auditLogService;

    @PostMapping
    public ResponseEntity<AssetDto> createAsset(@RequestBody  RegisterAsset  registerAsset){
        return ResponseEntity.ok(assetMapper.toDto(assetService.createAsset(registerAsset)));
    }

    @GetMapping("assets/search")
    public Page<AssetDto> search(@RequestParam(value = "searchText", required = false) String searchText,
                                @RequestParam(value = "serialNumber", required = false) String serialNumber,
                                @RequestParam(value = "model", required = false) String model,
                                @RequestParam(value = "type", required = false) String type,
                                Pageable pageable) {
        Page<Asset> searchResult = assetService.search(searchText,serialNumber, model,type,pageable);
        return new PageImpl<>(assetMapper.toDto(searchResult.getContent()), pageable, searchResult.getTotalElements());
    }

    @PatchMapping("assets/{id}/assign")
    public ResponseEntity<AssetDto> AssignAsset(@PathVariable Long id , @RequestBody AssignAssetRequest request){
        return ResponseEntity.ok(assetMapper.toDto(assetService.AssignAsset(id, request.getStaffId())));
    }

    @GetMapping("/auditLogs/{id}")
    public ResponseEntity<List<AuditLogDto>> auditLogs(@PathVariable Long id){
        return ResponseEntity.ok(auditLogMapper.toDto(auditLogService.auditLogs(id)));
    }

}
