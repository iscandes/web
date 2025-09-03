'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaFile } from '@/lib/mysql-database';

interface VideoSettings {
  id?: string;
  videoType: 'media' | 'youtube';
  videoUrl: string;
  youtubeUrl: string;
  selectedMediaId?: string;
  title: string;
  description: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface VideoSettingsContentProps {
  onUpdate?: () => void;
}

export default function VideoSettingsContent({ onUpdate }: VideoSettingsContentProps) {
  const [videoSettings, setVideoSettings] = useState<VideoSettings>({
    videoType: 'youtube',
    videoUrl: '',
    youtubeUrl: 'https://www.youtube.com/embed/v0rr-M0WfpM?si=nwaZehMCd80OHBqr&autoplay=1&mute=1&loop=1&playlist=v0rr-M0WfpM&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=1',
    title: 'Dubai Ultra HD Background Video',
    description: 'Premium real estate showcase video for the landing page',
    isActive: true
  });
  
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [showMediaBrowser, setShowMediaBrowser] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<MediaFile | null>(null);

  // Load current video settings and media files on mount
  useEffect(() => {
    const initializeData = async () => {
      await loadMediaFiles();
      await loadVideoSettings();
    };
    initializeData();
  }, []);

  const loadVideoSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/video-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          // Map 'upload' type from API to 'media' type for frontend
          const mappedSettings = {
            ...data.settings,
            videoType: data.settings.videoType === 'upload' ? 'media' : data.settings.videoType
          };
          setVideoSettings(mappedSettings);
          
          // If there's a selected media ID and we have media files loaded, find and set the selected media
          if (data.settings.selectedMediaId) {
            // We need to wait for media files to be loaded first
            const mediaResponse = await fetch('/api/admin/media');
            if (mediaResponse.ok) {
              const mediaData = await mediaResponse.json();
              if (mediaData.success) {
                const videoFiles = mediaData.data.filter((file: MediaFile) => 
                  file.mime_type?.startsWith('video/')
                );
                const media = videoFiles.find((m: MediaFile) => m.id === data.settings.selectedMediaId);
                if (media) {
                  setSelectedMedia(media);
                  setMediaFiles(videoFiles);
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Error loading video settings:', error);
      setMessage({ type: 'error', text: 'Failed to load video settings' });
    } finally {
      setLoading(false);
    }
  };

  // Load media files for selection
  const loadMediaFiles = async () => {
    try {
      const response = await fetch('/api/admin/media');
      console.log('Media API response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Media API data:', data);
        if (data.success) {
          // Filter only video files
          const videoFiles = data.data.filter((file: MediaFile) => 
            file.mime_type?.startsWith('video/')
          );
          console.log('Filtered video files:', videoFiles);
          setMediaFiles(videoFiles);
        } else {
          console.error('Media API returned success: false');
        }
      } else {
        console.error('Media API response not ok:', response.status);
      }
    } catch (error) {
      console.error('Error loading media files:', error);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      const settingsToSave = {
        ...videoSettings,
        // Map 'media' type to 'upload' for API compatibility
        videoType: videoSettings.videoType === 'media' ? 'upload' : videoSettings.videoType,
        selectedMediaId: videoSettings.videoType === 'media' ? selectedMedia?.id : null,
        // Set videoUrl to the selected media file path if using media
        videoUrl: videoSettings.videoType === 'media' && selectedMedia ? selectedMedia.file_path : videoSettings.videoUrl
      };
      
      console.log('Saving video settings:', settingsToSave);
      
      const response = await fetch('/api/admin/video-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settingsToSave),
      });

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (response.ok) {
        const result = await response.json();
        console.log('Save result:', result);
        setMessage({ type: 'success', text: 'Video settings saved successfully!' });
        onUpdate?.();
      } else {
        // Get detailed error information
        let errorMessage = 'Failed to save video settings';
        try {
          const errorData = await response.json();
          console.error('Error response:', errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (parseError) {
          console.error('Could not parse error response:', parseError);
          errorMessage = `Server error: ${response.status} ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error saving video settings:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to save video settings. Please try again.';
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setSaving(false);
    }
  };

  // Handle media selection
  const handleMediaSelect = (media: MediaFile) => {
    setSelectedMedia(media);
    setVideoSettings(prev => ({
      ...prev,
      videoType: 'media',
      videoUrl: media.file_path,
      selectedMediaId: media.id?.toString()
    }));
    setShowMediaBrowser(false);
    setMessage({ type: 'success', text: 'Video selected successfully!' });
  };

  // Handle media browser toggle
  const toggleMediaBrowser = () => {
    setShowMediaBrowser(!showMediaBrowser);
  };

  const extractYouTubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const generateEmbedUrl = (youtubeUrl: string): string => {
    const videoId = extractYouTubeId(youtubeUrl);
    if (!videoId) return youtubeUrl;
    
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=1`;
  };

  const handleYouTubeUrlChange = (url: string) => {
    setVideoSettings(prev => ({
      ...prev,
      youtubeUrl: url,
      videoUrl: generateEmbedUrl(url)
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-green-ocean border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Video Settings</h2>
          <p className="text-brand-gray">Manage the landing page background video</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="bg-green-ocean text-white px-6 py-2 rounded-lg font-medium hover:bg-green-ocean-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Saving...
            </>
          ) : (
            <>
              <span>💾</span>
              Save Settings
            </>
          )}
        </button>
      </div>

      {/* Message */}
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/30 text-green-400' 
                : 'bg-red-500/20 border border-red-500/30 text-red-400'
            }`}
          >
            {message.text}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Video Type Selection */}
      <div className="bg-luxury-black-light rounded-xl p-6 border border-green-ocean/20">
        <h3 className="text-lg font-semibold text-white mb-4">Video Source</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => setVideoSettings(prev => ({ ...prev, videoType: 'youtube' }))}
            className={`p-4 rounded-lg border-2 transition-all ${
              videoSettings.videoType === 'youtube'
                ? 'border-green-ocean bg-green-ocean/10 text-white'
                : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📺</span>
              <div className="text-left">
                <div className="font-medium">YouTube Video</div>
                <div className="text-sm opacity-75">Use a YouTube video URL</div>
              </div>
            </div>
          </button>
          
          <button
            onClick={() => setVideoSettings(prev => ({ ...prev, videoType: 'media' }))}
            className={`p-4 rounded-lg border-2 transition-all ${
              videoSettings.videoType === 'media'
                ? 'border-green-ocean bg-green-ocean/10 text-white'
                : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📁</span>
              <div className="text-left">
                <div className="font-medium">Media Library</div>
                <div className="text-sm opacity-75">Select from uploaded videos</div>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Video Configuration */}
      <div className="bg-luxury-black-light rounded-xl p-6 border border-green-ocean/20">
        <h3 className="text-lg font-semibold text-white mb-4">Video Configuration</h3>
        
        <div className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Video Title
            </label>
            <input
              type="text"
              value={videoSettings.title}
              onChange={(e) => setVideoSettings(prev => ({ ...prev, title: e.target.value }))}
              className="w-full bg-luxury-black text-white px-4 py-2 rounded-lg border border-green-ocean/20 focus:border-green-ocean focus:outline-none"
              placeholder="Enter video title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={videoSettings.description}
              onChange={(e) => setVideoSettings(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full bg-luxury-black text-white px-4 py-2 rounded-lg border border-green-ocean/20 focus:border-green-ocean focus:outline-none"
              placeholder="Enter video description"
            />
          </div>

          {/* YouTube URL Input */}
          {videoSettings.videoType === 'youtube' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={videoSettings.youtubeUrl}
                onChange={(e) => handleYouTubeUrlChange(e.target.value)}
                className="w-full bg-luxury-black text-white px-4 py-2 rounded-lg border border-green-ocean/20 focus:border-green-ocean focus:outline-none"
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <p className="text-sm text-gray-400 mt-1">
                Enter a YouTube video URL. It will be automatically converted to an embed URL.
              </p>
            </div>
          )}

          {/* Media Library Selection */}
          {videoSettings.videoType === 'media' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Select Video from Media Library
              </label>
              <div className="space-y-3">
                {selectedMedia ? (
                  <div className="flex items-center justify-between p-3 bg-luxury-black border border-green-ocean/20 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🎬</span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{selectedMedia.original_name}</p>
                        <p className="text-gray-400 text-sm">{(selectedMedia.file_size / (1024 * 1024)).toFixed(2)} MB</p>
                      </div>
                    </div>
                    <button
                      onClick={toggleMediaBrowser}
                      className="px-3 py-1 bg-green-ocean text-white rounded-lg hover:bg-green-ocean-light transition-colors"
                    >
                      Change
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={toggleMediaBrowser}
                    className="w-full p-4 border-2 border-dashed border-green-ocean/30 rounded-lg text-gray-400 hover:border-green-ocean hover:text-green-400 transition-colors"
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-4xl">🎬</span>
                      <span>Select Video from Media Library</span>
                      <span className="text-sm text-gray-500">Choose from your uploaded videos</span>
                    </div>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Active Status */}
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="video-active"
              checked={videoSettings.isActive}
              onChange={(e) => setVideoSettings(prev => ({ ...prev, isActive: e.target.checked }))}
              className="w-4 h-4 text-green-ocean bg-luxury-black border-green-ocean/20 rounded focus:ring-green-ocean focus:ring-2"
            />
            <label htmlFor="video-active" className="text-sm font-medium text-gray-300">
              Enable this video on the landing page
            </label>
          </div>
        </div>
      </div>

      {/* Preview */}
      {(videoSettings.videoUrl || videoSettings.youtubeUrl) && (
        <div className="bg-luxury-black-light rounded-xl p-6 border border-green-ocean/20">
          <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              src={videoSettings.videoType === 'youtube' ? videoSettings.videoUrl : videoSettings.videoUrl}
              className="w-full h-full"
              title={videoSettings.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}

      {/* Media Browser Modal */}
      <AnimatePresence>
        {showMediaBrowser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowMediaBrowser(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-luxury-black border border-green-ocean/20 rounded-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Select Video from Media Library</h3>
                <button
                  onClick={() => setShowMediaBrowser(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto max-h-[60vh]">
                {mediaFiles.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🎬</div>
                    <p className="text-gray-400">No video files found in media library</p>
                    <p className="text-sm text-gray-500 mt-2">Upload some videos to the media library first</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {mediaFiles.map((media) => (
                      <div
                        key={media.id}
                        className="bg-gray-800 border border-gray-700 rounded-lg p-4 hover:border-green-ocean/50 transition-colors cursor-pointer"
                        onClick={() => handleMediaSelect(media)}
                      >
                        <div className="aspect-video bg-gray-700 rounded-lg mb-3 flex items-center justify-center">
                          <span className="text-3xl">🎬</span>
                        </div>
                        <h4 className="text-white font-medium truncate mb-1">{media.original_name}</h4>
                        <p className="text-gray-400 text-sm">
                          {(media.file_size / (1024 * 1024)).toFixed(2)} MB
                        </p>
                        <p className="text-gray-500 text-xs mt-1">
                          {new Date(media.created_at || 0).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}