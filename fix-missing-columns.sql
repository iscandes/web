-- Fix missing columns in projects table
-- This script adds all the missing unit-related columns that are causing the video upload error

ALTER TABLE `projects` 
ADD COLUMN IF NOT EXISTS `units_6bedroom` INT DEFAULT 0 AFTER `units_5bedroom`,
ADD COLUMN IF NOT EXISTS `units_7bedroom` INT DEFAULT 0 AFTER `units_6bedroom`,
ADD COLUMN IF NOT EXISTS `units_8plus_bedrooms` VARCHAR(50) DEFAULT NULL AFTER `units_7bedroom`,
ADD COLUMN IF NOT EXISTS `custom_bedroom_count` VARCHAR(100) DEFAULT NULL AFTER `units_8plus_bedrooms`,
ADD COLUMN IF NOT EXISTS `shop_commercial` INT DEFAULT 0 AFTER `units_office`,
ADD COLUMN IF NOT EXISTS `category` VARCHAR(100) DEFAULT NULL AFTER `custom_bedroom_count`,
ADD COLUMN IF NOT EXISTS `featured` TINYINT(1) DEFAULT 0 AFTER `category`;

-- Also ensure other commonly used columns exist
ALTER TABLE `projects` 
ADD COLUMN IF NOT EXISTS `units_1bedroom` INT DEFAULT 0 AFTER `studios`,
ADD COLUMN IF NOT EXISTS `units_2bedroom` INT DEFAULT 0 AFTER `units_1bedroom`,
ADD COLUMN IF NOT EXISTS `units_3bedroom` INT DEFAULT 0 AFTER `units_2bedroom`,
ADD COLUMN IF NOT EXISTS `units_4bedroom` INT DEFAULT 0 AFTER `units_3bedroom`,
ADD COLUMN IF NOT EXISTS `units_5bedroom` INT DEFAULT 0 AFTER `units_4bedroom`;

-- Update existing projects to have default values
UPDATE `projects` SET 
  `units_1bedroom` = COALESCE(`units_1bedroom`, 0),
  `units_2bedroom` = COALESCE(`units_2bedroom`, 0),
  `units_3bedroom` = COALESCE(`units_3bedroom`, 0),
  `units_4bedroom` = COALESCE(`units_4bedroom`, 0),
  `units_5bedroom` = COALESCE(`units_5bedroom`, 0),
  `units_6bedroom` = COALESCE(`units_6bedroom`, 0),
  `units_7bedroom` = COALESCE(`units_7bedroom`, 0),
  `shop_commercial` = COALESCE(`shop_commercial`, 0),
  `featured` = COALESCE(`featured`, 0)
WHERE id > 0;