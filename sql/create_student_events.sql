CREATE TABLE student_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL,
  title VARCHAR(255) NOT NULL,
  event_date DATE NOT NULL,
  location VARCHAR(255),
  time_start VARCHAR(20),
  time_end VARCHAR(20),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
