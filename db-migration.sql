-- Change the embedding column to accept 3072 floats
ALTER TABLE student_profile
DROP COLUMN embedding;

ALTER TABLE student_profile
ADD COLUMN embedding vector(3072);
