package com.karthic.JobSeekingPlatform.security;


import com.karthic.JobSeekingPlatform.model.AppRole;
import com.karthic.JobSeekingPlatform.model.Role;
import com.karthic.JobSeekingPlatform.model.Users;
import com.karthic.JobSeekingPlatform.repositories.RoleRepository;
import com.karthic.JobSeekingPlatform.repositories.UserRepository;
import com.karthic.JobSeekingPlatform.repositories.CategoryRepository;
import com.karthic.JobSeekingPlatform.repositories.JobRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.http.HttpMethod;

import com.karthic.JobSeekingPlatform.security.jwt.AuthEntryPointJwt;
import com.karthic.JobSeekingPlatform.security.jwt.AuthTokenFilter;
import com.karthic.JobSeekingPlatform.security.services.UserDetailsServiceImpl;

import java.util.Set;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig {
    @Autowired
    UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthEntryPointJwt unauthorizedHandler;

    @Bean
    public AuthTokenFilter authenticationJwtTokenFilter() {
        return new AuthTokenFilter();
    }


    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();

        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }


    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }



    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
                .cors(cors -> {})
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                                // only these three auth endpoints are open; /api/auth/user and
                                // /api/auth/recruiters used to be public as well
                                .requestMatchers("/api/auth/signin", "/api/auth/signup", "/api/auth/signout").permitAll()
                                .requestMatchers("/api/auth/recruiters").hasRole("ADMIN")
                                // personal data that used to sit under /api/public
                                .requestMatchers("/api/public/experiences/**", "/api/public/qualifications/**").authenticated()
                                .requestMatchers("/api/public/**").permitAll()
                                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                                .requestMatchers("/api/recruiter/**").hasAnyRole("ADMIN", "RECRUITER")
                                .requestMatchers("/images/**").permitAll()
                                .anyRequest().authenticated()
                );

        http.authenticationProvider(authenticationProvider());
        http.addFilterBefore(authenticationJwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web -> web.ignoring().requestMatchers("/v2/api-docs",
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
                "/swagger-ui.html",
                "/webjars/**"));
    }


    @Bean
    public CommandLineRunner initData(RoleRepository roleRepository,
                                      UserRepository userRepository,
                                      CategoryRepository categoryRepository,
                                      JobRepository jobRepository,
                                      PasswordEncoder passwordEncoder,
                                      @Value("${app.seed-demo-data:false}") boolean seedDemoData,
                                      @Value("${app.seed-sample-jobs:false}") boolean seedSampleJobs,
                                      @Value("${app.seed-admin-password:admin123}") String adminPassword) {
        return args -> {
            Role userRole = roleRepository.findByRoleName(AppRole.ROLE_USER)
                    .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_USER)));
            Role recruiterRole = roleRepository.findByRoleName(AppRole.ROLE_RECRUITER)
                    .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_RECRUITER)));
            Role adminRole = roleRepository.findByRoleName(AppRole.ROLE_ADMIN)
                    .orElseGet(() -> roleRepository.save(new Role(AppRole.ROLE_ADMIN)));

            if (!seedDemoData) {
                return;
            }

            seedUser(userRepository, passwordEncoder, "admin", "admin@example.com", adminPassword,
                    Set.of(userRole, recruiterRole, adminRole));
            seedUser(userRepository, passwordEncoder, "recruiter", "recruiter@example.com", "recruiter123",
                    Set.of(recruiterRole));
            seedUser(userRepository, passwordEncoder, "user", "user@example.com", "password123",
                    Set.of(userRole));

            if (seedSampleJobs && jobRepository.count() == 0) {
                SampleData.seed(categoryRepository, jobRepository);
            }
        };
    }

    private void seedUser(UserRepository repo, PasswordEncoder encoder, String name, String email,
                          String rawPassword, Set<Role> roles) {
        if (repo.existsByUserName(name)) {
            return;
        }
        Users u = new Users();
        u.setUserName(name);
        u.setEmail(email);
        u.setPassword(encoder.encode(rawPassword));
        u.setRoles(roles);
        u.setUserPhoneNumber("1234567890");
        repo.save(u);
    }
}
