package com.karthic.JobSeekingPlatform.controller;

import com.karthic.JobSeekingPlatform.config.AppConstants;
import com.karthic.JobSeekingPlatform.payload.UserResponse;
import com.karthic.JobSeekingPlatform.payload.UsersDTO;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.karthic.JobSeekingPlatform.service.UserService;

@RestController
@RequestMapping("/api")

    public class UserController {

    @Autowired
    private UserService userService;

    @PostMapping("/admin/users/create")
    public ResponseEntity<UsersDTO> createUser(@Valid  @RequestBody UsersDTO userDTO) {

        UsersDTO savedUserDTO = userService.createUser(userDTO);
        return new ResponseEntity<>(savedUserDTO, HttpStatus.CREATED);

    }
    @DeleteMapping("/admin/users/{userId}")
    public ResponseEntity<UsersDTO> deleteUsers(@PathVariable Long userId){
        UsersDTO deletedUsers = userService.deleteUsers(userId);
        return new ResponseEntity<>(deletedUsers,HttpStatus.OK);

    }

    @GetMapping("/admin/users/search/{keyword}")
    public ResponseEntity<UserResponse> getUsersByKeyword(@PathVariable String keyword,
                                                                @RequestParam(name = "pageNumber", defaultValue= AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
                                                                @RequestParam(name="pageSize", defaultValue= AppConstants.PAGE_SIZE,required = false) Integer pageSize,
                                                                @RequestParam(name="sortBy", defaultValue= AppConstants.SORT_USER_BY,required = false) String sortBy,
                                                                @RequestParam(name="sortOrder", defaultValue= AppConstants.SORT_ORDER,required = false) String sortOrder){

        UserResponse userResponse = userService.searchUsersByKeyword(keyword,pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(userResponse,HttpStatus.OK);
    }

    @GetMapping("/admin/users/id/{userId}")
    public ResponseEntity<UserResponse> getUsersById(@PathVariable Long userId,
                                                          @RequestParam(name = "pageNumber", defaultValue= AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
                                                          @RequestParam(name="pageSize", defaultValue= AppConstants.PAGE_SIZE,required = false) Integer pageSize,
                                                          @RequestParam(name="sortBy", defaultValue= AppConstants.SORT_USER_BY,required = false) String sortBy,
                                                          @RequestParam(name="sortOrder", defaultValue= AppConstants.SORT_ORDER,required = false) String sortOrder){

        UserResponse userResponse = userService.searchUsersById(userId,pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(userResponse,HttpStatus.OK);
    }

    @PutMapping("/admin/users/{userId}")
    public ResponseEntity<UsersDTO> updateUsers(@Valid @RequestBody UsersDTO usersDTO,
                                                    @PathVariable Long userId){

        UsersDTO updatedUsersDTO = userService.updateUsers(userId,usersDTO);
        return new ResponseEntity<>(updatedUsersDTO,HttpStatus.OK);
    }



    }



