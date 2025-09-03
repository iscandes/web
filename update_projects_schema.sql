-- Update projects table to support new fields
-- Execute this SQL script in phpMyAdmin to add new columns

-- Add new columns to projects table
ALTER TABLE `projects` 
ADD COLUMN `project_name` varchar(255) DEFAULT NULL AFTER `name`,
ADD COLUMN `sub_project` varchar(255) DEFAULT NULL AFTER `project_name`,
ADD COLUMN `project_type` enum('ready','off-plan') DEFAULT 'ready' AFTER `status`,
ADD COLUMN `property_type` json DEFAULT NULL AFTER `project_type`,
ADD COLUMN `units` json DEFAULT NULL AFTER `bathrooms`,
ADD COLUMN `starting_price` varchar(100) DEFAULT NULL AFTER `price`,
ADD COLUMN `display_title` varchar(255) DEFAULT NULL AFTER `sub_project`,
ADD COLUMN `studios` int(11) DEFAULT 0 AFTER `units`,
ADD COLUMN `is_featured` tinyint(1) DEFAULT 0 AFTER `status`;

-- Update existing price column to be nullable since we now have starting_price
ALTER TABLE `projects` MODIFY COLUMN `price` varchar(100) DEFAULT NULL;

-- Add indexes for better performance
CREATE INDEX idx_projects_project_type ON projects(project_type);
CREATE INDEX idx_projects_featured ON projects(is_featured);

-- Update sample data to include new fields
UPDATE `projects` SET 
  `project_name` = `name`,
  `starting_price` = `price`,
  `project_type` = 'ready',
  `property_type` = '["apartment"]',
  `units` = '["2 bedroom", "3 bedroom"]',
  `is_featured` = 1
WHERE `id` IN (1, 2, 3);