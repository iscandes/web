'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Project } from '@/lib/mysql-database';

// Project Card Component
function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative overflow-hidden rounded-xl bg-luxury-black-light border border-green-ocean/20 hover:border-green-ocean/40 transition-all duration-300 cursor-pointer"
    >
      {/* Project Image */}
      <div className="relative h-64 overflow-hidden">
        <div 
          className="w-full h-full bg-cover bg-center"
          style={{ backgroundImage: `url('${project.image || 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop&q=80'}')` }}
        />
        
        {/* Overlay */}
        <div className={`absolute inset-0 bg-luxury-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Link 
              href={`/projects/${project.slug}`}
              className="w-16 h-16 bg-green-ocean/20 backdrop-blur-md rounded-full flex items-center justify-center border border-green-ocean/30 hover:bg-green-ocean/40 transition-all duration-300"
            >
              <i className="ri-play-fill text-2xl text-green-ocean"></i>
            </Link>
          </div>
        </div>

        {/* Status Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-green-ocean text-white rounded-full text-xs font-medium">
          {project.status}
        </div>
      </div>

      {/* Project Information */}
      <div className="p-6">
        {/* Project Name and Price */}
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold text-white group-hover:text-green-ocean transition-colors">
            {project.name}
          </h3>
          <div className="px-3 py-1 bg-green-ocean/20 text-green-ocean rounded-full text-sm font-semibold">
            {project.price}
          </div>
        </div>

        {/* Developer and Location */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-gray-300">
            <i className="ri-building-line w-4 h-4 mr-2"></i>
            <span className="text-sm font-medium">{project.developer}</span>
          </div>
          <div className="flex items-center text-gray-300">
            <i className="ri-map-pin-line w-4 h-4 mr-2"></i>
            <span className="text-sm">{project.location}</span>
          </div>
        </div>

        {/* Property Details */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-2 bg-luxury-black rounded-lg border border-green-ocean/20">
            <div className="text-lg font-bold text-green-ocean">{project.bedrooms}</div>
            <div className="text-xs text-gray-400">Bedrooms</div>
          </div>
          <div className="text-center p-2 bg-luxury-black rounded-lg border border-green-ocean/20">
            <div className="text-lg font-bold text-green-ocean">{project.bathrooms}</div>
            <div className="text-xs text-gray-400">Bathrooms</div>
          </div>
          <div className="text-center p-2 bg-luxury-black rounded-lg border border-green-ocean/20">
            <div className="text-lg font-bold text-green-ocean">{project.area}</div>
            <div className="text-xs text-gray-400">Area</div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* View Details Button */}
        <Link 
          href={`/projects/${project.slug}`}
          className="block w-full py-3 bg-green-ocean/10 hover:bg-green-ocean/20 text-green-ocean rounded-lg border border-green-ocean/30 hover:border-green-ocean/50 transition-all duration-300 font-medium text-center"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}

// Hero Section Component
function ProjectsHero() {
  return (
    <section className="py-20 bg-gradient-to-br from-luxury-black via-luxury-black-light to-luxury-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Premium
          <span className="bg-gradient-to-r from-green-ocean to-green-ocean-light bg-clip-text text-transparent"> Properties</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
          Discover Dubai&apos;s most exclusive real estate developments
        </p>
      </div>
    </section>
  );
}

// Main Projects Page Component
export default function ProjectsPage() {
  const [visibleProjects, setVisibleProjects] = useState(6);
  const [isLoading, setIsLoading] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch projects from database
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/projects');
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          console.error('Failed to fetch projects');
          setProjects([]);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleLoadMore = () => {
    setIsLoading(true);
    setTimeout(() => {
      setVisibleProjects(prev => prev + 3);
      setIsLoading(false);
    }, 1000);
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-luxury-black">
        <ProjectsHero />
        <section className="relative py-20 px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-ocean border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
              <p className="text-white text-xl">Loading projects...</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-luxury-black text-white">
      {/* Hero Section */}
      <ProjectsHero />
      
      {/* Projects Content */}
      <section className="relative py-20 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {projects.slice(0, visibleProjects).map((project, index) => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                index={index} 
              />
            ))}
          </div>

          {/* Load More Button */}
          {visibleProjects < projects.length && (
            <div className="text-center">
              <button
                onClick={handleLoadMore}
                disabled={isLoading}
                className="px-12 py-4 bg-green-ocean text-white font-semibold rounded-full text-lg transition-all duration-300 hover:bg-green-ocean-light disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="w-5 h-5 border-2 border-luxury-black border-t-transparent rounded-full mr-3 animate-spin"></div>
                    Loading...
                  </div>
                ) : (
                  'Load More Properties'
                )}
              </button>
            </div>
          )}

          {/* Results Summary */}
          <div className="text-center mt-12 text-gray-400">
            Showing {Math.min(visibleProjects, projects.length)} of {projects.length} properties
          </div>
        </div>
      </section>
    </main>
  );
}