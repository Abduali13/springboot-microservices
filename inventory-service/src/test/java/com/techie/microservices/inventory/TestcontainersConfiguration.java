package com.techie.microservices.inventory;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.utility.DockerImageName;

//@TestConfiguration(proxyBeanMethods = false)
@SpringBootTest
class TestcontainersConfiguration {

//	@Bean
//	@ServiceConnection
//	MySQLContainer<?> mysqlContainer() {
//		return new MySQLContainer<>(DockerImageName.parse("mysql:latest"));
//	}

	@Test
	void contextLoads() {
	}

}
