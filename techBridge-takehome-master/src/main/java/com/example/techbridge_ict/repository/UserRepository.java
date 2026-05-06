package com.example.techbridge_ict.repository;



import com.example.techbridge_ict.model.Role;
import com.example.techbridge_ict.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    List<User> findAllByRoles(Role role);

    Optional<User> findOneByEmail(String email);

    Optional<User> findOneByPhone(String phone);


    @Query("""
            SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END
            FROM User u 
            WHERE (:phone IS NULL OR u.phone = :phone) AND u.email = :email
            """)
    boolean existsByPhoneOrEmail(String phone, String email);


    boolean existsByPhone(String phone);

    boolean existsByEmailIgnoreCase(String email);

    Page<User> findAll(Pageable pageable);


    @Query("""
    SELECT u
    FROM User u
    WHERE u.deleted = false
      AND NOT EXISTS (
          SELECT r
          FROM u.roles r
          WHERE r.name = 'ADMIN'
      )
""")
    List<User> findManagers();



    @Query("""
    select u from User u 
    where (:searchText is null or :searchText = '' 
           or lower(concat(u.firstName, ' ', u.lastName)) like lower(concat('%', :searchText,'%')) 
           or lower(u.email) like lower(concat('%', :searchText,'%')) 
           or lower(u.phone) like lower(concat('%', :searchText,'%'))) 
      and (:phone is null or :phone = '' or lower(u.phone) like lower(concat('%', :phone,'%')))
      and (:isApproved is null or u.isApproved = :isApproved)
       """)
    Page<User> search(@Param("searchText") String searchText, @Param("phone") String phone, @Param("isApproved") Boolean isApproved,
                      Pageable pageable);




    @Query("select u.id from User  u where u.deleted=false  and u.isApproved=true and u.active=true")
    List<Long>  findUsersId();


}

