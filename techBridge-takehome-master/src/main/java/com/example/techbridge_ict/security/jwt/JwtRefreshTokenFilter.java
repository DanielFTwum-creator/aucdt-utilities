package com.example.techbridge_ict.security.jwt;

import com.example.techbridge_ict.constant.SecurityConstants;
import com.example.techbridge_ict.enums.ResponseMessageEnum;
import com.example.techbridge_ict.exception.BusinessException;
import com.example.techbridge_ict.services.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.IOException;

@Configuration
@Slf4j
public class JwtRefreshTokenFilter {

    @Autowired
    private  TokenProvider tokenProvider;

    @Autowired
    @Lazy
    private UserService userService;

    public  void refreshTokenFilter(HttpServletRequest request, HttpServletResponse response) {
        String token = request.getHeader(SecurityConstants.TOKEN_HEADER);
        log.info("Refreshing token loaded", token);
        final String  refreshToken;
        final String userName;
        if (StringUtils.isNotEmpty(token) && token.startsWith(SecurityConstants.TOKEN_PREFIX)){
            if (tokenProvider.validateToken(token)){
                var  principal=tokenProvider.getRefreshAuthentication(token).getPrincipal();
              try {
                  if(principal instanceof UserDetails){
                      UserDetails userDetails = (UserDetails) principal;
                      userName = userDetails.getUsername();
                      refreshToken= token.substring(7);
                      var user=userService.findOneByEmail(userName);
                      var authToken=tokenProvider.getAuthToken(user.getEmail(),user.getPrivileges());
                      authToken.setJwtRefreshToken(refreshToken);
                      authToken.setApproved(user.getIsApproved());
                      new ObjectMapper().writeValue(response.getOutputStream(), authToken);
                      log.info("token Refreshed: {}", authToken);
                  }
              }
              catch (IOException e){
                  log.info("An error occurred  while refreshing token: {}",e.getMessage());
              }
            }
            else {
                throw  new BusinessException(ResponseMessageEnum.BACK_TOKEN_MSG_001);
            }
        }

    }
}

