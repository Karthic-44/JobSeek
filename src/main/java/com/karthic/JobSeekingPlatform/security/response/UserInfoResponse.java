package com.karthic.JobSeekingPlatform.security.response;

import java.util.List;

public class UserInfoResponse {

    private Long id;
     private String email;
    private String username;
    private List<String> roles;

    public UserInfoResponse(Long id, String username, List<String> roles, String email) {
        this.id = id;
        this.username = username;
        this.roles = roles;
        this.email = email;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}



