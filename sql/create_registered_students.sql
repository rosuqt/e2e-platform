create table public.registered_students (
  id uuid not null default gen_random_uuid(),
  email text null,
  created_at timestamp with time zone not null default now(),
  user_id uuid null,
  first_name character varying null,
  last_name character varying null,
  year character varying null,
  section character varying null,
  course character varying null,
  address text null,
  constraint students_pkey primary key (id),
  constraint students_email_key unique (email),
  constraint students_user_id_fkey foreign key (user_id) references auth.users (id)
) tablespace pg_default;
