package com.example.techbridge_ict.model;

import com.example.techbridge_ict.enums.AssetStaus;
import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.hibernate.annotations.*;
import org.hibernate.annotations.Cache;

@Data
@EqualsAndHashCode(callSuper = false)
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "assets")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SQLDelete(sql = "UPDATE assets SET deleted=true WHERE id=?")
@SQLRestriction("deleted = false")
public class Asset extends AbstractModel {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name="serialNumber", unique = true, nullable = false)
    private String serialNumber;

    private String model;
    private String type;

    @Enumerated(EnumType.STRING)
    private AssetStaus status = AssetStaus.AVAILABLE;

    @ManyToOne(fetch = FetchType.LAZY)
    private Staff assignedStaff;
}
