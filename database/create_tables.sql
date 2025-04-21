CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create table for job postings
CREATE TABLE job_postings (
    id SERIAL PRIMARY KEY,FAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES registered_employers(id) ON DELETE CASCADE,
    job_title VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    remote_options VARCHAR(50),
    work_type VARCHAR(50),
    pay_type VARCHAR(50),
    pay_amount VARCHAR(50),
    recommended_course VARCHAR(255),
    job_description TEXT,
    job_summary TEXT,
    must_have_qualifications TEXT[],
    nice_to_have_qualifications TEXT[],
    application_deadline TIMESTAMP,
    max_applicants INT,
    application_questions JSONB,
    perks_and_benefits TEXT[],
    verification_tier VARCHAR(50) DEFAULT 'basic',
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create table for job drafts
CREATE TABLE job_drafts (
    id SERIAL PRIMARY KEY,FAULT gen_random_uuid(),
    employer_id UUID NOT NULL REFERENCES registered_employers(id) ON DELETE CASCADE,
    job_title VARCHAR(255),
    location VARCHAR(255),
    remote_options VARCHAR(50),
    work_type VARCHAR(50),
    pay_type VARCHAR(50),
    pay_amount VARCHAR(50),
    recommended_course VARCHAR(255),
    job_description TEXT,
    job_summary TEXT,
    must_have_qualifications TEXT[],
    nice_to_have_qualifications TEXT[],
    application_deadline TIMESTAMP,
    max_applicants INT,
    application_questions JSONB,
    perks_and_benefits TEXT[],
    verification_tier VARCHAR(50) DEFAULT 'basic',
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Allow NULL values for all fields in the job_drafts table except the primary key and foreign key
ALTER TABLE job_drafts ALTER COLUMN job_title DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN location DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN remote_options DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN work_type DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN pay_type DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN pay_amount DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN recommended_course DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN job_description DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN job_summary DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN must_have_qualifications DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN nice_to_have_qualifications DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN application_deadline DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN max_applicants DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN application_questions DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN perks_and_benefits DROP NOT NULL;
ALTER TABLE job_drafts ALTER COLUMN verification_tier DROP NOT NULL;

-- Registered employers table (for reference)
CREATE TABLE registered_employers (
    name VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    verify_status VARCHAR(50) DEFAULT 'basic'
);

-- Alter 'registered_employers' table to make 'id' a UUID and primary key
ALTER TABLE registered_employers
DROP COLUMN id,
ADD COLUMN id UUID PRIMARY KEY DEFAULT gen_random_uuid();


