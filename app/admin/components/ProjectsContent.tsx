'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Project } from '../../../lib/mysql-database';
import { AnimatePresence, motion } from 'framer-motion';

interface ProjectsContentProps {
  projects: Project[];
  onUpdate: () => void;
}

export default function ProjectsContent({ projects, onUpdate }: ProjectsContentProps) {
  // Debug logging
  console.log('📊 ProjectsContent received props:', {
    projectsLength: projects.length,
    projects: projects,
    onUpdate: typeof onUpdate
  });
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [uploadingPPTX, setUploadingPPTX] = useState(false);
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [pptxPreview, setPptxPreview] = useState<string | null>(null);
  const [pendingVideoFile, setPendingVideoFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>('');
  
  // Delete confirmation dialog state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  
  // New state for enhanced features
  const [developers, setDevelopers] = useState<any[]>([]);
  const [developerSuggestions, setDeveloperSuggestions] = useState<any[]>([]);
  const [showDeveloperSuggestions, setShowDeveloperSuggestions] = useState(false);
  const [isCreatingNewDeveloper, setIsCreatingNewDeveloper] = useState(false);
  const [selectedUnitTypes, setSelectedUnitTypes] = useState<string[]>([]);
  const [aiDescription, setAiDescription] = useState('');
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    description: '',
    image: '',
    featured_video: '',
    type: 'Apartment',
    developer: '',
    location: '',
    starting_price: '',
    bedrooms: 0,
    bathrooms: 0,
    studios: 0,
    units_1bedroom: 0,
    units_2bedroom: 0,
    units_3bedroom: 0,
    units_4bedroom: 0,
    units_5bedroom: 0,
    units_6bedroom: 0,
    units_7bedroom: 0,
    units_office: 0,
    shop_commercial: 0,
    area: '',
    features: [],
    property_types: [],
    gallery: [],
    presentation_file: '',
    project_type: 'ready',
    status: 'Available',
    is_featured: false,
    units_8plus_bedrooms: '',
    custom_bedroom_count: ''
  });

  // Fetch available images for image picker
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch('/api/admin/uploads');
        if (response.ok) {
          const data = await response.json();
          setAvailableImages(data.images || []);
        } else {
          // Fallback to predefined images
          setAvailableImages([
            '/uploads/photo_1_2025-07-24_19-59-29.jpg',
            '/uploads/photo_2_2025-07-24_19-59-29.jpg',
            '/uploads/photo_3_2025-07-24_19-59-29.jpg',
            '/uploads/photo_4_2025-07-24_19-59-29.jpg',
            '/uploads/photo_5_2025-07-24_19-59-29.jpg'
          ]);
        }
      } catch (error) {
        console.error('Error fetching images:', error);
        setAvailableImages([
          '/uploads/photo_1_2025-07-24_19-59-29.jpg',
          '/uploads/photo_2_2025-07-24_19-59-29.jpg',
          '/uploads/photo_3_2025-07-24_19-59-29.jpg',
          '/uploads/photo_4_2025-07-24_19-59-29.jpg',
          '/uploads/photo_5_2025-07-24_19-59-29.jpg'
        ]);
      }
    };

    fetchImages();
  }, []);

  // Fetch developers for auto-suggest
  useEffect(() => {
    const fetchDevelopers = async () => {
      try {
        const response = await fetch('/api/developers');
        if (response.ok) {
          const data = await response.json();
          setDevelopers(data);
        }
      } catch (error) {
        console.error('Error fetching developers:', error);
      }
    };

    fetchDevelopers();
  }, []);

  // Handle developer input change for auto-suggest
  const handleDeveloperInputChange = (value: string) => {
    setFormData(prev => ({ ...prev, developer: value }));
    
    if (value.length > 0) {
      const suggestions = developers.filter(dev => 
        dev.name.toLowerCase().includes(value.toLowerCase())
      );
      setDeveloperSuggestions(suggestions);
      setShowDeveloperSuggestions(true);
    } else {
      setShowDeveloperSuggestions(false);
    }
  };

  // Select developer from suggestions
  const selectDeveloper = (developer: any) => {
    setFormData(prev => ({ ...prev, developer: developer.name }));
    setShowDeveloperSuggestions(false);
    setIsCreatingNewDeveloper(false);
  };

  // Create new developer
  const createNewDeveloper = async (name: string) => {
    setIsCreatingNewDeveloper(false); // Hide the confirmation dialog
    
    try {
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const response = await fetch('/api/admin/developers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          slug,
          description: `${name} - Real Estate Developer`,
          projects_count: 0,
          status: 'Active',
          location: 'Dubai, UAE', // Default location
          established: new Date().getFullYear() // Current year as default
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const newDeveloper = result.data || result; // Handle both admin API format and direct format
        setDevelopers(prev => [...prev, newDeveloper]);
        setFormData(prev => ({ ...prev, developer: name }));
        setShowDeveloperSuggestions(false);
        
        // Trigger refresh on developers page
        localStorage.setItem('developer_added', 'true');
        
        // Show success message with more details
        alert(`✅ New developer "${name}" created successfully!\nYou can now assign projects to this developer.`);
      } else {
        const errorResult = await response.json();
        alert(`❌ Failed to create new developer: ${errorResult.message || errorResult.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error creating developer:', error);
      alert('❌ Error creating new developer. Please check your connection and try again.');
    }
  };

  // Handle unit type selection
  const handleUnitTypeChange = (unitType: string, checked: boolean) => {
    if (checked) {
      setSelectedUnitTypes(prev => [...prev, unitType]);
    } else {
      setSelectedUnitTypes(prev => prev.filter(type => type !== unitType));
    }
  };

  // Generate AI description
  const generateAIDescription = async () => {
    if (!formData.developer || selectedUnitTypes.length === 0) {
      alert('Please select a developer and unit types first');
      return;
    }

    try {
      const response = await fetch('/api/admin/ai-description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          developer: formData.developer,
          unitTypes: selectedUnitTypes,
          projectName: formData.name,
          location: formData.location
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAiDescription(data.description);
        setFormData(prev => ({ ...prev, description: data.description }));
      } else {
        alert('Failed to generate AI description');
      }
    } catch (error) {
      console.error('Error generating AI description:', error);
      alert('Error generating AI description');
    }
  };

  const handleVideoUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    const allowedTypes = ['video/mp4', 'video/webm', 'video/mov', 'video/quicktime'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    
    // Check both MIME type and file extension
    if (!allowedTypes.includes(file.type) && 
        !['mp4', 'webm', 'mov', 'quicktime'].includes(fileExtension || '')) {
      alert('Please select a valid video file (MP4, WebM, MOV)');
      return;
    }

    // Validate file size (max 250MB)
    const maxSize = 250 * 1024 * 1024; // 250MB
    if (file.size > maxSize) {
      alert('Video file is too large. Maximum size is 250MB');
      return;
    }

    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      uploadFormData.append('mediaType', 'video');
      
      // If editing existing project, upload immediately
      if (editingProject?.id) {
        uploadFormData.append('projectId', editingProject.id.toString());

        console.log('Uploading video for existing project:', editingProject.id);
        const response = await fetch('/api/admin/projects/upload-video', {
          method: 'POST',
          body: uploadFormData,
        });

        const result = await response.json();
        console.log('Upload response:', result);
        
        if (response.ok && result.success) {
          // Update the featured_video with the correct path
          const videoPath = result.data.filePath;
          setFormData(prev => ({ ...prev, featured_video: videoPath }));
          console.log('Video uploaded successfully:', videoPath);
          alert('Video uploaded successfully!');
          
          // Force refresh to ensure media_files is updated
          onUpdate();
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } else {
        // For new projects, don't store blob URL in form data
        // Just store the file for upload after project creation
        setPendingVideoFile(file);
        // Clear any existing featured_video to avoid blob URLs
        setFormData(prev => ({ ...prev, featured_video: '' }));
        alert('Video selected! It will be uploaded when you save the project.');
      }
    } catch (error) {
      console.error('Error uploading video:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to upload video';
      alert(`Error uploading video: ${errorMessage}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Prevent double submission
    if (isSubmitting) {
      return;
    }
    
    // Enhanced form validation
    const validationErrors = [];
    
    if (!formData.name?.trim()) {
      validationErrors.push('Project name is required');
    }
    
    if (!formData.developer?.trim()) {
      validationErrors.push('Developer assignment is required');
    }
    
    if (!formData.location?.trim()) {
      validationErrors.push('Location is required');
    }
    
    if (!formData.starting_price?.trim()) {
      validationErrors.push('Starting price is required');
    }
    
    if (!formData.description?.trim()) {
      validationErrors.push('Description is required');
    }
    
    // Validate video file if present
    if (pendingVideoFile) {
      const maxSize = 250 * 1024 * 1024; // 250MB
      const allowedTypes = ['video/mp4', 'video/webm', 'video/quicktime'];
      
      if (pendingVideoFile.size > maxSize) {
        validationErrors.push('Video file must be smaller than 250MB');
      }
      
      if (!allowedTypes.includes(pendingVideoFile.type)) {
        validationErrors.push('Video must be MP4, WebM, or MOV format');
      }
    }
    
    if (validationErrors.length > 0) {
      alert('Please fix the following errors:\n\n' + validationErrors.join('\n'));
      return;
    }
    
    setIsSubmitting(true);
    setUploadProgress(0);
    setUploadStatus('Preparing project...');
    
    try {
      console.log('🚀 Starting project submission with data:', formData);
      console.log('📋 Available developers:', developers.map(d => ({ id: d.id, name: d.name })));
      
      // Find the developer ID from the developer name
      const selectedDeveloper = developers.find(dev => dev.name === formData.developer);
      let developerId = selectedDeveloper?.id;
      let developerAutoCreated = false;
      
      console.log('👤 Selected developer:', selectedDeveloper, 'ID:', developerId);
      
      // If developer doesn't exist, create it first
      if (!developerId && formData.developer) {
        try {
          setUploadStatus('Creating developer profile...');
          setUploadProgress(10);
          const slug = formData.developer.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          const createDeveloperResponse = await fetch('/api/admin/developers', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: formData.developer,
              slug,
              description: `${formData.developer} - Real Estate Developer`,
              projects_count: 0,
              status: 'Active',
              location: 'Dubai, UAE', // Default location
              established: new Date().getFullYear() // Current year as default
            }),
          });
          
          if (createDeveloperResponse.ok) {
            const newDeveloperResult = await createDeveloperResponse.json();
            const newDeveloper = newDeveloperResult.data || newDeveloperResult;
            developerId = newDeveloper.id;
            setDevelopers(prev => [...prev, newDeveloper]);
            
            // Trigger refresh on developers page
            localStorage.setItem('developer_added', 'true');
            developerAutoCreated = true;
            
            console.log(`✅ Auto-created developer "${formData.developer}" during project creation`);
          } else {
            const errorResult = await createDeveloperResponse.json();
            alert(`❌ Failed to create developer: ${errorResult.message || errorResult.error || 'Unknown error'}`);
            return;
          }
        } catch (devError) {
          console.error('Error creating developer:', devError);
          alert('❌ Error creating developer. Please check your connection and try again.');
          return;
        }
      }
      
      setUploadStatus(editingProject ? 'Updating project...' : 'Creating project...');
      setUploadProgress(30);
      
      const url = editingProject 
        ? `/api/admin/projects/${editingProject.id}` 
        : '/api/admin/projects';
      
      const method = editingProject ? 'PUT' : 'POST';
      
      // Include developer_id in the project data
      const projectData = {
        ...formData,
        developer_id: developerId
      };
      
      console.log('📤 Making API request to:', url, 'with method:', method);
      console.log('📦 Project data being sent:', projectData);
      
      // Add timeout to prevent hanging
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projectData),
        signal: controller.signal
       });
       
       clearTimeout(timeoutId);
       console.log('📥 API response status:', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        
        // If this is a new project and we have a pending video file, upload it now
        if (!editingProject && pendingVideoFile) {
          setUploadStatus('Uploading video file...');
          setUploadProgress(50);
          
          // Get the project ID from the response - the API returns project data in 'data' field
          const projectId = result.data?.id;
          
          console.log('Project creation result:', result);
          console.log('Extracted project ID:', projectId);
          
          if (projectId) {
            try {
              console.log('Uploading video for project ID:', projectId);
              console.log('Pending video file:', pendingVideoFile);
              
              const fileSizeMB = (pendingVideoFile.size / (1024 * 1024)).toFixed(2);
              setUploadStatus(`Uploading video (${fileSizeMB}MB)...`);
              
              const videoFormData = new FormData();
              videoFormData.append('file', pendingVideoFile);
              videoFormData.append('projectId', projectId.toString());
              videoFormData.append('mediaType', 'video');

              console.log('Sending video upload request...');
              const videoResponse = await fetch('/api/admin/projects/upload-video', {
                method: 'POST',
                body: videoFormData,
              });

              const videoResult = await videoResponse.json();
              console.log('Video upload response:', videoResult);
              
              if (videoResponse.ok && videoResult.success) {
                setUploadProgress(80);
                setUploadStatus('Finalizing project...');
                
                // Update the project with the actual video URL
                console.log('Updating project with video URL:', videoResult.data.filePath);
                const updateResponse = await fetch(`/api/admin/projects/${projectId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    ...formData,
                    featured_video: videoResult.data.filePath
                  }),
                });
                
                if (updateResponse.ok) {
                  setUploadProgress(100);
                  setUploadStatus('Upload completed successfully!');
                  
                  console.log('Video uploaded and project updated successfully:', videoResult.data.filePath);
                  const successMsg = developerAutoCreated 
                    ? `✅ Project and video uploaded successfully! Developer "${formData.developer}" was automatically created.`
                    : '✅ Project and video uploaded successfully!';
                  alert(successMsg);
                } else {
                  console.error('Failed to update project with video URL');
                  const errorMsg = developerAutoCreated
                    ? `Video uploaded and developer "${formData.developer}" was auto-created, but failed to update project. Please refresh the page.`
                    : 'Video uploaded but failed to update project. Please refresh the page.';
                  alert(errorMsg);
                }
              } else {
                console.error('Video upload failed:', videoResult);
                const errorMsg = developerAutoCreated
                  ? `Project created and developer "${formData.developer}" was auto-created, but video upload failed: ${videoResult.error || 'Unknown error'}`
                  : `Project created but video upload failed: ${videoResult.error || 'Unknown error'}`;
                alert(errorMsg);
              }
              
              // Clean up the pending video file
              setPendingVideoFile(null);
            } catch (videoError) {
              console.error('Error uploading video:', videoError);
              const errorMsg = developerAutoCreated
                ? `Project created and developer "${formData.developer}" was auto-created, but video upload failed. Please try uploading the video again by editing the project.`
                : 'Project created but video upload failed. Please try uploading the video again by editing the project.';
              alert(errorMsg);
              // Clean up the pending video file even on error
              setPendingVideoFile(null);
            }
          } else {
            console.error('No project ID found in response:', result);
            const errorMsg = developerAutoCreated
              ? `Project created and developer "${formData.developer}" was auto-created, but could not upload video - no project ID found. Please edit the project to add the video.`
              : 'Project created but could not upload video - no project ID found. Please edit the project to add the video.';
            alert(errorMsg);
            // Clean up the pending video file
            setPendingVideoFile(null);
          }
        } else {
          // Success without video upload
          setUploadProgress(100);
          setUploadStatus('Project created successfully!');
          
          const successMsg = developerAutoCreated 
            ? `✅ Project created successfully! Developer "${formData.developer}" was automatically created.`
            : '✅ Project created successfully!';
          alert(successMsg);
        }
        
        onUpdate();
        setIsModalOpen(false);
        setEditingProject(null);
        setPendingVideoFile(null); // Clear pending video file
        
        // Reset loading states
        setTimeout(() => {
          setIsSubmitting(false);
          setUploadProgress(0);
          setUploadStatus('');
        }, 1500); // Show success message for 1.5 seconds
        
        setFormData({
          name: '',
          description: '',
          image: '',
          featured_video: '',
          type: 'Apartment',
          developer: '',
          location: '',
          starting_price: '',
          bedrooms: 0,
          bathrooms: 0,
          studios: 0,
          units_1bedroom: 0,
          units_2bedroom: 0,
          units_3bedroom: 0,
          units_4bedroom: 0,
          units_5bedroom: 0,
          units_office: 0,
          area: '',
          features: [],
          property_types: [],
          gallery: [],
          presentation_file: '',
          project_type: 'ready',
          status: 'Available',
          is_featured: false
        });
      } else {
        try {
          const errorData = await response.json();
          console.error('Project save error:', errorData);
          alert(`Error saving project: ${errorData.message || errorData.error || 'Failed to save project'}`);
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          alert(`Error saving project: HTTP ${response.status} - ${response.statusText}`);
        }
        // Clean up pending video file on project creation failure
        if (pendingVideoFile) {
          setPendingVideoFile(null);
        }
        
        // Reset loading states on error
        setIsSubmitting(false);
        setUploadProgress(0);
        setUploadStatus('');
      }
    } catch (error: any) {
      console.error('Error saving project:', error);
      
      let errorMessage = 'Error saving project';
      if (error.name === 'AbortError') {
        errorMessage = 'Request timed out. Please check your connection and try again.';
      } else if (error.message) {
        errorMessage = `Error: ${error.message}`;
      }
      
      alert(errorMessage);
      
      // Clean up pending video file on error
      if (pendingVideoFile) {
        setPendingVideoFile(null);
      }
      
      // Reset loading states on error
      setIsSubmitting(false);
      setUploadProgress(0);
      setUploadStatus('');
    }
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData(project);
    setPendingVideoFile(null); // Clear any pending video file when editing
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    // Show confirmation dialog instead of using browser confirm
    setProjectToDelete(id);
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = async () => {
    if (projectToDelete) {
      try {
        const response = await fetch(`/api/admin/projects/${projectToDelete}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          onUpdate();
          setShowDeleteConfirm(false);
          setProjectToDelete(null);
        } else {
          alert('Error deleting project');
        }
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Error deleting project');
      }
    }
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setProjectToDelete(null);
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...(prev.features || []), '']
    }));
  };

  const updateFeature = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.map((feature, i) => i === index ? value : feature) || []
    }));
  };

  const removeFeature = (index: number) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features?.filter((_, i) => i !== index) || []
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">Projects</h2>
          <p className="text-brand-gray">Manage your property listings</p>
        </div>
        <button
          onClick={() => {
            setEditingProject(null); // Clear editing state
            setFormData({ // Reset form to initial state
              name: '',
              description: '',
              image: '',
              featured_video: '',
              type: 'Apartment',
              developer: '',
              location: '',
              starting_price: '',
              bedrooms: 0,
              bathrooms: 0,
              studios: 0,
              units_1bedroom: 0,
              units_2bedroom: 0,
              units_3bedroom: 0,
              units_4bedroom: 0,
              units_5bedroom: 0,
              units_6bedroom: 0,
               units_7bedroom: 0,
               units_office: 0,
               shop_commercial: 0,
              area: '',
              features: [],
              property_types: [],
              gallery: [],
              presentation_file: '',
              project_type: 'ready',
              status: 'Available',
              is_featured: false,
              units_8plus_bedrooms: '',
              custom_bedroom_count: ''
            });
            setPendingVideoFile(null); // Clear any pending video file
            setSelectedUnitTypes([]);
            setShowDeveloperSuggestions(false);
            setIsCreatingNewDeveloper(false);
            setAiDescription('');
            setIsModalOpen(true);
          }}
          className="flex items-center space-x-2 px-6 py-3 bg-brand-green hover:bg-brand-green/80 text-white rounded-lg transition-colors hover:scale-105 active:scale-95"
        >
          <i className="ri-add-line"></i>
          <span>Add Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white/5 backdrop-blur-lg rounded-xl border border-white/10 overflow-hidden hover:scale-102 transition-transform"
          >
            <div className="relative h-48">
              {project.image && project.image.trim() !== '' ? (
                <Image
                  src={project.image}
                  alt={project.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-brand-green/20 to-brand-green/5 flex items-center justify-center">
                  <div className="text-center text-white/60">
                    <i className="ri-image-line text-3xl mb-2 block"></i>
                    <span className="text-sm">No Image</span>
                  </div>
                </div>
              )}
              <div className="absolute top-4 right-4 flex space-x-2">
                {project.is_featured && (
                  <span className="px-2 py-1 bg-brand-green text-white text-xs rounded-full">
                    Featured
                  </span>
                )}
                <span className={`px-2 py-1 text-xs rounded-full ${
                  project.status === 'Available' ? 'bg-green-500/20 text-green-400' :
                  project.status === 'Sold' ? 'bg-red-500/20 text-red-400' :
                  'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {project.status}
                </span>
              </div>
            </div>
            
            <div className="p-6">
              <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
              <p className="text-brand-gray text-sm mb-4 line-clamp-2">{project.description}</p>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-brand-gray">
                  <i className="ri-map-pin-line mr-2"></i>
                  {project.location}
                </div>
                <div className="flex items-center text-sm text-brand-gray">
                  <i className="ri-price-tag-3-line mr-2"></i>
                  Starting from {project.starting_price}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(project)}
                  className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors text-sm"
                >
                  <i className="ri-edit-line mr-1"></i>
                  Edit
                </button>
                <button
                  onClick={() => project.id && handleDelete(project.id)}
                  className="flex-1 px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors text-sm"
                >
                  <i className="ri-delete-bin-line mr-1"></i>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-brand-dark border border-white/10 rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">
                {editingProject ? 'Edit Project' : 'Add New Project'}
              </h3>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setPendingVideoFile(null); // Clear pending video file when closing modal
                }}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-xl text-white"></i>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* 2-Column Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column */}
                <div className="space-y-6">
                  <div className="relative">
                    <label className="block text-sm font-medium text-white mb-2">Developer</label>
                    <input
                      type="text"
                      value={formData.developer || ''}
                      onChange={(e) => handleDeveloperInputChange(e.target.value)}
                      onFocus={() => {
                        if (formData.developer && developerSuggestions.length > 0) {
                          setShowDeveloperSuggestions(true);
                        }
                      }}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                      placeholder="Enter developer name"
                      required
                    />
                    
                    {/* Developer Suggestions Dropdown */}
                    {showDeveloperSuggestions && (
                      <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-white/10 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        {developerSuggestions.map((developer) => (
                          <div
                            key={developer.id}
                            onClick={() => selectDeveloper(developer)}
                            className="px-4 py-2 hover:bg-white/10 cursor-pointer text-white border-b border-white/5 last:border-b-0"
                          >
                            <div className="font-medium">{developer.name}</div>
                            {developer.projects_count > 0 && (
                              <div className="text-xs text-gray-400">{developer.projects_count} projects</div>
                            )}
                          </div>
                        ))}
                        
                        {/* Add New Developer Option */}
                        {formData.developer && !developers.some(dev => 
                          dev.name.toLowerCase() === formData.developer?.toLowerCase()
                        ) && (
                          <div
                            onClick={() => setIsCreatingNewDeveloper(true)}
                            className="px-4 py-2 hover:bg-brand-green/20 cursor-pointer text-brand-green border-t border-white/10"
                          >
                            <div className="font-medium">+ Add &quot;{formData.developer}&quot; as new developer</div>
                            <div className="text-xs">Create new developer entry</div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Create New Developer Confirmation */}
                    {isCreatingNewDeveloper && (
                      <div className="absolute z-50 w-full mt-1 bg-gray-800 border border-white/10 rounded-lg shadow-lg p-4">
                        <div className="text-white mb-3">
                          <div className="font-medium">Create New Developer</div>
                          <div className="text-sm text-gray-400">Name: {formData.developer}</div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            type="button"
                            onClick={() => createNewDeveloper(formData.developer || '')}
                            className="px-3 py-1 bg-brand-green text-white rounded text-sm hover:bg-brand-green/80"
                          >
                            Create
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsCreatingNewDeveloper(false)}
                            className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-500"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Sub-Project</label>
                    <input
                      type="text"
                      value={formData.category || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                      placeholder="Enter sub-project name"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Type of Project</label>
                    <select
                      value={formData.type || 'Apartment'}
                      onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-green"
                    >
                      <option value="Apartment">Apartment</option>
                      <option value="Villa">Villa</option>
                      <option value="Townhouse">Townhouse</option>
                      <option value="Office">Office</option>
                      <option value="Community">Community</option>
                      <option value="Commercial">Commercial</option>
                      <option value="Stand-alone">Stand-alone</option>
                    </select>
                  </div>

                  {/* Property Type Checkboxes */}
                  <div>
                    <label className="block text-sm font-medium text-white mb-3">Property Type</label>
                    <div className="grid grid-cols-2 gap-3">
                      {['Apartment', 'Villa', 'Town House', 'Office'].map((type) => (
                        <label key={type} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(formData.property_types || []).includes(type)}
                            onChange={(e) => {
                              const currentTypes = formData.property_types || [];
                              if (e.target.checked) {
                                setFormData(prev => ({
                                  ...prev,
                                  property_types: [...currentTypes, type]
                                }));
                              } else {
                                setFormData(prev => ({
                                  ...prev,
                                  property_types: currentTypes.filter(t => t !== type)
                                }));
                              }
                            }}
                            className="w-4 h-4 text-brand-green bg-white/5 border-white/20 rounded focus:ring-brand-green focus:ring-2"
                          />
                          <span className="text-white text-sm">{type}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Project Name</label>
                    <input
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                      placeholder="Enter project name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                      placeholder="Enter location"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Status</label>
                    <select
                      value={formData.project_type || 'ready'}
                onChange={(e) => setFormData(prev => ({ ...prev, project_type: e.target.value }))}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-green"
                    >
                      <option value="available">Available</option>
                      <option value="ready">Ready</option>
                      <option value="off-plan">Off-Plan</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Unit Types Toggle Buttons */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">Available Unit Types</label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 gap-3">
                  {[
                    { key: 'studios', label: 'Studio' },
                    { key: 'units_1bedroom', label: '1 Bedroom' },
                    { key: 'units_2bedroom', label: '2 Bedroom' },
                    { key: 'units_3bedroom', label: '3 Bedroom' },
                    { key: 'units_4bedroom', label: '4 Bedroom' },
                    { key: 'units_5bedroom', label: '5 Bedroom' },
                    { key: 'units_6bedroom', label: '6 Bedroom' },
                    { key: 'units_7bedroom', label: '7 Bedroom' },
                    { key: 'office', label: 'Office' },
                    { key: 'shop_commercial', label: 'Shop' },
                    { key: 'bathrooms', label: 'Bathrooms' }
                  ].map((unit) => {
                    const isSelected = selectedUnitTypes.includes(unit.label);
                    return (
                      <button
                        key={unit.key}
                        type="button"
                        onClick={() => {
                          const currentValue = (formData as any)[unit.key] || 0;
                          const newValue = currentValue > 0 ? 0 : 1;
                          setFormData(prev => ({
                            ...prev,
                            [unit.key]: newValue
                          }));
                          handleUnitTypeChange(unit.label, newValue > 0);
                        }}
                        className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                          ((formData as any)[unit.key] || 0) > 0
                            ? 'bg-brand-green/20 border-brand-green text-brand-green'
                            : 'bg-white/5 border-white/10 text-gray-400'
                        }`}
                      >
                        <div>{unit.label}</div>
                        <div className="text-xs mt-1">
                          {((formData as any)[unit.key] || 0) > 0 ? 'Available' : 'Not Available'}
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {/* 8+ Bedrooms Custom Input */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-white mb-2">8+ Bedrooms (Custom)</label>
                  <div className="flex gap-3 items-center">
                    <select
                      value={formData.units_8plus_bedrooms || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, units_8plus_bedrooms: e.target.value }))}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-brand-green"
                    >
                      <option value="">Select bedrooms</option>
                      <option value="8">8 Bedrooms</option>
                      <option value="9">9 Bedrooms</option>
                      <option value="10">10 Bedrooms</option>
                      <option value="11">11 Bedrooms</option>
                      <option value="12">12 Bedrooms</option>
                      <option value="custom">Custom (specify below)</option>
                    </select>
                    {formData.units_8plus_bedrooms === 'custom' && (
                      <input
                        type="number"
                        min="8"
                        placeholder="Enter number of bedrooms"
                        value={formData.custom_bedroom_count || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, custom_bedroom_count: e.target.value }))}
                        className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                      />
                    )}
                  </div>
                  {(formData.units_8plus_bedrooms && formData.units_8plus_bedrooms !== '') && (
                    <div className="mt-2 text-xs text-brand-green">
                      ✓ {formData.units_8plus_bedrooms === 'custom' ? `${formData.custom_bedroom_count || 'Custom'}` : formData.units_8plus_bedrooms} bedroom units available
                    </div>
                  )}
                </div>
                
                {/* Selected Unit Types Display */}
                {selectedUnitTypes.length > 0 && (
                  <div className="mt-4 p-3 bg-brand-green/10 border border-brand-green/20 rounded-lg">
                    <div className="text-sm font-medium text-brand-green mb-2">Selected Unit Types:</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedUnitTypes.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-brand-green/20 text-brand-green text-xs rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bathrooms Configuration */}
                {selectedUnitTypes.includes('Bathrooms') && (
                  <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
                    <label className="block text-sm font-medium text-white mb-3">Bathroom Configuration</label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">1 Bathroom Units</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.bathrooms || 0}
                          onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-green"
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">2+ Bathroom Units</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.bathrooms || 0}
                          onChange={(e) => setFormData(prev => ({ ...prev, bathrooms: parseInt(e.target.value) || 0 }))}
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-brand-green"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>



              {/* Starting Price */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Starting Price</label>
                <input
                  type="text"
                  value={formData.starting_price || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, starting_price: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                  placeholder="AED 1,500,000"
                  required
                />
              </div>

              {/* Description with AI Enhancement */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-white">Description</label>
                  <button
                    type="button"
                    onClick={generateAIDescription}
                    disabled={!formData.developer || selectedUnitTypes.length === 0}
                    className="px-3 py-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    ✨ AI Generate
                  </button>
                </div>
                <textarea
                  value={formData.description || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                  placeholder="Enter project description or use AI to generate one"
                  rows={4}
                  required
                />
                {aiDescription && (
                  <div className="mt-2 text-xs text-gray-400">
                    💡 AI-generated description available. Click &quot;AI Generate&quot; to use it.
                  </div>
                )}
              </div>

              {/* Featured Project Toggle */}
              <div>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured || false}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="w-5 h-5 text-brand-green bg-white/5 border-white/20 rounded focus:ring-brand-green focus:ring-2"
                  />
                  <div>
                    <span className="text-sm font-medium text-white">Featured Project</span>
                    <div className="text-xs text-gray-400">Highlight this project on homepage and promotional components</div>
                  </div>
                </label>
              </div>

              {/* Main Image Section */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">Main Image</label>
                <div className="space-y-4">
                  {formData.image && (
                    <div className="relative w-full h-48 bg-white/5 rounded-lg overflow-hidden">
                      <Image
                        src={formData.image}
                        alt="Project preview"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowImagePicker(true)}
                      className="flex-1 px-4 py-2 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 rounded-lg transition-colors text-sm"
                    >
                      <i className="ri-image-line mr-2"></i>
                      Pick Image
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/*';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onload = (e) => {
                              setFormData(prev => ({ ...prev, image: e.target?.result as string }));
                            };
                            reader.readAsDataURL(file);
                          }
                        };
                        input.click();
                      }}
                      className="flex-1 px-4 py-2 bg-brand-green/20 text-brand-green hover:bg-brand-green/30 rounded-lg transition-colors text-sm"
                    >
                      <i className="ri-upload-line mr-2"></i>
                      Upload New
                    </button>
                  </div>
                </div>
              </div>

              {/* Video Upload Section */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">Project Video</label>
                <div className="space-y-4">
                  {formData.featured_video && (
                    <div className="relative w-full h-48 bg-white/5 rounded-lg overflow-hidden">
                      <video
                        controls
                        className="w-full h-full object-cover"
                        preload="metadata"
                      >
                        <source src={formData.featured_video} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => {
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'video/mp4,video/webm,video/mov,video/quicktime';
                        input.onchange = (e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) {
                            handleVideoUpload(file);
                          }
                        };
                        input.click();
                      }}
                      className="flex-1 px-4 py-2 bg-purple-500/20 text-purple-400 hover:bg-purple-500/30 rounded-lg transition-colors text-sm"
                    >
                      <i className="ri-video-line mr-2"></i>
                      Upload Video
                    </button>
                    {formData.featured_video && (
                      <button
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, featured_video: '' }))}
                        className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors text-sm"
                      >
                        <i className="ri-delete-bin-line mr-2"></i>
                        Remove
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400">
                    Supported formats: MP4, WebM, MOV. Maximum size: 250MB
                  </p>
                </div>
              </div>

              {/* Featured Project Checkbox */}
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.is_featured || false}
                  onChange={(e) => setFormData(prev => ({ ...prev, is_featured: e.target.checked }))}
                  className="w-4 h-4 text-brand-green bg-white/5 border-white/20 rounded focus:ring-brand-green focus:ring-2"
                />
                <label htmlFor="featured" className="text-white text-sm font-medium cursor-pointer">
                  Featured Project
                </label>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Features</label>
                <div className="space-y-2">
                  {(formData.features || []).map((feature, index) => (
                    <div key={index} className="flex space-x-2">
                      <input
                        type="text"
                        value={feature}
                        onChange={(e) => updateFeature(index, e.target.value)}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-brand-gray focus:outline-none focus:border-brand-green"
                        placeholder="Enter feature"
                      />
                      <button
                        type="button"
                        onClick={() => removeFeature(index)}
                        className="px-3 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg transition-colors"
                      >
                        <i className="ri-delete-bin-line"></i>
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addFeature}
                    className="px-4 py-2 bg-brand-green/20 text-brand-green hover:bg-brand-green/30 rounded-lg transition-colors"
                  >
                    <i className="ri-add-line mr-2"></i>
                    Add Feature
                  </button>
                </div>
              </div>

              {/* Upload Progress Indicator */}
              {isSubmitting && (
                <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white text-sm font-medium">{uploadStatus}</span>
                    <span className="text-brand-green text-sm font-medium">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-brand-green to-green-400 h-2 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  {pendingVideoFile && (
                    <div className="mt-2 text-xs text-gray-400">
                      Uploading: {pendingVideoFile.name} ({(pendingVideoFile.size / (1024 * 1024)).toFixed(2)}MB)
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setPendingVideoFile(null); // Clear pending video file when canceling
                  }}
                  className="flex-1 px-6 py-3 bg-white/5 text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 px-6 py-3 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                    isSubmitting 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-brand-green hover:bg-brand-green/80'
                  } text-white`}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Processing...</span>
                    </>
                  ) : (
                    <span>{editingProject ? 'Update' : 'Create'} Project</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Picker Modal */}
      {showImagePicker && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-brand-dark border border-white/10 rounded-xl p-6 w-full max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Select Image</h3>
              <button
                onClick={() => setShowImagePicker(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-xl text-white"></i>
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {availableImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setFormData(prev => ({ ...prev, image }));
                    setShowImagePicker(false);
                  }}
                  className="relative aspect-square bg-white/5 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-brand-green transition-all"
                >
                  <Image
                    src={image}
                    alt={`Option ${index + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center">
                    <i className="ri-check-line text-2xl text-white opacity-0 hover:opacity-100 transition-opacity"></i>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Delete Confirmation Dialog */}
      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={cancelDelete}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-brand-dark/90 backdrop-blur-lg rounded-2xl p-8 border border-white/10 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center space-y-4">
                <div className="mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-red-500/20 text-red-500">
                  <i className="ri-delete-bin-line text-3xl"></i>
                </div>
                <h3 className="text-xl font-bold text-white">
                  Delete Project
                </h3>
                <p className="text-brand-gray">
                  Are you sure you want to delete this project? This action cannot be undone.
                </p>
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={cancelDelete}
                    className="flex-1 px-6 py-3 bg-white/10 text-white hover:bg-white/20 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmDelete}
                    className="flex-1 px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
                  >
                    Confirm
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}