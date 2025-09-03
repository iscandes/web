'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import DeveloperProfileContent from './DeveloperProfileContent';

interface Developer {
  id?: number;
  name: string;
  slug: string;
  description: string;
  logo?: string;
  established?: string;
  projects_count: number;
  location?: string;
  website?: string;
  phone?: string;
  email?: string;
  status: 'Active' | 'Inactive';
  created_at?: string;
  updated_at?: string;
}

interface DevelopersContentProps {
  developers: Developer[];
  onUpdate: () => void;
}

export default function DevelopersContent({ developers, onUpdate }: DevelopersContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'list' | 'profile'>('list');
  const [selectedDeveloper, setSelectedDeveloper] = useState<Developer | null>(null);
  const [formData, setFormData] = useState<Partial<Developer>>({
    name: '',
    slug: '',
    description: '',
    logo: '',
    established: '',
    projects_count: 0,
    location: '',
    website: '',
    phone: '',
    email: '',
    status: 'Active'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [developerToDelete, setDeveloperToDelete] = useState<Developer | null>(null);
  const [developerProjects, setDeveloperProjects] = useState<any[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Fetch available images for logo selection
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/admin/media');
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            const imageFiles = data.data
              .filter((file: any) => file.mime_type?.startsWith('image/'))
              .map((file: any) => `/uploads/${file.filename}`);
            setAvailableImages(imageFiles);
          }
        }
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };

    fetchImages();
  }, []);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  // Form validation
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Company name is required';
    }

    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'Website must start with http:// or https://';
    }

    if (formData.phone && !/^[\+]?[1-9][\d]{0,15}$/.test(formData.phone.replace(/[\s\-\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setErrors({});
    
    try {
      const developerData = {
        ...formData,
        slug: formData.slug || generateSlug(formData.name || ''),
        projects_count: Number(formData.projects_count) || 0
      };

      let response;
      if (editingDeveloper) {
        // Update existing developer
        response = await fetch(`/api/admin/developers?id=${editingDeveloper.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(developerData),
        });
      } else {
        // Create new developer
        response = await fetch('/api/admin/developers', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(developerData),
        });
      }

      const result = await response.json();

      if (response.ok) {
        setIsModalOpen(false);
        setEditingDeveloper(null);
        resetForm();
        onUpdate();
      } else {
        setErrors({ submit: result.message || 'Failed to save developer' });
      }
    } catch (error) {
      console.error('Error saving developer:', error);
      setErrors({ submit: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      logo: '',
      established: '',
      projects_count: 0,
      location: '',
      website: '',
      phone: '',
      email: '',
      status: 'Active'
    });
    setErrors({});
  };

  // Handle edit
  const handleEdit = (developer: Developer) => {
    setEditingDeveloper(developer);
    setFormData({
      name: developer.name,
      slug: developer.slug,
      description: developer.description,
      logo: developer.logo || '',
      established: developer.established || '',
      projects_count: developer.projects_count,
      location: developer.location || '',
      website: developer.website || '',
      phone: developer.phone || '',
      email: developer.email || '',
      status: developer.status
    });
    setIsModalOpen(true);
  };

  // Handle delete confirmation
  const handleDeleteClick = async (developer: Developer) => {
    if (!developer.id) return;

    setDeveloperToDelete(developer);
    setIsLoadingProjects(true);
    setShowDeleteConfirm(true);
    
    try {
      // Check how many projects are associated with this developer
      const response = await fetch(`/api/admin/developers/${developer.id}/projects`);
      const result = await response.json();
      
      const projects = result.success ? result.data : [];
      setDeveloperProjects(projects);
    } catch (error) {
      console.error('Error checking developer projects:', error);
      setDeveloperProjects([]);
    } finally {
      setIsLoadingProjects(false);
    }
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!id) return;

    try {
      const response = await fetch(`/api/admin/developers?id=${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (response.ok) {
        setShowDeleteConfirm(false);
        setDeveloperToDelete(null);
        setDeveloperProjects([]);
        
        // Show success message with details about deleted projects
        if (result.deletedProjects > 0) {
          alert(`Developer deleted successfully! ${result.deletedProjects} associated project(s) were also removed.`);
        } else {
          alert('Developer deleted successfully!');
        }
        
        onUpdate();
      } else {
        console.error('Failed to delete developer:', result.message);
        alert(`Failed to delete developer: ${result.message}`);
      }
    } catch (error) {
      console.error('Error deleting developer:', error);
      alert('An error occurred while deleting the developer. Please try again.');
    }
  };

  // Handle view profile
  const handleViewProfile = (developer: Developer) => {
    setSelectedDeveloper(developer);
    setViewMode('profile');
  };

  // Handle back to list
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDeveloper(null);
  };

  // Handle image selection
  const handleImageSelect = (imagePath: string) => {
    setFormData({ ...formData, logo: imagePath });
    setShowImagePicker(false);
  };

  // Conditional rendering based on view mode
  if (viewMode === 'profile' && selectedDeveloper) {
    return (
      <DeveloperProfileContent
        developer={selectedDeveloper}
        onBack={handleBackToList}
        onUpdate={onUpdate}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Developers Management</h2>
          <p className="text-brand-gray">Manage real estate developers and companies</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-brand-green hover:bg-brand-green/80 text-white rounded-lg transition-colors"
        >
          <i className="ri-add-line text-xl"></i>
          <span>Add Developer</span>
        </motion.button>
      </div>

      {/* Developers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {developers.map((developer, index) => (
          <motion.div
            key={developer.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10 hover:border-brand-green/30 transition-all duration-300"
          >
            {/* Developer Logo */}
            <div className="flex items-center space-x-4 mb-4">
              <div className="w-16 h-16 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden relative">
                {developer.logo ? (
                  <Image 
                    src={developer.logo} 
                    alt={developer.name}
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : (
                  <i className="ri-building-line text-2xl text-brand-green"></i>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-white">{developer.name}</h3>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    developer.status === 'Active' 
                      ? 'bg-green-500/20 text-green-300' 
                      : 'bg-red-500/20 text-red-300'
                  }`}>
                    {developer.status}
                  </span>
                  {developer.established && (
                    <span className="text-brand-gray text-sm">Est. {developer.established}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Developer Info */}
            <div className="space-y-3 mb-4">
              {developer.location && (
                <div className="flex items-center space-x-2 text-brand-gray">
                  <i className="ri-map-pin-line"></i>
                  <span className="text-sm">{developer.location}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-2 text-brand-gray">
                <i className="ri-building-2-line"></i>
                <span className="text-sm">{developer.projects_count} Projects</span>
              </div>

              {developer.website && (
                <div className="flex items-center space-x-2 text-brand-gray">
                  <i className="ri-global-line"></i>
                  <a 
                    href={developer.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-sm hover:text-brand-green transition-colors"
                  >
                    Website
                  </a>
                </div>
              )}

              {developer.email && (
                <div className="flex items-center space-x-2 text-brand-gray">
                  <i className="ri-mail-line"></i>
                  <span className="text-sm">{developer.email}</span>
                </div>
              )}

              {developer.phone && (
                <div className="flex items-center space-x-2 text-brand-gray">
                  <i className="ri-phone-line"></i>
                  <span className="text-sm">{developer.phone}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <p className="text-brand-gray text-sm mb-4 line-clamp-3">
              {developer.description}
            </p>

            {/* Actions */}
            <div className="flex space-x-2">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleViewProfile(developer)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-green-500/20 text-green-300 hover:bg-green-500/30 rounded-lg transition-colors"
              >
                <i className="ri-eye-line"></i>
                <span>Profile</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleEdit(developer)}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 rounded-lg transition-colors"
              >
                <i className="ri-edit-line"></i>
                <span>Edit</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDeleteClick(developer)}
                disabled={isLoadingProjects}
                className="flex-1 flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors"
              >
                {isLoadingProjects ? (
                  <i className="ri-loader-4-line animate-spin"></i>
                ) : (
                  <i className="ri-delete-bin-line"></i>
                )}
                <span>Delete</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {developers.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <i className="ri-building-line text-6xl text-brand-gray mb-4"></i>
          <h3 className="text-xl font-bold text-white mb-2">No Developers Found</h3>
          <p className="text-brand-gray mb-6">Start by adding your first developer</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-brand-green hover:bg-brand-green/80 text-white rounded-lg transition-colors"
          >
            Add First Developer
          </motion.button>
        </motion.div>
      )}

      {/* Developer Form Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-dark/90 backdrop-blur-lg rounded-2xl p-8 border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">
                  {editingDeveloper ? 'Edit Developer' : 'Add New Developer'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="text-brand-gray hover:text-white transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => {
                        const name = e.target.value;
                        setFormData({ 
                          ...formData, 
                          name,
                          slug: generateSlug(name)
                        });
                        if (errors.name) {
                          setErrors({ ...errors, name: '' });
                        }
                      }}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-brand-gray focus:outline-none ${
                        errors.name ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-brand-green'
                      }`}
                      placeholder="Enter company name"
                      required
                    />
                    {errors.name && (
                      <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Slug
                    </label>
                    <input
                      type="text"
                      value={formData.slug || ''}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                      placeholder="company-slug"
                    />
                  </div>
                </div>

                {/* Logo Selection */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Company Logo
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 bg-white/10 rounded-lg flex items-center justify-center overflow-hidden relative">
                      {formData.logo ? (
                        <Image 
                          src={formData.logo} 
                          alt="Logo preview"
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      ) : (
                        <i className="ri-image-line text-2xl text-brand-gray"></i>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        value={formData.logo || ''}
                        onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green mb-2"
                        placeholder="Enter logo URL or select from gallery"
                      />
                      <button
                        type="button"
                        onClick={() => setShowImagePicker(true)}
                        className="px-4 py-2 bg-brand-green/20 text-brand-green hover:bg-brand-green/30 rounded-lg transition-colors"
                      >
                        Select from Gallery
                      </button>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                      placeholder="City, Country"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Established Year
                    </label>
                    <input
                      type="text"
                      value={formData.established || ''}
                      onChange={(e) => setFormData({ ...formData, established: e.target.value })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                      placeholder="2020"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, email: e.target.value });
                        if (errors.email) {
                          setErrors({ ...errors, email: '' });
                        }
                      }}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-brand-gray focus:outline-none ${
                        errors.email ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-brand-green'
                      }`}
                      placeholder="contact@company.com"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, phone: e.target.value });
                        if (errors.phone) {
                          setErrors({ ...errors, phone: '' });
                        }
                      }}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-brand-gray focus:outline-none ${
                        errors.phone ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-brand-green'
                      }`}
                      placeholder="+1 (555) 123-4567"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-sm mt-1">{errors.phone}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website || ''}
                      onChange={(e) => {
                        setFormData({ ...formData, website: e.target.value });
                        if (errors.website) {
                          setErrors({ ...errors, website: '' });
                        }
                      }}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-brand-gray focus:outline-none ${
                        errors.website ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-brand-green'
                      }`}
                      placeholder="https://company.com"
                    />
                    {errors.website && (
                      <p className="text-red-400 text-sm mt-1">{errors.website}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-white font-medium mb-2">
                      Projects Count
                    </label>
                    <input
                      type="number"
                      value={formData.projects_count || 0}
                      onChange={(e) => setFormData({ ...formData, projects_count: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                      placeholder="0"
                      min="0"
                    />
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Status
                  </label>
                  <select
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Inactive' })}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:border-brand-green"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description || ''}
                    onChange={(e) => {
                      setFormData({ ...formData, description: e.target.value });
                      if (errors.description) {
                        setErrors({ ...errors, description: '' });
                      }
                    }}
                    className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-brand-gray focus:outline-none ${
                      errors.description ? 'border-red-500 focus:border-red-500' : 'border-white/20 focus:border-brand-green'
                    }`}
                    placeholder="Enter company description..."
                    rows={4}
                    required
                  />
                  {errors.description && (
                    <p className="text-red-400 text-sm mt-1">{errors.description}</p>
                  )}
                </div>

                {/* Form Actions */}
                <div className="flex space-x-4 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 px-6 py-3 bg-white/10 text-white hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={isSubmitting}
                    className="flex-1 px-6 py-3 bg-brand-green hover:bg-brand-green/80 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {editingDeveloper ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      editingDeveloper ? 'Update Developer' : 'Create Developer'
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Picker Modal */}
      <AnimatePresence>
        {showImagePicker && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowImagePicker(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-dark/90 backdrop-blur-lg rounded-2xl p-8 border border-white/10 w-full max-w-4xl max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-white">Select Logo</h3>
                <button
                  onClick={() => setShowImagePicker(false)}
                  className="text-brand-gray hover:text-white transition-colors"
                >
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {availableImages.map((imagePath, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleImageSelect(imagePath)}
                    className="aspect-square bg-white/10 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-brand-green transition-all"
                  >
                    {imagePath && imagePath.trim() !== '' ? (
                      <Image
                        src={imagePath}
                        alt={`Option ${index + 1}`}
                        fill
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                        No Image
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {availableImages.length === 0 && (
                <div className="text-center py-8">
                  <i className="ri-image-line text-4xl text-brand-gray mb-4"></i>
                  <p className="text-brand-gray">No images available</p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && developerToDelete && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-brand-dark/90 backdrop-blur-lg rounded-2xl p-8 border border-white/10 w-full max-w-md"
            >
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <i className="ri-delete-bin-line text-red-600 text-xl"></i>
                </div>
                
                <h3 className="text-xl font-bold text-white mb-2">
                  Delete Developer
                </h3>
                
                <p className="text-brand-gray mb-4">
                  Are you sure you want to delete <span className="font-semibold text-white">{developerToDelete.name}</span>?
                </p>
                
                {isLoadingProjects ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-brand-green"></div>
                    <span className="ml-2 text-brand-gray">Checking associated projects...</span>
                  </div>
                ) : (
                  developerProjects.length > 0 && (
                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
                      <div className="flex items-center">
                        <i className="ri-alert-line text-yellow-500 text-lg mr-2"></i>
                        <p className="text-yellow-200 text-sm">
                          This developer has {developerProjects.length} associated project{developerProjects.length !== 1 ? 's' : ''}. 
                          Deleting will remove these associations.
                        </p>
                      </div>
                    </div>
                  )
                )}
                
                <div className="flex space-x-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 px-4 py-2 bg-white/10 text-white hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(developerToDelete.id!)}
                    disabled={isLoadingProjects}
                    className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Delete
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}