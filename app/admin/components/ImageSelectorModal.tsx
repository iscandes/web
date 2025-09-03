'use client';

import React, { useState } from 'react';
import { MediaFile } from '@/lib/mysql-database';

interface ImageSelectorModalProps {
  mediaFiles: MediaFile[];
  onSelect: (imageUrl: string) => void;
  onUpload: (file: File) => Promise<MediaFile>;
  onClose: () => void;
}

export default function ImageSelectorModal({ 
  mediaFiles, 
  onSelect, 
  onUpload, 
  onClose 
}: ImageSelectorModalProps) {
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  const handleFileUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFileUpload(imageFile);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl border border-amber-500/30 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex justify-between items-center p-4 sm:p-6 border-b border-amber-500/20">
          <div>
            <h3 className="text-lg sm:text-2xl font-bold text-white font-cormorant">Select or Upload Image</h3>
            <p className="text-amber-400/70 mt-1 text-sm sm:text-base">Choose from existing media or upload new images</p>
          </div>
          <button
            onClick={onClose}
            className="text-amber-400 hover:text-white transition-colors text-xl sm:text-2xl font-bold"
          >
            ✕
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {/* Upload Area */}
          <div
            className={`border-2 border-dashed rounded-xl p-4 sm:p-8 mb-6 text-center transition-all ${
              dragOver 
                ? 'border-amber-500 bg-amber-500/10' 
                : 'border-amber-500/30 hover:border-amber-500/50'
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
          >
            <div className="flex flex-col items-center space-y-3 sm:space-y-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-amber-500/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              
              <div>
                <p className="text-white font-medium mb-1 sm:mb-2 text-sm sm:text-base">
                  {uploading ? 'Uploading...' : 'Drag and drop images here, or click to browse'}
                </p>
                <p className="text-amber-400/70 text-xs sm:text-sm">
                  Supports JPG, PNG, GIF, WebP up to 10MB
                </p>
              </div>
              
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFileUpload(file);
                }}
                className="hidden"
                id="file-upload"
                disabled={uploading}
              />
              
              <label
                htmlFor="file-upload"
                className={`px-4 sm:px-6 py-2 sm:py-3 rounded-lg font-medium cursor-pointer transition-all text-sm sm:text-base ${
                  uploading
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-600 text-black hover:shadow-lg'
                }`}
              >
                {uploading ? 'Uploading...' : 'Browse Files'}
              </label>
            </div>
          </div>

          {/* Existing Media Grid */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4 font-montserrat">
              Existing Media ({mediaFiles.length})
            </h4>
            
            {mediaFiles.length === 0 ? (
              <div className="text-center py-8 sm:py-12">
                <div className="text-4xl sm:text-6xl mb-3 sm:mb-4">🖼️</div>
                <p className="text-amber-400/70 text-sm sm:text-base">No media files found. Upload your first image above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
                {mediaFiles.map((media) => (
                  <div
                    key={media.id}
                    onClick={() => onSelect(media.file_path)}
                    className="relative group cursor-pointer rounded-lg overflow-hidden border border-amber-500/20 hover:border-amber-500 transition-all hover:scale-105"
                  >
                    <div className="aspect-square">
                      <img
                        src={media.file_path}
                        alt={media.alt_text || media.filename}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                    
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center">
                        <div className="bg-amber-500 text-black px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium mb-1 sm:mb-2">
                          Select
                        </div>
                        <p className="text-white text-xs truncate px-1 sm:px-2">
                          {media.filename}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}