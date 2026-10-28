package com.karthic.JobSeekingPlatform.security;

import com.karthic.JobSeekingPlatform.model.Category;
import com.karthic.JobSeekingPlatform.model.Job;
import com.karthic.JobSeekingPlatform.repositories.CategoryRepository;
import com.karthic.JobSeekingPlatform.repositories.JobRepository;

import java.time.Instant;
import java.time.temporal.ChronoUnit;

/** A handful of listings so the dev profile does not start with an empty board. */
final class SampleData {

    private SampleData() {}

    static void seed(CategoryRepository categories, JobRepository jobs) {
        Category engineering = categories.save(category("Engineering"));
        Category design = categories.save(category("Design"));
        Category data = categories.save(category("Data"));
        Category ops = categories.save(category("Operations"));
        Category support = categories.save(category("Customer Support"));

        job(jobs, engineering, "Backend Engineer", "Software Engineer", "Kavya Payments", "Bengaluru",
                "₹18–28 LPA", "Java, Spring Boot, MySQL, REST",
                "B.E./B.Tech in CS or equivalent experience",
                "You will own the settlement service that moves merchant payouts every night. The code is Spring Boot on MySQL, "
                + "about 40k lines, with reasonable tests. You will review pull requests, carry a pager one week in six, and "
                + "help us retire the last of our batch scripts.", 2);
        job(jobs, engineering, "Frontend Developer", "Software Engineer", "Tidewater Logistics", "Remote (India)",
                "₹14–22 LPA", "React, TypeScript, CSS, accessibility",
                "Any degree, strong portfolio",
                "Our dispatch screens are used all day by people who do not have time for loading spinners. We need someone who "
                + "cares about keyboard navigation, tables with thousands of rows and honest error messages.", 5);
        job(jobs, design, "Product Designer", "Designer", "Inkwell Books", "Chennai",
                "₹12–18 LPA", "Figma, prototyping, user research",
                "Portfolio with shipped work",
                "We are a small team building a reading app. You would run short usability sessions with real readers, "
                + "turn what you learn into screens, and sit with engineers while it gets built.", 1);
        job(jobs, data, "Data Analyst", "Analyst", "Greenfield Agritech", "Pune",
                "₹8–13 LPA", "SQL, Python, dashboards",
                "B.Sc./B.Tech in a quantitative field",
                "Turn sensor and sales data from 2,000 farms into weekly decisions for the field team. Mostly SQL and "
                + "notebooks, with a monthly report that someone actually reads.", 9);
        job(jobs, ops, "Warehouse Operations Lead", "Operations", "Tidewater Logistics", "Hyderabad",
                "₹9–12 LPA", "Inventory, shift planning, Excel",
                "Graduate, 3+ years in warehousing",
                "Run a 45-person shift at our Hyderabad hub. You will plan dock schedules, handle exceptions and "
                + "report numbers to the regional manager every morning.", 12);
        job(jobs, support, "Customer Support Associate", "Support", "Kavya Payments", "Remote (India)",
                "₹4–6 LPA", "Written English, empathy, ticketing tools",
                "Any graduate",
                "Answer merchant questions about payouts and refunds. Training is two weeks, then you take tickets on "
                + "your own with a senior teammate reviewing replies.", 3);
        job(jobs, engineering, "DevOps Engineer", "Software Engineer", "Inkwell Books", "Chennai",
                "₹16–24 LPA", "AWS, Terraform, CI/CD, Linux",
                "B.E./B.Tech preferred",
                "Keep a small fleet of services boring. You will own deploys, backups and the on-call runbook, and "
                + "decide which alerts deserve to wake someone up.", 7);
    }

    private static Category category(String name) {
        Category c = new Category();
        c.setCategoryName(name);
        return c;
    }

    private static void job(JobRepository repo, Category category, String name, String role, String company,
                            String location, String salary, String skills, String qualifications,
                            String description, int daysAgo) {
        Job j = new Job();
        j.setJobName(name);
        j.setRole(role);
        j.setCompany(company);
        j.setLocation(location);
        j.setSalary(salary);
        j.setRequiredSkill(skills);
        j.setRequiredQualifications(qualifications);
        j.setDescription(description);
        j.setCategory(category);
        j.setPostedAt(Instant.now().minus(daysAgo, ChronoUnit.DAYS));
        repo.save(j);
    }
}
