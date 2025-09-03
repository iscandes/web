'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiSettings, 
  FiSave, 
  FiRefreshCw, 
  FiEye, 
  FiEyeOff,
  FiKey,
  FiGlobe,
  FiCpu,
  FiZap
} from 'react-icons/fi';

import { AIApiSettings } from '@/lib/mysql-database';

const AIApiControlContent: React.FC = () => {
  const [settings, setSettings] = useState({
    deepseek_api_key: '',
    deepseek_model: 'deepseek-chat',
    deepseek_max_tokens: 1000,
    deepseek_temperature: 0.7,
    default_provider: 'deepseek',
    ai_enabled: true,
    rate_limit_per_minute: 10,
    rate_limit_per_hour: 100,
    system_prompt: 'You are an expert real estate consultant with deep knowledge of the Dubai and UAE property market.',
    property_suggestions_enabled: true,
    property_suggestions_count: 4,
    contact_info_in_responses: true
  });

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [showApiKeys, setShowApiKeys] = useState({
    deepseek: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/ai-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data) {
          setSettings(data.data);
        }
      }
    } catch (error) {
      console.error('Error fetching AI settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/ai-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        alert('AI API settings saved successfully!');
      } else {
        alert('Failed to save AI API settings');
      }
    } catch (error) {
      console.error('Error saving AI settings:', error);
      alert('Error saving AI API settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof AIApiSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const toggleApiKeyVisibility = (provider: 'deepseek') => {
    setShowApiKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const testConnection = async (provider: string) => {
    if (provider !== 'deepseek') {
      alert('Only DeepSeek provider is supported');
      return;
    }
    
    try {
      const response = await fetch('/api/admin/ai-settings/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ provider, settings }),
      });

      const data = await response.json();
      if (data.success) {
        alert('DeepSeek connection successful!');
      } else {
        alert(`DeepSeek connection failed: ${data.message}`);
      }
    } catch (error) {
      alert('Error testing DeepSeek connection');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <FiRefreshCw className="animate-spin text-2xl text-blue-600" />
        <span className="ml-2 text-gray-600">Loading AI settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FiCpu className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">AI API Control</h2>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
          <span>{saving ? 'Saving...' : 'Save Settings'}</span>
        </motion.button>
      </div>

      {/* General Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <FiSettings className="mr-2" />
          General Settings
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AI Enabled
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={settings.ai_enabled}
                onChange={(e) => handleInputChange('ai_enabled', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-600">Enable AI features</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default AI Provider
            </label>
            <select
              value={settings.default_provider}
              onChange={(e) => handleInputChange('default_provider', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="deepseek">DeepSeek</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rate Limit (per minute)
            </label>
            <input
              type="number"
              value={settings.rate_limit_per_minute}
              onChange={(e) => handleInputChange('rate_limit_per_minute', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rate Limit (per hour)
            </label>
            <input
              type="number"
              value={settings.rate_limit_per_hour}
              onChange={(e) => handleInputChange('rate_limit_per_hour', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="1000"
            />
          </div>
        </div>
      </motion.div>



      {/* DeepSeek Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <FiZap className="mr-2 text-orange-600" />
          DeepSeek Configuration
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showApiKeys.deepseek ? 'text' : 'password'}
                value={settings.deepseek_api_key}
                onChange={(e) => handleInputChange('deepseek_api_key', e.target.value)}
                className="w-full px-3 py-2 pr-20 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="sk-..."
              />
              <div className="absolute right-2 top-2 flex space-x-1">
                <button
                  type="button"
                  onClick={() => toggleApiKeyVisibility('deepseek')}
                  className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                >
                  {showApiKeys.deepseek ? <FiEyeOff /> : <FiEye />}
                </button>
                <button
                  type="button"
                  onClick={() => testConnection('deepseek')}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <FiGlobe />
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Model
            </label>
            <select
              value={settings.deepseek_model}
              onChange={(e) => handleInputChange('deepseek_model', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="deepseek-chat">DeepSeek Chat</option>
              <option value="deepseek-coder">DeepSeek Coder</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Max Tokens
            </label>
            <input
              type="number"
              value={settings.deepseek_max_tokens}
              onChange={(e) => handleInputChange('deepseek_max_tokens', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="1"
              max="4000"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Temperature
            </label>
            <input
              type="number"
              step="0.1"
              value={settings.deepseek_temperature}
              onChange={(e) => handleInputChange('deepseek_temperature', parseFloat(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              max="2"
            />
          </div>
        </div>
      </motion.div>

      {/* AI Behavior Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6"
      >
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
          <FiZap className="mr-2 text-indigo-600" />
          AI Behavior Configuration
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              System Prompt
            </label>
            <textarea
              value={settings.system_prompt}
              onChange={(e) => handleInputChange('system_prompt', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={4}
              placeholder="Define how the AI should behave and respond to users..."
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              This prompt defines the AI&apos;s personality and expertise. It will be used for all AI responses.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="property_suggestions_enabled"
                checked={settings.property_suggestions_enabled}
                onChange={(e) => handleInputChange('property_suggestions_enabled', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
              />
              <label htmlFor="property_suggestions_enabled" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Enable Property Suggestions
              </label>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Suggestions Count
              </label>
              <input
                type="number"
                value={settings.property_suggestions_count}
                onChange={(e) => handleInputChange('property_suggestions_count', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="1"
                max="10"
                disabled={!settings.property_suggestions_enabled}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="contact_info_in_responses"
                checked={settings.contact_info_in_responses}
                onChange={(e) => handleInputChange('contact_info_in_responses', e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded"
              />
              <label htmlFor="contact_info_in_responses" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Include Contact Info
              </label>
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md p-3">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              <strong>Property Suggestions:</strong> When enabled, the AI will suggest relevant properties to visitors based on their inquiries.
              <br />
              <strong>Contact Info:</strong> When enabled, the AI will include your contact information in responses when appropriate.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AIApiControlContent;