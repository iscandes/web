-- Clear all existing developer data
DELETE FROM developers;

-- Reset auto-increment counter
ALTER TABLE developers AUTO_INCREMENT = 1;

-- Clear all existing project data
DELETE FROM projects;

-- Reset auto-increment counter for projects
ALTER TABLE projects AUTO_INCREMENT = 1;