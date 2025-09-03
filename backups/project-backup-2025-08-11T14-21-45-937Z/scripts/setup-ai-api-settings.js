const mysql = require('mysql2/promise');
require('dotenv').config({ path: '.env.local' });

async function setupAIApiSettings() {
  let connection;
  
  try {
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'premium_choice_real_estate',
      charset: 'utf8mb4'
    });

    console.log('✅ Connected to database');

    // Create the ai_api_settings table
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS \`ai_api_settings\` (
        \`id\` int(11) NOT NULL AUTO_INCREMENT,
        
        -- OpenAI Settings
        \`openai_api_key\` varchar(255) DEFAULT NULL,
        \`openai_model\` varchar(100) DEFAULT 'gpt-3.5-turbo',
        \`openai_max_tokens\` int(11) DEFAULT 1000,
        \`openai_temperature\` decimal(3,2) DEFAULT 0.70,
        
        -- Google Gemini Settings
        \`gemini_api_key\` varchar(255) DEFAULT NULL,
        \`gemini_model\` varchar(100) DEFAULT 'gemini-pro',
        \`gemini_max_tokens\` int(11) DEFAULT 1000,
        \`gemini_temperature\` decimal(3,2) DEFAULT 0.70,
        
        -- Anthropic Claude Settings
        \`claude_api_key\` varchar(255) DEFAULT NULL,
        \`claude_model\` varchar(100) DEFAULT 'claude-3-sonnet-20240229',
        \`claude_max_tokens\` int(11) DEFAULT 1000,
        \`claude_temperature\` decimal(3,2) DEFAULT 0.70,
        
        -- DeepSeek Settings
        \`deepseek_api_key\` varchar(255) DEFAULT NULL,
        \`deepseek_model\` varchar(100) DEFAULT 'deepseek-chat',
        \`deepseek_max_tokens\` int(11) DEFAULT 1000,
        \`deepseek_temperature\` decimal(3,2) DEFAULT 0.70,
        
        -- AI Behavior Settings
        \`system_prompt\` text DEFAULT 'You are an expert real estate consultant with deep knowledge of the Dubai and UAE property market. You have access to our current property portfolio and developer information. Always provide professional, accurate, and helpful advice to clients. When relevant, include our contact information for further assistance.',
        \`property_suggestions_enabled\` tinyint(1) DEFAULT 1,
        \`property_suggestions_count\` int(11) DEFAULT 4,
        \`contact_info_in_responses\` tinyint(1) DEFAULT 1,
        
        -- General Settings
        \`default_provider\` enum('openai','gemini','claude','deepseek') DEFAULT 'openai',
        \`ai_enabled\` tinyint(1) DEFAULT 1,
        \`rate_limit_per_minute\` int(11) DEFAULT 10,
        \`rate_limit_per_hour\` int(11) DEFAULT 100,
        
        -- Timestamps
        \`created_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updated_at\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        PRIMARY KEY (\`id\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;

    await connection.execute(createTableSQL);
    console.log('✅ ai_api_settings table created successfully');

    // Check if default record exists
    const [existingRows] = await connection.execute('SELECT id FROM ai_api_settings LIMIT 1');
    
    if (existingRows.length === 0) {
      // Insert default settings
      const insertDefaultSQL = `
        INSERT INTO \`ai_api_settings\` (
          \`openai_api_key\`, \`openai_model\`, \`openai_max_tokens\`, \`openai_temperature\`,
          \`gemini_api_key\`, \`gemini_model\`, \`gemini_max_tokens\`, \`gemini_temperature\`,
          \`claude_api_key\`, \`claude_model\`, \`claude_max_tokens\`, \`claude_temperature\`,
          \`deepseek_api_key\`, \`deepseek_model\`, \`deepseek_max_tokens\`, \`deepseek_temperature\`,
          \`system_prompt\`, \`property_suggestions_enabled\`, \`property_suggestions_count\`, \`contact_info_in_responses\`,
          \`default_provider\`, \`ai_enabled\`, \`rate_limit_per_minute\`, \`rate_limit_per_hour\`
        ) VALUES (
          NULL, 'gpt-3.5-turbo', 1000, 0.70,
          NULL, 'gemini-pro', 1000, 0.70,
          NULL, 'claude-3-sonnet-20240229', 1000, 0.70,
          NULL, 'deepseek-chat', 1000, 0.70,
          'You are an expert real estate consultant with deep knowledge of the Dubai and UAE property market. You have access to our current property portfolio and developer information. Always provide professional, accurate, and helpful advice to clients. When relevant, include our contact information for further assistance.',
          1, 4, 1,
          'openai', 1, 10, 100
        )
      `;

      await connection.execute(insertDefaultSQL);
      console.log('✅ Default AI API settings inserted successfully');
    } else {
      console.log('ℹ️  Default settings already exist, skipping insert');
    }

    // Verify the setup
    const [verifyRows] = await connection.execute('SELECT * FROM ai_api_settings');
    console.log('✅ Setup verification:');
    console.log(`   - Table exists: YES`);
    console.log(`   - Records count: ${verifyRows.length}`);
    console.log(`   - Default provider: ${verifyRows[0]?.default_provider || 'N/A'}`);
    console.log(`   - AI enabled: ${verifyRows[0]?.ai_enabled ? 'YES' : 'NO'}`);

    console.log('\n🎉 AI API Settings table setup completed successfully!');
    console.log('📝 You can now configure your API keys in the admin panel at /admin');

  } catch (error) {
    console.error('❌ Error setting up AI API settings table:', error);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n💡 Database connection failed. Please check:');
      console.log('   - Database credentials in .env.local file');
      console.log('   - Database server is running');
      console.log('   - User has proper permissions');
    } else if (error.code === 'ER_BAD_DB_ERROR') {
      console.log('\n💡 Database does not exist. Please:');
      console.log('   - Create the database first');
      console.log('   - Check the DB_NAME in .env.local file');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the setup
setupAIApiSettings();