package com.karthic.JobSeekingPlatform.service;

import com.karthic.JobSeekingPlatform.payload.ApplicationDTO;
import com.karthic.JobSeekingPlatform.payload.ApplicationResponse;

public interface ApplicationService {

    /** Creates an application for the given (logged-in) user. */
    ApplicationDTO createApplication(Long userId, ApplicationDTO applicationDTO);

    ApplicationResponse getAllApplications(Long userId, Integer pageNumber, Integer pageSize, String sortBy,
                                           String sortOrder, String keyword);

    ApplicationResponse getApplicationsForJob(Long jobId, Integer pageNumber, Integer pageSize);

    ApplicationResponse searchApplicationsById(Long applicationId, Integer pageNumber, Integer pageSize,
                                               String sortBy, String sortOrder);

    ApplicationDTO deleteApplication(Long applicationId);

    ApplicationDTO updateApplication(Long applicationId, ApplicationDTO applicationDTO);

    /** Lets a user withdraw their own application. */
    ApplicationDTO withdrawApplication(Long userId, Long applicationId);
}
