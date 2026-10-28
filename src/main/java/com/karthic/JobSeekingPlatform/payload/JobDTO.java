package com.karthic.JobSeekingPlatform.payload;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDTO {
    private Long jobId;

    @NotBlank(message = "Job title is required")
    @Size(min = 2, max = 120, message = "Title must be between 2 and 120 characters")
    private String jobName;

    private String role;
    private String company;
    private String location;
    private String salary;
    private String requiredSkill;
    private String requiredQualifications;

    @Size(max = 4000, message = "Description can be at most 4000 characters")
    private String description;

    private Long categoryId;
    private String categoryName;
    private Instant postedAt;
}
