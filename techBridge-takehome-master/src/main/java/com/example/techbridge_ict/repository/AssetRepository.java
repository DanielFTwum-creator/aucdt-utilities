package com.example.techbridge_ict.repository;

import com.example.techbridge_ict.model.Asset;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AssetRepository  extends JpaRepository<Asset, Long> {
    boolean existsBySerialNumber(String serialNumber);

    @Query("""
    select a from Asset a 
        where (:searchText is null or :searchText = ''
            or lower(a.serialNumber) like lower(concat('%', :searchText ,'%' ) ) 
            or lower(a.model) like lower(concat('%', :searchText ,'%' ) ) 
            or lower(a.type) like lower(concat('%', :searchText ,'%' ) )  
        )
        and (:serialNumber is null or :serialNumber = '' or lower(a.serialNumber) like lower(concat('%', :serialNumber , '%')))
        and (:model is null or :model = '' or lower(a.model) like lower(concat('%', :model, '%')))
        and (:type is null or :type = '' or lower(a.type) like lower(concat('%', :type, '%')))       
      """)
    Page<Asset> search(@Param("searchText") String searchText, @Param("serialNumber")  String serialNumber,
                       @Param("model") String model,
                       @Param("type") String type, Pageable pageable);
}
