package com.example.techbridge_ict.model;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.*;
import org.hibernate.annotations.Cache;

@Data
@Entity
@DynamicInsert
@DynamicUpdate
@EqualsAndHashCode(callSuper = false, exclude = {"user"})
@ToString(exclude = {"user"})
@Table(name = "ict_staff")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SQLDelete(sql = "UPDATE ict_staff SET deleted=true WHERE id=?")
@SQLRestriction("deleted = false")
public class Staff extends AbstractModel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user;

    @Column(name="employee_code", unique = true)
    private String employeeCode;

    @Column(name="department", length = 100)
    private String department;

    @Column(name="job_title", length = 150)
    private String jobTitle;

    @Column(name="unit", length = 100)
    private String unit;

    @Column(name="deleted", nullable = false)
    private Boolean deleted = false;
}
