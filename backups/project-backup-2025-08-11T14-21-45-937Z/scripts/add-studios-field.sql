-- Add studios field to projects table
-- This migration adds the studios field to support studio apartments

ALTER TABLE `projects` 
ADD COLUMN `studios` INT DEFAULT 0 AFTER `bathrooms`;

-- Update existing projects with default studios value
UPDATE `projects` SET `studios` = 0 WHERE `studios` IS NULL;