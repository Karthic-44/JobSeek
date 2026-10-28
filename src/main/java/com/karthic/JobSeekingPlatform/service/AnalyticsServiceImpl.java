package com.karthic.JobSeekingPlatform.service;

import com.karthic.JobSeekingPlatform.model.AppRole;
import com.karthic.JobSeekingPlatform.payload.AnalyticsResponse;
import com.karthic.JobSeekingPlatform.repositories.ApplicationRepository;
import com.karthic.JobSeekingPlatform.repositories.CategoryRepository;
import com.karthic.JobSeekingPlatform.repositories.JobRepository;
import com.karthic.JobSeekingPlatform.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

@Service
public class AnalyticsServiceImpl implements AnalyticsService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private UserRepository userRepository;

    @Override
    public AnalyticsResponse getAnalyticsData() {
        AnalyticsResponse response = new AnalyticsResponse();
        response.setTotalJobs(String.valueOf(jobRepository.count()));
        response.setTotalCategories(categoryRepository.count());
        response.setTotalApplications(applicationRepository.count());
        response.setTotalRecruiters(
                userRepository.findByRoleName(AppRole.ROLE_RECRUITER, PageRequest.of(0, 1)).getTotalElements());
        return response;
    }
}
