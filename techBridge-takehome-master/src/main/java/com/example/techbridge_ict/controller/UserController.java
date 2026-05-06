package com.example.techbridge_ict.controller;



import com.example.techbridge_ict.dto.BaseResponseDto;
import com.example.techbridge_ict.dto.auth.ForgottenPasswordDto;
import com.example.techbridge_ict.dto.auth.PasswordChangeDto;
import com.example.techbridge_ict.dto.user.RegisterUser;
import com.example.techbridge_ict.dto.user.UserDto;
import com.example.techbridge_ict.dto.user.UserMaskedDto;
import com.example.techbridge_ict.enums.ResponseMessageEnum;
import com.example.techbridge_ict.mappers.UserMapper;
import com.example.techbridge_ict.model.User;
import com.example.techbridge_ict.services.UserService;
import com.example.techbridge_ict.util.MaskUtil;
import lombok.extern.log4j.Log4j2;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@Log4j2
@RestController
@RequestMapping("/api")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private UserMapper userMapper;



    @PostMapping("/admin/user")
    public ResponseEntity<UserDto> registerUser(
            @RequestBody RegisterUser registerUser
           ) {
        User user = userService.register(registerUser);
        return ResponseEntity.ok(userMapper.toDto(user));
    }


    @GetMapping("/admin/user/search")
    public Page<UserDto> search(@RequestParam(value = "searchText", required = false) String searchText,
                                @RequestParam(value = "phoneNumber", required = false) String phoneNumber,
                                @RequestParam(value = "isApproved", required = false) Boolean isApproved,
                                Pageable pageable) {
        Page<User> searchResult = userService.search(searchText, phoneNumber, pageable,isApproved);
        return new PageImpl<>(userMapper.toDto(searchResult.getContent()), pageable, searchResult.getTotalElements());
    }


    @PutMapping("/admin/user/{userId}/deactivate")
    public ResponseEntity<BaseResponseDto> deactivateUser(@PathVariable Long userId) {
        userService.deactivateUser(userId);
        return ResponseEntity.ok(BaseResponseDto.builder().messageDetail(ResponseMessageEnum.BACK_USER_MSG_017.messageDetail()).message(ResponseMessageEnum.BACK_USER_MSG_017.message()).build());
    }

    @PutMapping("/admin/user/{userId}/approve")
    public ResponseEntity<BaseResponseDto> approveUser(@PathVariable Long userId) {
        userService.approveUser(userId);
        return ResponseEntity.ok(BaseResponseDto.builder().messageDetail(ResponseMessageEnum.BACK_USER_MSG_018.messageDetail()).message(ResponseMessageEnum.BACK_USER_MSG_018.message()).build());
    }

    @PutMapping("/admin/user/{userId}/reject")
    public ResponseEntity<BaseResponseDto> rejectUser(@PathVariable Long userId) {
        userService.reject(userId);
        return ResponseEntity.ok(BaseResponseDto.builder().messageDetail(ResponseMessageEnum.BACK_USER_MSG_019.messageDetail()).message(ResponseMessageEnum.BACK_USER_MSG_019.message()).build());
    }



    @PutMapping("/admin/user/{userId}/activate")
    public ResponseEntity<BaseResponseDto> activateUser(@PathVariable Long userId) {
        userService.activateUser(userId);
        return ResponseEntity.ok(BaseResponseDto.builder().messageDetail(ResponseMessageEnum.BACK_USER_MSG_016.messageDetail()).message(ResponseMessageEnum.BACK_USER_MSG_016.message()).build());
    }


    @GetMapping("/admin/user/{userId}")
    public ResponseEntity<UserDto> findById(@PathVariable Long userId) {
        UserDto userDto = userMapper.toDto(userService.findById(userId));
        return ResponseEntity.ok(userDto);
    }

    @GetMapping("/admin/user/branch-manager")
    public ResponseEntity<List<UserDto>> findAllBranchManagers() {
        List<UserDto> userDto = userMapper.toDto(userService.findAllBranchManagers());
        log.info(userDto.toString());
        return ResponseEntity.ok(userDto);
    }


    @PutMapping("/admin/user/{userId}")
    public ResponseEntity<UserDto> updateUserByAdmin(@PathVariable Long userId, @RequestBody UserDto userDto) {
        return ResponseEntity.ok(userMapper.toDto(userService.updateUserByAdmin(userId, userDto)));
    }


    @GetMapping("/user/current")
    public ResponseEntity<UserDto> getCurrentUser() {
        return ResponseEntity.ok(userMapper.toDto(userService.getCurrentUserForUnApprovedUsers()));
    }


    @PutMapping("/user/current")
    public ResponseEntity<UserDto> updateCurrentUser(@RequestBody UserDto userDto) {
        return ResponseEntity.ok(userMapper.toDto(userService.updateCurrentUser(userDto)));
    }


    @PutMapping("/user/current/change-password")
    public ResponseEntity<BaseResponseDto> changePassword(@RequestBody PasswordChangeDto passwordChangeDto) {
        userService.changePassword(passwordChangeDto.getOldPassword(), passwordChangeDto.getNewPassword());
        return ResponseEntity.ok(BaseResponseDto.builder().messageDetail(ResponseMessageEnum.BACK_USER_MSG_015.messageDetail()).message(ResponseMessageEnum.BACK_USER_MSG_015.message()).build());
    }


    @PutMapping("/public/user/current/forgotten-password")
    public ResponseEntity<BaseResponseDto> forgottenPassword(@RequestBody ForgottenPasswordDto forgottenPasswordDto) {
        userService.forgottenPassword(forgottenPasswordDto.getNewPassword(), forgottenPasswordDto.getVerificationCode(),forgottenPasswordDto.getEmail());
        return ResponseEntity.ok(BaseResponseDto.builder().messageDetail(ResponseMessageEnum.BACK_USER_MSG_015.messageDetail()).message(ResponseMessageEnum.BACK_USER_MSG_015.message()).build());
    }



    @GetMapping("/user/phone/{phone}")
    public ResponseEntity<UserMaskedDto> searchByPhone(@PathVariable String phone) {
        UserMaskedDto userMaskedDto = new UserMaskedDto();
        User user = userService.findOneByPhone(phone);
        userMaskedDto.setId(user.getId());
        userMaskedDto.setPhone(user.getPhone());
        userMaskedDto.setFirstName(MaskUtil.mask(user.getFirstName()));
        userMaskedDto.setLastName(MaskUtil.mask(user.getLastName()));
        return ResponseEntity.ok(userMaskedDto);
    }


    @DeleteMapping("/admin/user/{userId}")
    public ResponseEntity<BaseResponseDto> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok(BaseResponseDto.builder().message(ResponseMessageEnum.BACK_USER_MSG_023.message()).messageDetail(ResponseMessageEnum.BACK_USER_MSG_023.messageDetail()).build());
    }


    @DeleteMapping("/user/current")
    public ResponseEntity<BaseResponseDto> deleteCurrentUser() {
        userService.deleteByCurrentUser();
        return ResponseEntity.ok(BaseResponseDto.builder().message(ResponseMessageEnum.BACK_USER_MSG_023.message()).messageDetail(ResponseMessageEnum.BACK_USER_MSG_023.messageDetail()).build());
    }
}

