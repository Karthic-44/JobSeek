package com.karthic.JobSeekingPlatform.controller;

import com.karthic.JobSeekingPlatform.config.AppConstants;
import com.karthic.JobSeekingPlatform.payload.ApplicationDTO;
import com.karthic.JobSeekingPlatform.payload.ApplicationResponse;
import com.karthic.JobSeekingPlatform.service.ApplicationService;
import com.karthic.JobSeekingPlatform.util.AuthUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    @Autowired
    ApplicationService applicationService;

    @Autowired
    AuthUtil authUtil;

    // ---- the signed-in user's own applications ----

    @PostMapping("/user/applications")
    public ResponseEntity<ApplicationDTO> createApplication(@Valid @RequestBody ApplicationDTO applicationDTO) {
        ApplicationDTO saved = applicationService.createApplication(authUtil.loggedInUserId(), applicationDTO);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @GetMapping("/user/applications")
    public ResponseEntity<ApplicationResponse> getMyApplications(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_APPLICATION_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = "desc", required = false) String sortOrder) {
        return ResponseEntity.ok(applicationService.getAllApplications(
                authUtil.loggedInUserId(), pageNumber, pageSize, sortBy, sortOrder, keyword));
    }

    @DeleteMapping("/user/applications/{applicationId}")
    public ResponseEntity<ApplicationDTO> withdrawApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(applicationService.withdrawApplication(authUtil.loggedInUserId(), applicationId));
    }

    // ---- recruiters and admins ----

    @GetMapping("/recruiter/jobs/{jobId}/applications")
    public ResponseEntity<ApplicationResponse> getApplicationsForJob(
            @PathVariable Long jobId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = "20", required = false) Integer pageSize) {
        return ResponseEntity.ok(applicationService.getApplicationsForJob(jobId, pageNumber, pageSize));
    }

    @GetMapping("/admin/applications/id/{applicationId}")
    public ResponseEntity<ApplicationResponse> getApplicationsById(@PathVariable Long applicationId,
            @RequestParam(name = "pageNumber", defaultValue = AppConstants.PAGE_NUMBER, required = false) Integer pageNumber,
            @RequestParam(name = "pageSize", defaultValue = AppConstants.PAGE_SIZE, required = false) Integer pageSize,
            @RequestParam(name = "sortBy", defaultValue = AppConstants.SORT_APPLICATION_BY, required = false) String sortBy,
            @RequestParam(name = "sortOrder", defaultValue = AppConstants.SORT_ORDER, required = false) String sortOrder) {
        return ResponseEntity.ok(applicationService.searchApplicationsById(applicationId, pageNumber, pageSize, sortBy, sortOrder));
    }

    @DeleteMapping("/admin/application/{applicationId}")
    public ResponseEntity<ApplicationDTO> deleteApplication(@PathVariable Long applicationId) {
        return ResponseEntity.ok(applicationService.deleteApplication(applicationId));
    }

    @PutMapping("/admin/application/{applicationId}")
    public ResponseEntity<ApplicationDTO> updateApplication(@Valid @RequestBody ApplicationDTO applicationDTO,
                                                            @PathVariable Long applicationId) {
        return ResponseEntity.ok(applicationService.updateApplication(applicationId, applicationDTO));
    }
}
