package com.karthic.JobSeekingPlatform.payload;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AnalyticsResponse {

    private String totalJobs;
    private long totalCategories;
    private long totalApplications;
    private long totalRecruiters;
}
