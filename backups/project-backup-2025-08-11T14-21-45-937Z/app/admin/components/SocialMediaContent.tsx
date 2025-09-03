'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SocialMediaSettings {
  facebook: string;
  instagram: string;
  twitter: string;
  linkedin: string;
  youtube: string;
  tiktok: string;
  whatsapp: string;
  telegram: string;
}

interface SocialMediaContentProps {
  onUpdate: () => void;
}

export default function SocialMediaContent({ onUpdate }: SocialMediaContentProps) {
  const [socialMedia, setSocialMedia] = useState<SocialMediaSettings>({
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: '',
    youtube: '',
    tiktok: '',
    whatsapp: '',
    telegram: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSocialMediaSettings();
  }, []);

  const loadSocialMediaSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      
      if (data.success && data.data?.social) {
        setSocialMedia(prev => ({
          ...prev,
          ...data.data.social
        }));
      }
    } catch (error) {
      console.error('Error loading social media settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: 'social',
          settings: socialMedia
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        alert('Social media settings updated successfully!');
        onUpdate();
      } else {
        alert(`Error: ${result.message || 'Failed to update settings'}`);
      }
    } catch (error) {
      console.error('Error saving social media settings:', error);
      alert('Error saving settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (platform: keyof SocialMediaSettings, value: string) => {
    setSocialMedia(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const socialPlatforms = [
    {
      key: 'facebook' as keyof SocialMediaSettings,
      label: 'Facebook',
      icon: '📘',
      placeholder: 'https://facebook.com/yourpage',
      color: 'from-blue-600 to-blue-700'
    },
    {
      key: 'instagram' as keyof SocialMediaSettings,
      label: 'Instagram',
      icon: '📷',
      placeholder: 'https://instagram.com/youraccount',
      color: 'from-pink-500 to-purple-600'
    },
    {
      key: 'twitter' as keyof SocialMediaSettings,
      label: 'Twitter/X',
      icon: '🐦',
      placeholder: 'https://twitter.com/youraccount',
      color: 'from-blue-400 to-blue-500'
    },
    {
      key: 'linkedin' as keyof SocialMediaSettings,
      label: 'LinkedIn',
      icon: '💼',
      placeholder: 'https://linkedin.com/company/yourcompany',
      color: 'from-blue-700 to-blue-800'
    },
    {
      key: 'youtube' as keyof SocialMediaSettings,
      label: 'YouTube',
      icon: '📺',
      placeholder: 'https://youtube.com/channel/yourchannel',
      color: 'from-red-500 to-red-600'
    },
    {
      key: 'tiktok' as keyof SocialMediaSettings,
      label: 'TikTok',
      icon: '🎵',
      placeholder: 'https://tiktok.com/@youraccount',
      color: 'from-gray-800 to-gray-900'
    },
    {
      key: 'whatsapp' as keyof SocialMediaSettings,
      label: 'WhatsApp',
      icon: '💬',
      placeholder: 'https://wa.me/1234567890',
      color: 'from-green-500 to-green-600'
    },
    {
      key: 'telegram' as keyof SocialMediaSettings,
      label: 'Telegram',
      icon: '✈️',
      placeholder: 'https://t.me/yourchannel',
      color: 'from-blue-500 to-blue-600'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Social Media Management</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your social media links and presence</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-400 disabled:to-gray-500 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <span className="text-lg">💾</span>
              Save Changes
            </>
          )}
        </button>
      </div>

      {/* Social Media Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {socialPlatforms.map((platform) => (
          <motion.div
            key={platform.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all duration-200"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`w-12 h-12 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                {platform.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{platform.label}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Social media profile URL</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Profile URL
              </label>
              <input
                type="url"
                value={socialMedia[platform.key]}
                onChange={(e) => handleInputChange(platform.key, e.target.value)}
                placeholder={platform.placeholder}
                className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-3 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              
              {socialMedia[platform.key] && (
                <div className="flex items-center gap-2">
                  <a
                    href={socialMedia[platform.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
                  >
                    🔗 Test Link
                  </a>
                  <button
                    onClick={() => handleInputChange(platform.key, '')}
                    className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Preview Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl p-6 border border-blue-200 dark:border-gray-600">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <span className="text-xl">👀</span>
          Social Media Preview
        </h3>
        
        <div className="flex flex-wrap gap-3">
          {socialPlatforms
            .filter(platform => socialMedia[platform.key])
            .map(platform => (
              <a
                key={platform.key}
                href={socialMedia[platform.key]}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 bg-gradient-to-r ${platform.color} text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
              >
                <span>{platform.icon}</span>
                <span className="font-medium">{platform.label}</span>
              </a>
            ))}
        </div>
        
        {socialPlatforms.filter(platform => socialMedia[platform.key]).length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            No social media links configured yet. Add some links above to see the preview.
          </p>
        )}
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-3 flex items-center gap-2">
          <span className="text-xl">💡</span>
          Tips for Social Media Management
        </h3>
        <ul className="space-y-2 text-yellow-700 dark:text-yellow-300 text-sm">
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">•</span>
            Use complete URLs including https:// for all social media links
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">•</span>
            Test each link after saving to ensure they work correctly
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">•</span>
            Keep your social media profiles updated and active for better engagement
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">•</span>
            Use consistent branding across all social media platforms
          </li>
        </ul>
      </div>
    </div>
  );
}