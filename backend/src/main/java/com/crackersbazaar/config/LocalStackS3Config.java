package com.crackersbazaar.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;

import java.net.URI;

@Configuration
@ConditionalOnProperty(name = "aws.s3.localstack.enabled", havingValue = "true")
public class LocalStackS3Config {

    @Value("${aws.s3.localstack.endpoint:http://localhost:4566}")
    private String localstackEndpoint;

    @Value("${aws.s3.region}")
    private String region;

    @Bean
    @Primary
    public S3Client localStackS3Client() {
        // LocalStack uses fixed test credentials
        AwsBasicCredentials awsCredentials = AwsBasicCredentials.create("test", "test");

        System.out.println("===========================================");
        System.out.println("LocalStack S3 Configuration");
        System.out.println("===========================================");
        System.out.println("Endpoint: " + localstackEndpoint);
        System.out.println("Region: " + region);
        System.out.println("Credentials: test/test (LocalStack default)");
        System.out.println("Mode: DEVELOPMENT (Simulating AWS S3 locally)");
        System.out.println("===========================================");

        return S3Client.builder()
                .endpointOverride(URI.create(localstackEndpoint))
                .region(Region.of(region))
                .credentialsProvider(StaticCredentialsProvider.create(awsCredentials))
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)  // Required for LocalStack
                        .build())
                .build();
    }
}

