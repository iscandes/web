'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Developer, Project } from '../../../lib/mysql-database';

interface DeveloperProfileContentProps {
  developer: Developer;
  onBack: () => void;
  onUpdate: () => void;
}

interface ProjectWithDetails extends Project {
  totalUnits?: number;
  soldUnits?: number;
  availableUnits?: number;
}

export default function DeveloperProfileContent({ developer, onBack, onUpdate }: DeveloperProfileContentProps) {
  const [projects, setProjects] = useState<ProjectWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeProjects: 0,
    completedProjects: 0,
    totalUnits: 0,
    totalValue: 0
  });

  useEffect(() => {
    fetchDeveloperProjects();
  }, [developer.id]);

  const fetchDeveloperProjects = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/developers/${developer.id}/projects`);
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
        
        // Calculate stats
        const totalProjects = data.projects?.length || 0;
        const activeProjects = data.projects?.filter((p: Project) => p.status === 'active').length || 0;
        const completedProjects = data.projects?.filter((p: Project) => p.status === 'completed').length || 0;
        const totalUnits = data.projects?.reduce((sum: number, p: ProjectWithDetails) => sum + (p.totalUnits || 0), 0) || 0;
        const totalValue = data.projects?.reduce((sum: number, p: Project) => sum + (Number(p.price) || 0), 0) || 0;
        
        setStats({
          totalProjects,
          activeProjects,
          completedProjects,
          totalUnits,
          totalValue
        });
      }
    } catch (error) {
      console.error('Error fetching developer projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)}M AED`;
    } else if (price >= 1000) {
      return `${(price / 1000).toFixed(0)}K AED`;
    }
    return `${price} AED`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'completed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'upcoming': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'on-hold': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Back to Developers</span>
          </button>
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Developer Profile
        </div>
      </div>

      {/* Developer Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 border border-blue-200 dark:border-blue-700/50"
      >
        <div className="flex items-start space-x-6">
          {/* Developer Logo */}
          <div className="flex-shrink-0">
            {developer.logo ? (
              <img
                src={developer.logo}
                alt={developer.name}
                className="w-24 h-24 rounded-xl object-cover border-4 border-white dark:border-gray-700 shadow-lg"
              />
            ) : (
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center border-4 border-white dark:border-gray-700 shadow-lg">
                <span className="text-white text-2xl font-bold">
                  {developer.name.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Developer Info */}
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {developer.name}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                developer.status === 'Active' 
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
              }`}>
                {developer.status === 'Active' ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-gray-400">
              {developer.established && (
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">📅</span>
                  <span>Established: {developer.established}</span>
                </div>
              )}
              {developer.location && (
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">📍</span>
                  <span>{developer.location}</span>
                </div>
              )}
              {developer.email && (
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">✉️</span>
                  <a href={`mailto:${developer.email}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                    {developer.email}
                  </a>
                </div>
              )}
              {developer.phone && (
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">📞</span>
                  <a href={`tel:${developer.phone}`} className="hover:text-blue-600 dark:hover:text-blue-400">
                    {developer.phone}
                  </a>
                </div>
              )}
              {developer.website && (
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">🌐</span>
                  <a 
                    href={developer.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-blue-600 dark:hover:text-blue-400"
                  >
                    Visit Website
                  </a>
                </div>
              )}
            </div>

            {developer.description && (
              <div className="mt-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {developer.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {stats.totalProjects}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Projects
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {stats.activeProjects}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Active Projects
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {stats.completedProjects}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Completed
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="text-center">
            <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">
              {stats.totalUnits.toLocaleString()}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Units
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm"
        >
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {formatPrice(stats.totalValue)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Total Value
            </div>
          </div>
        </motion.div>
      </div>

      {/* Projects Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Associated Projects ({projects.length})
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            All projects developed by {developer.name}
          </p>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600 dark:text-gray-400">Loading projects...</span>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏗️</div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No Projects Found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                This developer doesn't have any associated projects yet.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-6 border border-gray-200 dark:border-gray-600 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {project.name}
                      </h3>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status || 'unknown')}`}>
                          {(project.status || 'unknown').charAt(0).toUpperCase() + (project.status || 'unknown').slice(1)}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {project.type}
                        </span>
                      </div>
                    </div>
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                      />
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    {project.location && (
                      <div className="flex items-center space-x-2">
                        <span>📍</span>
                        <span>{project.location}</span>
                      </div>
                    )}
                    {project.price && (
                      <div className="flex items-center space-x-2">
                        <span>💰</span>
                        <span className="font-medium text-gray-900 dark:text-white">
                          {formatPrice(Number(project.price))}
                        </span>
                      </div>
                    )}

                  </div>

                  {project.description && (
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-3 line-clamp-2">
                      {project.description}
                    </p>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}