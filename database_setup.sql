-- Premium Choice Real Estate Database Setup
-- Execute this SQL script in phpMyAdmin to set up the complete database

-- Set charset and collation
SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================
-- 1. USERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','editor','viewer') DEFAULT 'viewer',
  `name` varchar(255) NOT NULL,
  `last_login` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user
INSERT INTO `users` (`email`, `password_hash`, `role`, `name`, `is_active`) VALUES
('admin@example.com', 'Abedyr57..', 'admin', 'Admin', 1);

-- =============================================
-- 2. DEVELOPERS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `developers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `description` text,
  `logo` varchar(500) DEFAULT NULL,
  `established` varchar(50) DEFAULT NULL,
  `projects_count` int(11) DEFAULT 0,
  `location` varchar(255) DEFAULT NULL,
  `website` varchar(500) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `status` enum('Active','Inactive') DEFAULT 'Active',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample developers
INSERT INTO `developers` (`name`, `slug`, `description`, `logo`, `established`, `projects_count`, `location`, `website`, `phone`, `email`, `status`) VALUES
('Emaar Properties', 'emaar-properties', 'Leading real estate developer in Dubai', 'https://readdy.ai/assets/emaar-logo.png', '1997', 15, 'Dubai, UAE', 'https://www.emaar.com', '+971-4-367-3333', 'info@emaar.ae', 'Active'),
('DAMAC Properties', 'damac-properties', 'Luxury real estate developer', 'https://readdy.ai/assets/damac-logo.png', '2002', 12, 'Dubai, UAE', 'https://www.damacproperties.com', '+971-4-420-0000', 'info@damac.com', 'Active'),
('Nakheel', 'nakheel', 'Master developer of Dubai', 'https://readdy.ai/assets/nakheel-logo.png', '2000', 8, 'Dubai, UAE', 'https://www.nakheel.com', '+971-4-390-3333', 'info@nakheel.com', 'Active');

-- =============================================
-- 3. PROJECTS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `developer` varchar(255) NOT NULL,
  `location` varchar(255) NOT NULL,
  `price` varchar(100) NOT NULL,
  `status` enum('Available','Sold','Under Construction') DEFAULT 'Available',
  `bedrooms` int(11) NOT NULL,
  `bathrooms` int(11) NOT NULL,
  `area` varchar(50) NOT NULL,
  `description` text NOT NULL,
  `image` varchar(500) NOT NULL,
  `gallery` json DEFAULT NULL,
  `coordinates_lat` decimal(10,8) NOT NULL,
  `coordinates_lng` decimal(11,8) NOT NULL,
  `features` json DEFAULT NULL,
  `amenities` json DEFAULT NULL,
  `presentation_file` varchar(500) DEFAULT NULL,
  `presentation_url` varchar(500) DEFAULT NULL,
  `presentation_slides` json DEFAULT NULL,
  `presentation_animations` json DEFAULT NULL,
  `presentation_effects` json DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample projects
INSERT INTO `projects` (`name`, `slug`, `developer`, `location`, `price`, `status`, `bedrooms`, `bathrooms`, `area`, `description`, `image`, `gallery`, `coordinates_lat`, `coordinates_lng`, `features`, `amenities`) VALUES
('Dubai Hills Estate', 'dubai-hills-estate', 'Emaar Properties', 'Dubai Hills, Dubai', 'AED 2,500,000', 'Available', 3, 4, '2,200 sq ft', 'Luxury villa in the heart of Dubai Hills with stunning golf course views and premium amenities.', 'https://readdy.ai/assets/dubai-hills-1.jpg', '["https://readdy.ai/assets/dubai-hills-1.jpg", "https://readdy.ai/assets/dubai-hills-2.jpg", "https://readdy.ai/assets/dubai-hills-3.jpg"]', 25.11720000, 55.23650000, '["Golf Course View", "Private Garden", "Smart Home", "Premium Finishes"]', '["Swimming Pool", "Gym", "Kids Play Area", "24/7 Security", "Concierge Service"]'),
('Downtown Views', 'downtown-views', 'Emaar Properties', 'Downtown Dubai', 'AED 1,800,000', 'Available', 2, 3, '1,400 sq ft', 'Modern apartment with breathtaking views of Burj Khalifa and Dubai Fountain.', 'https://readdy.ai/assets/downtown-views-1.jpg', '["https://readdy.ai/assets/downtown-views-1.jpg", "https://readdy.ai/assets/downtown-views-2.jpg"]', 25.19750000, 55.27440000, '["Burj Khalifa View", "Dubai Fountain View", "Premium Location", "High Floor"]', '["Infinity Pool", "Spa", "Valet Parking", "Business Center"]'),
('DAMAC Hills Villas', 'damac-hills-villas', 'DAMAC Properties', 'DAMAC Hills, Dubai', 'AED 3,200,000', 'Under Construction', 4, 5, '3,500 sq ft', 'Spacious family villa with private pool and garden in a gated community.', 'https://readdy.ai/assets/damac-hills-1.jpg', '["https://readdy.ai/assets/damac-hills-1.jpg", "https://readdy.ai/assets/damac-hills-2.jpg", "https://readdy.ai/assets/damac-hills-3.jpg"]', 25.05580000, 55.20830000, '["Private Pool", "Garden", "Maid Room", "Study Room", "Garage"]', '["Golf Course", "Community Center", "Retail Outlets", "Schools Nearby"]');

-- =============================================
-- 4. HERO SECTIONS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `hero_sections` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `page` varchar(100) NOT NULL,
  `title` varchar(255) NOT NULL,
  `subtitle` varchar(255) DEFAULT NULL,
  `description` text,
  `background_image` varchar(500) NOT NULL,
  `cta_text` varchar(100) DEFAULT NULL,
  `cta_link` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert hero sections
INSERT INTO `hero_sections` (`page`, `title`, `subtitle`, `description`, `background_image`, `cta_text`, `cta_link`, `is_active`) VALUES
('home', 'Premium Choice Real Estate', 'Your Gateway to Luxury Living', 'Discover exceptional properties in Dubai\'s most prestigious locations', '/images/hero-background.jpg', 'Explore Properties', '/projects', 1),
('projects', 'Luxury Properties', 'Exceptional Real Estate Portfolio', 'Browse our curated collection of premium properties', '/images/projects-hero.jpg', 'View All Projects', '#projects', 1),
('about', 'About Premium Choice', 'Excellence in Real Estate', 'Your trusted partner in finding the perfect property', '/images/about-hero.jpg', 'Learn More', '#about', 1);

-- =============================================
-- 5. ARTICLES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `articles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `excerpt` text,
  `featured_image` varchar(500) DEFAULT NULL,
  `author` varchar(255) NOT NULL,
  `status` enum('draft','published','archived') DEFAULT 'draft',
  `published_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `slug` (`slug`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample articles
INSERT INTO `articles` (`title`, `slug`, `content`, `excerpt`, `featured_image`, `author`, `status`, `published_at`) VALUES
('Dubai Real Estate Market Trends 2024', 'dubai-real-estate-trends-2024', 'The Dubai real estate market continues to show strong growth...', 'Latest insights into Dubai\'s property market performance', '/images/articles/market-trends.jpg', 'Premium Choice Team', 'published', NOW()),
('Investment Guide: Buying Property in Dubai', 'investment-guide-dubai-property', 'A comprehensive guide for international investors...', 'Everything you need to know about property investment in Dubai', '/images/articles/investment-guide.jpg', 'Premium Choice Team', 'published', NOW());

-- =============================================
-- 6. MEDIA FILES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `media_files` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `filename` varchar(255) NOT NULL,
  `original_name` varchar(255) NOT NULL,
  `file_path` varchar(500) NOT NULL,
  `file_size` bigint(20) NOT NULL,
  `mime_type` varchar(100) NOT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `uploaded_by` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `uploaded_by` (`uploaded_by`),
  CONSTRAINT `media_files_ibfk_1` FOREIGN KEY (`uploaded_by`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 7. SYSTEM LOGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `system_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `level` enum('info','warning','error','success') NOT NULL,
  `category` varchar(100) NOT NULL,
  `message` text NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text,
  `details` json DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `timestamp` (`timestamp`),
  KEY `level` (`level`),
  CONSTRAINT `system_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 8. CHAT MESSAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `chat_messages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `session_id` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `response` text NOT NULL,
  `timestamp` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `response_time` int(11) NOT NULL,
  `user_ip` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `session_id` (`session_id`),
  KEY `timestamp` (`timestamp`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 9. PRESENTATION SLIDES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `presentation_slides` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `project_id` int(11) NOT NULL,
  `slide_number` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` text,
  `image_url` varchar(500) DEFAULT NULL,
  `animation_type` varchar(100) DEFAULT NULL,
  `duration` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `project_id` (`project_id`),
  CONSTRAINT `presentation_slides_ibfk_1` FOREIGN KEY (`project_id`) REFERENCES `projects` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- 10. SITE SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `site_name` varchar(255) NOT NULL DEFAULT 'Cinematic Real Estate',
  `site_description` text,
  `site_logo` varchar(500) DEFAULT NULL,
  `favicon` varchar(500) DEFAULT NULL,
  `contact_email` varchar(255) NOT NULL,
  `contact_phone` varchar(50) DEFAULT NULL,
  `contact_address` text,
  `social_facebook` varchar(500) DEFAULT NULL,
  `social_twitter` varchar(500) DEFAULT NULL,
  `social_instagram` varchar(500) DEFAULT NULL,
  `social_linkedin` varchar(500) DEFAULT NULL,
  `social_youtube` varchar(500) DEFAULT NULL,
  `meta_title` varchar(255) NOT NULL,
  `meta_description` text NOT NULL,
  `meta_keywords` text,
  `google_analytics_id` varchar(100) DEFAULT NULL,
  `google_maps_api_key` varchar(255) DEFAULT NULL,
  `maintenance_mode` tinyint(1) DEFAULT 0,
  `maintenance_message` text,
  `theme_primary_color` varchar(7) DEFAULT '#005f6b',
  `theme_secondary_color` varchar(7) DEFAULT '#00a676',
  `currency` varchar(10) DEFAULT 'AED',
  `timezone` varchar(50) DEFAULT 'Asia/Dubai',
  `language` varchar(10) DEFAULT 'en',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default site settings
INSERT INTO `site_settings` (
  `site_name`, `site_description`, `contact_email`, `meta_title`, `meta_description`, `meta_keywords`
) VALUES (
  'Cinematic Real Estate',
  'Luxury real estate platform with cinematic presentations showcasing premium properties in Dubai and UAE',
  'info@cinematicrealestate.com',
  'Cinematic Real Estate - Luxury Properties in Dubai',
  'Discover luxury real estate with cinematic presentations. Premium properties, villas, and apartments in Dubai with immersive virtual tours.',
  'real estate, luxury properties, dubai, villas, apartments, cinematic presentations, virtual tours, premium real estate'
);

-- =============================================
-- ENABLE FOREIGN KEY CHECKS
-- =============================================
SET FOREIGN_KEY_CHECKS = 1;

-- =============================================
-- CREATE INDEXES FOR PERFORMANCE
-- =============================================
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_developer ON projects(developer);
CREATE INDEX idx_projects_location ON projects(location);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_active ON users(is_active);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_published ON articles(published_at);

-- =============================================
-- SETUP COMPLETE
-- =============================================
-- Database setup completed successfully!
-- Default admin login: admin@example.com / Abedyr57..