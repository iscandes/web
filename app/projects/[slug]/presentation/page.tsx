'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams } from 'next/navigation';
import { Project } from '../../../../lib/mysql-database';

interface PresentationSlide {
  id: string;
  title: string;
  content: string;
  image_url: string;
  background_image?: string;
  voice_over_url?: string;
  duration: number;
  order: number;
}

export default function ProjectPresentationPage() {
  const params = useParams();
  const projectSlug = params.slug as string;
  
  const [slides, setSlides] = useState<PresentationSlide[]>([]);
  const [project, setProject] = useState<Project | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      try {
        setLoading(true);
        
        // Fetch project data
        const projectResponse = await fetch(`/api/projects/${projectSlug}`);
        if (!projectResponse.ok) {
          throw new Error('Project not found');
        }
        
        const projectData = await projectResponse.json();
        setProject(projectData);
        
        // Set slides from project data or create default slides
        if (projectData.presentation_slides && projectData.presentation_slides.length > 0) {
          setSlides(projectData.presentation_slides.sort((a: PresentationSlide, b: PresentationSlide) => a.order - b.order));
        } else {
          // Create default slides if none exist
          const defaultSlides: PresentationSlide[] = [
            {
              id: '1',
              title: `Welcome to ${projectData.name}`,
              content: projectData.description || 'Discover luxury living at its finest.',
              image_url: projectData.image,
              duration: 5000,
              order: 1
            }
          ];
          setSlides(defaultSlides);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load project');
      } finally {
        setLoading(false);
      }
    };

    if (projectSlug) {
      fetchProjectData();
    }
  }, [projectSlug]);

  // Auto-advance slides when playing
  useEffect(() => {
    if (!isPlaying || slides.length === 0) return;

    const timer = setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, slides[currentSlide]?.duration || 5000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentSlide, slides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-brand-green border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-error-warning-line text-3xl text-red-400"></i>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Presentation Not Found</h1>
          <p className="text-brand-gray mb-6">{error || 'The requested presentation could not be loaded.'}</p>
          <Link
            href="/projects"
            className="inline-flex items-center space-x-2 bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-green-dark transition-colors"
          >
            <i className="ri-arrow-left-line"></i>
            <span>Back to Projects</span>
          </Link>
        </div>
      </div>
    );
  }

  const currentSlideData = slides[currentSlide];

  return (
    <div className="min-h-screen bg-brand-dark">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-50 p-6">
        <div className="flex items-center justify-between">
          <Link
            href={`/projects/${projectSlug}`}
            className="flex items-center space-x-2 text-white hover:text-brand-green transition-colors"
          >
            <i className="ri-arrow-left-line text-xl"></i>
            <span>Back to Project</span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="text-white text-sm">
              {currentSlide + 1} / {slides.length}
            </div>
            <Link
              href="/projects"
              className="text-white hover:text-brand-green transition-colors"
            >
              <i className="ri-close-line text-xl"></i>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Presentation Area */}
      <div className="relative h-screen">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0"
            style={{
              backgroundImage: `url(${currentSlideData?.background_image || currentSlideData?.image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>
            
            {/* Content */}
            <div className="relative z-10 h-full flex items-center justify-center">
              <div className="text-center max-w-4xl px-6">
                <motion.h1
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-4xl md:text-6xl font-bold text-white mb-6 font-serif"
                >
                  {currentSlideData?.title}
                </motion.h1>
                
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-xl md:text-2xl text-brand-light max-w-3xl mx-auto leading-relaxed"
                >
                  {currentSlideData?.content}
                </motion.p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Controls */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-50">
          <div className="flex items-center space-x-4 bg-black/50 backdrop-blur-lg rounded-full px-6 py-3">
            <button
              onClick={prevSlide}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              disabled={slides.length <= 1}
            >
              <i className="ri-arrow-left-line"></i>
            </button>
            
            <button
              onClick={togglePlayback}
              className="w-12 h-12 bg-brand-green hover:bg-brand-green-dark rounded-full flex items-center justify-center text-white transition-colors"
            >
              <i className={`ri-${isPlaying ? 'pause' : 'play'}-line text-lg`}></i>
            </button>
            
            <button
              onClick={nextSlide}
              className="w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
              disabled={slides.length <= 1}
            >
              <i className="ri-arrow-right-line"></i>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        {isPlaying && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
            <motion.div
              className="h-full bg-brand-green"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ 
                duration: (currentSlideData?.duration || 5000) / 1000,
                ease: 'linear'
              }}
              key={currentSlide}
            />
          </div>
        )}

        {/* Slide Indicators */}
        {slides.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 z-40">
            <div className="flex space-x-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentSlide ? 'bg-brand-green' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}