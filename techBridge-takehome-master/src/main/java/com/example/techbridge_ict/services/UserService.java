package com.example.techbridge_ict.services;

import com.example.techbridge_ict.dto.user.RegisterUser;
import com.example.techbridge_ict.dto.user.UserDto;
import com.example.techbridge_ict.model.User;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface UserService {
    boolean checkDuplicatePhoneOrEmail(String phone, String email);

    User register(RegisterUser registerUser);

    void refreshToken(HttpServletRequest request, HttpServletResponse response);


    User findOneByPhone(String phone);

    User findOneByEmail(String email);

    User findById(Long id);

    List<User> findAllBranchManagers();

    Page<User> search(String searchText, String phoneNumber, Pageable pageable, Boolean isApproved);

    void changePassword(String currentClearTextPassword, String newPassword);

    void deactivateUser(Long userId);

    User getCurrentUser();
    User getCurrentUserForUnApprovedUsers();

    User updateCurrentUser(UserDto userDto);

    User updateUserByAdmin(Long userId, UserDto userDto);

    void activateUser(Long userId);


    void forgottenPassword(String password, Integer verificationCode, String email);

    void approveUser(Long userId);

    void unapprovedUser(Long userId);

    List<Long>  findAllUsersId();

    void isApprovedUser(Long userId);




    void reject(Long id);

    void  deleteUser(Long id);

    void deleteByCurrentUser();

    void save(User user);
}
