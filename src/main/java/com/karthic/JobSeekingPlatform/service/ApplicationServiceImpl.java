package com.karthic.JobSeekingPlatform.service;

import com.karthic.JobSeekingPlatform.Exception.APIException;
import com.karthic.JobSeekingPlatform.Exception.ResourceNotFoundException;
import com.karthic.JobSeekingPlatform.model.Application;
import com.karthic.JobSeekingPlatform.model.Job;
import com.karthic.JobSeekingPlatform.model.Users;
import com.karthic.JobSeekingPlatform.payload.ApplicationDTO;
import com.karthic.JobSeekingPlatform.payload.ApplicationResponse;
import com.karthic.JobSeekingPlatform.repositories.ApplicationRepository;
import com.karthic.JobSeekingPlatform.repositories.JobRepository;
import com.karthic.JobSeekingPlatform.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository usersRepository;

    @Override
    public ApplicationDTO createApplication(Long userId, ApplicationDTO dto) {
        Job job = jobRepository.findById(dto.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job", "jobId", dto.getJobId()));
        Users user = usersRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User", "userId", userId));

        if (applicationRepository.existsByUser_UserIdAndJob_JobId(userId, job.getJobId())) {
            throw new APIException("You have already applied for this job");
        }

        Application application = new Application();
        application.setJob(job);
        application.setUser(user);
        application.setAppliedDate(new Date());
        application.setResumeURL(dto.getResumeURL());
        return toDTO(applicationRepository.save(application));
    }

    @Override
    public ApplicationResponse getAllApplications(Long userId, Integer pageNumber, Integer pageSize, String sortBy,
                                                  String sortOrder, String keyword) {
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort(sortBy, sortOrder));

        Specification<Application> spec = (root, query, cb) -> {
            var mine = cb.equal(root.get("user").get("userId"), userId);
            if (keyword == null || keyword.isBlank()) {
                return mine;
            }
            String like = "%" + keyword.trim().toLowerCase() + "%";
            return cb.and(mine, cb.or(
                    cb.like(cb.lower(root.get("job").get("jobName")), like),
                    cb.like(cb.lower(root.get("job").get("company")), like)));
        };

        return toResponse(applicationRepository.findAll(spec, pageDetails));
    }

    @Override
    public ApplicationResponse getApplicationsForJob(Long jobId, Integer pageNumber, Integer pageSize) {
        if (!jobRepository.existsById(jobId)) {
            throw new ResourceNotFoundException("Job", "jobId", jobId);
        }
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, Sort.by("applicationId").descending());
        return toResponse(applicationRepository.findByJob_JobId(jobId, pageDetails));
    }

    @Override
    public ApplicationResponse searchApplicationsById(Long applicationId, Integer pageNumber, Integer pageSize,
                                                      String sortBy, String sortOrder) {
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort(sortBy, sortOrder));
        return toResponse(applicationRepository.findByApplicationId(applicationId, pageDetails));
    }

    @Override
    public ApplicationDTO deleteApplication(Long applicationId) {
        Application application = find(applicationId);
        ApplicationDTO snapshot = toDTO(application);
        applicationRepository.delete(application);
        return snapshot;
    }

    @Override
    public ApplicationDTO withdrawApplication(Long userId, Long applicationId) {
        Application application = find(applicationId);
        if (!application.getUser().getUserId().equals(userId)) {
            // same message as "not found" so ids of other people's applications are not revealed
            throw new ResourceNotFoundException("Application", "applicationId", applicationId);
        }
        ApplicationDTO snapshot = toDTO(application);
        applicationRepository.delete(application);
        return snapshot;
    }

    @Override
    public ApplicationDTO updateApplication(Long applicationId, ApplicationDTO dto) {
        Application application = find(applicationId);
        if (dto.getResumeURL() != null) {
            application.setResumeURL(dto.getResumeURL());
        }
        return toDTO(applicationRepository.save(application));
    }

    // ---- helpers ----

    private Application find(Long applicationId) {
        return applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application", "applicationId", applicationId));
    }

    private Sort sort(String sortBy, String sortOrder) {
        return "asc".equalsIgnoreCase(sortOrder) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
    }

    private ApplicationDTO toDTO(Application a) {
        ApplicationDTO dto = new ApplicationDTO();
        dto.setApplicationId(a.getApplicationId());
        dto.setAppliedDate(a.getAppliedDate());
        dto.setResumeURL(a.getResumeURL());
        if (a.getUser() != null) {
            dto.setUserId(a.getUser().getUserId());
            dto.setUserName(a.getUser().getUserName());
            dto.setUserEmail(a.getUser().getEmail());
        }
        if (a.getJob() != null) {
            dto.setJobId(a.getJob().getJobId());
            dto.setJobName(a.getJob().getJobName());
            dto.setCompany(a.getJob().getCompany());
        }
        return dto;
    }

    private ApplicationResponse toResponse(Page<Application> page) {
        ApplicationResponse r = new ApplicationResponse();
        r.setContent(page.getContent().stream().map(this::toDTO).toList());
        r.setPageNumber(page.getNumber());
        r.setPageSize(page.getSize());
        r.setTotalElements(page.getTotalElements());
        r.setTotalPages(page.getTotalPages());
        r.setLastPage(page.isLast());
        return r;
    }
}
