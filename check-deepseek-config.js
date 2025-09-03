const mysql = require('mysql2/promise');

async function checkDeepSeekConfig() {
  const connection = await mysql.createConnection({
    host: 'srv1558.hstgr.io',
    user: 'u485564989_pcrs',
    password: 'Abedyr57..',
    database: 'u485564989_pcrs',
    port: 3306
  });

  try {
    console.log('Connected to database successfully!');
    
    // Check if ai_api_settings table exists
    const [tables] = await connection.execute(
      "SHOW TABLES LIKE 'ai_api_settings'"
    );
    
    if (tables.length === 0) {
      console.log('❌ ai_api_settings table does not exist');
      return;
    }
    
    console.log('✅ ai_api_settings table exists');
    
    // Check table structure
    const [columns] = await connection.execute(
      "DESCRIBE ai_api_settings"
    );
    
    console.log('\n📋 Table structure:');
    columns.forEach(col => {
      console.log(`  ${col.Field}: ${col.Type} ${col.Null === 'YES' ? '(nullable)' : '(not null)'} ${col.Default ? `default: ${col.Default}` : ''}`);
    });
    
    // Check current settings
    const [settings] = await connection.execute(
      "SELECT * FROM ai_api_settings ORDER BY created_at DESC LIMIT 1"
    );
    
    if (settings.length === 0) {
      console.log('\n❌ No AI settings found in database');
      
      // Create default settings
      console.log('🔧 Creating default AI settings...');
      await connection.execute(`
        INSERT INTO ai_api_settings (
          ai_enabled, 
          default_provider, 
          deepseek_api_key, 
          deepseek_model, 
          deepseek_max_tokens, 
          deepseek_temperature,
          created_at,
          updated_at
        ) VALUES (
          1, 
          'deepseek', 
          'sk-test-key-placeholder', 
          'deepseek-chat', 
          1000, 
          0.70,
          NOW(),
          NOW()
        )
      `);
      console.log('✅ Default AI settings created');
    } else {
      console.log('\n📊 Current AI settings:');
      const setting = settings[0];
      console.log(`  AI Enabled: ${setting.ai_enabled}`);
      console.log(`  Default Provider: ${setting.default_provider}`);
      console.log(`  DeepSeek API Key: ${setting.deepseek_api_key ? '***configured***' : 'NOT SET'}`);
      console.log(`  DeepSeek Model: ${setting.deepseek_model}`);
      console.log(`  DeepSeek Max Tokens: ${setting.deepseek_max_tokens}`);
      console.log(`  DeepSeek Temperature: ${setting.deepseek_temperature}`);
      
      // Update to use DeepSeek as default if not already
      if (setting.default_provider !== 'deepseek') {
        console.log('🔧 Updating default provider to DeepSeek...');
        await connection.execute(
          "UPDATE ai_api_settings SET default_provider = 'deepseek', updated_at = NOW() WHERE id = ?",
          [setting.id]
        );
        console.log('✅ Default provider updated to DeepSeek');
      }
      
      // Add a test API key if none exists
      if (!setting.deepseek_api_key || setting.deepseek_api_key === 'NULL') {
        console.log('🔧 Adding test DeepSeek API key...');
        await connection.execute(
          "UPDATE ai_api_settings SET deepseek_api_key = 'sk-test-key-placeholder', updated_at = NOW() WHERE id = ?",
          [setting.id]
        );
        console.log('✅ Test API key added');
      }
    }
    
    // Final verification
    const [finalSettings] = await connection.execute(
      "SELECT * FROM ai_api_settings ORDER BY created_at DESC LIMIT 1"
    );
    
    console.log('\n🎯 Final configuration:');
    if (finalSettings.length > 0) {
      const setting = finalSettings[0];
      console.log(`  ✅ AI Enabled: ${setting.ai_enabled}`);
      console.log(`  ✅ Default Provider: ${setting.default_provider}`);
      console.log(`  ✅ DeepSeek API Key: ${setting.deepseek_api_key ? 'configured' : 'NOT SET'}`);
      console.log(`  ✅ DeepSeek Model: ${setting.deepseek_model}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkDeepSeekConfig().catch(console.error);