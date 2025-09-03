'use client';

import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok, FaWhatsapp, FaTelegram, FaExternalLinkAlt, FaTimes, FaCheck, FaExclamationTriangle, FaSpinner } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useSocialMedia, updateSocialMediaSettings } from '../../../lib/useSocialMedia';

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

interface ValidationStatus {
  [key: string]: {
    isValid: boolean;
    isVerifying: boolean;
    error?: string;
  };
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
  const [validationStatus, setValidationStatus] = useState<ValidationStatus>({});

  useEffect(() => {
    loadSocialMediaSettings();
  }, []);

  // URL validation functions
  const isValidUrl = (url: string): boolean => {
    if (!url) return true; // Empty URLs are considered valid (optional)
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const validatePlatformUrl = (platform: keyof SocialMediaSettings, url: string): { isValid: boolean; error?: string } => {
    if (!url) return { isValid: true };
    
    if (!isValidUrl(url)) {
      return { isValid: false, error: 'Invalid URL format' };
    }

    const platformPatterns = {
      facebook: /^https?:\/\/(www\.)?(facebook|fb)\.com\/.+/i,
      instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/i,
      twitter: /^https?:\/\/(www\.)?(twitter|x)\.com\/.+/i,
      linkedin: /^https?:\/\/(www\.)?linkedin\.com\/(company|in)\/.+/i,
      youtube: /^https?:\/\/(www\.)?(youtube\.com\/(channel|c|user)\/|youtu\.be\/).+/i,
      tiktok: /^https?:\/\/(www\.)?tiktok\.com\/@.+/i,
      whatsapp: /^https?:\/\/(wa\.me|api\.whatsapp\.com)\/.+/i,
      telegram: /^https?:\/\/(t\.me|telegram\.me)\/.+/i
    };

    const pattern = platformPatterns[platform];
    if (pattern && !pattern.test(url)) {
      return { isValid: false, error: `Invalid ${platform} URL format` };
    }

    return { isValid: true };
  };

  const verifyUrlAccessibility = async (url: string): Promise<boolean> => {
    if (!url) return true;
    
    try {
      // Use a CORS proxy or create an API endpoint for URL verification
      const response = await fetch('/api/verify-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const result = await response.json();
      return result.accessible;
    } catch {
      // If verification fails, assume URL is accessible to avoid blocking saves
      return true;
    }
  };

  const validateAllUrls = async (): Promise<boolean> => {
    const platforms = Object.keys(socialMedia) as (keyof SocialMediaSettings)[];
    let allValid = true;
    const newValidationStatus: ValidationStatus = {};

    for (const platform of platforms) {
      const url = socialMedia[platform];
      if (url) {
        setValidationStatus(prev => ({
          ...prev,
          [platform]: { isValid: false, isVerifying: true }
        }));

        const validation = validatePlatformUrl(platform, url);
        if (!validation.isValid) {
          newValidationStatus[platform] = {
            isValid: false,
            isVerifying: false,
            error: validation.error
          };
          allValid = false;
        } else {
          const isAccessible = await verifyUrlAccessibility(url);
          newValidationStatus[platform] = {
            isValid: isAccessible,
            isVerifying: false,
            error: isAccessible ? undefined : 'URL is not accessible'
          };
          if (!isAccessible) allValid = false;
        }
      } else {
        newValidationStatus[platform] = {
          isValid: true,
          isVerifying: false
        };
      }
    }

    setValidationStatus(newValidationStatus);
    return allValid;
  };

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
      // Validate all URLs before saving
      const isValid = await validateAllUrls();
      
      if (!isValid) {
        alert('Please fix the invalid URLs before saving.');
        setSaving(false);
        return;
      }

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          social: socialMedia
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        // Update global state and notify all subscribers
        updateSocialMediaSettings(socialMedia);
        
        // Broadcast to SSE clients
        try {
          await fetch('/api/admin/settings/broadcast', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              type: 'social_media_update',
              settings: socialMedia
            }),
          });
        } catch (broadcastError) {
          console.warn('Failed to broadcast update:', broadcastError);
        }
        
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

    // Real-time validation
    if (value) {
      const validation = validatePlatformUrl(platform, value);
      setValidationStatus(prev => ({
        ...prev,
        [platform]: {
          isValid: validation.isValid,
          isVerifying: false,
          error: validation.error
        }
      }));
    } else {
      setValidationStatus(prev => ({
        ...prev,
        [platform]: {
          isValid: true,
          isVerifying: false
        }
      }));
    }
  };

  const verifyUrl = async (platform: keyof SocialMediaSettings) => {
    const url = socialMedia[platform];
    if (!url) return;

    setValidationStatus(prev => ({
      ...prev,
      [platform]: { ...prev[platform], isVerifying: true }
    }));

    const isAccessible = await verifyUrlAccessibility(url);
    setValidationStatus(prev => ({
      ...prev,
      [platform]: {
        isValid: isAccessible,
        isVerifying: false,
        error: isAccessible ? undefined : 'URL is not accessible'
      }
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
              <div className="relative">
                <input
                  type="url"
                  value={socialMedia[platform.key]}
                  onChange={(e) => handleInputChange(platform.key, e.target.value)}
                  placeholder={platform.placeholder}
                  className={`w-full bg-gray-50 dark:bg-gray-700 border rounded-lg px-4 py-3 pr-12 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 ${
                    socialMedia[platform.key] && validationStatus[platform.key]
                      ? validationStatus[platform.key].isValid
                        ? 'border-green-300 dark:border-green-600 focus:ring-green-500'
                        : 'border-red-300 dark:border-red-600 focus:ring-red-500'
                      : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }`}
                />
                
                {/* Validation Status Icon */}
                {socialMedia[platform.key] && validationStatus[platform.key] && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    {validationStatus[platform.key].isVerifying ? (
                      <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    ) : validationStatus[platform.key].isValid ? (
                      <span className="text-green-500 text-lg">✓</span>
                    ) : (
                      <span className="text-red-500 text-lg">✗</span>
                    )}
                  </div>
                )}
              </div>
              
              {/* Validation Error Message */}
              {socialMedia[platform.key] && validationStatus[platform.key]?.error && (
                <div className="flex items-center gap-2 text-red-500 dark:text-red-400 text-sm">
                  <span className="text-red-500">⚠️</span>
                  {validationStatus[platform.key].error}
                </div>
              )}
              
              {socialMedia[platform.key] && (
                <div className="flex items-center gap-3 flex-wrap">
                  <a
                    href={socialMedia[platform.key]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 text-sm flex items-center gap-1 transition-colors"
                  >
                    🔗 Test Link
                  </a>
                  
                  <button
                    onClick={() => verifyUrl(platform.key)}
                    disabled={validationStatus[platform.key]?.isVerifying}
                    className="text-purple-500 hover:text-purple-600 dark:text-purple-400 dark:hover:text-purple-300 text-sm flex items-center gap-1 transition-colors disabled:opacity-50"
                  >
                    {validationStatus[platform.key]?.isVerifying ? (
                      <>🔄 Verifying...</>
                    ) : (
                      <>🔍 Verify URL</>
                    )}
                  </button>
                  
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
            URLs are automatically validated for format and platform compatibility
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">•</span>
            Use the "Verify URL" button to check if links are accessible online
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-500 mt-0.5">•</span>
            Green checkmarks indicate valid URLs, red X marks show errors
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