'use client';

import React, { useState, useEffect } from 'react';
import { Project } from '../lib/mysql-database';
import Link from 'next/link';
import ErrorBoundary from './ErrorBoundary';

interface CinematicProjectPageProps {
  projectSlug: string;
}

export default function CinematicProjectPage({ projectSlug }: CinematicProjectPageProps) {
  const normalizePath = (path: string | undefined | null): string | undefined => {
    if (!path) return undefined;
    
    // If it's already a full URL, return it as is
    if (/^https?:\/\//i.test(path)) return path;
    
    // If it's already an API path, return as is
    if (path.startsWith('/api/media/')) {
      return path;
    }
    
    // If it starts with /media/, convert to /api/media/
    if (path.startsWith('/media/')) {
      return path.replace('/media/', '/api/media/');
    }
    
    // If it starts with /uploads/, convert to /api/media/
    if (path.startsWith('/uploads/')) {
      return path.replace('/uploads/', '/api/media/');
    }
    
    // Remove 'public/' prefix if present
    let cleaned = path.replace(/^public\//, "");
    
    // Ensure path starts with a slash
    cleaned = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
    
    // For any other path, assume it needs the /api/media/ prefix
    const cleanPath = cleaned.startsWith('/') ? cleaned.substring(1) : cleaned;
    return `/api/media/${cleanPath}`;
  };

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching project with slug:', projectSlug);
        
        // Check if projectSlug is numeric (likely an ID) or a string slug
        const isNumericId = /^\d+$/.test(projectSlug);
        const endpoint = isNumericId ? `/api/projects/${projectSlug}` : `/api/projects/${encodeURIComponent(projectSlug)}`;
        
        console.log('🔗 Using API endpoint:', endpoint);
        const response = await fetch(endpoint, { cache: 'no-store' });
        
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Project data received:', data);
          console.log('🎬 Featured video:', data.featured_video);
          console.log('📁 Media files:', data.media_files);
          setProject(data);
        } else {
          console.error('❌ Project fetch failed with status:', response.status);
          setError('Project not found');
        }
      } catch (err) {
        setError('Failed to load project');
        console.error('❌ Error fetching project:', err);
      } finally {
        setLoading(false);
      }
    };

    if (projectSlug) {
      fetchProject();
    }
  }, [projectSlug]);
  
  // Initialize video when project data is loaded
  useEffect(() => {
    if (project) {
      // Add user interaction detector to help with autoplay restrictions
      const addUserInteractionDetector = () => {
        const interactionEvents = ['click', 'touchstart', 'keydown'];
        const markUserInteraction = () => {
          document.documentElement.setAttribute('data-user-interacted', 'true');
          console.log('User interaction detected, video can be unmuted now');
          
          // If video is already playing but muted, we can unmute it now
          const video = document.querySelector(`#luxury-video-${project.id}`) as HTMLVideoElement;
          if (video && !video.paused && video.muted) {
            video.muted = false;
            console.log('Unmuted video after user interaction');
          }
          
          // Remove event listeners after first interaction
          interactionEvents.forEach(event => {
            document.removeEventListener(event, markUserInteraction);
          });
        };
        
        interactionEvents.forEach(event => {
          document.addEventListener(event, markUserInteraction);
        });
      };
      
      // Add the user interaction detector
      addUserInteractionDetector();
      
      // Wait for DOM to be ready
      setTimeout(() => {
        const video = document.querySelector(`#luxury-video-${project.id}`) as HTMLVideoElement;
        if (video) {
          console.log('Initializing video element');
          // Ensure video has proper sources
          const videoSrc = getVideoSource();
          if (videoSrc && (!video.src || video.src === '')) {
            console.log('Setting initial video source:', videoSrc);
            video.src = videoSrc;
          }
          
          // Preload video
          video.load();
          
          // Try to play video automatically if possible (always start muted)
          video.muted = true; // Always start muted to bypass autoplay restrictions
          video.play().then(() => {
            console.log('Video autoplay successful (muted)');
            setIsVideoPlaying(true);
          }).catch(err => {
            console.log('Autoplay prevented by browser, waiting for user interaction', err);
            // This is expected on most browsers - they require user interaction
          });
          
          // Add error handling
          const handleVideoError = (e: Event) => {
            console.error('Video initialization error:', (e.target as HTMLVideoElement).error);
            handlePlaybackError(video);
          };
          
          video.addEventListener('error', handleVideoError);
          
          return () => {
            video.removeEventListener('error', handleVideoError);
          };
        }
      }, 500);
    }
  }, [project]);

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-2 border-amber-400 border-t-transparent rounded-full mx-auto mb-6 animate-spin"></div>
          <p className="text-white text-2xl font-light tracking-wide">Loading Experience...</p>
        </div>
      </main>
    );
  }

  if (error || !project) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-5xl font-light text-white mb-6 tracking-wide">Not Found</h1>
          <p className="text-gray-400 mb-10 text-lg leading-relaxed">{error || 'The requested project could not be found.'}</p>
          <Link 
            href="/projects" 
            className="inline-block px-8 py-4 border border-green-ocean text-green-ocean hover:bg-green-ocean hover:text-white transition-all duration-500 text-sm tracking-widest uppercase font-medium"
          >
            Return to Projects
          </Link>
        </div>
      </main>
    );
  }

  const getVideoSource = () => {
    if (!project || !project.id) {
      console.error('❌ getVideoSource called without valid project data');
      return null;
    }
    
    console.log('🎬 Getting video source for project:', project.id, project.name);
    console.log('🔍 Project slug from URL:', projectSlug);
    
    // Validate that we're getting video for the correct project
    const isNumericSlug = /^\d+$/.test(projectSlug);
    const expectedId = isNumericSlug ? parseInt(projectSlug) : null;
    
    if (expectedId && expectedId !== project.id) {
      console.error('⚠️ PROJECT MISMATCH! Expected ID:', expectedId, 'but got project ID:', project.id);
      console.error('This indicates a cross-project video issue!');
    }
    
    // First priority: Check featured_video
    if (project.featured_video) {
      console.log('✅ Using featured_video:', project.featured_video);
      const path = normalizePath(project.featured_video);
      console.log('🔗 Normalized featured_video path:', path);
      return path;
    }
    
    // Second priority: Check media_files for video type
    if (project.media_files && Array.isArray(project.media_files)) {
      console.log('Checking media_files for videos, count:', project.media_files.length);
      
      // First look for explicit video types
      const videoFile = project.media_files.find(file => 
        file.media_type === 'video' || file.type === 'video'
      );
      
      if (videoFile) {
        const videoPath = videoFile.url || videoFile.file_path;
        console.log('Found video by media_type:', videoPath);
        return normalizePath(videoPath);
      }
      
      // Then look for video extensions in urls (only .mp4 to avoid 404s)
      const videoByExtension = project.media_files.find(file => {
        const url = file.url?.toLowerCase() || '';
        const filePath = file.file_path?.toLowerCase() || '';
        const hasVideoExtension = 
          url.endsWith('.mp4') || filePath.endsWith('.mp4');
        
        if (hasVideoExtension) {
          console.log('Found file with video extension:', file);
        }
        
        return hasVideoExtension;
      });
      
      if (videoByExtension) {
        const videoPath = videoByExtension.url || videoByExtension.file_path;
        console.log('Found video by extension:', videoPath);
        return normalizePath(videoPath);
      }
      
      // Log all media files for debugging
      console.log('All media files:', JSON.stringify(project.media_files, null, 2));
    }
    
    console.log('No video found, using fallback video');
    // Fallback to a default video if none is found
    return '/videos/luxury-fallback.mp4';
  };
  
  // Verify video file exists and is accessible
  const verifyVideoSource = async (src: string) => {
    try {
      // Only check for local files, not external URLs
      if (src.startsWith('/')) {
        const response = await fetch(src, { method: 'HEAD' });
        if (!response.ok) {
          console.error(`Video file not accessible: ${src}, status: ${response.status}`);
          return false;
        }
        return true;
      }
      return true; // Assume external URLs are valid
    } catch (error) {
      console.error(`Error verifying video source: ${src}`, error);
      return false;
    }
  };

  const handleVideoPlay = async () => {
    const video = document.querySelector(`#luxury-video-${project.id}`) as HTMLVideoElement;
    
    if (!video) {
      console.error('Video element not found!');
      return;
    }
    
    console.log('Video element found, current state:', video.paused ? 'paused' : 'playing');
    console.log('Video readyState:', video.readyState);
    console.log('Video src:', video.currentSrc || video.src);
    
    // Check if video source is valid
    if (!video.src && !video.querySelector('source')?.src) {
      console.error('No valid video source found!');
      
      // Try to set the source directly if getVideoSource returns a value
      const videoSrc = getVideoSource();
      if (videoSrc) {
        // Verify the video source is accessible
        const isValid = await verifyVideoSource(videoSrc);
        
        if (isValid) {
          console.log('Setting video source directly:', videoSrc);
          video.src = videoSrc;
          video.load();
        } else {
          console.error('Video source is not accessible:', videoSrc);
          // Try to use fallback video
          video.src = '/videos/luxury-fallback.mp4';
          video.load();
        }
      } else {
        console.error('No video source available from getVideoSource');
        return;
      }
    }
    
    if (video.paused) {
      // Force video to be visible
      video.style.display = 'block';
      
      // If video hasn't loaded yet, try to load it first
      if (video.readyState < 2) { // HAVE_CURRENT_DATA or lower
        console.log('Video not ready, loading now...');
        video.load();
        
        const onCanPlay = () => {
          console.log('Video can play now, attempting playback');
          video.removeEventListener('canplay', onCanPlay);
          
          // Use a timeout to ensure the browser is ready to play
          setTimeout(() => {
            // Always start muted to bypass autoplay restrictions
            video.muted = true;
            
            video.play().then(() => {
              console.log('Video playback started successfully (muted)');
              setIsVideoPlaying(true);
              // After successful play, we can try to unmute if user has interacted with the page
              if (document.documentElement.hasAttribute('data-user-interacted')) {
                video.muted = false;
                console.log('Unmuted video after successful playback');
              }
            }).catch(secondError => {
              console.error('Video play failed even with muted:', secondError);
              handlePlaybackError(video);
            });
          }, 100);
        };
        
        video.addEventListener('canplay', onCanPlay);
      } else {
        console.log('Video already loaded, attempting playback');
        
        // Always start muted to bypass autoplay restrictions
        video.muted = true;
        
        video.play().then(() => {
          console.log('Video playback started successfully (muted)');
          setIsVideoPlaying(true);
          // After successful play, we can try to unmute if user has interacted with the page
          if (document.documentElement.hasAttribute('data-user-interacted')) {
            video.muted = false;
            console.log('Unmuted video after successful playback');
          }
        }).catch(error => {
          console.error('Video play failed:', error);
          handlePlaybackError(video);
        });
      }
    } else {
      console.log('Pausing video');
      video.pause();
      setIsVideoPlaying(false);
    }
  };
  
  const handlePlaybackError = (video: HTMLVideoElement) => {
    console.log('Handling playback error, trying alternative approaches');
    
    // Try to reload the video
    video.load();
    
    // Try with different source format
    const sources = video.querySelectorAll('source');
    let currentSourceIndex = 0;
    
    const tryNextSource = () => {
      if (currentSourceIndex < sources.length) {
        const nextSource = sources[currentSourceIndex].src;
        console.log(`Trying source ${currentSourceIndex + 1}/${sources.length}:`, nextSource);
        
        video.src = nextSource;
        video.load();
        
        setTimeout(() => {
          video.play().then(() => {
            console.log('Video retry successful with source:', nextSource);
            setIsVideoPlaying(true);
          }).catch(e => {
            console.error(`Video retry failed with source ${currentSourceIndex + 1}:`, e);
            currentSourceIndex++;
            tryNextSource();
          });
        }, 500);
      } else {
        console.error('All video sources failed');
        // Reset video source to the first one for future attempts
        if (sources.length > 0) {
          video.src = sources[0].src;
          video.load();
        }
      }
    };
    
    tryNextSource();
  };

  return (
    <ErrorBoundary>
      <main className="min-h-screen bg-black text-white overflow-hidden">
        {/* Full Screen Video Section */}
        <section className="relative h-screen w-full">
          {/* Video Background */}
          <div className="absolute inset-0">
            <video 
              id={`luxury-video-${project.id}`}
              className="w-full h-full object-cover"
              muted={isMuted}
              playsInline
              loop
              poster={normalizePath(project.image)}
              preload="auto"
              autoPlay
              style={{ display: getVideoSource() ? 'block' : 'none' }}
              onLoadedData={() => console.log('Video loaded data successfully')}
              onCanPlay={() => {
                console.log('Video can play now');
                const video = document.querySelector(`#luxury-video-${project.id}`) as HTMLVideoElement;
                if (video) {
                  video.play().catch(err => console.log('Play from canplay event failed:', err));
                }
              }}
              onPlay={() => {
                console.log('Video play event fired');
                setIsVideoPlaying(true);
              }}
              onPause={() => {
                console.log('Video pause event fired');
                setIsVideoPlaying(false);
              }}
              onEnded={() => setIsVideoPlaying(false)}
              onError={(e) => {
                const video = e.target as HTMLVideoElement;
                console.error('Video error:', video.error);
                console.error('Video src that failed:', video.currentSrc || video.src);
                // Set a data attribute to indicate error for styling
                video.setAttribute('data-error', 'true');
                // Log the error but don't try alternative formats to avoid 404s
                console.log('Video failed to load, but not attempting alternative formats to avoid 404 errors');
              }}
            >
              {getVideoSource() && <source src={getVideoSource() || ''} type="video/mp4" />}
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Elegant Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

          {/* Enhanced Navigation */}
          <nav className="absolute top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/50 to-transparent backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6 py-6">
              <div className="flex justify-between items-center">
                <Link 
                  href="/projects" 
                  className="group flex items-center space-x-4 text-white/90 hover:text-white transition-all duration-300 bg-black/20 hover:bg-black/40 px-6 py-3 rounded-full backdrop-blur-md border border-white/10 hover:border-amber-400/50"
                >
                  <div className="w-8 h-8 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <i className="ri-arrow-left-line text-xl"></i>
                  </div>
                  <span className="text-sm tracking-wide font-medium">Back to Projects</span>
                </Link>
                
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <div className="text-xs tracking-widest uppercase text-white/60 mb-1">Premium Choice</div>
                    <div className="text-sm tracking-wider text-white/90 font-medium">Real Estate</div>
                  </div>
                  <Link 
                    href="/contact" 
                    className="bg-green-ocean hover:bg-green-ocean-light text-white px-6 py-2 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105"
                  >
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Central Content */}
          <div className="absolute inset-0 flex items-center justify-center z-40 pt-20">
            <div className="text-center max-w-5xl mx-auto px-8">
              {/* Project Title */}
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-extralight mb-6 tracking-wide leading-none text-white drop-shadow-2xl">
                {project.name}
              </h1>
              
              {/* Subtitle */}
              <p className="text-lg md:text-xl lg:text-2xl font-light text-white/95 mb-8 tracking-wide max-w-3xl mx-auto leading-relaxed drop-shadow-lg">
                {project.display_title || project.description}
              </p>



              {/* Play Button */}
              <button 
                onClick={(e) => {
                  e.preventDefault();
                  handleVideoPlay();
                }}
                className="group relative w-24 h-24 mx-auto mb-16 transition-all duration-500 hover:scale-110"
              >
                <div className="absolute inset-0 border border-green-ocean rounded-full group-hover:border-2 transition-all duration-300"></div>
                <div className="absolute inset-2 bg-green-ocean/10 rounded-full group-hover:bg-green-ocean/20 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {isVideoPlaying ? (
                    <i className="ri-pause-line text-2xl text-green-ocean"></i>
                  ) : (
                    <i className="ri-play-fill text-2xl text-green-ocean ml-1"></i>
                  )}
                </div>
              </button>

              {/* Project Meta */}
              <div className="flex items-center justify-center space-x-12 text-sm tracking-widest uppercase text-white/70">
                <div className="flex items-center space-x-2">
                  <i className="ri-building-line text-amber-400"></i>
                  <span>{project.developer}</span>
                </div>
                <div className="w-px h-4 bg-white/30"></div>
                <div className="flex items-center space-x-2">
                  <i className="ri-map-pin-line text-amber-400"></i>
                  <span>{project.location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Bottom Info Panel */}
          <div className="absolute bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-black/80 via-black/40 to-transparent backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-8 py-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                <div className="text-center bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:border-amber-400/30 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-light text-amber-400 mb-2">{project.bedrooms}</div>
                  <div className="text-xs tracking-widest uppercase text-white/70 font-medium">Bedrooms</div>
                </div>
                <div className="text-center bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:border-amber-400/30 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-light text-amber-400 mb-2">{project.bathrooms}</div>
                  <div className="text-xs tracking-widest uppercase text-white/70 font-medium">Bathrooms</div>
                </div>
                <div className="text-center bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:border-amber-400/30 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-light text-amber-400 mb-2">{project.area}</div>
                  <div className="text-xs tracking-widest uppercase text-white/70 font-medium">Area</div>
                </div>
                <div className="text-center bg-black/30 backdrop-blur-md rounded-lg p-4 border border-white/10 hover:border-amber-400/30 transition-all duration-300">
                  <div className="text-2xl md:text-3xl font-light text-amber-400 mb-2">{project.starting_price}</div>
                  <div className="text-xs tracking-widest uppercase text-white/70 font-medium">Starting Price</div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-8 right-8 z-50 flex space-x-4">
            <button
                onClick={() => {
                  const video = document.querySelector(`#luxury-video-${project.id}`) as HTMLVideoElement;
                  if (video) {
                    const newMutedState = !video.muted;
                    video.muted = newMutedState;
                    setIsMuted(newMutedState);
                    console.log('Video mute toggled:', newMutedState ? 'muted' : 'unmuted');
                  }
                }}
                className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:border-amber-400 transition-all duration-300"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                <i className={`${isMuted ? 'ri-volume-mute-line' : 'ri-volume-up-line'} text-lg`}></i>
              </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const video = document.querySelector(`#luxury-video-${project.id}`) as HTMLVideoElement;
                if (video && video.requestFullscreen) {
                  video.requestFullscreen();
                }
              }}
              className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:border-amber-400 transition-all duration-300"
            >
              <i className="ri-fullscreen-line text-lg"></i>
            </button>
          </div>
        </section>

        {/* Luxury Details Section */}
        <section className="relative bg-gradient-to-b from-black to-gray-900 py-24">
          <div className="max-w-6xl mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Project Description */}
              <div>
                <h2 className="text-4xl font-light mb-8 tracking-wide">Experience Luxury</h2>
                <p className="text-lg text-gray-300 leading-relaxed mb-12 font-light">
                  {project.description}
                </p>
                
                {/* Features */}
                {project.features && Array.isArray(project.features) && project.features.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-light tracking-wide text-green-ocean mb-6">Premium Features</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {project.features.slice(0, 6).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-4 text-gray-300">
                          <div className="w-2 h-2 bg-green-ocean rounded-full"></div>
                          <span className="font-light tracking-wide">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Contact Section */}
              <div className="bg-gradient-to-br from-gray-900 to-black p-12 rounded-lg border border-amber-400/20">
                <h3 className="text-3xl font-light mb-6 tracking-wide">Exclusive Viewing</h3>
                <p className="text-gray-300 mb-8 font-light leading-relaxed">
                  Schedule a private viewing of {project.name} and discover luxury redefined.
                </p>
                
                <div className="space-y-4">
                  <Link 
                    href="/contact" 
                    className="block w-full py-4 bg-green-ocean text-white text-center font-medium tracking-widest uppercase hover:bg-green-ocean-light transition-all duration-300"
                  >
                    Schedule Viewing
                  </Link>
                  
                  {project.presentation_file && (
                    <a 
                      href={project.presentation_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-4 border border-green-ocean text-green-ocean text-center font-medium tracking-widest uppercase hover:bg-green-ocean hover:text-white transition-all duration-300"
                    >
                      Download Brochure
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exclusive Viewing Section */}
        <section className="bg-gradient-to-r from-green-ocean/20 to-green-ocean-light/20 py-16">
          <div className="max-w-7xl mx-auto px-8 text-center">
            <h2 className="text-3xl font-light text-white mb-4 tracking-wide">
              Exclusive Viewing Experience
            </h2>
            <p className="text-xl text-gray-300 mb-8 font-light">
              Schedule a private viewing and experience luxury living firsthand
            </p>
            <Link
              href="/contact"
              className="inline-block bg-green-ocean text-white px-8 py-4 font-medium text-lg hover:bg-green-ocean-light shadow-lg transform hover:scale-105 transition-all duration-300 tracking-widest uppercase"
            >
              Schedule Viewing
            </Link>
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
}