package com.karthic.JobSeekingPlatform.service;

import com.karthic.JobSeekingPlatform.Exception.APIException;
import com.karthic.JobSeekingPlatform.Exception.ResourceNotFoundException;
import com.karthic.JobSeekingPlatform.model.Job;
import com.karthic.JobSeekingPlatform.model.Category;
import com.karthic.JobSeekingPlatform.payload.JobDTO;
import com.karthic.JobSeekingPlatform.payload.JobResponse;
import com.karthic.JobSeekingPlatform.repositories.UserRepository;

import jakarta.validation.Valid;

import com.karthic.JobSeekingPlatform.repositories.CategoryRepository;
import org.modelmapper.ModelMapper;
import com.karthic.JobSeekingPlatform.repositories.JobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobPostingServiceImpl implements JobPostingService {

    @Autowired
    public ModelMapper modelMapper;

    @Autowired
    private JobRepository jobRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public JobDTO createJob(JobDTO jobDTO) {
        Job jobDb = jobRepository.findByJobName(jobDTO.getJobName());
        if (jobDb != null) {
            throw new APIException("Job " + jobDTO.getJobName() + " already exists");
        }
        
        Job job = new Job();
        job.setJobName(jobDTO.getJobName());
        job.setRole(jobDTO.getRole());
        job.setRequiredSkill(jobDTO.getRequiredSkill());
        job.setRequiredQualifications(jobDTO.getRequiredQualifications());
        job.setDescription(jobDTO.getDescription());
        
        if (jobDTO.getCategoryId() != null) {
            Category category = categoryRepository.findById(jobDTO.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", jobDTO.getCategoryId()));
            job.setCategory(category);
        }
        
        Job savedJob = jobRepository.save(job);
        return modelMapper.map(savedJob, JobDTO.class);
    }

    @Override
    public JobDTO deleteJob(Long jobId) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "jobId", jobId));
        jobRepository.delete(job);
        return modelMapper.map(job, JobDTO.class);
    }

    @Override
    public JobDTO updateJob(Long jobId, JobDTO jobDTO) {
        Job jobFromDb = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "jobId", jobId));

        jobFromDb.setJobName(jobDTO.getJobName());
        jobFromDb.setRole(jobDTO.getRole());
        jobFromDb.setRequiredSkill(jobDTO.getRequiredSkill());
        jobFromDb.setRequiredQualifications(jobDTO.getRequiredQualifications());
        jobFromDb.setDescription(jobDTO.getDescription());

        Job savedJob = jobRepository.save(jobFromDb);
        return modelMapper.map(savedJob, JobDTO.class);
    }

    @Override
    public JobResponse getAllJobs(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder, String keyword) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);

        Specification<Job> spec = Specification.where(null);
        if (keyword != null && !keyword.isEmpty()) {
            spec = spec.and((root, query, criteriaBuilder) ->
                    criteriaBuilder.like(criteriaBuilder.lower(root.get("jobName")), "%" + keyword.toLowerCase() + "%"));
        }

        Page<Job> pageJobs = jobRepository.findAll(spec, pageDetails);
        List<Job> jobs = pageJobs.getContent();

        List<JobDTO> jobDTOS = jobs.stream()
                .map(job -> modelMapper.map(job, JobDTO.class))
                .toList();

        JobResponse jobResponse = new JobResponse();
        jobResponse.setContent(jobDTOS);
        jobResponse.setPageNumber(pageJobs.getNumber());
        jobResponse.setPageSize(pageJobs.getSize());
        jobResponse.setTotalElements(pageJobs.getTotalElements());
        jobResponse.setTotalPages(pageJobs.getTotalPages());
        jobResponse.setLastPage(pageJobs.isLast());
        return jobResponse;
    }

    @Override
    public JobResponse searchJobByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        Sort sortByAndOrder = sortOrder.equalsIgnoreCase("asc")
                ? Sort.by(sortBy).ascending()
                : Sort.by(sortBy).descending();

        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sortByAndOrder);
        Page<Job> pageJobs = jobRepository.findByJobNameLikeIgnoreCase('%' + keyword + '%', pageDetails);

        List<Job> jobs = pageJobs.getContent();
        List<JobDTO> jobDTOS = jobs.stream()
                .map(job -> modelMapper.map(job, JobDTO.class))
                .toList();

        if (jobs.isEmpty()) {
            throw new APIException("Jobs not found with keyword: " + keyword);
        }

        JobResponse jobResponse = new JobResponse();
        jobResponse.setContent(jobDTOS);
        jobResponse.setPageNumber(pageJobs.getNumber());
        jobResponse.setPageSize(pageJobs.getSize());
        jobResponse.setTotalElements(pageJobs.getTotalElements());
        jobResponse.setTotalPages(pageJobs.getTotalPages());
        jobResponse.setLastPage(pageJobs.isLast());
        return jobResponse;
    }

    @Override
public JobDTO getJobById(Long jobId){

    Job job = jobRepository.findById(jobId)
            .orElseThrow(
                    () -> new ResourceNotFoundException(
                            "Job",
                            "jobId",
                            jobId
                    )
            );

    return modelMapper.map(
            job,
            JobDTO.class
    );
}
}