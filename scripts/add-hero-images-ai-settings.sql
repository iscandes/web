-- Migration script to add hero_images and ai_api_settings tables
-- Execute this SQL script in phpMyAdmin to add the new tables

-- =============================================
-- HERO IMAGES TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `hero_images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `url` varchar(500) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `alt_text` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `order_index` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  INDEX `idx_active_order` (`is_active`, `order_index`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- AI API SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `ai_api_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openai_api_key` varchar(255) DEFAULT NULL,
  `openai_model` varchar(100) DEFAULT 'gpt-3.5-turbo',
  `openai_max_tokens` int(11) DEFAULT 1000,
  `openai_temperature` decimal(3,2) DEFAULT 0.70,
  `google_api_key` varchar(255) DEFAULT NULL,
  `google_model` varchar(100) DEFAULT 'gemini-pro',
  `google_max_tokens` int(11) DEFAULT 1000,
  `google_temperature` decimal(3,2) DEFAULT 0.70,
  `anthropic_api_key` varchar(255) DEFAULT NULL,
  `anthropic_model` varchar(100) DEFAULT 'claude-3-sonnet-20240229',
  `anthropic_max_tokens` int(11) DEFAULT 1000,
  `anthropic_temperature` decimal(3,2) DEFAULT 0.70,
  `default_provider` enum('openai','google','anthropic') DEFAULT 'openai',
  `ai_enabled` tinyint(1) DEFAULT 1,
  `rate_limit_per_minute` int(11) DEFAULT 10,
  `rate_limit_per_hour` int(11) DEFAULT 100,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- INSERT DEFAULT DATA
-- =============================================

-- Insert default hero images (using the fallback images from the component)
INSERT INTO `hero_images` (`url`, `title`, `description`, `alt_text`, `is_active`, `order_index`) VALUES
('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1920&h=1080&fit=crop', 'Dubai Marina Skyline', 'Stunning view of Dubai Marina with modern skyscrapers', 'Dubai Marina skyline with luxury buildings', 1, 1),
('https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=1920&h=1080&fit=crop', 'Burj Khalifa District', 'Iconic Burj Khalifa and surrounding luxury developments', 'Burj Khalifa tower in Dubai downtown', 1, 2),
('https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1920&h=1080&fit=crop', 'Palm Jumeirah Luxury', 'Exclusive properties on the world-famous Palm Jumeirah', 'Palm Jumeirah artificial island luxury properties', 1, 3),
('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=1920&h=1080&fit=crop', 'Dubai Marina Waterfront', 'Waterfront luxury living in Dubai Marina', 'Dubai Marina waterfront with yachts and buildings', 1, 4),
('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&h=1080&fit=crop', 'Business Bay District', 'Modern business district with premium residential options', 'Business Bay area with modern architecture', 1, 5);

-- Insert default AI API settings (with empty API keys for security)
INSERT INTO `ai_api_settings` (
  `openai_api_key`, `openai_model`, `openai_max_tokens`, `openai_temperature`,
  `google_api_key`, `google_model`, `google_max_tokens`, `google_temperature`,
  `anthropic_api_key`, `anthropic_model`, `anthropic_max_tokens`, `anthropic_temperature`,
  `default_provider`, `ai_enabled`, `rate_limit_per_minute`, `rate_limit_per_hour`
) VALUES (
  NULL, 'gpt-3.5-turbo', 1000, 0.70,
  NULL, 'gemini-pro', 1000, 0.70,
  NULL, 'claude-3-sonnet-20240229', 1000, 0.70,
  'openai', 1, 10, 100
);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these to verify the tables were created successfully:
-- SELECT COUNT(*) as hero_images_count FROM hero_images;
-- SELECT COUNT(*) as ai_settings_count FROM ai_api_settings;
-- SHOW TABLES LIKE '%hero_images%';
-- SHOW TABLES LIKE '%ai_api_settings%';