'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Setting {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'email' | 'url' | 'color' | 'json' | 'password' | 'file' | 'select';
  category: string;
  label: string;
  description: string;
  isPublic: boolean;
  updatedAt: string;
}

interface SettingsContentProps {
  settings: Setting[];
  onUpdate: () => void;
}

export default function SettingsContent({ settings, onUpdate }: SettingsContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<Setting>>({
    key: '',
    value: '',
    type: 'text',
    category: 'general',
    label: '',
    description: '',
    isPublic: false
  });

  const categories = [
    'general', 'site', 'contact', 'social', 'seo', 'analytics', 'api', 'theme', 
    'security', 'email', 'payment', 'media', 'performance', 'maintenance', 'legal',
    'Real Estate AI Engine'
  ];
  
  const settingTypes = [
    { value: 'text', label: 'Text' },
    { value: 'textarea', label: 'Textarea' },
    { value: 'number', label: 'Number' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'email', label: 'Email' },
    { value: 'url', label: 'URL' },
    { value: 'color', label: 'Color' },
    { value: 'json', label: 'JSON' },
    { value: 'password', label: 'Password' },
    { value: 'file', label: 'File Path' },
    { value: 'select', label: 'Select Options' }
  ];

  // Initialize AI Engine settings if they don't exist
  useEffect(() => {
    const initializeAISettings = async () => {
      const aiEngineSettings = settings.filter(s => s.category === 'Real Estate AI Engine');
      
      if (aiEngineSettings.length === 0) {
        try {
          // Create DeepSeek API Key setting
          await fetch('/api/admin/settings/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              key: 'deepseek_api_key',
              value: '',
              type: 'password',
              category: 'Real Estate AI Engine',
              label: 'DeepSeek API Key',
              description: 'API key for DeepSeek AI service used for generating project descriptions',
              isPublic: false
            }),
          });

          // Create AI Description Enabled setting
          await fetch('/api/admin/settings/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              key: 'ai_description_enabled',
              value: 'true',
              type: 'boolean',
              category: 'Real Estate AI Engine',
              label: 'Enable AI Description Generation',
              description: 'Enable or disable AI-powered project description generation',
              isPublic: false
            }),
          });

          // Create AI Model setting
          await fetch('/api/admin/settings/create', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              key: 'ai_model',
              value: 'deepseek-chat',
              type: 'text',
              category: 'Real Estate AI Engine',
              label: 'AI Model',
              description: 'The AI model to use for description generation',
              isPublic: false
            }),
          });

          onUpdate(); // Refresh the settings list
        } catch (error) {
          console.error('Error initializing AI settings:', error);
        }
      }
    };

    if (settings.length > 0) {
      initializeAISettings();
    }
  }, [settings, onUpdate]);
  
  const filteredSettings = settings.filter(setting => {
    const matchesSearch = setting.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setting.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         setting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || setting.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const groupedSettings = filteredSettings.reduce((acc, setting) => {
    if (!acc[setting.category]) {
      acc[setting.category] = [];
    }
    acc[setting.category].push(setting);
    return acc;
  }, {} as Record<string, Setting[]>);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingSetting 
        ? `/api/admin/settings/${editingSetting.id}`
        : '/api/admin/settings/create';
      
      const method = editingSetting ? 'PUT' : 'POST';
      
      let processedValue = formData.value;
      
      // Process value based on type
      if (formData.type === 'boolean') {
        processedValue = formData.value === 'true' ? 'true' : 'false';
      } else if (formData.type === 'number') {
        processedValue = String(Number(formData.value) || 0);
      } else if (formData.type === 'json') {
        try {
          JSON.parse(formData.value || '{}');
        } catch {
          alert('Invalid JSON format');
          return;
        }
      }
      
      const submitData = {
        ...formData,
        value: processedValue
      };
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(editingSetting ? 'Setting updated successfully!' : 'Setting created successfully!');
        setIsModalOpen(false);
        setEditingSetting(null);
        setFormData({
          key: '',
          value: '',
          type: 'text',
          category: 'general',
          label: '',
          description: '',
          isPublic: false
        });
        onUpdate();
      } else {
        alert(`Error: ${result.message || 'Failed to save setting'}`);
      }
    } catch (error) {
      console.error('Error saving setting:', error);
      alert('Error saving setting. Please try again.');
    }
  };

  const handleEdit = (setting: Setting) => {
    setEditingSetting(setting);
    setFormData(setting);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this setting?')) {
      try {
        const response = await fetch(`/api/admin/settings/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Setting deleted successfully!');
          onUpdate();
        } else {
          const result = await response.json();
          alert(`Error deleting setting: ${result.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting setting:', error);
        alert('Error deleting setting. Please try again.');
      }
    }
  };

  const renderSettingValue = (setting: Setting) => {
    switch (setting.type) {
      case 'boolean':
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            setting.value === 'true' 
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400' 
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
          }`}>
            {setting.value === 'true' ? 'True' : 'False'}
          </span>
        );
      case 'color':
        return (
          <div className="flex items-center gap-2">
            <div 
              className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
              style={{ backgroundColor: setting.value }}
            ></div>
            <span className="text-sm text-gray-600 dark:text-gray-400">{setting.value}</span>
          </div>
        );
      case 'url':
        return (
          <a 
            href={setting.value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm truncate"
          >
            {setting.value}
          </a>
        );
      case 'email':
        return (
          <a 
            href={`mailto:${setting.value}`}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
          >
            {setting.value}
          </a>
        );
      case 'password':
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400 font-mono">
            {'•'.repeat(Math.min(setting.value.length, 12))}
          </span>
        );
      case 'file':
        return (
          <div className="flex items-center gap-2">
            <span className="text-blue-600 dark:text-blue-400">📄</span>
            <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {setting.value}
            </span>
          </div>
        );
      case 'select':
        return (
          <div className="flex flex-wrap gap-1">
            {setting.value.split('\n').filter(option => option.trim()).map((option, index) => (
              <span 
                key={index}
                className={`px-2 py-1 rounded text-xs ${
                  index === 0 
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium' 
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                {option.trim()}
              </span>
            ))}
          </div>
        );
      case 'json':
        return (
          <pre className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 p-2 rounded max-w-xs overflow-x-auto">
            {JSON.stringify(JSON.parse(setting.value || '{}'), null, 2)}
          </pre>
        );
      case 'textarea':
        return (
          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
            {setting.value}
          </p>
        );
      default:
        return (
          <span className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {setting.value}
          </span>
        );
    }
  };

  const renderFormInput = () => {
    const commonProps = {
      value: formData.value || '',
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => 
        setFormData(prev => ({ ...prev, value: e.target.value })),
      className: "w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    };

    switch (formData.type) {
      case 'textarea':
        return (
          <textarea
            {...commonProps}
            rows={4}
            placeholder="Enter value"
            className={`${commonProps.className} resize-none`}
          />
        );
      case 'number':
        return (
          <input
            {...commonProps}
            type="number"
            placeholder="Enter number"
          />
        );
      case 'boolean':
        return (
          <select {...commonProps}>
            <option value="true">True</option>
            <option value="false">False</option>
          </select>
        );
      case 'email':
        return (
          <input
            {...commonProps}
            type="email"
            placeholder="Enter email address"
          />
        );
      case 'url':
        return (
          <input
            {...commonProps}
            type="url"
            placeholder="Enter URL"
          />
        );
      case 'password':
        return (
          <input
            {...commonProps}
            type="password"
            placeholder="Enter password"
          />
        );
      case 'file':
        return (
          <input
            {...commonProps}
            type="text"
            placeholder="Enter file path (e.g., /uploads/logo.png)"
          />
        );
      case 'color':
        return (
          <div className="flex gap-2">
            <input
              type="color"
              value={formData.value || '#000000'}
              onChange={(e) => setFormData(prev => ({ ...prev, value: e.target.value }))}
              className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700"
            />
            <input
              {...commonProps}
              type="text"
              placeholder="#000000"
              className="flex-1 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        );
      case 'json':
        return (
          <textarea
            {...commonProps}
            rows={6}
            placeholder='{"key": "value"}'
            className={`${commonProps.className} resize-none font-mono text-sm`}
          />
        );
      case 'select':
        return (
          <div className="space-y-2">
            <textarea
              {...commonProps}
              rows={3}
              placeholder="Enter options separated by new lines (e.g., Option 1&#10;Option 2&#10;Option 3)"
              className={`${commonProps.className} resize-none text-sm`}
            />
            <p className="text-xs text-gray-600 dark:text-gray-400">
              Enter each option on a new line. The first option will be the default.
            </p>
          </div>
        );
      default:
        return (
          <input
            {...commonProps}
            type="text"
            placeholder="Enter value"
          />
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">⚙️ Settings Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Configure your application settings and website content</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={async () => {
              try {
                const response = await fetch('/api/admin/settings/export');
                if (response.ok) {
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `settings-export-${new Date().toISOString().split('T')[0]}.json`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                  alert('Settings exported successfully!');
                } else {
                  alert('Error exporting settings');
                }
              } catch (error) {
                alert('Error exporting settings');
              }
            }}
            className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            📥 Export
          </button>
          <button
            onClick={() => {
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.json';
              input.onchange = async (e) => {
                const file = (e.target as HTMLInputElement).files?.[0];
                if (file) {
                  try {
                    const text = await file.text();
                    const data = JSON.parse(text);
                    
                    if (confirm('This will replace all current settings. Continue?')) {
                      const response = await fetch('/api/admin/settings/export', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(data)
                      });
                      
                      if (response.ok) {
                        alert('Settings imported successfully!');
                        onUpdate();
                      } else {
                        alert('Error importing settings');
                      }
                    }
                  } catch (error) {
                    alert('Invalid JSON file');
                  }
                }
              };
              input.click();
            }}
            className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            📤 Import
          </button>
          <button
            onClick={async () => {
              if (confirm('This will initialize default settings for your website. Continue?')) {
                try {
                  const response = await fetch('/api/admin/settings/initialize', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }
                  });
                  const result = await response.json();
                  if (response.ok) {
                    alert('Default settings initialized successfully!');
                    onUpdate();
                  } else {
                    alert(`Error: ${result.message}`);
                  }
                } catch (error) {
                  alert('Error initializing settings');
                }
              }
            }}
            className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            🔧 Initialize
          </button>
          <button
            onClick={() => {
              setEditingSetting(null);
              setFormData({
                key: '',
                value: '',
                type: 'text',
                category: 'general',
                label: '',
                description: '',
                isPublic: false
              });
              setIsModalOpen(true);
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2"
          >
            ➕ Add Setting
          </button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <span className="text-green-600 dark:text-green-400 text-lg">⚙️</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{settings.length}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Settings</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-blue-600 dark:text-blue-400 text-lg">👁️</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {settings.filter(s => s.isPublic).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Public Settings</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <span className="text-purple-600 dark:text-purple-400 text-lg">📁</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {Object.keys(groupedSettings).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Categories</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <span className="text-orange-600 dark:text-orange-400 text-lg">🕒</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {settings.filter(s => {
                  const updatedDate = new Date(s.updatedAt);
                  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
                  return updatedDate > dayAgo;
                }).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Updated Today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search settings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Settings by Category */}
      <div className="space-y-6">
        {Object.entries(groupedSettings).map(([category, categorySettings]) => (
          <div key={category} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
                {category} Settings
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                {categorySettings.length} setting{categorySettings.length !== 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              <AnimatePresence>
                {categorySettings.map((setting) => (
                  <motion.div
                    key={setting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                            {setting.label}
                          </h4>
                          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded text-xs font-medium">
                            {setting.type}
                          </span>
                          {setting.isPublic && (
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs font-medium">
                              Public
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {setting.description}
                        </p>
                        
                        <div className="mb-2">
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Key:</span>
                          <code className="ml-2 px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-green-600 dark:text-green-400">
                            {setting.key}
                          </code>
                        </div>
                        
                        <div className="mb-3">
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">Value:</span>
                          <div className="mt-1">
                            {renderSettingValue(setting)}
                          </div>
                        </div>
                        
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          Last updated: {new Date(setting.updatedAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(setting)}
                          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(setting.id)}
                          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-sm"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {Object.keys(groupedSettings).length === 0 && (
        <div className="text-center py-12">
          <span className="text-6xl text-gray-400 dark:text-gray-500 mb-4 block">⚙️</span>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No settings found</h3>
          <p className="text-gray-600 dark:text-gray-400">
            {searchTerm || filterCategory !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Create your first setting to get started'}
          </p>
        </div>
      )}

      {/* Setting Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {editingSetting ? 'Edit Setting' : 'Add New Setting'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Category *
                    </label>
                    <select
                      required
                      value={formData.category || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category.charAt(0).toUpperCase() + category.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Type *
                    </label>
                    <select
                      required
                      value={formData.type || 'text'}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as any }))}
                      className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {settingTypes.map(type => (
                        <option key={type.value} value={type.value}>
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Key * (unique identifier)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.key || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, key: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., site_title, contact_email"
                    disabled={!!editingSetting}
                  />
                  {editingSetting && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      Key cannot be changed after creation
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Label *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.label || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, label: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Human-readable label"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    placeholder="Describe what this setting controls"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                    Value *
                  </label>
                  {renderFormInput()}
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-gray-900 dark:text-white">
                    <input
                      type="checkbox"
                      checked={formData.isPublic || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                      className="rounded border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-blue-600 focus:ring-blue-500"
                    />
                    Public (accessible via API)
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-sm"
                  >
                    {editingSetting ? 'Update Setting' : 'Create Setting'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-500 dark:bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}