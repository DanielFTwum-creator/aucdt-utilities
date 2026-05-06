package com.example.techbridge_ict.model;


import com.example.techbridge_ict.util.LogUtil;
import com.example.techbridge_ict.util.SecurityUtils;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.MappedSuperclass;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;

import java.io.Serializable;
import java.time.LocalDateTime;

@Data
@MappedSuperclass
public  abstract class AbstractModel implements Serializable {

    private static final long serialVersionUID = 1L;

    @CreatedBy
    @Column(name = "created_by", length = 50, updatable = false)
    @JsonIgnore
    private String createdBy;


    @CreatedDate
    @Column(name = "created_date", updatable = false)
    @JsonIgnore
    private LocalDateTime createdDate;

    @LastModifiedBy
    @Column(name = "last_modified_by", length = 50)
    @JsonIgnore
    private String lastModifiedBy;

    @LastModifiedDate
    @Column(name = "last_modified_date")
    @JsonIgnore
    private LocalDateTime lastModifiedDate;

    @NotNull
    @JsonIgnore
    @Column(name = "deleted", columnDefinition = "boolean default false")
    private Boolean deleted = Boolean.FALSE;

    @PrePersist
    private void prePersist() {
        createdDate = LocalDateTime.now();
        createdBy = LogUtil.isBatchProcess() ? LogUtil.batchName() : SecurityUtils.getCurrentUsername();
    }

    @PreUpdate
    private void preUpdate() {
        lastModifiedDate = LocalDateTime.now();
        lastModifiedBy = LogUtil.isBatchProcess() ? LogUtil.batchName() : SecurityUtils.getCurrentUsername();
    }

}

