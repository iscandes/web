'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface VideoSettings {
  id: string;
  videoType: 'upload' | 'youtube' | 'media';
  videoUrl: string;
  youtubeUrl: string;
  title: string;
  description: string;
  isActive: boolean;
}

export default function HeroSection() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [videoSettings, setVideoSettings] = useState<VideoSettings | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to convert YouTube URL to embed format
  const convertToEmbedUrl = (url: string): string => {
    // Handle different YouTube URL formats
    const patterns = [
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&\n?#]+)/,
      /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^&\n?#]+)/,
      /(?:https?:\/\/)?youtu\.be\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) {
        return `https://www.youtube.com/embed/${match[1]}?autoplay=1&mute=1&loop=1&playlist=${match[1]}&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=1`;
      }
    }
    
    // If no pattern matches, return the original URL
    return url;
  };

  // Fetch video settings from admin panel
  useEffect(() => {
    const fetchVideoSettings = async () => {
      try {
        const response = await fetch('/api/admin/video-settings');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data.success && data.settings && data.settings.isActive) {
          setVideoSettings(data.settings);
        }
      } catch (error) {
        // Silently handle the error - video settings are optional
        // This prevents console errors while maintaining functionality
      } finally {
        setLoading(false);
      }
    };

    fetchVideoSettings();
  }, []);

  // Default fallback video URL
  const defaultVideoUrl = "https://www.youtube.com/embed/v0rr-M0WfpM?si=nwaZehMCd80OHBqr&autoplay=1&mute=1&loop=1&playlist=v0rr-M0WfpM&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&disablekb=1&fs=0&cc_load_policy=0&playsinline=1&enablejsapi=1";
  
  // Helper function to normalize media paths
  const normalizeMediaPath = (path: string): string => {
    if (!path) return path;
    
    // If already an API path, return as is
    if (path.startsWith('/api/media/')) {
      return path;
    }
    
    // Convert /media/ or /uploads/ paths to API endpoint
    if (path.startsWith('/media/') || path.startsWith('/uploads/')) {
      return `/api${path}`;
    }
    
    // For other paths, prepend /api/media/
    return `/api/media${path.startsWith('/') ? '' : '/'}${path}`;
  };

  // Use video from admin settings or fallback to default
  let videoUrl = defaultVideoUrl;
  if (videoSettings) {
    if (videoSettings.videoType === 'youtube' && videoSettings.youtubeUrl) {
      videoUrl = convertToEmbedUrl(videoSettings.youtubeUrl);
    } else if (videoSettings.videoType === 'upload' && videoSettings.videoUrl) {
      videoUrl = normalizeMediaPath(videoSettings.videoUrl);
    } else if (videoSettings.videoType === 'media' && videoSettings.videoUrl) {
      videoUrl = normalizeMediaPath(videoSettings.videoUrl);
    }
  }
  
  const videoTitle = videoSettings?.title || "Dubai Ultra HD Background Video";

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        {!loading && (
          videoSettings?.videoType === 'youtube' ? (
            <iframe
              className="absolute top-1/2 left-1/2 w-[177.77777778vh] h-[56.25vw] min-h-full min-w-full transform -translate-x-1/2 -translate-y-1/2"
              src={videoUrl}
              title={videoTitle}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              onLoad={() => setVideoLoaded(true)}
            />
          ) : (
            <video
              className="absolute top-1/2 left-1/2 w-[177.77777778vh] h-[56.25vw] min-h-full min-w-full transform -translate-x-1/2 -translate-y-1/2 object-cover"
              src={videoUrl}
              title={videoTitle}
              autoPlay
              muted
              loop
              playsInline
              onLoadedData={() => setVideoLoaded(true)}
              onError={(e) => {
                console.error('Video failed to load:', e);
                console.log('Video URL:', videoUrl);
              }}
            />
          )
        )}
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/50"></div>
      </div>
      
      {/* Loading fallback - removed notification */}
      {(loading || !videoLoaded) && (
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800">
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-tight text-white">
            <span className="block">Luxury</span>
            <span className="block bg-gradient-to-r from-green-ocean to-green-ocean-light bg-clip-text text-transparent">
              Developments
            </span>
            <span className="block text-2xl md:text-3xl lg:text-4xl font-light mt-4 text-gray-200">
              in Dubai&apos;s Future
            </span>
          </h1>
          
          <p className="text-lg md:text-xl lg:text-2xl max-w-4xl mx-auto leading-relaxed text-gray-200">
            Partner with leading developers to secure your investment in Dubai&apos;s most promising real estate projects. Premium locations, exceptional returns, and world-class amenities await.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
            <Link
              href="/projects"
              className="bg-green-ocean text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-ocean-light shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              View Developments
            </Link>
            <Link
              href="/contact"
              className="border-2 border-green-ocean text-green-ocean bg-white/90 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-green-ocean hover:text-white transform hover:scale-105 transition-all duration-300"
            >
              Schedule Meeting
            </Link>
          </div>
        </div>
      </div>




    </section>
  )
}