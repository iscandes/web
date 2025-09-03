'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProjectsContent from './ProjectsContent';
import DevelopersContent from './DevelopersContent';
import ArticlesContent from './ArticlesContent';
import MediaContent from './MediaContent';
import VideoSettingsContent from './VideoSettingsContent';
import SettingsContent from './SettingsContent';
import AIApiControlContent from './AIApiControlContent';
import SocialMediaContent from './SocialMediaContent';
import { Project, Developer, Article, MediaFile } from '../../../lib/mysql-database';

interface AdminDashboardProps {
  onLogout: () => void;
}

interface Settings {
  siteName: string;
  siteDescription: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  social: {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
  };
  seo: {
    keywords: string;
    description: string;
  };
  theme: {
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
  };
}

interface Setting {
  id: string;
  key: string;
  value: string;
  type: 'text' | 'textarea' | 'number' | 'boolean' | 'email' | 'url' | 'color' | 'json';
  category: string;
  label: string;
  description: string;
  isPublic: boolean;
  updatedAt: string;
}

const NAV_ITEMS = [
  { id: 'overview', label: 'Overview', icon: '📊', description: 'Dashboard overview and analytics' },
  { id: 'projects', label: 'Projects', icon: '🏢', description: 'Manage real estate projects' },
  { id: 'developers', label: 'Developers', icon: '👥', description: 'Manage developer profiles' },
  { id: 'articles', label: 'Articles', icon: '📝', description: 'Create and manage articles' },
  { id: 'media', label: 'Media', icon: '📁', description: 'File and media management' },
  { id: 'social-media', label: 'Social Media', icon: '🌐', description: 'Manage social media links' },
  { id: 'video-settings', label: 'Video Settings', icon: '🎬', description: 'Manage landing page video' },
  { id: 'ai-api-control', label: 'AI API Control', icon: '🤖', description: 'AI settings and controls' },
  { id: 'settings', label: 'Settings', icon: '⚙️', description: 'Website settings and configuration' },
];

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [settings, setSettings] = useState<Settings | null>(null);

  // Utility function to convert settings object to array format
  const convertSettingsToArray = (settingsObj: Settings | null): Setting[] => {
    if (!settingsObj) return [];
    
    const settingsArray: Setting[] = [];
    const now = new Date().toISOString();
    
    // Site settings
    settingsArray.push({
      id: 'site_name',
      key: 'siteName',
      value: settingsObj.siteName || '',
      type: 'text',
      category: 'site',
      label: 'Site Name',
      description: 'The name of your website',
      isPublic: true,
      updatedAt: now
    });
    
    settingsArray.push({
      id: 'site_description',
      key: 'siteDescription',
      value: settingsObj.siteDescription || '',
      type: 'textarea',
      category: 'site',
      label: 'Site Description',
      description: 'A brief description of your website',
      isPublic: true,
      updatedAt: now
    });
    
    // Contact settings
    if (settingsObj.contact) {
      settingsArray.push({
        id: 'contact_email',
        key: 'contact.email',
        value: settingsObj.contact.email || '',
        type: 'email',
        category: 'contact',
        label: 'Contact Email',
        description: 'Primary contact email address',
        isPublic: true,
        updatedAt: now
      });
      
      settingsArray.push({
        id: 'contact_phone',
        key: 'contact.phone',
        value: settingsObj.contact.phone || '',
        type: 'text',
        category: 'contact',
        label: 'Contact Phone',
        description: 'Primary contact phone number',
        isPublic: true,
        updatedAt: now
      });
      
      settingsArray.push({
        id: 'contact_address',
        key: 'contact.address',
        value: settingsObj.contact.address || '',
        type: 'textarea',
        category: 'contact',
        label: 'Contact Address',
        description: 'Business address',
        isPublic: true,
        updatedAt: now
      });
    }
    
    // Social settings
    if (settingsObj.social) {
      settingsArray.push({
        id: 'social_facebook',
        key: 'social.facebook',
        value: settingsObj.social.facebook || '',
        type: 'url',
        category: 'social',
        label: 'Facebook URL',
        description: 'Facebook page URL',
        isPublic: true,
        updatedAt: now
      });
      
      settingsArray.push({
        id: 'social_instagram',
        key: 'social.instagram',
        value: settingsObj.social.instagram || '',
        type: 'url',
        category: 'social',
        label: 'Instagram URL',
        description: 'Instagram profile URL',
        isPublic: true,
        updatedAt: now
      });
      
      settingsArray.push({
        id: 'social_twitter',
        key: 'social.twitter',
        value: settingsObj.social.twitter || '',
        type: 'url',
        category: 'social',
        label: 'Twitter URL',
        description: 'Twitter profile URL',
        isPublic: true,
        updatedAt: now
      });
      
      settingsArray.push({
        id: 'social_linkedin',
        key: 'social.linkedin',
        value: settingsObj.social.linkedin || '',
        type: 'url',
        category: 'social',
        label: 'LinkedIn URL',
        description: 'LinkedIn profile URL',
        isPublic: true,
        updatedAt: now
      });
    }
    
    // SEO settings
    if (settingsObj.seo) {
      settingsArray.push({
        id: 'seo_keywords',
        key: 'seo.keywords',
        value: settingsObj.seo.keywords || '',
        type: 'textarea',
        category: 'seo',
        label: 'SEO Keywords',
        description: 'Meta keywords for search engines',
        isPublic: true,
        updatedAt: now
      });
      
      settingsArray.push({
        id: 'seo_description',
        key: 'seo.description',
        value: settingsObj.seo.description || '',
        type: 'textarea',
        category: 'seo',
        label: 'SEO Description',
        description: 'Meta description for search engines',
        isPublic: true,
        updatedAt: now
      });
    }
    
    // Theme settings
    if (settingsObj.theme) {
      settingsArray.push({
        id: 'theme_primary',
        key: 'theme.primaryColor',
        value: settingsObj.theme.primaryColor || '#00D4AA',
        type: 'color',
        category: 'theme',
        label: 'Primary Color',
        description: 'Main brand color',
        isPublic: true,
        updatedAt: now
      });
      
      settingsArray.push({
        id: 'theme_secondary',
        key: 'theme.secondaryColor',
        value: settingsObj.theme.secondaryColor || '#1A1A1A',
        type: 'color',
        category: 'theme',
        label: 'Secondary Color',
        description: 'Secondary brand color',
        isPublic: true,
        updatedAt: now
      });
      
      settingsArray.push({
        id: 'theme_accent',
        key: 'theme.accentColor',
        value: settingsObj.theme.accentColor || '#00A693',
        type: 'color',
        category: 'theme',
        label: 'Accent Color',
        description: 'Accent color for highlights',
        isPublic: true,
        updatedAt: now
      });
    }
    
    return settingsArray;
  };

  // Load data when component mounts or section changes
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      if (activeTab === 'projects' || activeTab === 'overview') {
        const response = await fetch('/api/admin/projects');
        const data = await response.json();
        if (data.success) setProjects(data.data);
      }
      
      if (activeTab === 'developers' || activeTab === 'overview') {
        const response = await fetch('/api/admin/developers');
        const data = await response.json();
        if (data.success) setDevelopers(data.data);
      }
      
      if (activeTab === 'articles' || activeTab === 'overview') {
        const response = await fetch('/api/admin/articles');
        const data = await response.json();
        if (data.success) setArticles(data.data);
      }
      
      if (activeTab === 'media' || activeTab === 'overview') {
        const response = await fetch('/api/admin/media');
        const data = await response.json();
        if (data.success) setMediaFiles(data.data);
      }
      
      if (activeTab === 'settings' || activeTab === 'overview') {
        const response = await fetch('/api/admin/settings');
        const data = await response.json();
        if (data.success) setSettings(data.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-ocean"></div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewContent projects={projects} developers={developers} articles={articles} mediaFiles={mediaFiles} />;
      case 'projects':
        return <ProjectsContent projects={projects} onUpdate={loadData} />;
      case 'developers':
        return <DevelopersContent developers={developers} onUpdate={loadData} />;
      case 'articles':
        return <ArticlesContent articles={articles} onUpdate={loadData} />;
      case 'media':
        return <MediaContent mediaFiles={mediaFiles} onUpdate={loadData} />;
      case 'social-media':
        return <SocialMediaContent onUpdate={loadData} />;
      case 'video-settings':
        return <VideoSettingsContent onUpdate={loadData} />;
      case 'ai-api-control':
        return <AIApiControlContent />;
      case 'settings':
        return <SettingsContent settings={convertSettingsToArray(settings)} onUpdate={loadData} />;
      default:
        return <OverviewContent projects={projects} developers={developers} articles={articles} mediaFiles={mediaFiles} />;
    }
  };

  return (
    <div className="admin-panel min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-gray-200 dark:border-gray-700">
          {/* Logo/Header */}
          <div className="flex items-center justify-center h-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <h1 className="text-xl font-bold">Admin Panel</h1>
          </div>
          
          {/* Navigation */}
          <nav className="mt-6 px-3">
            <div className="space-y-1">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 group ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  <span className="text-lg mr-3">{item.icon}</span>
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className={`text-xs mt-0.5 ${
                      activeTab === item.id 
                        ? 'text-blue-100' 
                        : 'text-gray-500 dark:text-gray-400'
                    }`}>
                      {item.description}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </nav>
          
          {/* User Info & Logout */}
          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">A</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Administrator</p>
                </div>
              </div>
              <button
                onClick={onLogout}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <span className="text-lg">🚪</span>
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-64">
          {/* Top Header */}
          <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
            <div className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {NAV_ITEMS.find(item => item.id === activeTab)?.label || 'Dashboard'}
                  </h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {NAV_ITEMS.find(item => item.id === activeTab)?.description || 'Manage your website'}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Last updated: {new Date().toLocaleDateString()}
                  </div>
                  <button
                    onClick={onLogout}
                    className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="p-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[calc(100vh-200px)]">
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Content Components
// Dashboard Overview Content
function OverviewContent({ projects, developers, articles, mediaFiles }: {
  projects: Project[];
  developers: Developer[];
  articles: Article[];
  mediaFiles: MediaFile[];
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-600 dark:text-gray-400">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Projects</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🏢</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Developers</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{developers.length}</p>
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">👥</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Articles</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{articles.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📝</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Media Files</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white">{mediaFiles.length}</p>
            </div>
            <div className="w-12 h-12 bg-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📁</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 border border-gray-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
            <span className="text-lg">➕</span>
            Add New Project
          </button>
          <button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
            <span className="text-lg">📝</span>
            Create Article
          </button>
          <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl">
            <span className="text-lg">📤</span>
            Upload Media
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-8 border border-gray-200 dark:border-gray-600">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'New project added', item: 'Marina Heights Tower', time: '2 hours ago', icon: '🏢', color: 'blue' },
            { action: 'Article published', item: 'Dubai Real Estate Market Trends', time: '5 hours ago', icon: '📝', color: 'purple' },
            { action: 'Developer updated', item: 'Emaar Properties', time: '1 day ago', icon: '👥', color: 'green' },
            { action: 'Media uploaded', item: '15 new images', time: '2 days ago', icon: '📁', color: 'orange' },
          ].map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 bg-${activity.color}-500 rounded-lg flex items-center justify-center`}>
                <span className="text-white text-lg">{activity.icon}</span>
              </div>
              <div className="flex-1">
                <p className="text-gray-900 dark:text-white font-medium">{activity.action}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{activity.item}</p>
              </div>
              <span className="text-gray-500 dark:text-gray-400 text-sm">{activity.time}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}