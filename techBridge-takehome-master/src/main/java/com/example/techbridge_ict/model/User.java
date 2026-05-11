package com.example.techbridge_ict.model;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.persistence.CascadeType;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.ToString;
import org.hibernate.annotations.*;
import org.springframework.util.CollectionUtils;

import java.util.HashSet;
import java.util.Set;

@Data
@EqualsAndHashCode(callSuper = true, exclude = {"roles", "staffProfile"})
@ToString(exclude = {"password", "roles", "staffProfile", "privileges"})
@Entity
@DynamicInsert
@DynamicUpdate
@Table(name = "users")
@org.hibernate.annotations.Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SQLDelete(sql = "UPDATE users SET deleted=true WHERE id=?")
@SQLRestriction("deleted = false")
public class User extends AbstractModel {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "first_name", length = 150)
    private String firstName;

    @Column(name = "last_name", length = 150)
    private String lastName;

    @Column(name = "is_approved")
    private Boolean isApproved;

    @JsonIgnore
    @Column(name = "password", length = 128, nullable = false)
    private String password;

    @Column(name = "email", length = 254, nullable = false, unique = true)
    private String email;

    @Column(name = "phone", length = 20, nullable = false, unique = true)
    private String phone;

    @NotNull
    @Column(name = "is_active", columnDefinition = "boolean default false")
    private Boolean active = Boolean.FALSE;

    @ManyToMany(fetch = FetchType.LAZY, cascade = CascadeType.REFRESH)
    @JoinTable(name = "user_role", joinColumns = @JoinColumn(name = "user_id"), inverseJoinColumns = @JoinColumn(name = "role_id"))
    private Set<Role> roles;

    @OneToOne(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    private Staff staffProfile;


    @Transient
    private Set<String> privileges;

    public Set<String> getPrivileges() {
        if (privileges == null) {
            privileges = new HashSet<>();
            if (!CollectionUtils.isEmpty(getRoles())) {
                getRoles().stream().forEach(role -> {
                    role.getPrivileges().forEach(privilege -> privileges.add(privilege.getName()));
                });
            }
        }
        return privileges;
    }

    public String getFullName() {
        if (lastName == null) {
            return firstName;
        } else {
            return firstName + " " + lastName;
        }
    }

}