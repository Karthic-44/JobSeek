package com.karthic.JobSeekingPlatform.controller;

import com.karthic.JobSeekingPlatform.config.AppConstants;
import com.karthic.JobSeekingPlatform.payload.JobDTO;
import com.karthic.JobSeekingPlatform.payload.JobResponse;
import com.karthic.JobSeekingPlatform.service.JobPostingService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api")
public class JobController {

    @Autowired
    private JobPostingService jobPostingService;


    @GetMapping("/public/jobs")
    public ResponseEntity<JobResponse> getAllJobs(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "categoryId", required = false) Long categoryId,
            @RequestParam(name = "pageNumber", defaultValue= AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
            @RequestParam(name="pageSize", defaultValue= AppConstants.PAGE_SIZE,required = false) Integer pageSize,
            @RequestParam(name="sortBy", defaultValue= AppConstants.SORT_JOB_BY,required = false) String sortBy,
            @RequestParam(name="sortOrder", defaultValue= AppConstants.SORT_ORDER,required = false) String sortOrder
    ){
        JobResponse jobResponse = jobPostingService.getAllJobs(pageNumber, pageSize, sortBy, sortOrder, keyword, categoryId);
        return new ResponseEntity<>(jobResponse,HttpStatus.OK);
    }

    @GetMapping("/public/jobs/keyword/{keyword}")
    public ResponseEntity<JobResponse> getJobsByKeyword(@PathVariable String keyword,
                                                                @RequestParam(name = "pageNumber", defaultValue= AppConstants.PAGE_NUMBER,required = false) Integer pageNumber,
                                                                @RequestParam(name="pageSize", defaultValue= AppConstants.PAGE_SIZE,required = false) Integer pageSize,
                                                                @RequestParam(name="sortBy", defaultValue= AppConstants.SORT_JOB_BY,required = false) String sortBy,
                                                                @RequestParam(name="sortOrder", defaultValue= AppConstants.SORT_ORDER,required = false) String sortOrder){

        JobResponse jobResponse = jobPostingService.searchJobByKeyword(keyword,pageNumber,pageSize,sortBy,sortOrder);
        return new ResponseEntity<>(jobResponse,HttpStatus.OK);
    }

    @PostMapping("/recruiter/job")
    public ResponseEntity<JobDTO> CreateJob(@Valid @RequestBody JobDTO jobDTO) {

        JobDTO savedJobDTO = jobPostingService.createJob(jobDTO);
        return new ResponseEntity<>(savedJobDTO, HttpStatus.CREATED);
    }

    @DeleteMapping("/recruiter/job/{jobId}")
    public ResponseEntity<JobDTO> deleteJob(@PathVariable Long jobId){

        JobDTO deleteJob = jobPostingService.deleteJob(jobId);
        return new ResponseEntity<>(deleteJob, HttpStatus.OK);
    }

    @PutMapping("/recruiter/job/{jobId}")
    public ResponseEntity<JobDTO> updateJob(@Valid @RequestBody JobDTO jobDTO,
                                                    @PathVariable Long jobId){

        JobDTO updatedJobDTO = jobPostingService.updateJob(jobId,jobDTO);
        return new ResponseEntity<>(updatedJobDTO,HttpStatus.OK);
    }
    @GetMapping("/public/jobs/{jobId}")
public ResponseEntity<JobDTO> getJobById(
@PathVariable Long jobId){

JobDTO job=jobPostingService.getJobById(jobId);

return ResponseEntity.ok(job);

}

}
