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
    if (/^https?:\/\//i.test(path)) return path;
    const cleaned = path.replace(/^public\//, "");
    const normalizedPath = cleaned.startsWith("/") ? cleaned : `/${cleaned}`;
    return normalizedPath;
  };

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        console.log('🔍 Fetching project with slug:', projectSlug);
        const response = await fetch(`/api/projects/${projectSlug}`, { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          console.log('📊 Project data received:', data);
          console.log('🎬 Featured video:', data.featured_video);
          console.log('📁 Media files:', data.media_files);
          setProject(data);
        } else {
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
            className="inline-block px-8 py-4 border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-500 text-sm tracking-widest uppercase font-medium"
          >
            Return to Projects
          </Link>
        </div>
      </main>
    );
  }

  const getVideoSource = () => {
    if (project.featured_video) {
      return normalizePath(project.featured_video);
    }
    
    if (project.media_files && Array.isArray(project.media_files)) {
      const videoFile = project.media_files.find(file => 
        file.media_type === 'video' || file.type === 'video' || 
        (file.url && (file.url.includes('.mp4') || file.url.includes('.webm') || file.url.includes('.mov')))
      );
      if (videoFile) {
        return normalizePath(videoFile.url || (videoFile as any).file_path);
      }
    }
    
    return project.image; // Fallback to project image if no video
  };

  const handleVideoPlay = () => {
    const video = document.querySelector(`#luxury-video-${project.id}`) as HTMLVideoElement;
    
    if (video) {
      if (video.paused) {
        // If video hasn't loaded yet, try to load it first
        if (video.readyState === 0) {
          video.load();
          const onCanPlay = () => {
            video.removeEventListener('canplay', onCanPlay);
            video.play().then(() => {
              setIsVideoPlaying(true);
            }).catch(error => {
              console.error('Video play failed:', error);
            });
          };
          video.addEventListener('canplay', onCanPlay);
        } else {
          video.play().then(() => {
            setIsVideoPlaying(true);
          }).catch(error => {
            console.error('Video play failed:', error);
            // Try to reload and play again
            video.load();
            setTimeout(() => {
              video.play().then(() => {
                setIsVideoPlaying(true);
              }).catch(e => console.error('Video retry failed:', e));
            }, 1000);
          });
        }
      } else {
        video.pause();
        setIsVideoPlaying(false);
      }
    }
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
              muted
              playsInline
              loop
              poster={normalizePath(project.image)}
              preload="metadata"
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onEnded={() => setIsVideoPlaying(false)}
              onError={(e) => {
                const video = e.target as HTMLVideoElement;
                console.error('Video error:', video.error);
              }}
            >
              <source src={getVideoSource()} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>

          {/* Elegant Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>

          {/* Luxury Navigation */}
          <nav className="absolute top-0 left-0 right-0 z-50 p-8">
            <div className="flex justify-between items-center">
              <Link 
                href="/projects" 
                className="group flex items-center space-x-3 text-white/80 hover:text-white transition-all duration-300"
              >
                <div className="w-10 h-10 border border-white/30 rounded-full flex items-center justify-center group-hover:border-amber-400 group-hover:bg-amber-400/10 transition-all duration-300">
                  <i className="ri-arrow-left-line text-lg"></i>
                </div>
                <span className="text-sm tracking-widest uppercase font-light">Back to Projects</span>
              </Link>
              
              <div className="text-right">
                <div className="text-xs tracking-widest uppercase text-white/60 mb-1">Premium Choice</div>
                <div className="text-sm tracking-wider text-white/80">Real Estate</div>
              </div>
            </div>
          </nav>

          {/* Central Content */}
          <div className="absolute inset-0 flex items-center justify-center z-40">
            <div className="text-center max-w-4xl mx-auto px-8">
              {/* Project Title */}
              <h1 className="text-6xl md:text-8xl font-extralight mb-8 tracking-wide leading-none">
                {project.name}
              </h1>
              
              {/* Subtitle */}
              <p className="text-xl md:text-2xl font-light text-white/90 mb-12 tracking-wide max-w-2xl mx-auto leading-relaxed">
                {project.display_title || project.description}
              </p>



              {/* Play Button */}
              <button 
                onClick={handleVideoPlay}
                className="group relative w-24 h-24 mx-auto mb-16 transition-all duration-500 hover:scale-110"
              >
                <div className="absolute inset-0 border border-amber-400 rounded-full group-hover:border-2 transition-all duration-300"></div>
                <div className="absolute inset-2 bg-amber-400/10 rounded-full group-hover:bg-amber-400/20 transition-all duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {isVideoPlaying ? (
                    <i className="ri-pause-line text-2xl text-amber-400"></i>
                  ) : (
                    <i className="ri-play-fill text-2xl text-amber-400 ml-1"></i>
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

          {/* Bottom Info Panel */}
          <div className="absolute bottom-0 left-0 right-0 z-40 p-8">
            <div className="max-w-7xl mx-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-3xl font-light text-amber-400 mb-2">{project.bedrooms}</div>
                  <div className="text-xs tracking-widest uppercase text-white/60">Bedrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-amber-400 mb-2">{project.bathrooms}</div>
                  <div className="text-xs tracking-widest uppercase text-white/60">Bathrooms</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-amber-400 mb-2">{project.area}</div>
                  <div className="text-xs tracking-widest uppercase text-white/60">Area</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-light text-amber-400 mb-2">{project.starting_price}</div>
                  <div className="text-xs tracking-widest uppercase text-white/60">Starting Price</div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Controls */}
          <div className="absolute bottom-8 right-8 z-50 flex space-x-4">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                const video = document.querySelector(`#luxury-video-${project.id}`) as HTMLVideoElement;
                if (video) {
                  video.muted = !video.muted;
                }
              }}
              className="w-12 h-12 border border-white/30 rounded-full flex items-center justify-center text-white/70 hover:text-white hover:border-amber-400 transition-all duration-300"
            >
              <i className="ri-volume-mute-line text-lg"></i>
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
                    <h3 className="text-xl font-light tracking-wide text-amber-400 mb-6">Premium Features</h3>
                    <div className="grid grid-cols-1 gap-4">
                      {project.features.slice(0, 6).map((feature, index) => (
                        <div key={index} className="flex items-center space-x-4 text-gray-300">
                          <div className="w-2 h-2 bg-amber-400 rounded-full"></div>
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
                    className="block w-full py-4 bg-amber-400 text-black text-center font-medium tracking-widest uppercase hover:bg-amber-300 transition-all duration-300"
                  >
                    Schedule Viewing
                  </Link>
                  
                  {project.presentation_file && (
                    <a 
                      href={project.presentation_file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full py-4 border border-amber-400 text-amber-400 text-center font-medium tracking-widest uppercase hover:bg-amber-400 hover:text-black transition-all duration-300"
                    >
                      Download Brochure
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </ErrorBoundary>
  );
}