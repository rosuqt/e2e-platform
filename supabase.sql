CREATE TABLE employer_verifications (
  id BIGSERIAL PRIMARY KEY,
  employer_id UUID NOT NULL,
  file_path TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  company_name TEXT NOT NULL,
  submitted_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT NOT NULL
);
