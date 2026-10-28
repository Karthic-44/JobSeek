package com.karthic.JobSeekingPlatform.service;

import com.karthic.JobSeekingPlatform.Exception.APIException;
import com.karthic.JobSeekingPlatform.Exception.ResourceNotFoundException;
import com.karthic.JobSeekingPlatform.model.AppRole;
import com.karthic.JobSeekingPlatform.model.Users;
import com.karthic.JobSeekingPlatform.repositories.RoleRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.karthic.JobSeekingPlatform.payload.UserResponse;
import com.karthic.JobSeekingPlatform.payload.UsersDTO;
import com.karthic.JobSeekingPlatform.repositories.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.List;

@Service
public class UserServiceImpl implements UserService{

    @Autowired
    public ModelMapper modelMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UsersDTO createUser(UsersDTO userDTO) {
        Users user = modelMapper.map(userDTO,Users.class);
        Users userDb = userRepository.findByUserName(user.getUserName()).orElse(null);
        if (userDb!=null){
            throw new APIException("User "+ user.getUserName() + " already exists");
        }
        if (userDTO.getPassword() == null || userDTO.getPassword().length() < 6) {
            throw new APIException("Password must be at least 6 characters");
        }
        // The password used to be stored as plain text, and the user had no role, so nobody could sign in as them.
        user.setPassword(passwordEncoder.encode(userDTO.getPassword()));
        user.getRoles().add(roleRepository.findByRoleName(AppRole.ROLE_USER)
                .orElseThrow(() -> new APIException("Default role is missing")));
        Users savedUser = userRepository.save(user);
        return  modelMapper.map(savedUser, UsersDTO.class);
    }

    @Override
    public UsersDTO deleteUsers(Long userId) {
        Users user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Users", "userId", userId));
        userRepository.delete(user);
        return modelMapper.map(user, UsersDTO.class);
    }

    @Override
    public UserResponse searchUsersByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Users> pageUsers = userRepository.findByUserNameLikeIgnoreCase('%' + keyword + '%', pageDetails);

        List<Users> users = pageUsers.getContent();
        List<UsersDTO> usersDTOS = users.stream()
                .map(user -> modelMapper.map(user, UsersDTO.class))
                .toList();

        UserResponse usersResponse = new UserResponse();
        usersResponse.setContent(usersDTOS);
        usersResponse.setPageNumber(pageUsers.getNumber());
        usersResponse.setPageSize(pageUsers.getSize());
        usersResponse.setTotalElements(pageUsers.getTotalElements());
        usersResponse.setTotalPages(pageUsers.getTotalPages());
        usersResponse.setLastPage(pageUsers.isLast());
        return usersResponse;
    }

    @Override
    public UserResponse searchUsersById(Long userId, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Users> pageUsers = userRepository.findByUserId(userId, pageDetails);

        List<Users> users = pageUsers.getContent();
        List<UsersDTO> usersDTOS = users.stream()
                .map(user -> modelMapper.map(user, UsersDTO.class))
                .toList();

        if(users.isEmpty()){
            throw new APIException("Users not found with id: " + userId);
        }

        UserResponse usersResponse = new UserResponse();
        usersResponse.setContent(usersDTOS);
        usersResponse.setPageNumber(pageUsers.getNumber());
        usersResponse.setPageSize(pageUsers.getSize());
        usersResponse.setTotalElements(pageUsers.getTotalElements());
        usersResponse.setTotalPages(pageUsers.getTotalPages());
        usersResponse.setLastPage(pageUsers.isLast());
        return usersResponse;
    }

    @Override
    public UsersDTO updateUsers(Long userId, UsersDTO usersDTO) {
        Users usersFromDb = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Users", "userId", userId));

        Users users = modelMapper.map(usersDTO, Users.class);

        usersFromDb.setUserName(users.getUserName());
        usersFromDb.setEmail(users.getEmail());
        // Only change the password when a new one was sent, and always store it hashed.
        if (usersDTO.getPassword() != null && !usersDTO.getPassword().isBlank()) {
            usersFromDb.setPassword(passwordEncoder.encode(usersDTO.getPassword()));
        }
        usersFromDb.setUserPhoneNumber(users.getUserPhoneNumber());
        if (users.getSkills() != null) {
            usersFromDb.setSkills(users.getSkills());
        }


        Users savedUsers = userRepository.save(usersFromDb);

        return modelMapper.map(savedUsers, UsersDTO.class);
    }


}
