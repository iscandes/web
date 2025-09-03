-- Update Developers Table for Person-Based Information
-- Add new fields for person name, company name, position, and experience

ALTER TABLE `developers` 
ADD COLUMN `company_name` VARCHAR(255) DEFAULT NULL AFTER `name`,
ADD COLUMN `position` VARCHAR(255) DEFAULT NULL AFTER `company_name`,
ADD COLUMN `experience` VARCHAR(255) DEFAULT NULL AFTER `position`;

-- Update existing sample data to reflect person-based information
UPDATE `developers` SET 
  `company_name` = `name`,
  `name` = CASE 
    WHEN `slug` = 'emaar-properties' THEN 'Ahmed Al Mansouri'
    WHEN `slug` = 'damac-properties' THEN 'Sarah Johnson'
    WHEN `slug` = 'nakheel' THEN 'Mohammed Hassan'
    ELSE 'John Doe'
  END,
  `position` = CASE 
    WHEN `slug` = 'emaar-properties' THEN 'Senior Development Manager'
    WHEN `slug` = 'damac-properties' THEN 'Project Director'
    WHEN `slug` = 'nakheel' THEN 'Lead Architect'
    ELSE 'Developer'
  END,
  `experience` = CASE 
    WHEN `slug` = 'emaar-properties' THEN '15+ years'
    WHEN `slug` = 'damac-properties' THEN '12+ years'
    WHEN `slug` = 'nakheel' THEN '10+ years'
    ELSE '5+ years'
  END
WHERE `id` IN (SELECT * FROM (SELECT `id` FROM `developers` LIMIT 10) AS temp);