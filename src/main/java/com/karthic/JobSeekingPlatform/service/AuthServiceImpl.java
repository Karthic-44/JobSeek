package com.karthic.JobSeekingPlatform.service;

import com.karthic.JobSeekingPlatform.model.AppRole;
import com.karthic.JobSeekingPlatform.model.Role;
import com.karthic.JobSeekingPlatform.model.Users;
import com.karthic.JobSeekingPlatform.payload.AuthenticationResult;
import com.karthic.JobSeekingPlatform.payload.UsersDTO;
import com.karthic.JobSeekingPlatform.payload.UserResponse;
import com.karthic.JobSeekingPlatform.repositories.RoleRepository;
import com.karthic.JobSeekingPlatform.repositories.UserRepository;
import com.karthic.JobSeekingPlatform.security.jwt.JwtUtils;
import com.karthic.JobSeekingPlatform.security.request.LoginRequest;
import com.karthic.JobSeekingPlatform.security.request.SignupRequest;
import com.karthic.JobSeekingPlatform.security.response.MessageResponse;
import com.karthic.JobSeekingPlatform.security.response.UserInfoResponse;
import com.karthic.JobSeekingPlatform.security.services.UserDetailsImpl;
import jakarta.transaction.Transactional;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Transactional
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    UserRepository userRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    ModelMapper modelMapper;

    @Override
    public AuthenticationResult login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager
                    .authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        ResponseCookie jwtCookie = jwtUtils.generateJwtCookie(userDetails);

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(userDetails.getId(),
                userDetails.getUsername(), roles, userDetails.getEmail());

        return new AuthenticationResult(response, jwtCookie);
    }

    @Override
    public ResponseEntity<MessageResponse> register(SignupRequest signUpRequest) {
        if (userRepository.existsByUserName(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        if (userRepository.existsByEmail(signUpRequest.getEmail())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Email is already in use!"));
        }

        // Create new user's account
        // Users user = new Users(signUpRequest.getUsername(),
        //         signUpRequest.getEmail(),
        //         encoder.encode(signUpRequest.getPassword()));

        Users user = new Users();
        user.setUserName(signUpRequest.getUsername());
        user.setEmail(signUpRequest.getEmail());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));

        // Self sign-up can only create job seekers or recruiters. Admin accounts are never
        // created from a public request (this used to accept "admin" in the request body).
        Set<String> requested = signUpRequest.getRole();
        AppRole wanted = (requested != null && requested.contains("recruiter"))
                ? AppRole.ROLE_RECRUITER
                : AppRole.ROLE_USER;
        Role role = roleRepository.findByRoleName(wanted)
                .orElseThrow(() -> new RuntimeException("Error: Role is not found."));
        Set<Role> roles = new HashSet<>();
        roles.add(role);

        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok(new MessageResponse("Users registered successfully!"));
    }

    @Override
    public UserInfoResponse getCurrentUserDetails(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();

        List<String> roles = userDetails.getAuthorities().stream()
                .map(item -> item.getAuthority())
                .collect(Collectors.toList());

        UserInfoResponse response = new UserInfoResponse(userDetails.getId(),
                userDetails.getUsername(), roles, userDetails.getEmail());

        return response;
    }

    @Override
    public ResponseCookie logoutUser() {
        return jwtUtils.getCleanJwtCookie();
    }

    @Override
    public UserResponse getAllRecruiters(Pageable pageable) {
        Page<Users> allUsers = userRepository.findByRoleName(AppRole.ROLE_RECRUITER, pageable);
        List<UsersDTO> userDtos = allUsers.getContent()
                .stream()
                .map(p -> modelMapper.map(p, UsersDTO.class))
                .collect(Collectors.toList());

        UserResponse response = new UserResponse();
        response.setContent(userDtos);
        response.setPageNumber(allUsers.getNumber());
        response.setPageSize(allUsers.getSize());
        response.setTotalElements(allUsers.getTotalElements());
        response.setTotalPages(allUsers.getTotalPages());
        response.setLastPage(allUsers.isLast());
        return response;
    }


}