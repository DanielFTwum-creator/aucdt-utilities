package com.example.techbridge_ict.services.impl;

import com.example.techbridge_ict.dto.RolesAndPrivileges.RoleDto;
import com.example.techbridge_ict.dto.user.RegisterUser;
import com.example.techbridge_ict.dto.user.UserDto;
import com.example.techbridge_ict.enums.ResponseMessageEnum;
import com.example.techbridge_ict.exception.BusinessException;
import com.example.techbridge_ict.exception.InvalidPasswordException;
import com.example.techbridge_ict.model.User;
import com.example.techbridge_ict.repository.UserRepository;
import com.example.techbridge_ict.security.jwt.JwtRefreshTokenFilter;
import com.example.techbridge_ict.services.RoleService;
import com.example.techbridge_ict.services.UserService;
import com.example.techbridge_ict.util.RandomUtil;
import com.example.techbridge_ict.util.SecurityUtils;
import io.micrometer.common.util.StringUtils;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.ConstraintViolationException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static com.example.techbridge_ict.util.MailSmsUtil.isValidEmailAddress;


@Slf4j
@Service("userService")
@Transactional
public class UserServiceImpl implements UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private RoleService roleService;


    @Autowired
    private JwtRefreshTokenFilter refreshTokenFilter;

    @Override
    public boolean checkDuplicatePhoneOrEmail(String phone, String email) {
        return userRepository.existsByPhoneOrEmail(phone, email);
    }

    @Override
    public User register(RegisterUser registerUser) {

        if (checkDuplicatePhoneOrEmail(registerUser.getPhone(), registerUser.getEmail())) {
            throw new BusinessException(ResponseMessageEnum.BACK_USER_MSG_006);}


        User newUser = new User();
        newUser.setEmail(registerUser.getEmail().toLowerCase());
        newUser.setPassword(passwordEncoder.encode(registerUser.getPassword()));
        newUser.setFirstName(registerUser.getFirstName());
        newUser.setLastName(registerUser.getLastName());
        newUser.setPhone(registerUser.getPhone());
        newUser.setActive(true);
        newUser.setIsApproved(true);
        try {
            var user=  userRepository.save(newUser);
            userRepository.save(user);
        } catch (ConstraintViolationException ex) {
            throw new BusinessException(ResponseMessageEnum.BACK_USER_MSG_027);
        }
        return newUser;
    }

    @Override
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) {
        refreshTokenFilter.refreshTokenFilter(request, response);
    }


    @Override
    public User findOneByPhone(String phone) {
        return userRepository.findOneByPhone(phone).orElseThrow(() -> new BusinessException(ResponseMessageEnum.BACK_USER_MSG_001));
    }

    @Override
    public User findOneByEmail(String email) {
        return userRepository.findOneByEmail(email).orElseThrow(() -> new BusinessException(ResponseMessageEnum.BACK_USER_MSG_001));

    }


    @Override
    public User findById(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new BusinessException(ResponseMessageEnum.BACK_USER_MSG_001));
    }

    @Override
    public List<User> findAllBranchManagers() {
        return userRepository.findManagers();
    }


    @Override
    public Page<User> search(String searchText, String phoneNumber, Pageable pageable, Boolean isApproved) {
        return userRepository.search(searchText, phoneNumber, isApproved,pageable);
    }

    @Override
    public void changePassword(String currentClearTextPassword, String newPassword) {
        log.info("user: {}", SecurityUtils.getCurrentUsername());
        Optional.ofNullable(SecurityUtils.getCurrentUsername())
                .flatMap(userRepository::findOneByEmail)
                .ifPresent(user -> {
                    String currentEncryptedPassword = user.getPassword();
                    if (!passwordEncoder.matches(currentClearTextPassword, currentEncryptedPassword)) {
                        throw new InvalidPasswordException();
                    }
                    String encryptedPassword = passwordEncoder.encode(newPassword);
                    user.setPassword(encryptedPassword);
                    log.info("User password changed. User: {}", user);
                });
    }

    @Override
    public void deactivateUser(Long userId) {
        User user = findById(userId);
        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    public User getCurrentUser() {
        User user = null;
        String phone = SecurityUtils.getCurrentUsername();
        if (StringUtils.isNotEmpty(phone)) {
            user = userRepository.findOneByPhone(phone).orElse(null);
        }
        if (user == null) {
            throw new BusinessException(ResponseMessageEnum.BACK_USER_MSG_001);
        }
        if(!user.getIsApproved()){
            throw new BusinessException(ResponseMessageEnum.BACK_USER_MSG_012);
        }
        return user;
    }

    public User getCurrentUserForUnApprovedUsers() {
        User user = null;
        String phone = SecurityUtils.getCurrentUsername();
        if (StringUtils.isNotEmpty(phone)) {
            user = userRepository.findOneByPhone(phone).orElse(null);
        }
        if (user == null) {
            throw new BusinessException(ResponseMessageEnum.BACK_USER_MSG_001);
        }
        return user;
    }

    @Override
    public User updateCurrentUser(UserDto userDto) {
        User user = getCurrentUser();
        User updatedUser = updateUser(user, userDto);
        userRepository.save(updatedUser);
        log.info("User updated: {}", updatedUser.getPhone());
        return updatedUser;
    }

    @Override
    public User updateUserByAdmin(Long userId, UserDto userDto) {
        User updatedUser;
        User user;
        try {
            user = findById(userId);
            updatedUser = updateUser(user, userDto);
            if (userDto.getRoles() != null) {
                List<Long> roleIds = userDto.getRoles().stream().map(RoleDto::getId).collect(Collectors.toList());
                updatedUser.setRoles(new HashSet<>(roleService.findAllById(roleIds)));
            }
            if (userDto.getActive() != null) {
                updatedUser.setActive(userDto.getActive());
            }

            userRepository.save(updatedUser);
            log.info("The user has been updated by the admin. {}", updatedUser.getPhone());
        } catch (Exception e) {
            throw e;
        }
        return updatedUser;}


    @Override
    public void activateUser(Long userId) {
        User user = findById(userId);
        user.setActive(true);
        userRepository.save(user);
    }

    @Override
    public void forgottenPassword(String password, Integer verificationCode, String email) {

        if (!isValidEmailAddress(email)) {
            throw new BusinessException(ResponseMessageEnum.BACK_EMAIL_MSG_004);
        }
        var user = findOneByEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);

    }

    @Override
    public void approveUser(Long userId) {
        var user = findById(userId);
        if(!user.getIsApproved()){
            user.setIsApproved(true);
            userRepository.save(user);
        }
        else throw  new BusinessException(ResponseMessageEnum.BACK_USER_MSG_020);

    }

    @Override
    public void unapprovedUser(Long userId) {
        var user = findById(userId);
        if(user.getIsApproved()){
            user.setIsApproved(false);
            userRepository.save(user);
            return;
        }
        else
            throw new BusinessException(ResponseMessageEnum.BACK_USER_MSG_021);

    }

    @Override
    public List<Long> findAllUsersId() {
        return userRepository.findUsersId();
    }

    @Override
    public void isApprovedUser(Long userId) {
        var user=findById(userId);
        if(!user.getIsApproved()){
            throw  new BusinessException(ResponseMessageEnum.BACK_USER_MSG_012);
        }

    }


    @Override
    public void reject(Long id) {
        var user =findById(id);
        userRepository.delete(user);
    }

    @Override
    public void deleteUser(Long id) {
        var user= findById(id);
        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    public void deleteByCurrentUser() {
        var user =getCurrentUser();
        user.setPassword(passwordEncoder.encode(RandomUtil.generateKey()));
        user.setEmail(user.getEmail() + "_old_" + user.getId());
        user.setPhone(user.getPhone() + "_old_" + user.getId());
        userRepository.save(user);
    }

    @Override
    public void save(User user) {
        userRepository.save(user);
    }




    private User updateUser(User updatedUser ,UserDto userDto){
        if (StringUtils.isNotEmpty(userDto.getFirstName())) {
            updatedUser.setFirstName(userDto.getFirstName());
        }
        if (StringUtils.isNotEmpty(userDto.getLastName())) {
            updatedUser.setLastName(userDto.getLastName());
        }
        if(StringUtils.isNotEmpty(userDto.getEmail())){
            updatedUser.setEmail(userDto.getEmail().toLowerCase());
        }
        return updatedUser;
    }

    public String generateStaffNumber(Long seq, String name) {
        return String.format("USR-%s-%06d", name.substring(0, 3), seq);
    }


    public String generateStaffId(Long userId, String firstName, String lastName,
                                  String prof) {
        return String.format(
                "%s-%s-%s-%06d",
                yearTwoDigits(),
                generateInitials(firstName, lastName),
                prof.substring(0, 2),
                userId
        );
    }


    private String yearTwoDigits() {
        return String.valueOf(Year.now().getValue()).substring(2);
    }


    private String initialOf(String value) {
        return (value != null && !value.isBlank())
                ? value.substring(0, 1).toUpperCase()
                : "X";
    }

    private String generateInitials(String firstName, String lastName) {
        return initialOf(firstName) + initialOf(lastName);
    }
}
