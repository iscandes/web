-- Update Projects Table for Dynamic Project Page
-- Add new fields for cinematic presentation and dynamic theming

ALTER TABLE `projects` 
ADD COLUMN `type` ENUM('Villa', 'Apartment', 'Town House', 'Commercial') DEFAULT 'Apartment' AFTER `developer`,
ADD COLUMN `studios` INT DEFAULT 0 AFTER `bathrooms`,
ADD COLUMN `property_types` JSON DEFAULT NULL AFTER `amenities`,
ADD COLUMN `sub_projects` JSON DEFAULT NULL AFTER `property_types`,
ADD COLUMN `brochure_url` VARCHAR(500) DEFAULT NULL AFTER `sub_projects`,
ADD COLUMN `theme_color` VARCHAR(7) DEFAULT '#005f6b' AFTER `brochure_url`,
ADD COLUMN `voice_over_url` VARCHAR(500) DEFAULT NULL AFTER `theme_color`;

-- Update presentation_slides table to include voice-over per slide
ALTER TABLE `presentation_slides`
ADD COLUMN `description` TEXT DEFAULT NULL AFTER `content`,
ADD COLUMN `background_image` VARCHAR(500) DEFAULT NULL AFTER `description`,
ADD COLUMN `voice_over_url` VARCHAR(500) DEFAULT NULL AFTER `background_image`,
MODIFY COLUMN `content` TEXT DEFAULT NULL;

-- Update existing projects with new fields
UPDATE `projects` SET 
  `type` = 'Villa',
  `property_types` = '["3 Bedroom Villa", "4 Bedroom Villa", "Penthouse"]',
  `theme_color` = '#d4af37'
WHERE `slug` = 'dubai-hills-estate';

UPDATE `projects` SET 
  `type` = 'Apartment',
  `property_types` = '["1 Bedroom", "2 Bedroom", "3 Bedroom", "Penthouse"]',
  `theme_color` = '#1e3a8a'
WHERE `slug` = 'downtown-views';

UPDATE `projects` SET 
  `type` = 'Villa',
  `property_types` = '["4 Bedroom Villa", "5 Bedroom Villa", "Mansion"]',
  `sub_projects` = '["Phase 1", "Phase 2", "Golf Villas"]',
  `theme_color` = '#059669'
WHERE `slug` = 'damac-hills-villas';

-- Insert sample presentation slides
INSERT INTO `presentation_slides` (`project_id`, `slide_number`, `title`, `description`, `background_image`) VALUES
(1, 1, 'Welcome to Dubai Hills Estate', 'Experience luxury living in the heart of Dubai with stunning golf course views and world-class amenities.', 'https://readdy.ai/assets/dubai-hills-slide-1.jpg'),
(1, 2, 'Premium Amenities', 'Enjoy access to championship golf course, swimming pools, fitness centers, and exclusive dining options.', 'https://readdy.ai/assets/dubai-hills-slide-2.jpg'),
(1, 3, 'Your Dream Home Awaits', 'Choose from our collection of 3 and 4 bedroom villas with private gardens and premium finishes.', 'https://readdy.ai/assets/dubai-hills-slide-3.jpg'),

(2, 1, 'Downtown Views - Urban Luxury', 'Live in the heart of Dubai with breathtaking views of Burj Khalifa and Dubai Fountain.', 'https://readdy.ai/assets/downtown-views-slide-1.jpg'),
(2, 2, 'Iconic Views', 'Wake up to stunning views of the world\'s tallest building and enjoy front-row seats to the Dubai Fountain show.', 'https://readdy.ai/assets/downtown-views-slide-2.jpg'),
(2, 3, 'Premium Location', 'Steps away from Dubai Mall, world-class dining, and the best entertainment Dubai has to offer.', 'https://readdy.ai/assets/downtown-views-slide-3.jpg'),

(3, 1, 'DAMAC Hills - Family Paradise', 'Discover spacious family villas in a secure, gated community with world-class amenities.', 'https://readdy.ai/assets/damac-hills-slide-1.jpg'),
(3, 2, 'Golf Course Living', 'Enjoy direct access to the championship golf course and exclusive clubhouse facilities.', 'https://readdy.ai/assets/damac-hills-slide-2.jpg'),
(3, 3, 'Community Lifestyle', 'Experience resort-style living with swimming pools, parks, retail outlets, and top-rated schools.', 'https://readdy.ai/assets/damac-hills-slide-3.jpg');