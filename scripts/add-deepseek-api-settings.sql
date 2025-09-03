-- Migration script to add DeepSeek API settings to ai_api_settings table
-- Execute this SQL script to add DeepSeek support to the AI API control

-- Add DeepSeek columns to ai_api_settings table
ALTER TABLE `ai_api_settings` 
ADD COLUMN `deepseek_api_key` VARCHAR(255) DEFAULT NULL AFTER `anthropic_temperature`,
ADD COLUMN `deepseek_model` VARCHAR(100) DEFAULT 'deepseek-chat' AFTER `deepseek_api_key`,
ADD COLUMN `deepseek_max_tokens` INT(11) DEFAULT 1000 AFTER `deepseek_model`,
ADD COLUMN `deepseek_temperature` DECIMAL(3,2) DEFAULT 0.70 AFTER `deepseek_max_tokens`;

-- Update the default_provider enum to include deepseek
ALTER TABLE `ai_api_settings` 
MODIFY COLUMN `default_provider` ENUM('openai','google','anthropic','deepseek') DEFAULT 'openai';

-- Update existing record with default DeepSeek values if it exists
UPDATE `ai_api_settings` SET 
  `deepseek_api_key` = NULL,
  `deepseek_model` = 'deepseek-chat',
  `deepseek_max_tokens` = 1000,
  `deepseek_temperature` = 0.70
WHERE `id` IS NOT NULL;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================
-- Run these to verify the columns were added successfully:
-- DESCRIBE ai_api_settings;
-- SELECT * FROM ai_api_settings;
-- SHOW COLUMNS FROM ai_api_settings LIKE '%deepseek%';