package com.karthic.JobSeekingPlatform.service;

import com.karthic.JobSeekingPlatform.payload.JobDTO;
import com.karthic.JobSeekingPlatform.payload.JobResponse;
import jakarta.validation.Valid;

public interface JobPostingService {

    JobDTO createJob(JobDTO jobDTO);
    JobDTO deleteJob(Long jobId);

    JobDTO updateJob(Long jobId, @Valid JobDTO jobDTO);
    JobDTO getJobById(Long jobId);


    JobResponse getAllJobs(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String keyword);

    JobResponse searchJobByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder);
}
