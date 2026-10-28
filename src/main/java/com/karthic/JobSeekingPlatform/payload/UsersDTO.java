package com.karthic.JobSeekingPlatform.payload;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsersDTO {

    private Long userId;

    @NotBlank
    private String userName;

    @NotBlank
    @Email
    private String email;

    // Accepted on input, never written to responses (it used to leak the password hash).
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;

    private String userPhoneNumber;
    private List<String> skills;
}
