package com.example.identify;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class IdentifyApplication {
	public static void main(String[] args) {
		System.setProperty("GOOGLE_APPLICATION_CREDENTIALS", "../../resources/identify-44310-1e88fa2b4cbe.json");
		SpringApplication.run(IdentifyApplication.class, args);
	}

}
