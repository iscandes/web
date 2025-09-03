-- Complete AI API Settings Table Setup Script
-- This script creates the ai_api_settings table with all required columns
-- Execute this SQL script in your database to set up AI API control functionality

-- =============================================
-- CREATE AI API SETTINGS TABLE
-- =============================================
CREATE TABLE IF NOT EXISTS `ai_api_settings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  
  -- OpenAI Settings
  `openai_api_key` varchar(255) DEFAULT NULL,
  `openai_model` varchar(100) DEFAULT 'gpt-3.5-turbo',
  `openai_max_tokens` int(11) DEFAULT 1000,
  `openai_temperature` decimal(3,2) DEFAULT 0.70,
  
  -- Google Gemini Settings
  `gemini_api_key` varchar(255) DEFAULT NULL,
  `gemini_model` varchar(100) DEFAULT 'gemini-pro',
  `gemini_max_tokens` int(11) DEFAULT 1000,
  `gemini_temperature` decimal(3,2) DEFAULT 0.70,
  
  -- Anthropic Claude Settings
  `claude_api_key` varchar(255) DEFAULT NULL,
  `claude_model` varchar(100) DEFAULT 'claude-3-sonnet-20240229',
  `claude_max_tokens` int(11) DEFAULT 1000,
  `claude_temperature` decimal(3,2) DEFAULT 0.70,
  
  -- DeepSeek Settings
  `deepseek_api_key` varchar(255) DEFAULT NULL,
  `deepseek_model` varchar(100) DEFAULT 'deepseek-chat',
  `deepseek_max_tokens` int(11) DEFAULT 1000,
  `deepseek_temperature` decimal(3,2) DEFAULT 0.70,
  
  -- AI Behavior Settings
  `system_prompt` text DEFAULT 'You are an expert real estate consultant with deep knowledge of the Dubai and UAE property market. You have access to our current property portfolio and developer information. Always provide professional, accurate, and helpful advice to clients.',
  `property_suggestions_enabled` tinyint(1) DEFAULT 1,
  `property_suggestions_count` int(11) DEFAULT 4,
  `contact_info_in_responses` tinyint(1) DEFAULT 1,
  
  -- General Settings
  `default_provider` enum('openai','gemini','claude','deepseek') DEFAULT 'openai',
  `ai_enabled` tinyint(1) DEFAULT 1,
  `rate_limit_per_minute` int(11) DEFAULT 10,
  `rate_limit_per_hour` int(11) DEFAULT 100,
  
  -- Timestamps
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- INSERT DEFAULT SETTINGS
-- =============================================
INSERT IGNORE INTO `ai_api_settings` (
  `openai_api_key`, `openai_model`, `openai_max_tokens`, `openai_temperature`,
  `gemini_api_key`, `gemini_model`, `gemini_max_tokens`, `gemini_temperature`,
  `claude_api_key`, `claude_model`, `claude_max_tokens`, `claude_temperature`,
  `deepseek_api_key`, `deepseek_model`, `deepseek_max_tokens`, `deepseek_temperature`,
  `system_prompt`, `property_suggestions_enabled`, `property_suggestions_count`, `contact_info_in_responses`,
  `default_provider`, `ai_enabled`, `rate_limit_per_minute`, `rate_limit_per_hour`
) VALUES (
  NULL, 'gpt-3.5-turbo', 1000, 0.70,
  NULL, 'gemini-pro', 1000, 0.70,
  NULL, 'claude-3-sonnet-20240229', 1000, 0.70,
  NULL, 'deepseek-chat', 1000, 0.70,
  'You are an expert real estate consultant with deep knowledge of the Dubai and UAE property market. You have access to our current property portfolio and developer information. Always provide professional, accurate, and helpful advice to clients. When relevant, include our contact information for further assistance.',
  1, 4, 1,
  'openai', 1, 10, 100
);

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these to verify the table was created successfully:
-- DESCRIBE ai_api_settings;
-- SELECT * FROM ai_api_settings;
-- SELECT COUNT(*) as ai_settings_count FROM ai_api_settings;
-- SHOW TABLES LIKE '%ai_api_settings%';

-- =============================================
-- NOTES
-- =============================================
-- 1. This script uses INSERT IGNORE to prevent duplicate entries
-- 2. API keys are set to NULL for security - configure them in the admin panel
-- 3. Default models and parameters are set to reasonable values
-- 4. The system prompt is optimized for real estate consultation
-- 5. Property suggestions and contact info are enabled by default