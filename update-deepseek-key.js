const mysql = require('mysql2/promise');

async function updateDeepSeekKey() {
  const connection = await mysql.createConnection({
    host: 'srv1558.hstgr.io',
    user: 'u485564989_pcrs',
    password: 'Abedyr57..',
    database: 'u485564989_pcrs',
    port: 3306
  });

  try {
    console.log('Connected to database successfully!');
    
    // Update with a proper test API key format
    const testApiKey = 'sk-0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
    
    const [result] = await connection.execute(
      "UPDATE ai_api_settings SET deepseek_api_key = ?, updated_at = NOW() WHERE id IS NOT NULL",
      [testApiKey]
    );
    
    console.log('✅ DeepSeek API key updated successfully');
    console.log('Rows affected:', result.affectedRows);
    
    // Verify the update
    const [settings] = await connection.execute(
      "SELECT deepseek_api_key, deepseek_model, default_provider, ai_enabled FROM ai_api_settings ORDER BY created_at DESC LIMIT 1"
    );
    
    if (settings.length > 0) {
      const setting = settings[0];
      console.log('\n📊 Updated settings:');
      console.log(`  AI Enabled: ${setting.ai_enabled}`);
      console.log(`  Default Provider: ${setting.default_provider}`);
      console.log(`  DeepSeek API Key: ${setting.deepseek_api_key.substring(0, 10)}...`);
      console.log(`  DeepSeek Model: ${setting.deepseek_model}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

updateDeepSeekKey().catch(console.error);