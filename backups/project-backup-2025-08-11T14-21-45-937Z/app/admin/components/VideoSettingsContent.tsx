'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VideoSettings {
  id?: string;
  videoType: 'upload' | 'youtube';
  videoUrl: string;
  youtubeUrl: string;
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
  const [uploadProgress, setUploadProgress] = useState(0);

  // Load current video settings
  useEffect(() => {
    loadVideoSettings();
  }, []);

  const loadVideoSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/video-settings');
      if (response.ok) {
        const data = await response.json();
        if (data.settings) {
          setVideoSettings(data.settings);
        }
      }
    } catch (error) {
      console.error('Error loading video settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    
    try {
      console.log('Saving video settings:', videoSettings);
      
      const response = await fetch('/api/admin/video-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(videoSettings),
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

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('video/')) {
      setMessage({ type: 'error', text: 'Please select a valid video file.' });
      return;
    }

    // Validate file size (max 100MB)
    if (file.size > 100 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'File size must be less than 100MB.' });
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    setSaving(true);
    setUploadProgress(0);
    setMessage(null);

    try {
      const xhr = new XMLHttpRequest();
      
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = (e.loaded / e.total) * 100;
          setUploadProgress(progress);
        }
      });

      xhr.onload = () => {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          setVideoSettings(prev => ({
            ...prev,
            videoUrl: response.videoUrl,
            videoType: 'upload'
          }));
          setMessage({ type: 'success', text: 'Video uploaded successfully!' });
        } else {
          setMessage({ type: 'error', text: 'Failed to upload video.' });
        }
        setSaving(false);
        setUploadProgress(0);
      };

      xhr.onerror = () => {
        setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
        setSaving(false);
        setUploadProgress(0);
      };

      xhr.open('POST', '/api/admin/upload-video');
      xhr.send(formData);
    } catch (error) {
      console.error('Error uploading video:', error);
      setMessage({ type: 'error', text: 'Upload failed. Please try again.' });
      setSaving(false);
      setUploadProgress(0);
    }
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
            onClick={() => setVideoSettings(prev => ({ ...prev, videoType: 'upload' }))}
            className={`p-4 rounded-lg border-2 transition-all ${
              videoSettings.videoType === 'upload'
                ? 'border-green-ocean bg-green-ocean/10 text-white'
                : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500'
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">📁</span>
              <div className="text-left">
                <div className="font-medium">Upload Video</div>
                <div className="text-sm opacity-75">Upload your own video file</div>
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

          {/* File Upload */}
          {videoSettings.videoType === 'upload' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Upload Video File
              </label>
              <div className="border-2 border-dashed border-green-ocean/30 rounded-lg p-6 text-center">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="video-upload"
                  disabled={saving}
                />
                <label
                  htmlFor="video-upload"
                  className={`cursor-pointer ${saving ? 'cursor-not-allowed opacity-50' : ''}`}
                >
                  <div className="text-4xl mb-2">🎬</div>
                  <div className="text-white font-medium mb-1">
                    {saving ? 'Uploading...' : 'Click to upload video'}
                  </div>
                  <div className="text-sm text-gray-400">
                    Supports MP4, WebM, AVI (Max 100MB)
                  </div>
                </label>
                
                {/* Upload Progress */}
                {saving && uploadProgress > 0 && (
                  <div className="mt-4">
                    <div className="bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-green-ocean h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                    <div className="text-sm text-gray-400 mt-1">
                      {Math.round(uploadProgress)}% uploaded
                    </div>
                  </div>
                )}
              </div>
              
              {videoSettings.videoUrl && (
                <div className="mt-2 text-sm text-green-400">
                  ✅ Video uploaded: {videoSettings.videoUrl}
                </div>
              )}
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
    </div>
  );
}