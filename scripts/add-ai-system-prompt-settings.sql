-- Migration script to add system prompt and property suggestions settings
-- Execute this SQL script to add AI system prompt control to admin dashboard

-- Add system prompt and property suggestions columns to ai_api_settings table
ALTER TABLE `ai_api_settings` 
ADD COLUMN `system_prompt` TEXT DEFAULT 'You are an expert real estate consultant with deep knowledge of the Dubai and UAE property market. Provide professional, accurate, and helpful advice to clients.' AFTER `anthropic_temperature`,
ADD COLUMN `property_suggestions_enabled` TINYINT(1) DEFAULT 1 AFTER `system_prompt`,
ADD COLUMN `property_suggestions_count` INT(11) DEFAULT 4 AFTER `property_suggestions_enabled`,


-- Update existing record with default values if it exists
UPDATE `ai_api_settings` SET 
  `system_prompt` = 'You are an expert real estate consultant with deep knowledge of the Dubai and UAE property market. You have access to our current property portfolio and developer information. Always provide professional, accurate, and helpful advice to clients.',
  `property_suggestions_enabled` = 1,
  `property_suggestions_count` = 4,

WHERE `id` = 1;

-- If no record exists, insert default settings
INSERT IGNORE INTO `ai_api_settings` (
  `openai_api_key`, `openai_model`, `openai_max_tokens`, `openai_temperature`,
  `google_api_key`, `google_model`, `google_max_tokens`, `google_temperature`,
  `anthropic_api_key`, `anthropic_model`, `anthropic_max_tokens`, `anthropic_temperature`,
  `system_prompt`, `property_suggestions_enabled`, `property_suggestions_count`,
  `default_provider`, `ai_enabled`, `rate_limit_per_minute`, `rate_limit_per_hour`
) VALUES (
  NULL, 'gpt-3.5-turbo', 1000, 0.70,
  NULL, 'gemini-pro', 1000, 0.70,
  NULL, 'claude-3-sonnet-20240229', 1000, 0.70,
  'You are an expert real estate consultant with deep knowledge of the Dubai and UAE property market. You have access to our current property portfolio and developer information. Always provide professional, accurate, and helpful advice to clients.',
  1, 4,
  'openai', 1, 10, 100
);