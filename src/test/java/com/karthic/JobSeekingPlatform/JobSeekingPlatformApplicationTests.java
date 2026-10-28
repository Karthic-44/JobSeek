package com.karthic.JobSeekingPlatform;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

// runs against the in-memory H2 database, so no MySQL is needed
@ActiveProfiles("dev")
@SpringBootTest
class JobSeekingPlatformApplicationTests {

	@Test
	void contextLoads() {
	}

}
