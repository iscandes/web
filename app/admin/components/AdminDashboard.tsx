'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import ProjectsContent from './ProjectsContent';
import DevelopersContent from './DevelopersContent';
import ArticlesContent from './ArticlesContent';
import MediaContent from './MediaContent';
import VideoSettingsContent from './VideoSettingsContent';

import AIApiControlContent from './AIApiControlContent';
import SocialMediaContent from './SocialMediaContent';
import { Project, Developer, Article, MediaFile } from '../../../lib/mysql-database';

interface AdminDashboardProps {
  onLogout: () => void;
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
];

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [loadingStates, setLoadingStates] = useState({
    projects: false,
    developers: false,
    articles: false,
    media: false,
    settings: false
  });

  // Data states
  const [projects, setProjects] = useState<Project[]>([]);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [settings, setSettings] = useState<any>(null);




  // Optimized parallel data loading functions
  const loadProjects = useCallback(async (forceRefresh = false) => {
    if (projects.length > 0 && !forceRefresh) return; // Skip if already loaded unless forced
    setLoadingStates(prev => ({ ...prev, projects: true }));
    try {
      console.log('🔄 Loading projects from API...');
      const data = await fetchWithRetry('/api/admin/projects');
      console.log('📊 Projects API response:', data);
      if (data.success) {
        setProjects(data.data);
        console.log('✅ Projects loaded:', data.data.length);
      } else {
        console.error('❌ Projects API failed:', data.message);
      }
    } catch (error) {
      // Silently handle errors to prevent console spam during development
      setProjects([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, projects: false }));
    }
  }, [projects.length]);

  const loadDevelopers = useCallback(async (forceRefresh = false) => {
    if (developers.length > 0 && !forceRefresh) return; // Skip if already loaded unless forced
    setLoadingStates(prev => ({ ...prev, developers: true }));
    try {
      const data = await fetchWithRetry('/api/admin/developers');
      if (data.success) setDevelopers(data.data);
    } catch (error) {
      // Silently handle errors to prevent console spam during development
      setDevelopers([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, developers: false }));
    }
  }, [developers.length]);

  const loadArticles = useCallback(async () => {
    if (articles.length > 0) return; // Skip if already loaded
    setLoadingStates(prev => ({ ...prev, articles: true }));
    try {
      const data = await fetchWithRetry('/api/admin/articles');
      if (data.success) setArticles(data.data);
    } catch (error) {
      // Silently handle errors to prevent console spam during development
      setArticles([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, articles: false }));
    }
  }, [articles.length]);

  // Robust fetch with retry logic to prevent network errors
  const fetchWithRetry = async (url: string, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
        
        const response = await fetch(url, {
          signal: controller.signal,
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        return await response.json();
      } catch (error: any) {
        if (error.name === 'AbortError') {
          console.warn(`Request to ${url} timed out, attempt ${i + 1}/${retries}`);
        } else if (i === retries - 1) {
          // Only log error on final attempt
          console.error(`Failed to fetch ${url} after ${retries} attempts:`, error.message);
          throw error;
        }
        
        if (i < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, delay * (i + 1)));
        }
      }
    }
  };

  const loadMedia = useCallback(async (forceRefresh = false) => {
    if (mediaFiles.length > 0 && !forceRefresh) return; // Skip if already loaded unless forced
    setLoadingStates(prev => ({ ...prev, media: true }));
    try {
      const data = await fetchWithRetry('/api/admin/media');
      if (data.success) setMediaFiles(data.data);
    } catch (error) {
      // Silently handle errors to prevent console spam during development
      setMediaFiles([]);
    } finally {
      setLoadingStates(prev => ({ ...prev, media: false }));
    }
  }, [mediaFiles.length]);

  // Force refresh media files - specifically for MediaContent onUpdate
  const refreshMediaFiles = useCallback(async () => {
    console.log('🔄 Force refreshing media files...');
    await loadMedia(true);
  }, [loadMedia]);

  const loadSettings = useCallback(async () => {
    if (settings) return; // Skip if already loaded
    setLoadingStates(prev => ({ ...prev, settings: true }));
    try {
      const data = await fetchWithRetry('/api/admin/settings');
      if (data.success) setSettings(data.data);
    } catch (error) {
      // Silently handle errors to prevent console spam during development
      setSettings(null);
    } finally {
      setLoadingStates(prev => ({ ...prev, settings: false }));
    }
  }, [settings]);

  // Optimized data loading based on active tab
  const loadData = useCallback(async (forceRefresh = false) => {
    setLoading(true);
    try {
      console.log('🔄 Loading data for tab:', activeTab, 'forceRefresh:', forceRefresh);
      if (activeTab === 'overview') {
        // Load critical data first
        await Promise.all([
          loadProjects(forceRefresh),
          loadDevelopers(forceRefresh)
        ]);
        
        // Load non-critical data with slight delay
        setTimeout(() => {
          Promise.all([
            loadArticles(),
            loadMedia()
          ]);
        }, 100);
      } else {
        // Load specific data based on active tab
        switch (activeTab) {
          case 'projects':
            await loadProjects(forceRefresh);
            break;
          case 'developers':
            await loadDevelopers(forceRefresh);
            break;
          case 'articles':
            await loadArticles();
            break;
          case 'media':
            await loadMedia();
            break;
          case 'settings':
            await loadSettings();
            break;
        }
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab, loadProjects, loadDevelopers, loadArticles, loadMedia, loadSettings]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Listen for admin refresh flag
  useEffect(() => {
    const checkForRefresh = () => {
      const shouldRefresh = localStorage.getItem('admin_refresh_needed');
      if (shouldRefresh === 'true') {
        console.log('🔄 Refreshing admin data due to localStorage flag');
        localStorage.removeItem('admin_refresh_needed');
        loadData(true); // Force refresh all data
      }
    };

    // Check immediately
    checkForRefresh();

    // Set up interval to check periodically
    const interval = setInterval(checkForRefresh, 1000);

    return () => clearInterval(interval);
  }, [loadData]);

  // Listen for developer_added flag from project page
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'developer_added') {
        loadDevelopers(true); // Force refresh
        localStorage.removeItem('developer_added'); // Clean up
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for the flag on focus (for same-tab updates)
    const handleFocus = () => {
      if (localStorage.getItem('developer_added')) {
        loadDevelopers(true); // Force refresh
        localStorage.removeItem('developer_added');
      }
    };

    window.addEventListener('focus', handleFocus);

    // Check immediately on mount in case flag was set
    if (localStorage.getItem('developer_added')) {
      loadDevelopers(true);
      localStorage.removeItem('developer_added');
    }

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [loadDevelopers]);

  const renderContent = () => {
    // Show minimal loading only for initial load
    const isInitialLoad = loading && activeTab === 'overview' && projects.length === 0 && developers.length === 0;
    
    // Debug logging
    console.log('🎯 AdminDashboard renderContent:', {
      activeTab,
      projectsLength: projects.length,
      projects: projects,
      loading,
      isInitialLoad
    });
    
    if (isInitialLoad) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-ocean"></div>
            <p className="text-sm text-gray-600 dark:text-gray-400">Loading dashboard...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case 'overview':
        return <OverviewContent 
          projects={projects} 
          developers={developers} 
          articles={articles} 
          mediaFiles={mediaFiles} 
          loadingStates={loadingStates}
        />;
      case 'projects':
        console.log('🏢 Rendering ProjectsContent with projects:', projects);
        return <ProjectsContent projects={projects} onUpdate={loadData} />;
      case 'developers':
        return <DevelopersContent developers={developers} onUpdate={loadData} />;
      case 'articles':
        return <ArticlesContent articles={articles} mediaFiles={mediaFiles} onUpdate={loadData} />;
      case 'media':
        return <MediaContent mediaFiles={mediaFiles} onUpdate={refreshMediaFiles} />;
      case 'social-media':
        return <SocialMediaContent onUpdate={loadData} />;
      case 'video-settings':
        return <VideoSettingsContent onUpdate={loadData} />;
      case 'ai-api-control':
        return <AIApiControlContent />;

      default:
        return <OverviewContent projects={projects} developers={developers} articles={articles} mediaFiles={mediaFiles} />;
    }
  };

  return (
    <div className="admin-panel min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800" style={{ pointerEvents: 'auto' }}>
      <div className="flex" style={{ pointerEvents: 'auto' }}>
        {/* Sidebar Navigation - Hidden */}
        {/* Navigation removed as requested */}

        {/* Main Content */}
        <main className="flex-1 bg-gray-50 dark:bg-gray-900 overflow-auto flex" style={{ pointerEvents: 'auto' }}>
          {/* Main Content Area */}
          <div className="flex-1 p-6">
            {/* Top Header */}
            <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 rounded-lg mb-6">
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {NAV_ITEMS.find(item => item.id === activeTab)?.label || 'Dashboard'}
                    </h1>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {NAV_ITEMS.find(item => item.id === activeTab)?.description || 'Manage your website'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Welcome back, Admin
                    </span>
                    <button
                      onClick={(e) => {
                        console.log('Logout button clicked');
                        e.preventDefault();
                        onLogout();
                      }}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer"
                      style={{ pointerEvents: 'auto' }}
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Content Container */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 min-h-[calc(100vh-200px)]" style={{ pointerEvents: 'auto' }}>
              <div className="p-6" style={{ pointerEvents: 'auto' }}>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="h-full"
                    style={{ pointerEvents: 'auto' }}
                  >
                    {renderContent()}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right Sidebar Navigation */}
          <aside className="w-80 bg-white dark:bg-gray-800 shadow-lg border-l border-gray-200 dark:border-gray-700 flex flex-col" style={{ pointerEvents: 'auto' }}>
            {/* Sidebar Header */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Navigation
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Select a section to manage
              </p>
            </div>

            {/* Navigation Items */}
            <nav className="flex-1 p-4 space-y-2">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => {
                    console.log('Navigation item clicked:', item.id);
                    setActiveTab(item.id);
                  }}
                  className={`w-full text-left p-4 rounded-lg transition-all duration-200 cursor-pointer group ${
                    activeTab === item.id
                      ? 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300'
                      : 'bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                  }`}
                  style={{ pointerEvents: 'auto' }}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1">
                      <div className="font-medium">{item.label}</div>
                      <div className="text-xs opacity-75 mt-1">{item.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </nav>
          </aside>
        </main>
      </div>
    </div>
  );
}

// Content Components
// Dashboard Overview Content
function OverviewContent({ projects, developers, articles, mediaFiles, loadingStates }: {
  projects: Project[];
  developers: Developer[];
  articles: Article[];
  mediaFiles: MediaFile[];
  loadingStates?: {
    projects: boolean;
    developers: boolean;
    articles: boolean;
    media: boolean;
  };
}) {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Dashboard Overview</h2>
        <p className="text-gray-600 dark:text-gray-400">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Projects Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border border-blue-200 dark:border-blue-700/50 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => {
            console.log('Projects card clicked');
          }}
          style={{ pointerEvents: 'auto' }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Total Projects</p>
              {loadingStates?.projects ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
              )}
            </div>
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">🏢</span>
            </div>
          </div>
        </motion.div>

        {/* Developers Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border border-green-200 dark:border-green-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Developers</p>
              {loadingStates?.developers ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-500"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{developers.length}</p>
              )}
            </div>
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">👥</span>
            </div>
          </div>
        </motion.div>

        {/* Articles Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl p-6 border border-purple-200 dark:border-purple-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Articles</p>
              {loadingStates?.articles ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{articles.length}</p>
              )}
            </div>
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-xl">📝</span>
            </div>
          </div>
        </motion.div>

        {/* Media Files Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-xl p-6 border border-orange-200 dark:border-orange-700/50"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">Media Files</p>
              {loadingStates?.media ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{mediaFiles.length}</p>
              )}
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