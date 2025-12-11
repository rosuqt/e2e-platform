create table student_saved_jobs (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references registered_students(id) on delete cascade,
  job_id uuid not null references community_jobs(id) on delete cascade,
  saved_at timestamp with time zone default now(),
  unique(student_id, job_id)
);
