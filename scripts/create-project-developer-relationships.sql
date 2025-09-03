-- Database Migration: Create Project-Developer Relationships
-- This script establishes proper foreign key relationships between projects and developers

-- Step 1: Add developer_id column to projects table
ALTER TABLE `projects` 
ADD COLUMN `developer_id` INT(11) DEFAULT NULL AFTER `slug`;

-- Step 2: Update existing projects to link with developers by name
-- This matches existing developer names in projects table with developers table
UPDATE `projects` p 
INNER JOIN `developers` d ON p.developer = d.name 
SET p.developer_id = d.id;

-- Step 3: Add foreign key constraint
ALTER TABLE `projects` 
ADD CONSTRAINT `fk_projects_developer` 
FOREIGN KEY (`developer_id`) REFERENCES `developers`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- Step 4: Create index for performance
CREATE INDEX `idx_projects_developer_id` ON `projects`(`developer_id`);

-- Step 5: Keep the old developer column for backward compatibility (optional)
-- You can remove this step if you want to completely replace the varchar developer field
-- ALTER TABLE `projects` DROP COLUMN `developer`;

-- Step 6: Create project_developers junction table for many-to-many relationships (future enhancement)
CREATE TABLE IF NOT EXISTS `project_developers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `developer_id` int(11) NOT NULL,
  `role` enum('Primary','Secondary','Consultant') DEFAULT 'Primary',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_project_developer` (`project_id`, `developer_id`),
  KEY `idx_project_id` (`project_id`),
  KEY `idx_developer_id` (`developer_id`),
  CONSTRAINT `fk_project_developers_project` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_project_developers_developer` FOREIGN KEY (`developer_id`) REFERENCES `developers` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Step 7: Populate project_developers table with existing relationships
INSERT INTO `project_developers` (`project_id`, `developer_id`, `role`)
SELECT p.id, p.developer_id, 'Primary'
FROM `projects` p
WHERE p.developer_id IS NOT NULL;

-- Step 8: Update developers table to maintain project count accuracy
UPDATE `developers` d 
SET d.projects_count = (
    SELECT COUNT(*) 
    FROM `projects` p 
    WHERE p.developer_id = d.id
)
WHERE d.id > 0;

-- Step 9: Create trigger to automatically update project count when projects are added/removed
DELIMITER //

CREATE TRIGGER `update_developer_project_count_insert` 
AFTER INSERT ON `projects`
FOR EACH ROW
BEGIN
    IF NEW.developer_id IS NOT NULL THEN
        UPDATE `developers` 
        SET projects_count = projects_count + 1 
        WHERE id = NEW.developer_id;
    END IF;
END//

CREATE TRIGGER `update_developer_project_count_update` 
AFTER UPDATE ON `projects`
FOR EACH ROW
BEGIN
    -- Decrease count for old developer
    IF OLD.developer_id IS NOT NULL AND OLD.developer_id != NEW.developer_id THEN
        UPDATE `developers` 
        SET projects_count = projects_count - 1 
        WHERE id = OLD.developer_id;
    END IF;
    
    -- Increase count for new developer
    IF NEW.developer_id IS NOT NULL AND OLD.developer_id != NEW.developer_id THEN
        UPDATE `developers` 
        SET projects_count = projects_count + 1 
        WHERE id = NEW.developer_id;
    END IF;
END//

CREATE TRIGGER `update_developer_project_count_delete` 
AFTER DELETE ON `projects`
FOR EACH ROW
BEGIN
    IF OLD.developer_id IS NOT NULL THEN
        UPDATE `developers` 
        SET projects_count = projects_count - 1 
        WHERE id = OLD.developer_id;
    END IF;
END//

DELIMITER ;

-- Step 10: Create view for easy project-developer queries
CREATE OR REPLACE VIEW `projects_with_developers` AS
SELECT 
    p.*,
    d.name as developer_name,
    d.slug as developer_slug,
    d.logo as developer_logo,
    d.established as developer_established,
    d.location as developer_location,
    d.website as developer_website,
    d.status as developer_status
FROM `projects` p
LEFT JOIN `developers` d ON p.developer_id = d.id;

-- Migration completed successfully!
-- This establishes proper referential integrity between projects and developers
-- with cascading deletion and automatic project count maintenance.