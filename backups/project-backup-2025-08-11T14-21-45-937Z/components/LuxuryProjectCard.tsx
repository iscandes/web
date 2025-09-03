'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface LuxuryProjectCardProps {
  project: {
    id: number;
    slug?: string;
    name: string;
    developer: string;
    location: string;
    price: string;
    status: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
    description: string;
    image: string;
    amenities: string[];
  };
  index: number;
}

export default function LuxuryProjectCard({ project, index }: LuxuryProjectCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Under Construction':
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'Sold':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'Coming Soon':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative performance-optimized"
    >
      <div className="glass-dark rounded-2xl overflow-hidden border border-white/10 hover:border-green-ocean/30 transition-colors duration-300">
        {/* Image Container */}
        <div className="relative h-64 overflow-hidden">
          {project.image && project.image.trim() !== '' ? (
            <Image
              src={project.image}
              alt={project.name}
              fill
              className="object-cover transition-transform duration-300"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-ocean/20 to-green-ocean/5 flex items-center justify-center">
              <div className="text-center text-white/60">
                <i className="ri-image-line text-4xl mb-2 block"></i>
                <span className="text-sm">No Image Available</span>
              </div>
            </div>
          )}
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-transparent to-transparent opacity-60" />
          
          {/* Status Badge */}
          <div className="absolute top-4 left-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(project.status)}`}>
              {project.status}
            </span>
          </div>

          {/* Price Badge */}
          <div className="absolute top-4 right-4">
            <div className="glass-gold px-3 py-1 rounded-full">
              <span className="text-luxury-black font-semibold text-sm">{project.price}</span>
            </div>
          </div>

          {/* Hover Overlay - Simplified */}
          <div
            className={`absolute inset-0 bg-green-ocean/10 backdrop-blur-sm flex items-center justify-center transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}
          >
            <Link
              href={`/projects/${project.slug || project.id}`}
              className="glass-dark px-6 py-3 rounded-lg text-white hover:bg-green-ocean hover:text-white transition-colors duration-200"
            >
              <i className="ri-eye-line mr-2"></i>
              View Details
            </Link>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Developer */}
          <p className="text-green-ocean text-sm font-medium mb-2">{project.developer}</p>
          
          {/* Project Name */}
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-ocean transition-colors">
            {project.name}
          </h3>
          
          {/* Location */}
          <div className="flex items-center text-white/70 mb-4">
            <i className="ri-map-pin-line mr-2 text-green-ocean"></i>
            <span className="text-sm">{project.location}</span>
          </div>

          {/* Description */}
          <p className="text-white/80 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Property Details */}
          <div className="flex items-center justify-between mb-4 text-sm">
            <div className="flex items-center space-x-4">
              <div className="flex items-center text-white/70">
                <i className="ri-hotel-bed-line mr-1 text-green-ocean"></i>
                <span>{project.bedrooms} Bed</span>
              </div>
              <div className="flex items-center text-white/70">
                <i className="ri-drop-line mr-1 text-green-ocean"></i>
                <span>{project.bathrooms} Bath</span>
              </div>
              <div className="flex items-center text-white/70">
                <i className="ri-ruler-line mr-1 text-green-ocean"></i>
                <span>{project.area}</span>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {project.amenities && Array.isArray(project.amenities) && project.amenities.length > 0 && (
            <div className="mb-4">
              <div className="flex flex-wrap gap-2">
                {project.amenities.slice(0, 3).map((amenity, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-white/10 rounded-md text-xs text-white/80"
                  >
                    {amenity}
                  </span>
                ))}
                {project.amenities.length > 3 && (
                  <span className="px-2 py-1 bg-green-ocean/20 rounded-md text-xs text-green-ocean">
                    +{project.amenities.length - 3} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Link
              href={`/projects/${project.slug || project.id}`}
              className="flex-1 bg-green-ocean text-white text-center py-2 rounded-lg font-semibold hover:bg-green-ocean-light"
            >
              View Project
            </Link>
            <button className="px-4 py-2 border border-green-ocean text-green-ocean rounded-lg hover:bg-green-ocean hover:text-white">
              <i className="ri-heart-line"></i>
            </button>
            <button className="px-4 py-2 border border-green-ocean text-green-ocean rounded-lg hover:bg-green-ocean hover:text-white">
              <i className="ri-share-line"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Floating Elements - Removed for stability */}
    </div>
  );
}