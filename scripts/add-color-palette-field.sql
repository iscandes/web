-- Add color_palette field to projects table for dynamic theming
-- Execute this SQL script to add the color_palette column

ALTER TABLE `projects` 
ADD COLUMN `color_palette` JSON DEFAULT NULL AFTER `presentation_file`;

-- Update the comment for the table
ALTER TABLE `projects` COMMENT = 'Projects table with dynamic color theming support';