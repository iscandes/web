-- Update articles table to include additional fields for enhanced functionality
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS tags JSON DEFAULT NULL,
ADD COLUMN IF NOT EXISTS category VARCHAR(100) DEFAULT NULL,
ADD COLUMN IF NOT EXISTS read_time INT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS meta_description TEXT DEFAULT NULL,
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS views_count INT DEFAULT 0;

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_featured ON articles(featured);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);