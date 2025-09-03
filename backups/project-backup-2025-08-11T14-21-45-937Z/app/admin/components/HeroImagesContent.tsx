'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { HeroImage } from '../../../lib/mysql-database';

interface HeroImagesContentProps {
  heroImages: HeroImage[];
  onUpdate: () => void;
}

export default function HeroImagesContent({ heroImages, onUpdate }: HeroImagesContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<HeroImage | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState<Partial<HeroImage>>({
    url: '',
    title: '',
    description: '',
    is_active: true,
    order_index: 0
  });
  const [isLoading, setIsLoading] = useState(false);

  const filteredImages = (heroImages || []).filter(image =>
    image.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingImage 
        ? `/api/admin/hero-images/${editingImage.id}`
        : '/api/admin/hero-images';
      
      const method = editingImage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsModalOpen(false);
        setEditingImage(null);
        setFormData({
          url: '',
          title: '',
          description: '',
          is_active: true,
          order_index: 0
        });
        onUpdate();
        alert(editingImage ? 'Hero image updated successfully!' : 'Hero image created successfully!');
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message || 'Failed to save hero image'}`);
      }
    } catch (error) {
      console.error('Error saving hero image:', error);
      alert('Error saving hero image');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (image: HeroImage) => {
    setEditingImage(image);
    setFormData(image);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this hero image?')) {
      try {
        const response = await fetch(`/api/admin/hero-images/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          onUpdate();
          alert('Hero image deleted successfully!');
        } else {
          const errorData = await response.json();
          alert(`Error: ${errorData.message || 'Failed to delete hero image'}`);
        }
      } catch (error) {
        console.error('Error deleting hero image:', error);
        alert('Error deleting hero image');
      }
    }
  };

  const handleToggleActive = async (id: string, is_active: boolean) => {
    try {
      const response = await fetch(`/api/admin/hero-images/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ is_active: !is_active }),
      });

      if (response.ok) {
        onUpdate();
      } else {
        alert('Failed to update image status');
      }
    } catch (error) {
      console.error('Error updating image status:', error);
      alert('Error updating image status');
    }
  };

  const openModal = () => {
    setEditingImage(null);
    setFormData({
      url: '',
      title: '',
      description: '',
      is_active: true,
      order_index: (heroImages || []).length
    });
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Hero Images</h2>
          <p className="text-brand-gray">Manage landing page hero images</p>
        </div>
        <button
          onClick={openModal}
          className="px-6 py-3 bg-green-ocean text-white rounded-lg hover:bg-green-ocean/80 transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-2"
        >
          <i className="ri-add-line"></i>
          <span>Add Hero Image</span>
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gray"></i>
        <input
            type="text"
            placeholder="Search hero images..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-green-ocean"
          />
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredImages.map((image) => (
            <div
              key={image.id}
              className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden animate-fade-in"
            >
              {/* Image Preview */}
              <div className="relative h-48 bg-gray-800">
                {image.url ? (
                  <Image
                    src={image.url}
                    alt={image.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/images/property-placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-brand-gray">
                    <i className="ri-image-line text-4xl"></i>
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  image.is_active
                    ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                    : 'bg-red-500/20 text-red-400 border border-red-500/30'
                }`}>
                  {image.is_active ? 'Active' : 'Inactive'}
                </span>
                </div>

                {/* Order Badge */}
                  <div className="absolute top-3 right-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-ocean/20 text-green-ocean border border-green-ocean/30">
                      #{image.order_index}
                    </span>
                  </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-2 truncate">
                  {image.title}
                </h3>
                {image.description && (
                  <p className="text-brand-gray text-sm mb-3 line-clamp-2">
                    {image.description}
                  </p>
                )}
                
                {/* URL */}
                <p className="text-xs text-brand-gray mb-4 truncate">
                  {image.url}
                </p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleEdit(image)}
                      className="p-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all transform hover:scale-105 active:scale-95"
                    >
                      <i className="ri-edit-line"></i>
                    </button>
                    <button
                      onClick={() => handleToggleActive(image.id?.toString() || '', image.is_active)}
                      className={`p-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 ${
                        image.is_active
                          ? 'bg-green-ocean/20 text-green-ocean hover:bg-green-ocean/30'
                          : 'bg-green-500/20 text-green-500 hover:bg-green-500/30'
                      }`}
                    >
                      <i className={image.is_active ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
                    </button>
                    <button
                      onClick={() => handleDelete(image.id?.toString() || '')}
                      className="p-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-all transform hover:scale-105 active:scale-95"
                    >
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>

      {filteredImages.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-image-line text-6xl text-brand-gray mb-4"></i>
          <h3 className="text-xl font-semibold text-white mb-2">No Hero Images Found</h3>
          <p className="text-brand-gray mb-6">
            {searchTerm ? 'No images match your search criteria.' : 'Start by adding your first hero image.'}
          </p>
          {!searchTerm && (
            <button
              onClick={openModal}
              className="px-6 py-3 bg-green-ocean text-white rounded-lg hover:bg-green-ocean/80 transition-all transform hover:scale-105 active:scale-95"
            >
              Add First Hero Image
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-brand-dark border border-white/10 rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white">
                  {editingImage ? 'Edit Hero Image' : 'Add Hero Image'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <i className="ri-close-line text-xl text-brand-gray"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    required
                    value={formData.url || ''}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-green-ocean"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-green-ocean"
                    placeholder="Enter image title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-green-ocean"
                    placeholder="Enter image description"
                    rows={3}
                  />
                </div>

                <div>
                  <label htmlFor="order_index" className="block text-sm font-medium text-white mb-2">
                    Display Order
                  </label>
                  <input
                    type="number"
                    id="order_index"
                    min="0"
                    value={formData.order_index || 0}
                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-green-ocean"
                    placeholder="0"
                  />
                </div>

                <div className="flex items-center space-x-3">
                  <input
                      type="checkbox"
                      id="is_active"
                      checked={formData.is_active || false}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-4 h-4 text-green-ocean bg-white/5 border-white/10 rounded focus:ring-green-ocean"
                    />
                    <label htmlFor="is_active" className="ml-2 text-sm text-brand-gray">
                      Active
                    </label>
                </div>

                {/* Image Preview */}
                {formData.url && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-white mb-2">
                      Preview
                    </label>
                    <div className="relative h-32 bg-gray-800 rounded-lg overflow-hidden">
                      <Image
                        src={formData.url}
                        alt="Preview"
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-6 py-3 text-brand-gray hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-6 py-3 bg-green-ocean text-white rounded-lg hover:bg-green-ocean/80 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {isLoading && <i className="ri-loader-4-line animate-spin"></i>}
                    <span>{editingImage ? 'Update' : 'Create'} Hero Image</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
}