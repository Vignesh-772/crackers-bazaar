-- Initialize the crackers_bazaar database
-- This script runs when the PostgreSQL container starts for the first time

-- Create extensions if needed
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create indexes for better performance (will be created by JPA, but good to have)
-- These will be created automatically by Spring Boot JPA, but we can add custom ones here if needed

-- Insert any initial data if required
-- (The default admin users will be created by Spring Boot's DataInitializer)

