package com.example.techbridge_ict.controller;


import com.example.techbridge_ict.dto.AuthToken;
import com.example.techbridge_ict.dto.BaseResponseDto;
import com.example.techbridge_ict.dto.user.RegisterUser;
import com.example.techbridge_ict.enums.ResponseMessageEnum;
import com.example.techbridge_ict.exception.BusinessException;
import com.example.techbridge_ict.security.jwt.AuthRequest;
import com.example.techbridge_ict.security.jwt.TokenProvider;
import com.example.techbridge_ict.services.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private TokenProvider tokenProvider;

    @Autowired
    private AuthenticationManagerBuilder authenticationManagerBuilder;

    @Autowired
    private UserService userService;
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    @PostMapping("/auth/login")
    public AuthToken login(@Valid @RequestBody AuthRequest authRequest) {
        log.info("Login: {}", authRequest);
        AuthToken authToken;
        try {
            UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(authRequest.getPhone(), authRequest.getPassword());
           log.info("WHY:{} ",authenticationToken.toString());
            Authentication authentication = authenticationManagerBuilder.getObject().authenticate(authenticationToken);
            log.info("authentication : {} ", authentication);
            SecurityContextHolder.getContext().setAuthentication(authentication);
            authToken = tokenProvider.getAuthToken(authentication);
            authToken.setJwtRefreshToken(tokenProvider.buildRefreshToken(authentication.getName()));
            authToken.setApproved(userService.getCurrentUserForUnApprovedUsers().getIsApproved());
            log.info("auth token : {}", authToken.getJwtToken());
        } catch (AuthenticationException e) {
            throw new BusinessException(ResponseMessageEnum.BACK_USER_MSG_007);
        }

        log.info("Login successfully. Phone: {}", authRequest.getPhone());
        return authToken;
    }

    @PostMapping("/refresh-token")
    public void refreshToken( HttpServletRequest request, HttpServletResponse response) {
        userService.refreshToken(request, response);
    }


    @PostMapping("/admin/register")
    public BaseResponseDto registerUser(@RequestBody RegisterUser registerUser) {
        userService.register(registerUser);
        return BaseResponseDto.builder().messageDetail(ResponseMessageEnum.BACK_USER_MSG_014.messageDetail())
                .message(ResponseMessageEnum.BACK_USER_MSG_014.message())
                .statusCode(HttpStatus.CREATED.value()).status(HttpStatus.CREATED.name()).build();
    }

}
