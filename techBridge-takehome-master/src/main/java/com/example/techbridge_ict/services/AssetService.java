package com.example.techbridge_ict.services;

import com.example.techbridge_ict.dto.asset.RegisterAsset;
import com.example.techbridge_ict.model.Asset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AssetService {
    public Asset createAsset(RegisterAsset registerAsset);
    public Asset AssignAsset(Long assetId, Long staffId);
    Page<Asset> search(String searchText, String serialNumber,
                       String model, String type,  Pageable pageable);
    public Asset findById(Long assetId);

    public Asset markRepair(Long assetId);

    public Asset markAvailable(Long assetId);




}
