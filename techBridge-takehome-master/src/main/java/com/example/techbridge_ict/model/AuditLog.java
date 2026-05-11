package com.example.techbridge_ict.model;

import com.example.techbridge_ict.enums.ResponseMessageEnum;
import com.example.techbridge_ict.exception.BusinessException;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.*;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@DynamicInsert
@DynamicUpdate
@Immutable
@Table(name = "audit_log")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SQLDelete(sql = "UPDATE audit_log SET deleted=true WHERE id=?")
@SQLRestriction("deleted = false")
public class AuditLog extends AbstractModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name="asset_id", insertable = false, updatable = false)
    private Asset asset;
    @Column(nullable = false, name = "asset_id")
    private Long assetId;

    private String action;


    @PreRemove
    private void preventDelete(){
        throw new BusinessException(ResponseMessageEnum.BACK_STAFF_MSG_02);
    }

}