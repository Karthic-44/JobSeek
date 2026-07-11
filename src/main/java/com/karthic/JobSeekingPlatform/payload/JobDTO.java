package com.karthic.JobSeekingPlatform.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class JobDTO {
    private String jobName;
    private String role;
    private String requiredSkill;
    private String requiredQualifications;
    private String description;
    private Long recruiterId; 
    private Long userId;      
    private Long categoryId;  

}
