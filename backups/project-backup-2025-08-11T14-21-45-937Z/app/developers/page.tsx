'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Developer {
  id: number;
  name: string;
  slug: string;
  description?: string;
  logo?: string;
  established?: string;
  projects_count: number;
  location?: string;
  website?: string;
  phone?: string;
  email?: string;
  status: 'Active' | 'Inactive';
}

export default function DevelopersPage() {
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch developers from database
  const fetchDevelopers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/developers', { cache: 'no-store' });
      if (response.ok) {
        const data = await response.json();
        setDevelopers(data);
      } else {
        console.error('Failed to fetch developers');
        setDevelopers([]);
      }
    } catch (error) {
      console.error('Error fetching developers:', error);
      setDevelopers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, []);

  // Listen for storage events to refresh when developers are added from other pages
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'developer_added') {
        fetchDevelopers();
        localStorage.removeItem('developer_added'); // Clean up
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also check for the flag on focus (for same-tab updates)
    const handleFocus = () => {
      if (localStorage.getItem('developer_added')) {
        fetchDevelopers();
        localStorage.removeItem('developer_added');
      }
    };

    window.addEventListener('focus', handleFocus);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-luxury-black text-white">
        <section className="py-20 bg-gradient-to-br from-luxury-black via-luxury-black-light to-luxury-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Premium 
              <span className="bg-gradient-to-r from-green-ocean to-green-ocean-light bg-clip-text text-transparent"> Developers</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
              Discover Dubai&apos;s most trusted real estate developers
            </p>
          </div>
        </section>
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-green-ocean border-t-transparent rounded-full mx-auto mb-4 animate-spin"></div>
              <p className="text-white text-xl">Loading developers...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-luxury-black text-white">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-luxury-black via-luxury-black-light to-luxury-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Premium 
            <span className="bg-gradient-to-r from-green-ocean to-green-ocean-light bg-clip-text text-transparent"> Developers</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto">
            Discover Dubai&apos;s most trusted real estate developers
          </p>
        </div>
      </section>

      {/* Developers Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {developers.length === 0 ? (
            <div className="text-center">
              <p className="text-gray-300 text-xl">No developers found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {developers.map((developer) => (
                <div key={developer.id} className="bg-luxury-black-light rounded-xl p-6 hover:bg-luxury-black-light/80 transition-all duration-300 hover:scale-105 group">
                  {/* Clickable Developer Logo */}
                  <Link href={`/developers/${developer.slug}`} className="block">
                    <div className="aspect-video bg-luxury-black rounded-lg mb-4 overflow-hidden cursor-pointer group-hover:ring-2 group-hover:ring-green-ocean/50 transition-all">
                      <Image 
                        src={developer.logo || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop&q=80"} 
                        alt={developer.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>
                  </Link>
                  
                  <Link href={`/developers/${developer.slug}`} className="block hover:text-green-ocean transition-colors">
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-green-ocean transition-colors">{developer.name}</h3>
                  </Link>
                  
                  {developer.location && (
                    <p className="text-gray-300 mb-2 flex items-center">
                      <i className="ri-map-pin-line mr-2 text-green-ocean"></i>
                      {developer.location}
                    </p>
                  )}
                  {developer.established && (
                    <p className="text-gray-300 mb-2 flex items-center">
                      <i className="ri-calendar-line mr-2 text-green-ocean"></i>
                      Est. {developer.established}
                    </p>
                  )}
                  <p className="text-green-ocean font-semibold mb-3">
                    {developer.projects_count} Project{developer.projects_count !== 1 && 's'}
                  </p>
                  {developer.description && (
                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                      {developer.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={`/developers/${developer.slug}`}
                      className="inline-flex items-center space-x-2 bg-green-ocean text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-ocean-light transition-colors"
                    >
                      <i className="ri-building-line"></i>
                      <span>View Projects</span>
                    </Link>
                    {developer.website && (
                      <a 
                        href={developer.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center space-x-2 bg-green-ocean/10 hover:bg-green-ocean/20 text-green-ocean px-4 py-2 rounded-lg border border-green-ocean/30 hover:border-green-ocean/50 transition-all duration-300 text-sm"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <i className="ri-external-link-line"></i>
                        <span>Website</span>
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
