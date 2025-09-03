'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroSection } from '@/lib/mysql-database';

interface HeroSectionsContentProps {
  heroSections: HeroSection[];
  onUpdate: () => void;
}

export default function HeroSectionsContent({ heroSections, onUpdate }: HeroSectionsContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHero, setEditingHero] = useState<HeroSection | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPage, setFilterPage] = useState<string>('all');
  const [formData, setFormData] = useState<Partial<HeroSection>>({
    page: '',
    title: '',
    subtitle: '',
    description: '',
    background_image: '',
    cta_text: '',
    cta_link: '',
    is_active: true
  });

  const pages = ['home', 'projects', 'developers', 'contact', 'articles'];
  
  const filteredHeroSections = heroSections.filter(hero => {
    const matchesSearch = hero.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hero.page.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPage = filterPage === 'all' || hero.page === filterPage;
    return matchesSearch && matchesPage;
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = editingHero 
        ? `/api/admin/hero-sections/${editingHero.id}`
        : '/api/admin/hero-sections';
      
      const method = editingHero ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert(editingHero ? 'Hero section updated successfully!' : 'Hero section created successfully!');
        setIsModalOpen(false);
        setEditingHero(null);
        setFormData({
          page: '',
          title: '',
          subtitle: '',
          description: '',
          background_image: '',
          cta_text: '',
          cta_link: '',
          is_active: true
        });
        onUpdate();
      } else {
        alert(`Error: ${result.message || 'Failed to save hero section'}`);
      }
    } catch (error) {
      console.error('Error saving hero section:', error);
      alert('Error saving hero section. Please try again.');
    }
  };

  const handleEdit = (hero: HeroSection) => {
    setEditingHero(hero);
    setFormData(hero);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hero section?')) {
      try {
        const response = await fetch(`/api/admin/hero-sections/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Hero section deleted successfully!');
          onUpdate();
        } else {
          const result = await response.json();
          alert(`Error deleting hero section: ${result.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting hero section:', error);
        alert('Error deleting hero section. Please try again.');
      }
    }
  };

  const toggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/hero-sections/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (response.ok) {
        onUpdate();
      } else {
        alert('Error updating hero section status');
      }
    } catch (error) {
      console.error('Error toggling hero section:', error);
      alert('Error updating hero section status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Hero Sections Management</h2>
          <p className="text-brand-gray">Manage hero sections for different pages</p>
        </div>
        <button
          onClick={() => {
            setEditingHero(null);
            setFormData({
              page: '',
              title: '',
              subtitle: '',
              description: '',
              background_image: '',
              cta_text: '',
              cta_link: '',
              is_active: true
            });
            setIsModalOpen(true);
          }}
          className="bg-green-ocean text-white px-6 py-3 rounded-lg font-medium hover:bg-green-ocean-light transition-colors flex items-center gap-2"
        >
          <i className="ri-add-line"></i>
          Add New Hero Section
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search hero sections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-brand-gray focus:outline-none focus:border-green-ocean"
            />
          </div>
          <select
            value={filterPage}
            onChange={(e) => setFilterPage(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-ocean"
          >
            <option value="all">All Pages</option>
            {pages.map(page => (
              <option key={page} value={page}>
                {page.charAt(0).toUpperCase() + page.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Hero Sections Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredHeroSections.map((hero) => (
            <motion.div
              key={hero.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden hover:border-green-ocean/50 transition-colors"
            >
              {/* Hero Preview */}
              <div className="relative aspect-video bg-gray-800 overflow-hidden">
                {hero.background_image ? (
                  <Image
                    src={hero.background_image}
                    alt={hero.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
                    <i className="ri-image-line text-4xl text-gray-500"></i>
                  </div>
                )}
                
                {/* Overlay */}
                <div className="absolute inset-0 bg-black opacity-50"></div>
                
                {/* Content Preview */}
                <div className="absolute inset-0 flex flex-col justify-center p-6 text-center">
                  <h3 className="text-white text-lg font-bold mb-2 line-clamp-2">
                    {hero.title}
                  </h3>
                  {hero.subtitle && (
                    <p className="text-green-ocean text-sm mb-2 line-clamp-1">
                      {hero.subtitle}
                    </p>
                  )}
                  {hero.description && (
                    <p className="text-gray-300 text-xs mb-3 line-clamp-2">
                      {hero.description}
                    </p>
                  )}
                  {hero.cta_text && (
                    <button className="bg-green-ocean text-white px-3 py-1 rounded text-xs font-medium w-fit">
                      {hero.cta_text}
                    </button>
                  )}
                </div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    hero.is_active 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {hero.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-green-ocean/20 text-green-ocean rounded-full text-sm font-medium">
                    {hero.page.charAt(0).toUpperCase() + hero.page.slice(1)}
                  </span>
                </div>
                
                <h4 className="text-lg font-semibold text-white mb-4 line-clamp-1">
                  {hero.title}
                </h4>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleActive(hero.id?.toString() || '', hero.is_active)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      hero.is_active
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                  >
                    {hero.is_active ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleEdit(hero)}
                    className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                  >
                    <i className="ri-edit-line"></i>
                  </button>
                  <button
                    onClick={() => handleDelete(hero.id?.toString() || '')}
                    className="px-3 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                  >
                    <i className="ri-delete-bin-line"></i>
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredHeroSections.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-landscape-line text-6xl text-brand-gray mb-4"></i>
          <h3 className="text-xl font-semibold text-white mb-2">No hero sections found</h3>
          <p className="text-brand-gray">
            {searchTerm || filterPage !== 'all' 
              ? 'Try adjusting your search or filters' 
              : 'Create your first hero section to get started'}
          </p>
        </div>
      )}

      {/* Hero Section Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-gray-900 rounded-xl border border-white/10 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">
                  {editingHero ? 'Edit Hero Section' : 'Add New Hero Section'}
                </h3>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Page *
                  </label>
                  <select
                    required
                    value={formData.page || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, page: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-green-ocean"
                  >
                    <option value="">Select a page</option>
                    {pages.map(page => (
                      <option key={page} value={page}>
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-brand-gray focus:outline-none focus:border-green-ocean"
                    placeholder="Enter hero title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Subtitle
                  </label>
                  <input
                    type="text"
                    value={formData.subtitle || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-brand-gray focus:outline-none focus:border-green-ocean"
                    placeholder="Enter hero subtitle"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={formData.description || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-brand-gray focus:outline-none focus:border-green-ocean resize-none"
                    placeholder="Enter hero description"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Background Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.background_image || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, background_image: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-brand-gray focus:outline-none focus:border-green-ocean"
                    placeholder="Enter background image URL"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      CTA Button Text
                    </label>
                    <input
                      type="text"
                      value={formData.cta_text || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, cta_text: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-brand-gray focus:outline-none focus:border-green-ocean"
                      placeholder="Enter CTA button text"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">
                      CTA Button Link
                    </label>
                    <input
                      type="text"
                      value={formData.cta_link || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, cta_link: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-brand-gray focus:outline-none focus:border-green-ocean"
                      placeholder="Enter CTA button link"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-white">
                    <input
                      type="checkbox"
                      checked={formData.is_active || false}
                      onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
                      className="rounded border-white/20 bg-white/10 text-green-ocean focus:ring-green-ocean"
                    />
                    Active
                  </label>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-green-ocean text-white px-6 py-3 rounded-lg font-medium hover:bg-green-ocean-light transition-colors"
                  >
                    {editingHero ? 'Update Hero Section' : 'Create Hero Section'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}