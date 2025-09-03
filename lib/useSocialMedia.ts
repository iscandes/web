'use client';

import { useState, useEffect, useCallback } from 'react';

export interface SocialMediaSettings {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  youtube?: string;
  tiktok?: string;
  whatsapp?: string;
  telegram?: string;
}

interface UseSocialMediaReturn {
  socialMedia: SocialMediaSettings;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

// Global state for social media settings
let globalSocialMedia: SocialMediaSettings = {};
let globalLoading = false; // Changed from true to false
let globalError: string | null = null;
let hasInitialized = false; // Track if we've attempted initial fetch
const subscribers = new Set<() => void>();

// Subscribe to global state changes
const subscribe = (callback: () => void) => {
  subscribers.add(callback);
  return () => {
    subscribers.delete(callback);
  };
};

// Notify all subscribers of state changes
const notifySubscribers = () => {
  subscribers.forEach(callback => callback());
};

// Fetch social media settings from API
const fetchSocialMediaSettings = async (): Promise<void> => {
  if (globalLoading) return;
  
  try {
    globalLoading = true;
    globalError = null;
    notifySubscribers();

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
    
    const response = await fetch('/api/admin/settings', {
      signal: controller.signal,
      headers: {
        'Cache-Control': 'no-cache',
        'Accept': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`Social media settings API returned ${response.status}: ${response.statusText}`);
      globalSocialMedia = {};
      return;
    }
    
    const data = await response.json();

    if (data.success && data.data?.social) {
      globalSocialMedia = data.data.social;
    } else {
      // Fallback to empty object if no social data
      globalSocialMedia = {};
    }
  } catch (error) {
    // Silently handle common network errors to reduce console noise
    if (error instanceof Error && error.name !== 'AbortError' && error.name !== 'TypeError') {
      console.warn('Error fetching social media settings:', error.message);
      globalError = 'Failed to load social media settings';
    }
    globalSocialMedia = {};
  } finally {
    globalLoading = false;
    notifySubscribers();
  }
};

// Auto-sync system using polling only
let syncInterval: NodeJS.Timeout | null = null;
let isAutoSyncEnabled = false;

const startAutoSync = () => {
  if (isAutoSyncEnabled) return;
  
  isAutoSyncEnabled = true;
  startPolling();
};

const startPolling = () => {
  if (syncInterval) return;
  
  // Poll every 5 minutes for changes (optimized frequency to reduce server load)
  syncInterval = setInterval(async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout
      
      const response = await fetch('/api/admin/settings', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
          'Accept': 'application/json'
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        // Don't throw for 404 or 500 errors, just log them
        console.warn(`Social media settings API returned ${response.status}: ${response.statusText}`);
        return;
      }
      
      const data = await response.json();
      
      if (data.success && data.data?.social) {
        const newSocialMedia = data.data.social;
        
        // Only update if data has changed
        if (JSON.stringify(newSocialMedia) !== JSON.stringify(globalSocialMedia)) {
          globalSocialMedia = newSocialMedia;
          notifySubscribers();
        }
      }
    } catch (error) {
      // Silently handle abort errors and network issues to prevent console spam
      if (error instanceof Error && error.name !== 'AbortError' && error.name !== 'TypeError') {
        console.warn('Social media settings sync error:', error.message);
      }
    }
  }, 300000); // 5 minutes (300 seconds)
};

const stopAutoSync = () => {
  if (syncInterval) {
    clearInterval(syncInterval);
    syncInterval = null;
  }
  isAutoSyncEnabled = false;
};

// Custom hook for using social media settings
export const useSocialMedia = (enableAutoSync: boolean = true): UseSocialMediaReturn => {
  const [localState, setLocalState] = useState({
    socialMedia: globalSocialMedia,
    loading: globalLoading,
    error: globalError
  });

  // Subscribe to global state changes
  useEffect(() => {
    const unsubscribe = subscribe(() => {
      setLocalState({
        socialMedia: globalSocialMedia,
        loading: globalLoading,
        error: globalError
      });
    });

    return unsubscribe;
  }, []);

  // Initial fetch and auto-sync setup
  useEffect(() => {
    // Initial fetch if not already loaded
    if (!hasInitialized) {
      hasInitialized = true;
      fetchSocialMediaSettings();
    }

    // Start auto-sync if enabled
    if (enableAutoSync) {
      startAutoSync();
    }

    // Cleanup on unmount
    return () => {
      if (enableAutoSync) {
        stopAutoSync();
      }
    };
  }, [enableAutoSync]);

  const refetch = useCallback(async () => {
    await fetchSocialMediaSettings();
  }, []);

  return {
    socialMedia: localState.socialMedia,
    loading: localState.loading,
    error: localState.error,
    refetch
  };
};

// Utility function to update social media settings and notify all subscribers
export const updateSocialMediaSettings = (newSettings: SocialMediaSettings) => {
  globalSocialMedia = newSettings;
  globalLoading = false;
  globalError = null;
  notifySubscribers();
};

// Utility function to get current social media settings without subscribing
export const getCurrentSocialMediaSettings = (): SocialMediaSettings => {
  return globalSocialMedia;
};