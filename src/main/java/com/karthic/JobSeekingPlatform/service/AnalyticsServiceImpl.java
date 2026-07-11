package com.karthic.JobSeekingPlatform.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.karthic.JobSeekingPlatform.payload.AnalyticsResponse;
import com.karthic.JobSeekingPlatform.repositories.JobRepository;
// import com.karthic.JobSeekingPlatform.repositories.JobRepository;

@Service
public class AnalyticsServiceImpl implements AnalyticsService{

    @Autowired
    private JobRepository jobRepository;

   

    @Override
    public AnalyticsResponse getAnalyticsData() {
        AnalyticsResponse response = new AnalyticsResponse();

        long jobCount = jobRepository.count();

        response.setTotalJobs(String.valueOf(jobCount));
        return response;
    }
}
