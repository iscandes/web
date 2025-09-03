'use client';

import React from 'react';
import { FaFacebook, FaInstagram, FaTwitter, FaLinkedin, FaYoutube, FaTiktok, FaWhatsapp, FaTelegram, FaSpinner } from 'react-icons/fa';
import { useSocialMedia } from '../lib/useSocialMedia';

interface SocialMediaDisplayProps {
  title?: string;
  showTitle?: boolean;
  enableAutoSync?: boolean;
  className?: string;
  iconSize?: 'sm' | 'md' | 'lg';
}

const socialPlatforms = [
  { key: 'facebook', label: 'Facebook', icon: FaFacebook, color: '#1877F2' },
  { key: 'instagram', label: 'Instagram', icon: FaInstagram, color: '#E4405F' },
  { key: 'twitter', label: 'Twitter', icon: FaTwitter, color: '#1DA1F2' },
  { key: 'linkedin', label: 'LinkedIn', icon: FaLinkedin, color: '#0A66C2' },
  { key: 'youtube', label: 'YouTube', icon: FaYoutube, color: '#FF0000' },
  { key: 'tiktok', label: 'TikTok', icon: FaTiktok, color: '#000000' },
  { key: 'whatsapp', label: 'WhatsApp', icon: FaWhatsapp, color: '#25D366' },
  { key: 'telegram', label: 'Telegram', icon: FaTelegram, color: '#0088CC' },
];

const iconSizes = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl'
};

export default function SocialMediaDisplay({
  title = 'Follow Us',
  showTitle = true,
  enableAutoSync = true,
  className = '',
  iconSize = 'md'
}: SocialMediaDisplayProps) {
  const { socialMedia, loading, error } = useSocialMedia(enableAutoSync);

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <FaSpinner className="animate-spin text-gray-400" />
        <span className="ml-2 text-gray-600">Loading social media links...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`text-red-500 text-sm p-4 ${className}`}>
        Error loading social media links: {error}
      </div>
    );
  }

  // Filter out empty social media links
  const activePlatforms = socialPlatforms.filter(platform => {
    const url = socialMedia[platform.key as keyof typeof socialMedia];
    return url && url.trim() !== '';
  });

  if (activePlatforms.length === 0) {
    return (
      <div className={`text-gray-500 text-sm p-4 ${className}`}>
        No social media links configured
      </div>
    );
  }

  return (
    <div className={`${className}`}>
      {showTitle && (
        <h3 className="text-lg font-semibold mb-4 text-gray-800">{title}</h3>
      )}
      
      <div className="flex flex-wrap gap-3">
        {activePlatforms.map((platform) => {
          const Icon = platform.icon;
          const url = socialMedia[platform.key as keyof typeof socialMedia];
          
          return (
            <a
              key={platform.key}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`
                inline-flex items-center justify-center
                w-10 h-10 rounded-full
                transition-all duration-300
                hover:scale-110 hover:shadow-lg
                bg-gray-100 hover:bg-white
                border border-gray-200 hover:border-gray-300
                group
              `}
              style={{
                '--hover-color': platform.color
              } as React.CSSProperties}
              title={`Visit our ${platform.label}`}
            >
              <Icon 
                className={`
                  ${iconSizes[iconSize]} 
                  text-gray-600 
                  group-hover:text-[var(--hover-color)] 
                  transition-colors duration-300
                `} 
              />
            </a>
          );
        })}
      </div>
      
      {enableAutoSync && (
        <div className="mt-2 text-xs text-gray-400">
          🔄 Auto-sync enabled - Updates in real-time
        </div>
      )}
    </div>
  );
}