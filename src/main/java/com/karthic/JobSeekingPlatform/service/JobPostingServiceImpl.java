package com.karthic.JobSeekingPlatform.service;

import com.karthic.JobSeekingPlatform.Exception.ResourceNotFoundException;
import com.karthic.JobSeekingPlatform.model.Category;
import com.karthic.JobSeekingPlatform.model.Job;
import com.karthic.JobSeekingPlatform.payload.JobDTO;
import com.karthic.JobSeekingPlatform.payload.JobResponse;
import com.karthic.JobSeekingPlatform.repositories.CategoryRepository;
import com.karthic.JobSeekingPlatform.repositories.JobRepository;
import jakarta.persistence.criteria.Predicate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;

@Service
public class JobPostingServiceImpl implements JobPostingService {

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @Override
    public JobDTO createJob(JobDTO dto) {
        Job job = new Job();
        apply(job, dto);
        job.setPostedAt(Instant.now());
        return toDTO(jobRepository.save(job));
    }

    @Override
    public JobDTO deleteJob(Long jobId) {
        Job job = findJob(jobId);
        JobDTO snapshot = toDTO(job);
        jobRepository.delete(job);
        return snapshot;
    }

    @Override
    public JobDTO updateJob(Long jobId, JobDTO dto) {
        Job job = findJob(jobId);
        apply(job, dto);
        return toDTO(jobRepository.save(job));
    }

    @Override
    public JobDTO getJobById(Long jobId) {
        return toDTO(findJob(jobId));
    }

    @Override
    public JobResponse getAllJobs(Integer pageNumber, Integer pageSize, String sortBy, String sortOrder,
                                  String keyword, Long categoryId) {
        Pageable pageDetails = PageRequest.of(pageNumber, pageSize, sort(sortBy, sortOrder));

        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> parts = new java.util.ArrayList<>();
            if (keyword != null && !keyword.isBlank()) {
                String like = "%" + keyword.trim().toLowerCase() + "%";
                parts.add(cb.or(
                        cb.like(cb.lower(root.get("jobName")), like),
                        cb.like(cb.lower(root.get("company")), like),
                        cb.like(cb.lower(root.get("role")), like),
                        cb.like(cb.lower(root.get("requiredSkill")), like)));
            }
            if (categoryId != null) {
                parts.add(cb.equal(root.get("category").get("categoryId"), categoryId));
            }
            return cb.and(parts.toArray(new Predicate[0]));
        };

        return toResponse(jobRepository.findAll(spec, pageDetails));
    }

    @Override
    public JobResponse searchJobByKeyword(String keyword, Integer pageNumber, Integer pageSize, String sortBy, String sortOrder) {
        return getAllJobs(pageNumber, pageSize, sortBy, sortOrder, keyword, null);
    }

    // ---- helpers ----

    private Job findJob(Long jobId) {
        return jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job", "jobId", jobId));
    }

    private void apply(Job job, JobDTO dto) {
        job.setJobName(dto.getJobName());
        job.setRole(dto.getRole());
        job.setCompany(dto.getCompany());
        job.setLocation(dto.getLocation());
        job.setSalary(dto.getSalary());
        job.setRequiredSkill(dto.getRequiredSkill());
        job.setRequiredQualifications(dto.getRequiredQualifications());
        job.setDescription(dto.getDescription());

        if (dto.getCategoryId() != null) {
            Category category = categoryRepository.findById(dto.getCategoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "categoryId", dto.getCategoryId()));
            job.setCategory(category);
        } else {
            job.setCategory(null);
        }
    }

    private Sort sort(String sortBy, String sortOrder) {
        return "asc".equalsIgnoreCase(sortOrder) ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
    }

    static JobDTO toDTO(Job job) {
        JobDTO dto = new JobDTO();
        dto.setJobId(job.getJobId());
        dto.setJobName(job.getJobName());
        dto.setRole(job.getRole());
        dto.setCompany(job.getCompany());
        dto.setLocation(job.getLocation());
        dto.setSalary(job.getSalary());
        dto.setRequiredSkill(job.getRequiredSkill());
        dto.setRequiredQualifications(job.getRequiredQualifications());
        dto.setDescription(job.getDescription());
        dto.setPostedAt(job.getPostedAt());
        if (job.getCategory() != null) {
            dto.setCategoryId(job.getCategory().getCategoryId());
            dto.setCategoryName(job.getCategory().getCategoryName());
        }
        return dto;
    }

    private JobResponse toResponse(Page<Job> page) {
        JobResponse r = new JobResponse();
        r.setContent(page.getContent().stream().map(JobPostingServiceImpl::toDTO).toList());
        r.setPageNumber(page.getNumber());
        r.setPageSize(page.getSize());
        r.setTotalElements(page.getTotalElements());
        r.setTotalPages(page.getTotalPages());
        r.setLastPage(page.isLast());
        return r;
    }
}
