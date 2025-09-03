'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { MediaFile } from '@/lib/mysql-database';

interface MediaContentProps {
  mediaFiles: MediaFile[];
  onUpdate: () => void;
}

export default function MediaContent({ mediaFiles, onUpdate }: MediaContentProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<MediaFile | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');

  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState<Partial<MediaFile>>({
    alt_text: '',
    uploaded_by: 1 // Default to user ID 1, should be replaced with actual user ID
  });

  const fileTypes = ['image', 'video', 'document'];
  
  const filteredMediaFiles = (mediaFiles || []).filter(media => {
    const matchesSearch = media.original_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      media.filename.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || 
      (filterType === 'image' && media.mime_type?.startsWith('image/')) ||
      (filterType === 'video' && media.mime_type?.startsWith('video/')) ||
      (filterType === 'document' && !media.mime_type?.startsWith('image/') && !media.mime_type?.startsWith('video/'));
    return matchesSearch && matchesType;
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (mimeType: string, filename: string) => {
    if (mimeType?.startsWith('image/')) return 'ri-image-line';
    if (mimeType?.startsWith('video/')) return 'ri-video-line';
    if (mimeType === 'application/pdf' || filename.endsWith('.pdf')) return 'ri-file-pdf-line';
    if (mimeType?.includes('word') || filename.endsWith('.doc') || filename.endsWith('.docx')) return 'ri-file-word-line';
    if (mimeType?.includes('excel') || filename.endsWith('.xls') || filename.endsWith('.xlsx')) return 'ri-file-excel-line';
    if (mimeType?.includes('powerpoint') || filename.endsWith('.ppt') || filename.endsWith('.pptx')) return 'ri-file-ppt-line';
    return 'ri-file-line';
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles(files);
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('alt_text', formData.alt_text || '');
        formDataUpload.append('uploaded_by', String(formData.uploaded_by || 1));

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        setUploadProgress(((i + 1) / selectedFiles.length) * 100);
      }

      alert('Files uploaded successfully!');
      setSelectedFiles([]);
      setFormData({
        alt_text: '',
        uploaded_by: 1
      });
      onUpdate();
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading files. Please try again.');
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Media Library</h2>
          <p className="text-brand-gray">Manage your media files and assets</p>
        </div>
      </div>

      {/* Upload Section */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <h3 className="text-lg font-semibold text-white mb-4">Upload New Files</h3>
        
        <div className="space-y-4">
          <div>
            <input
              type="file"
              multiple
              accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
              onChange={handleFileSelect}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-brand-green file:text-white file:cursor-pointer hover:file:bg-brand-green-dark"
            />
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                      value={formData.uploaded_by || 1}
                      onChange={(e) => setFormData(prev => ({ ...prev, uploaded_by: parseInt(e.target.value) || 1 }))}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                      placeholder="User ID"
                      min="1"
                    />
                  </div>
               </div>

              <div className="flex items-center gap-4">
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="bg-brand-green text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-green-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isUploading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin"></i>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <i className="ri-upload-line"></i>
                      Upload {selectedFiles.length} file(s)
                    </>
                  )}
                </button>

                {isUploading && (
                  <div className="flex-1 bg-white/10 rounded-lg overflow-hidden">
                    <div 
                      className="bg-brand-green h-2 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>

              <div className="text-sm text-brand-gray">
                Selected files: {selectedFiles.map(f => f.name).join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-lg rounded-xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search media files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
            />
          </div>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-brand-green"
          >
            <option value="all">All Types</option>
            {fileTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence>
          {filteredMediaFiles.map((media) => (
            <motion.div
              key={media.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden hover:border-brand-green/50 transition-colors group"
            >
              {/* Media Preview */}
              <div className="aspect-square bg-gray-800 relative overflow-hidden">
                {media.mime_type?.startsWith('image/') ? (
                  <Image
                    src={media.file_path}
                    alt={media.alt_text || media.original_name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : media.mime_type?.startsWith('video/') ? (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <video
                      src={media.file_path}
                      className="w-full h-full object-cover"
                      muted
                    />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                      <i className="ri-play-circle-line text-4xl text-white"></i>
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                    <i className={`${getFileIcon(media.mime_type, media.filename)} text-4xl text-gray-400`}></i>
                  </div>
                )}
                
                {/* Quick Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => copyToClipboard(media.file_path)}
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
                    {media.mime_type}
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
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredMediaFiles.length === 0 && (
        <div className="text-center py-12">
          <i className="ri-image-line text-6xl text-brand-gray mb-4"></i>
          <h3 className="text-xl font-semibold text-white mb-2">No media files found</h3>
          <p className="text-brand-gray">
            {searchTerm || filterType !== 'all'
              ? 'Try adjusting your search or filters' 
              : 'Upload your first media file to get started'}
          </p>
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