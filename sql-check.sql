-- List all functions in the public schema
select routine_name, routine_type, data_type
from information_schema.routines
where specific_schema = 'public';

-- Check if a specific function exists (replace with your function name)
select routine_name, routine_type, data_type
from information_schema.routines
where specific_schema = 'public'
  and routine_name = 'get_job_matches_for_student';

-- List all tables and columns in the public schema
select table_name, column_name, data_type
from information_schema.columns
where table_schema = 'public';

-- Check if a specific column exists in a table
select column_name, data_type
from information_schema.columns
where table_schema = 'public'
  and table_name = 'job_postings'
  and column_name = 'pay_amount';
