CREATE TABLE dtr_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL,
  job_id UUID NOT NULL,
  applied_at TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL,
  job_title TEXT NOT NULL,
  work_type TEXT,
  remote_options TEXT,
  employer_id UUID,
  company_id UUID,
  employer_first_name TEXT,
  employer_last_name TEXT,
  company_name TEXT,
  total_hours INTEGER,
  start_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
