-- Migration script to add video_settings table
-- Execute this SQL script in phpMyAdmin to add video settings functionality

-- =============================================
-- VIDEO SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `video_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `video_type` enum('upload','youtube') NOT NULL DEFAULT 'youtube',
  `video_url` varchar(1000) NOT NULL,
  `youtube_url` varchar(1000) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `is_active` (`is_active`),
  KEY `video_type` (`video_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default video settings
INSERT INTO `video_settings` (`video_type`, `video_url`, `youtube_url`, `title`, `description`, `is_active`) VALUES
('youtube', 'https://www.youtube.com/embed/v0rr-M0WfpM?si=nwaZehMCd80OHBqr&autoplay=1&mute=1&loop=1&playlist=v0rr-M0WfpM&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=1', 'https://www.youtube.com/watch?v=v0rr-M0WfpM', 'Dubai Ultra HD Background Video', 'Premium real estate showcase video for the landing page', 1);

-- Create index for performance
CREATE INDEX idx_video_settings_active ON video_settings(is_active);
CREATE INDEX idx_video_settings_type ON video_settings(video_type);