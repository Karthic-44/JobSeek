package com.karthic.JobSeekingPlatform.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.karthic.JobSeekingPlatform.config.AppConstants;
import com.karthic.JobSeekingPlatform.payload.ApplicationDTO;
import com.karthic.JobSeekingPlatform.payload.ApplicationResponse;
import com.karthic.JobSeekingPlatform.service.ApplicationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api")
public class ApplicationController {

    @Autowired
    ApplicationService applicationService;

    @PostMapping("/public/application/create")
    public ResponseEntity<ApplicationDTO> CreateApplication(@Valid @RequestBody ApplicationDTO applicationDTO) {

        ApplicationDTO savedApplicationDTO = applicationService.createApplication(applicationDTO);
        return new ResponseEntity<>(savedApplicationDTO, HttpStatus.CREATED);
    }

      @GetMapping("/public/applications/userId/{userId}")
    public ResponseEntity<ApplicationResponse> getAllApplicationsOfUser(
            @PathVariable Long userId,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "category", required = false) String category,
            @RequestParam(name = "pageNumber", defaultValue= AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
            @RequestParam(name="pageSize", defaultValue= AppConstants.PAGE_SIZE,required = false) Integer pageSize,
            @RequestParam(name="sortBy", defaultValue= AppConstants.SORT_APPLICATION_BY,required = false) String sortBy,
            @RequestParam(name="sortOrder", defaultValue= AppConstants.SORT_ORDER,required = false) String sortOrder
    ){
        ApplicationResponse applicationResponse = applicationService.getAllApplications(userId,pageNumber,pageSize,sortBy,sortOrder, keyword);
        return new ResponseEntity<>(applicationResponse,HttpStatus.OK);
    }

    @GetMapping("/public/applications/id/{applicationId}")
    public ResponseEntity<ApplicationResponse> getApplicationsById(@PathVariable Long applicationId,
                                                          @RequestParam(name = "pageNumber", defaultValue= AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
                                                          @RequestParam(name="pageSize", defaultValue= AppConstants.PAGE_SIZE,required = false) Integer pageSize,
                                                          @RequestParam(name="sortBy", defaultValue= AppConstants.SORT_APPLICATION_BY,required = false) String sortBy,
                                                          @RequestParam(name="sortOrder", defaultValue= AppConstants.SORT_ORDER,required = false) String sortOrder){

        ApplicationResponse applicationResponse = applicationService.searchApplicationsById(applicationId,pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(applicationResponse,HttpStatus.OK);
    }

    @DeleteMapping("/admin/application/{applicationId}")
    public ResponseEntity<ApplicationDTO> deleteApplication(@PathVariable Long applicationId){

        ApplicationDTO deleteApplication = applicationService.deleteApplication(applicationId);
        return new ResponseEntity<>(deleteApplication, HttpStatus.OK);
    }

    @PutMapping("/admin/application/{applicationId}")
    public ResponseEntity<ApplicationDTO> updateApplication(@Valid @RequestBody ApplicationDTO applicationDTO,
                                            @PathVariable Long applicationId){

        ApplicationDTO updatedApplicationDTO = applicationService.updateApplication(applicationId,applicationDTO);
        return new ResponseEntity<>(updatedApplicationDTO,HttpStatus.OK);
    }

    
    
}
