'use client';

import React, { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaFile } from '@/lib/mysql-database';

// Helper function to normalize media file paths to use the API endpoint
const normalizeMediaPath = (filePath: string): string => {
  if (!filePath) return '';
  
  // If it's already an API path, return as is
  if (filePath.startsWith('/api/media/')) {
    return filePath;
  }
  
  // If it starts with /media/, convert to /api/media/
  if (filePath.startsWith('/media/')) {
    return filePath.replace('/media/', '/api/media/');
  }
  
  // If it starts with /uploads/, convert to /api/media/
  if (filePath.startsWith('/uploads/')) {
    return filePath.replace('/uploads/', '/api/media/');
  }
  
  // For any other path, assume it needs the /api/media/ prefix
  const cleanPath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  return `/api/media/${cleanPath}`;
};

interface MediaContentProps {
  mediaFiles: MediaFile[];
  onUpdate: () => void;
}

export default function MediaContent({ mediaFiles, onUpdate }: MediaContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [formData, setFormData] = useState<Partial<MediaFile>>({
    alt_text: '',
    uploaded_by: 1 // Default to user ID 1, should be replaced with actual user ID
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropZoneRef = useRef<HTMLDivElement>(null);

  const fileTypes = ['image', 'video', 'document', 'archive'];
  
  const filteredAndSortedMediaFiles = (mediaFiles || [])
    .filter(media => {
      const matchesSearch = media.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        media.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (media.alt_text && media.alt_text.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesType = filterType === 'all' || 
        (filterType === 'image' && media.mime_type?.startsWith('image/')) ||
        (filterType === 'video' && media.mime_type?.startsWith('video/')) ||
        (filterType === 'document' && (media.mime_type?.includes('pdf') || media.mime_type?.includes('document') || media.mime_type?.includes('text'))) ||
        (filterType === 'archive' && (media.mime_type?.includes('zip') || media.mime_type?.includes('rar')));
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      let comparison = 0;
      switch (sortBy) {
        case 'name':
          comparison = a.original_name.localeCompare(b.original_name);
          break;
        case 'size':
          comparison = a.file_size - b.file_size;
          break;
        case 'date':
        default:
          comparison = new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
          break;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Drag and drop handlers
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setSelectedFiles(files);
      handleUpload(files);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedFiles(files);
      handleUpload(files);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return '🖼️';
    if (mimeType.startsWith('video/')) return '🎥';
    if (mimeType.includes('pdf')) return '📄';
    if (mimeType.includes('document') || mimeType.includes('word')) return '📝';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return '📊';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return '📈';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return '🗜️';
    if (mimeType.includes('text')) return '📋';
    return '📁';
  };

  const getFileTypeLabel = (mimeType: string) => {
    if (mimeType.startsWith('image/')) return 'Image';
    if (mimeType.startsWith('video/')) return 'Video';
    if (mimeType.includes('pdf')) return 'PDF';
    if (mimeType.includes('document') || mimeType.includes('word')) return 'Document';
    if (mimeType.includes('spreadsheet') || mimeType.includes('excel')) return 'Spreadsheet';
    if (mimeType.includes('presentation') || mimeType.includes('powerpoint')) return 'Presentation';
    if (mimeType.includes('zip') || mimeType.includes('rar')) return 'Archive';
    if (mimeType.includes('text')) return 'Text';
    return 'File';
  };

  const getFileIconClass = (mimeType: string, filename: string) => {
    if (mimeType?.startsWith('image/')) return 'ri-image-line';
    if (mimeType?.startsWith('video/')) return 'ri-video-line';
    if (mimeType === 'application/pdf' || filename.endsWith('.pdf')) return 'ri-file-pdf-line';
    if (mimeType?.includes('word') || filename.endsWith('.doc') || filename.endsWith('.docx')) return 'ri-file-word-line';
    if (mimeType?.includes('excel') || filename.endsWith('.xls') || filename.endsWith('.xlsx')) return 'ri-file-excel-line';
    if (mimeType?.includes('powerpoint') || filename.endsWith('.ppt') || filename.endsWith('.pptx')) return 'ri-file-ppt-line';
    return 'ri-file-line';
  };

  const handleFileSelectForUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
    // Auto-scroll to upload form when files are selected
    if (files.length > 0) {
      setTimeout(() => {
        const uploadForm = document.querySelector('[data-upload-form]');
        if (uploadForm) {
          uploadForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  const handleUpload = async (files?: File[]) => {
    const filesToUpload = files || selectedFiles;
    console.log('handleUpload called with:', { files, selectedFiles, filesToUpload });
    
    if (!filesToUpload || !Array.isArray(filesToUpload) || filesToUpload.length === 0) {
      console.log('No files to upload or invalid file array');
      return;
    }

    console.log('Starting upload process for', filesToUpload.length, 'files');
    setIsUploading(true);
    setUploadProgress(0);

    try {
      const uploadPromises = filesToUpload.map(async (file, index) => {
        const formDataToSend = new FormData();
        formDataToSend.append('file', file);
        formDataToSend.append('alt_text', formData.alt_text || file.name);
        formDataToSend.append('uploaded_by', formData.uploaded_by?.toString() || '1');

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formDataToSend,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to upload ${file.name}`);
        }

        const result = await response.json();
        const progress = ((index + 1) / filesToUpload.length) * 100;
        setUploadProgress(progress);
        return result;
      });

      await Promise.all(uploadPromises);

      // Reset form
      setSelectedFiles([]);
      setFormData({ alt_text: '', uploaded_by: 1 });
      onUpdate(); // Refresh the media list
      
      // Show success message
      alert(`Successfully uploaded ${filesToUpload.length} file(s)!`);
    } catch (error) {
      console.error('Upload error:', error);
      alert(`Failed to upload files: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleEdit = (media: MediaFile) => {
    setEditingMedia(media);
    setFormData({
      alt_text: media.alt_text || '',
      uploaded_by: media.uploaded_by
    });
    setIsModalOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMedia) return;

    try {
      const response = await fetch(`/api/admin/media/${editingMedia.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        alert('Media file updated successfully!');
        setIsModalOpen(false);
        setEditingMedia(null);
        onUpdate();
      } else {
        const result = await response.json();
        alert(`Error: ${result.message || 'Failed to update media file'}`);
      }
    } catch (error) {
      console.error('Error updating media:', error);
      alert('Error updating media file. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this media file?')) {
      try {
        const response = await fetch(`/api/admin/media/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Media file deleted successfully!');
          onUpdate();
        } else {
          const result = await response.json();
          alert(`Error deleting media file: ${result.message || 'Unknown error'}`);
        }
      } catch (error) {
        console.error('Error deleting media:', error);
        alert('Error deleting media file. Please try again.');
      }
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Media Library</h2>
          <p className="text-brand-gray mt-1">
            {filteredAndSortedMediaFiles.length} file{filteredAndSortedMediaFiles.length !== 1 ? 's' : ''} 
            {filterType !== 'all' && ` • ${filterType} files`}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {/* View Mode Toggle */}
          <div className="flex bg-white/10 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-brand-green text-white shadow-sm' : 'text-brand-gray hover:text-white'
              }`}
            >
              <i className="ri-grid-line mr-1"></i> Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'list' ? 'bg-brand-green text-white shadow-sm' : 'text-brand-gray hover:text-white'
              }`}
            >
              <i className="ri-list-check mr-1"></i> List
            </button>
          </div>
          
          {/* Sort Controls */}
          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
            className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-brand-green"
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="size-desc">Largest First</option>
            <option value="size-asc">Smallest First</option>
          </select>
          
          {/* Enhanced Upload Button */}
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.zip,.rar"
            onChange={handleFileSelectForUpload}
            className="hidden"
          />
          <div className="relative group">
            <button
              onClick={triggerFileSelect}
              disabled={isUploading}
              className="relative overflow-hidden bg-gradient-to-r from-brand-green to-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-brand-green-dark hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            >
              {/* Animated Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              
              {/* Button Content */}
              <div className="relative z-10 flex items-center gap-3">
                {isUploading ? (
                  <>
                    <div className="relative">
                      <i className="ri-loader-4-line animate-spin text-lg"></i>
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                    </div>
                    <span className="font-medium">Uploading...</span>
                  </>
                ) : (
                  <>
                    <div className="relative">
                      <i className="ri-upload-cloud-2-line text-lg"></i>
                      <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
                    </div>
                    <span className="font-medium">Add Media</span>
                    <i className="ri-arrow-right-line text-sm opacity-70 group-hover:opacity-100 transform group-hover:translate-x-1 transition-all duration-200"></i>
                  </>
                )}
              </div>
            </button>
            
            {/* Tooltip */}
            <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-black/80 text-white text-xs px-3 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
              Click to browse or drag files here
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Drag and Drop Upload Section */}
      <motion.div 
        ref={dropZoneRef}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`relative overflow-hidden bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-lg rounded-2xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer group ${
          dragActive 
            ? 'border-brand-green bg-gradient-to-br from-brand-green/20 to-emerald-500/10 shadow-2xl shadow-brand-green/20 scale-105' 
            : 'border-white/20 hover:border-brand-green/50 hover:bg-gradient-to-br hover:from-white/10 hover:to-brand-green/5'
        }`}
        onClick={triggerFileSelect}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-brand-green rounded-full animate-pulse"></div>
          <div className="absolute top-8 right-8 w-4 h-4 bg-emerald-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute bottom-8 left-8 w-6 h-6 border-2 border-yellow-400 rotate-45 animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-4 right-4 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        </div>

        <div className="relative z-10 text-center">
          <motion.div 
            className="mb-6"
            animate={dragActive ? { scale: 1.2, rotate: 5 } : { scale: 1, rotate: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="relative inline-block">
              <i className={`ri-upload-cloud-2-line text-7xl transition-all duration-300 ${
                dragActive ? 'text-brand-green drop-shadow-lg' : 'text-brand-gray group-hover:text-brand-green'
              }`}></i>
              {dragActive && (
                <div className="absolute inset-0 bg-brand-green/20 rounded-full animate-ping"></div>
              )}
            </div>
          </motion.div>
          
          <motion.h3 
            className={`text-xl font-bold mb-3 transition-colors duration-300 ${
              dragActive ? 'text-brand-green' : 'text-white group-hover:text-brand-green'
            }`}
            animate={dragActive ? { scale: 1.05 } : { scale: 1 }}
          >
            {dragActive ? '🎯 Drop your files here!' : '📁 Drag & drop your media files'}
          </motion.h3>
          
          <p className={`text-base mb-6 transition-colors duration-300 ${
            dragActive ? 'text-brand-green/80' : 'text-brand-gray group-hover:text-white'
          }`}>
            {dragActive ? 'Release to upload' : 'or click anywhere to browse'}
          </p>
          
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              triggerFileSelect();
            }}
            className="bg-gradient-to-r from-brand-green to-emerald-500 text-white px-8 py-4 rounded-xl font-semibold hover:from-brand-green-dark hover:to-emerald-600 transition-all duration-300 inline-flex items-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
            whileHover={{ y: -2 }}
            whileTap={{ y: 0 }}
          >
            <i className="ri-folder-open-line text-lg"></i>
            <span>Browse Files</span>
            <i className="ri-external-link-line text-sm opacity-70"></i>
          </motion.button>
          
          <div className="mt-6 flex flex-wrap justify-center gap-2 text-xs">
            <span className="bg-white/10 text-brand-gray px-3 py-1 rounded-full border border-white/20">
              📸 Images
            </span>
            <span className="bg-white/10 text-brand-gray px-3 py-1 rounded-full border border-white/20">
              🎥 Videos
            </span>
            <span className="bg-white/10 text-brand-gray px-3 py-1 rounded-full border border-white/20">
              📄 Documents
            </span>
            <span className="bg-white/10 text-brand-gray px-3 py-1 rounded-full border border-white/20">
              📦 Archives
            </span>
          </div>
          
          <p className="text-xs text-brand-gray/70 mt-4">
            Maximum file size: <span className="text-brand-green font-medium">10MB</span> per file
          </p>
        </div>
      </motion.div>

      {/* Enhanced Upload Form Section */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl"
            data-upload-form
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-brand-green/20 rounded-xl flex items-center justify-center">
                  <i className="ri-settings-3-line text-brand-green text-lg"></i>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Upload Configuration</h3>
                  <p className="text-brand-gray text-sm">{selectedFiles.length} file{selectedFiles.length !== 1 ? 's' : ''} selected</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedFiles([])}
                className="text-brand-gray hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
                title="Clear selection"
              >
                <i className="ri-close-line text-lg"></i>
              </button>
            </div>
            
            {/* Selected Files Preview */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
                <i className="ri-file-list-3-line"></i>
                Selected Files
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-32 overflow-y-auto">
                {selectedFiles.map((file, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3 border border-white/10">
                    <div className="flex items-center gap-2">
                      <i className={`text-lg ${
                        file.type.startsWith('image/') ? 'ri-image-line text-blue-400' :
                        file.type.startsWith('video/') ? 'ri-video-line text-purple-400' :
                        'ri-file-line text-gray-400'
                      }`}></i>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{file.name}</p>
                        <p className="text-brand-gray text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <i className="ri-text text-brand-green"></i>
                  Alt Text (Accessibility)
                </label>
                <input
                  type="text"
                  value={formData.alt_text || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-brand-gray focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all duration-200"
                  placeholder="Describe the content for screen readers"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-white mb-3 flex items-center gap-2">
                  <i className="ri-user-line text-brand-green"></i>
                  Uploader ID
                </label>
                <input
                  type="number"
                  value={formData.uploaded_by || 1}
                  onChange={(e) => setFormData(prev => ({ ...prev, uploaded_by: parseInt(e.target.value) || 1 }))}
                  className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-brand-gray focus:outline-none focus:border-brand-green focus:ring-2 focus:ring-brand-green/20 transition-all duration-200"
                  placeholder="User ID"
                  min="1"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <motion.button
                onClick={() => handleUpload()}
                disabled={isUploading || selectedFiles.length === 0}
                className="w-full sm:w-auto bg-gradient-to-r from-brand-green to-emerald-500 text-white px-8 py-4 rounded-xl font-bold hover:from-brand-green-dark hover:to-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl transform hover:scale-105 active:scale-95"
                whileHover={{ y: -2 }}
                whileTap={{ y: 0 }}
              >
                {isUploading ? (
                  <>
                    <div className="relative">
                      <i className="ri-loader-4-line animate-spin text-xl"></i>
                      <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse"></div>
                    </div>
                    <span className="font-bold">Uploading Files...</span>
                  </>
                ) : (
                  <>
                    <i className="ri-rocket-line text-xl"></i>
                    <span className="font-bold">Upload {selectedFiles.length} File{selectedFiles.length !== 1 ? 's' : ''}</span>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold">{selectedFiles.length}</span>
                    </div>
                  </>
                )}
               </motion.button>
               
               <button
                 onClick={() => setSelectedFiles([])}
                 disabled={isUploading}
                 className="px-6 py-3 bg-white/10 text-white rounded-xl font-medium hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
               >
                 <i className="ri-close-line"></i>
                 Cancel
               </button>
             </div>

             {/* Upload Progress */}
             {isUploading && (
               <motion.div 
                 initial={{ opacity: 0, height: 0 }}
                 animate={{ opacity: 1, height: 'auto' }}
                 className="mt-6 space-y-3"
               >
                 <div className="flex items-center justify-between text-sm">
                   <span className="text-white font-medium">Upload Progress</span>
                   <span className="text-brand-green font-bold">{uploadProgress}%</span>
                 </div>
                 <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                   <motion.div 
                     className="bg-gradient-to-r from-brand-green to-emerald-400 h-full rounded-full shadow-lg"
                     initial={{ width: 0 }}
                     animate={{ width: `${uploadProgress}%` }}
                     transition={{ duration: 0.3 }}
                   >
                     <div className="w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 animate-pulse"></div>
                   </motion.div>
                 </div>
                 <p className="text-xs text-brand-gray text-center">
                   Uploading files to media library...
                 </p>
               </motion.div>
             )}
           </motion.div>
         )}
       </AnimatePresence>

      {/* Search and Filters */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-gray"></i>
            <input
              type="text"
              placeholder="Search by filename, alt text..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg pl-10 pr-4 py-3 text-white placeholder-brand-gray focus:outline-none focus:border-brand-green focus:bg-white/15 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-brand-gray hover:text-white"
              >
                <i className="ri-close-line"></i>
              </button>
            )}
          </div>
          
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-brand-green min-w-[120px]"
            >
              <option value="all">All Types</option>
              {fileTypes.map(type => (
                <option key={type} value={type}>
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </option>
              ))}
            </select>
            
            {(searchTerm || filterType !== 'all') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterType('all');
                }}
                className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-brand-gray hover:text-white hover:border-brand-green transition-colors"
                title="Clear filters"
              >
                <i className="ri-filter-off-line"></i>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Media Display */}
      <div className={viewMode === 'grid' 
        ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        : "space-y-4"
      }>
        <AnimatePresence>
          {filteredAndSortedMediaFiles.map((media) => (
            <motion.div
              key={media.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={viewMode === 'grid' 
                ? "bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden hover:border-brand-green/50 transition-all duration-300 group hover:shadow-lg hover:shadow-brand-green/10"
                : "bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 p-4 hover:border-brand-green/50 transition-all duration-300 group hover:shadow-lg hover:shadow-brand-green/10"
              }
            >
              {viewMode === 'grid' ? (
                <>
                  {/* Grid View - Media Preview */}
                  <div className="aspect-square bg-gray-800 relative overflow-hidden">
                    {media.mime_type?.startsWith('image/') ? (
                      <Image
                        src={normalizeMediaPath(media.file_path)}
                        alt={media.alt_text || media.original_name}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : media.mime_type?.startsWith('video/') ? (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center relative">
                        <video
                          src={normalizeMediaPath(media.file_path)}
                          className="w-full h-full object-cover"
                          muted
                        />
                        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                          <i className="ri-play-circle-line text-4xl text-white"></i>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex flex-col items-center justify-center">
                        <i className={`${getFileIconClass(media.mime_type || '', media.filename)} text-4xl text-gray-400 mb-2`}></i>
                        <span className="text-xs text-gray-500 text-center px-2">
                          {getFileTypeLabel(media.mime_type || '')}
                        </span>
                      </div>
                    )}
                    
                    {/* Quick Actions Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => copyToClipboard(normalizeMediaPath(media.file_path))}
                        className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                        title="Copy URL"
                      >
                        <i className="ri-link text-lg"></i>
                      </button>
                      <button
                        onClick={() => handleEdit(media)}
                        className="bg-white/20 text-white p-2 rounded-lg hover:bg-white/30 transition-colors"
                        title="Edit"
                      >
                        <i className="ri-edit-line text-lg"></i>
                      </button>
                      <button
                        onClick={() => handleDelete(media.id?.toString() || '')}
                        className="bg-red-500/20 text-red-300 p-2 rounded-lg hover:bg-red-500/30 transition-colors"
                        title="Delete"
                      >
                        <i className="ri-delete-bin-line text-lg"></i>
                      </button>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-1 bg-brand-green/20 text-brand-green rounded text-xs font-medium">
                        {getFileTypeLabel(media.mime_type || '')}
                      </span>
                      <span className="text-xs text-brand-gray">
                        {formatFileSize(media.file_size)}
                      </span>
                    </div>
                    
                    <h4 className="text-sm font-medium text-white mb-1 truncate" title={media.original_name}>
                      {media.original_name}
                    </h4>
                    
                    {media.alt_text && (
                      <p className="text-xs text-brand-gray mb-2 line-clamp-2">
                        {media.alt_text}
                      </p>
                    )}
                    
                    <div className="text-xs text-brand-gray">
                      {media.created_at ? new Date(media.created_at).toLocaleDateString() : 'No date'}
                    </div>
                  </div>
                </>
              ) : (
                /* List View */
                <div className="flex items-center gap-4">
                  {/* Thumbnail */}
                  <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                    {media.mime_type?.startsWith('image/') ? (
                      <Image
                        src={normalizeMediaPath(media.file_path)}
                        alt={media.alt_text || media.original_name}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <i className={`${getFileIconClass(media.mime_type || '', media.filename)} text-xl text-gray-400`}></i>
                      </div>
                    )}
                  </div>
                  
                  {/* File Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-medium text-white truncate" title={media.original_name}>
                        {media.original_name}
                      </h4>
                      <span className="px-2 py-1 bg-brand-green/20 text-brand-green rounded text-xs font-medium flex-shrink-0">
                        {getFileTypeLabel(media.mime_type || '')}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-xs text-brand-gray">
                      <span>{formatFileSize(media.file_size)}</span>
                      <span>{media.created_at ? new Date(media.created_at).toLocaleDateString() : 'No date'}</span>
                      {media.alt_text && (
                        <span className="truncate max-w-xs" title={media.alt_text}>
                          Alt: {media.alt_text}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => copyToClipboard(media.file_path)}
                      className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
                      title="Copy URL"
                    >
                      <i className="ri-link text-sm"></i>
                    </button>
                    <button
                      onClick={() => handleEdit(media)}
                      className="bg-white/10 text-white p-2 rounded-lg hover:bg-white/20 transition-colors"
                      title="Edit"
                    >
                      <i className="ri-edit-line text-sm"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(media.id?.toString() || '')}
                      className="bg-red-500/20 text-red-300 p-2 rounded-lg hover:bg-red-500/30 transition-colors"
                      title="Delete"
                    >
                      <i className="ri-delete-bin-line text-sm"></i>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAndSortedMediaFiles.length === 0 && (
        <div className="text-center py-16">
          <div className="mb-6">
            <i className="ri-image-line text-8xl text-brand-gray/50"></i>
          </div>
          <h3 className="text-xl font-semibold text-white mb-3">
            {searchTerm || filterType !== 'all' ? 'No matching files found' : 'No media files yet'}
          </h3>
          <p className="text-brand-gray mb-6 max-w-md mx-auto">
            {searchTerm || filterType !== 'all' 
              ? 'Try adjusting your search or filter criteria'
              : 'Upload your first media files to get started with your media library'
            }
          </p>
          {(!searchTerm && filterType === 'all') && (
            <button
              onClick={triggerFileSelect}
              className="bg-brand-green text-white px-6 py-3 rounded-lg hover:bg-brand-green-dark transition-colors inline-flex items-center gap-2"
            >
              <i className="ri-upload-line"></i>
              Upload Your First Files
            </button>
          )}
        </div>
      )}

      {/* Edit Media Modal */}
      <AnimatePresence>
        {isModalOpen && editingMedia && (
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
              className="bg-gray-900 rounded-xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-white/10">
                <h3 className="text-xl font-bold text-white">Edit Media File</h3>
              </div>

              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white mb-2">Alt Text</label>
                  <input
                    type="text"
                    value={formData.alt_text || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, alt_text: e.target.value }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                    placeholder="Alt text for accessibility"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-2">Uploaded By (User ID)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.uploaded_by || 1}
                    onChange={(e) => setFormData(prev => ({ ...prev, uploaded_by: parseInt(e.target.value) || 1 }))}
                    className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                    placeholder="User ID"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    className="bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-green-dark transition-colors"
                  >
                    Update Media File
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