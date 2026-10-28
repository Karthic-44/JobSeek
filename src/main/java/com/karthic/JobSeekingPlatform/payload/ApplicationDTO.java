package com.karthic.JobSeekingPlatform.payload;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApplicationDTO {

    private Long applicationId;

    // Only read from responses. When applying, the user is always the logged-in user.
    private Long userId;
    private String userName;
    private String userEmail;

    @NotNull(message = "jobId is required")
    private Long jobId;
    private String jobName;
    private String company;

    private Date appliedDate;
    private String resumeURL;
}
