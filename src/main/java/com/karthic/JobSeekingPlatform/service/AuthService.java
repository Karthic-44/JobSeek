package com.karthic.JobSeekingPlatform.service;

import com.karthic.JobSeekingPlatform.payload.AuthenticationResult;
import com.karthic.JobSeekingPlatform.payload.UserResponse;
import com.karthic.JobSeekingPlatform.security.request.LoginRequest;
import com.karthic.JobSeekingPlatform.security.request.SignupRequest;
import com.karthic.JobSeekingPlatform.security.response.MessageResponse;
import com.karthic.JobSeekingPlatform.security.response.UserInfoResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;

public interface AuthService {

    AuthenticationResult login(LoginRequest loginRequest);

    ResponseEntity<MessageResponse> register(SignupRequest signUpRequest);

    UserInfoResponse getCurrentUserDetails(Authentication authentication);

    ResponseCookie logoutUser();

    UserResponse getAllRecruiters(Pageable pageable);
}
