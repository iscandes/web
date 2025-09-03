'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MediaFile, Article } from '@/lib/mysql-database';
import ImageSelectorModal from './ImageSelectorModal';

interface AddNewArticlePageProps {
  onClose: () => void;
  onSave: (article: Partial<Article>) => Promise<void>;
  editingArticle?: Article | null;
  mediaFiles: MediaFile[];
}

interface EditorState {
  content: string;
  selection: { start: number; end: number } | null;
}

const LUXURY_FONTS = {
  titles: [
    { name: 'Playfair Display', value: 'Playfair Display, serif', category: 'Elegant Serif' },
    { name: 'Cormorant Garamond', value: 'Cormorant Garamond, serif', category: 'Luxury Serif' },
    { name: 'Crimson Text', value: 'Crimson Text, serif', category: 'Classic Serif' },
    { name: 'Libre Baskerville', value: 'Libre Baskerville, serif', category: 'Modern Serif' }
  ],
  subtitles: [
    { name: 'Montserrat', value: 'Montserrat, sans-serif', category: 'Modern Sans' },
    { name: 'Source Sans Pro', value: 'Source Sans Pro, sans-serif', category: 'Clean Sans' },
    { name: 'Lato', value: 'Lato, sans-serif', category: 'Friendly Sans' },
    { name: 'Open Sans', value: 'Open Sans, sans-serif', category: 'Versatile Sans' }
  ],
  body: [
    { name: 'Inter', value: 'Inter, sans-serif', category: 'Reading Sans' },
    { name: 'Source Serif Pro', value: 'Source Serif Pro, serif', category: 'Reading Serif' },
    { name: 'Merriweather', value: 'Merriweather, serif', category: 'Web Serif' },
    { name: 'PT Serif', value: 'PT Serif, serif', category: 'Elegant Reading' }
  ]
};

const FORMATTING_OPTIONS = [
  { icon: '𝐁', action: 'bold', tooltip: 'Bold (Ctrl+B)' },
  { icon: '𝐼', action: 'italic', tooltip: 'Italic (Ctrl+I)' },
  { icon: '𝐔', action: 'underline', tooltip: 'Underline (Ctrl+U)' },
  { icon: '𝐒', action: 'strikethrough', tooltip: 'Strikethrough' },
  { icon: '🔗', action: 'link', tooltip: 'Insert Link' },
  { icon: '📷', action: 'image', tooltip: 'Insert Image' },
  { icon: '∑', action: 'formula', tooltip: 'Insert Formula' },
  { icon: '📝', action: 'quote', tooltip: 'Block Quote' },
  { icon: '📋', action: 'code', tooltip: 'Code Block' },
  { icon: '📊', action: 'table', tooltip: 'Insert Table' }
];

export default function AddNewArticlePage({ 
  onClose, 
  onSave, 
  editingArticle, 
  mediaFiles 
}: AddNewArticlePageProps) {
  const [formData, setFormData] = useState<Partial<Article>>({
    title: editingArticle?.title || '',
    slug: editingArticle?.slug || '',
    excerpt: editingArticle?.excerpt || '',
    content: editingArticle?.content || '',
    featured_image: editingArticle?.featured_image || '',
    status: editingArticle?.status || 'draft',
    tags: editingArticle?.tags || [],
    meta_title: editingArticle?.meta_title || '',
    meta_description: editingArticle?.meta_description || '',
    author_id: editingArticle?.author_id || 1
  });

  const [editorState, setEditorState] = useState<EditorState>({
    content: formData.content || '',
    selection: null
  });

  const [showImageSelector, setShowImageSelector] = useState(false);
  const [showFormulaEditor, setShowFormulaEditor] = useState(false);
  const [formulaInput, setFormulaInput] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFont, setSelectedFont] = useState('Inter, sans-serif');
  
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredImages = mediaFiles.filter(file => 
    file.mime_type?.startsWith('image/')
  );

  const handleFormatting = (action: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    editor.focus();
    
    switch (action) {
      case 'bold':
        document.execCommand('bold', false);
        break;
      case 'italic':
        document.execCommand('italic', false);
        break;
      case 'underline':
        document.execCommand('underline', false);
        break;
      case 'strikethrough':
        document.execCommand('strikeThrough', false);
        break;
      case 'link':
        const url = prompt('Enter URL:');
        if (url) document.execCommand('createLink', false, url);
        break;
      case 'image':
        setShowImageSelector(true);
        break;
      case 'formula':
        setShowFormulaEditor(true);
        break;
      case 'quote':
        insertQuote();
        break;
      case 'code':
        insertCodeBlock();
        break;
      case 'table':
        insertTable();
        break;
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'p':
        document.execCommand('formatBlock', false, action);
        break;
      case 'bulletlist':
        document.execCommand('insertUnorderedList', false);
        break;
      case 'numberlist':
        document.execCommand('insertOrderedList', false);
        break;
      case 'alignleft':
        document.execCommand('justifyLeft', false);
        break;
      case 'aligncenter':
        document.execCommand('justifyCenter', false);
        break;
      case 'alignright':
        document.execCommand('justifyRight', false);
        break;
    }

    updateContent();
  };

  const insertTable = () => {
    const tableHTML = `
      <table class="w-full border-collapse border border-amber-500/30 my-4">
        <thead>
          <tr class="bg-amber-500/10">
            <th class="border border-amber-500/30 px-4 py-2 text-amber-300">Header 1</th>
            <th class="border border-amber-500/30 px-4 py-2 text-amber-300">Header 2</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="border border-amber-500/30 px-4 py-2 text-white">Cell 1</td>
            <td class="border border-amber-500/30 px-4 py-2 text-white">Cell 2</td>
          </tr>
        </tbody>
      </table>
    `;
    document.execCommand('insertHTML', false, tableHTML);
    updateContent();
  };

  const insertCodeBlock = () => {
    const codeHTML = `<pre class="bg-gray-800 border border-gray-600 rounded-lg p-4 my-4 overflow-x-auto"><code class="text-green-400 font-mono text-sm">// Your code here\nconsole.log('Hello, World!');</code></pre>`;
    document.execCommand('insertHTML', false, codeHTML);
    updateContent();
  };

  const insertQuote = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const blockquote = document.createElement('blockquote');
      blockquote.className = 'border-l-4 border-amber-500 pl-4 italic text-amber-100 my-4 bg-black/20 py-2';
      
      if (selection.toString()) {
        try {
          range.surroundContents(blockquote);
        } catch {
          blockquote.appendChild(range.extractContents());
          range.insertNode(blockquote);
        }
      } else {
        blockquote.textContent = 'Enter your quote here...';
        range.insertNode(blockquote);
      }
    }
    updateContent();
  };

  const insertImage = (imageUrl: string) => {
    const imageHTML = `<img src="${imageUrl}" alt="Article image" class="max-w-full h-auto rounded-lg shadow-lg my-4" />`;
    document.execCommand('insertHTML', false, imageHTML);
    setShowImageSelector(false);
    updateContent();
  };

  const handleImageSelect = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, featured_image: imageUrl }));
    setShowImageSelector(false);
  };

  const handleImageUpload = async (files: FileList) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const formDataUpload = new FormData();
        formDataUpload.append('file', file);
        formDataUpload.append('alt_text', `Article image: ${file.name}`);
        formDataUpload.append('uploaded_by', '1');

        const response = await fetch('/api/admin/media', {
          method: 'POST',
          body: formDataUpload,
        });

        if (!response.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const result = await response.json();
        if (result.success && result.data) {
          insertImage(result.data.url || `/uploads/${result.data.filename}`);
        }

        setUploadProgress(((i + 1) / files.length) * 100);
      }
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading files. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // Wrapper function for ImageSelectorModal compatibility
  const handleSingleImageUpload = async (file: File): Promise<MediaFile> => {
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);
    formDataUpload.append('alt_text', `Article image: ${file.name}`);
    formDataUpload.append('uploaded_by', '1');

    const response = await fetch('/api/admin/media', {
      method: 'POST',
      body: formDataUpload,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload ${file.name}`);
    }

    const result = await response.json();
    if (result.success && result.data) {
      insertImage(result.data.url || `/uploads/${result.data.filename}`);
      return result.data;
    }
    
    throw new Error('Upload failed');
  };

  const insertFormula = () => {
    if (!formulaInput.trim()) return;
    
    const formulaHTML = `<span class="inline-block bg-blue-50 border border-blue-200 rounded px-2 py-1 mx-1 font-mono text-blue-800">${formulaInput}</span>`;
    document.execCommand('insertHTML', false, formulaHTML);
    
    setFormulaInput('');
    setShowFormulaEditor(false);
    updateContent();
  };

  const updateContent = () => {
    const editor = editorRef.current;
    if (editor) {
      const content = editor.innerHTML;
      setEditorState(prev => ({ ...prev, content }));
      setFormData(prev => ({ ...prev, content }));
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter(tag => tag !== tagToRemove) || []
    }));
  };

  const handleSave = async () => {
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error saving article:', error);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'b':
            e.preventDefault();
            handleFormatting('bold');
            break;
          case 'i':
            e.preventDefault();
            handleFormatting('italic');
            break;
          case 'u':
            e.preventDefault();
            handleFormatting('underline');
            break;
          case 's':
            e.preventDefault();
            handleSave();
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [formData]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900 z-50 overflow-hidden">
      {/* Luxury Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-400/20 via-transparent to-amber-600/20"></div>
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255, 215, 0, 0.1) 0%, transparent 50%),
                           radial-gradient(circle at 75% 75%, rgba(255, 215, 0, 0.1) 0%, transparent 50%)`
        }}></div>
      </div>

      <div className="relative h-full flex flex-col">
        {/* Header */}
        <div className="bg-black/80 backdrop-blur-xl border-b border-amber-500/20 px-4 sm:px-8 py-4 sm:py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="text-amber-400 hover:text-amber-300 transition-colors p-1 sm:p-2"
              >
                ← Back to Admin
              </button>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleSave}
                className="bg-amber-500 hover:bg-amber-600 text-black px-3 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                Save Draft
              </button>
              <button
                onClick={() => {
                  setFormData(prev => ({ ...prev, status: 'published' }));
                  handleSave();
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
              >
                Publish
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar */}
          <div className="w-80 bg-black/60 backdrop-blur-xl border-r border-amber-500/20 p-4 sm:p-6 overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-bold text-amber-400 mb-4 sm:mb-6">Add New Article</h2>
            <p className="text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8">Craft your story with luxury and precision</p>
            
            <div className="space-y-4 sm:space-y-6">
              {/* Title */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-amber-300 mb-2">Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 text-sm sm:text-base"
                  placeholder="Enter article title..."
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-amber-300 mb-2">Slug</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 text-sm sm:text-base"
                  placeholder="article-slug"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-amber-300 mb-2">Excerpt</label>
                <textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 resize-none text-sm sm:text-base"
                  rows={3}
                  placeholder="Brief description..."
                />
              </div>

              {/* Featured Image */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-amber-300 mb-2">Featured Image</label>
                <button
                  onClick={() => setShowImageSelector(true)}
                  className="w-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg px-3 sm:px-4 py-2 text-amber-300 transition-colors text-sm sm:text-base"
                >
                  {formData.featured_image ? 'Change Image' : 'Select Image'}
                </button>
                {formData.featured_image && (
                  <div className="mt-2">
                    <img src={formData.featured_image} alt="Featured" className="w-full h-20 object-cover rounded" />
                  </div>
                )}
              </div>

              {/* Tags */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-amber-300 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags?.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-amber-500/20 text-amber-300 px-2 py-1 rounded text-xs flex items-center gap-1"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="hover:text-red-400 transition-colors"
                      >
                        ✕
                      </button>
                    </span>
                  ))}
                </div>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    className="flex-1 bg-black/40 border border-amber-500/30 rounded px-2 py-1 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
                    placeholder="Add tag..."
                  />
                  <button
                    onClick={handleAddTag}
                    className="bg-amber-500 hover:bg-amber-600 text-black px-3 py-1 rounded font-medium transition-colors text-xs sm:text-sm"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* SEO Meta */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-amber-300 mb-2">Meta Title</label>
                <input
                  type="text"
                  value={formData.meta_title}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_title: e.target.value }))}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 text-sm sm:text-base"
                  placeholder="SEO title..."
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-amber-300 mb-2">Meta Description</label>
                <textarea
                  value={formData.meta_description}
                  onChange={(e) => setFormData(prev => ({ ...prev, meta_description: e.target.value }))}
                  className="w-full bg-black/40 border border-amber-500/30 rounded-lg px-3 sm:px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-amber-500 resize-none text-sm sm:text-base"
                  rows={3}
                  placeholder="SEO description..."
                />
              </div>
            </div>
          </div>

          {/* Main Editor */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Enhanced Toolbar */}
            <div className="bg-black/40 backdrop-blur-xl border-b border-amber-500/20 p-2 sm:p-4">
              <div className="flex flex-wrap items-center gap-1 text-xs sm:text-sm">
                {/* Text Formatting */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleFormatting('bold')}
                    className="p-1.5 sm:p-2 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded transition-colors text-xs sm:text-sm"
                    title="Bold (Ctrl+B)"
                  >
                    𝐁
                  </button>
                  <button
                    onClick={() => handleFormatting('italic')}
                    className="p-1.5 sm:p-2 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded transition-colors text-xs sm:text-sm"
                    title="Italic (Ctrl+I)"
                  >
                    𝐼
                  </button>
                  <button
                    onClick={() => handleFormatting('underline')}
                    className="p-1.5 sm:p-2 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded transition-colors text-xs sm:text-sm"
                    title="Underline (Ctrl+U)"
                  >
                    𝐔
                  </button>
                  <button
                    onClick={() => handleFormatting('strikethrough')}
                    className="p-1.5 sm:p-2 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded transition-colors text-xs sm:text-sm"
                    title="Strikethrough"
                  >
                    𝐒
                  </button>
                </div>

                <div className="w-px h-6 bg-amber-500/30 mx-2"></div>

                {/* Headings */}
                <div className="flex items-center gap-1">
                  <select
                    onChange={(e) => handleFormatting(e.target.value)}
                    className="bg-black/60 border border-amber-500/30 rounded px-2 py-1 text-amber-300 text-xs focus:outline-none focus:border-amber-500"
                    defaultValue=""
                  >
                    <option value="" disabled>Headings</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="h4">Heading 4</option>
                    <option value="p">Paragraph</option>
                  </select>
                </div>

                {/* Typography */}
                <div className="flex items-center gap-1">
                  <select
                    value={selectedFont}
                    onChange={(e) => {
                      setSelectedFont(e.target.value);
                      if (editorRef.current) {
                        editorRef.current.style.fontFamily = e.target.value;
                      }
                    }}
                    className="bg-black/60 border border-amber-500/30 rounded px-2 py-1 text-amber-300 text-xs focus:outline-none focus:border-amber-500"
                  >
                    <optgroup label="Title Fonts">
                      {LUXURY_FONTS.titles.map(font => (
                        <option key={font.name} value={font.value}>{font.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Subtitle Fonts">
                      {LUXURY_FONTS.subtitles.map(font => (
                        <option key={font.name} value={font.value}>{font.name}</option>
                      ))}
                    </optgroup>
                    <optgroup label="Body Fonts">
                      {LUXURY_FONTS.body.map(font => (
                        <option key={font.name} value={font.value}>{font.name}</option>
                      ))}
                    </optgroup>
                  </select>
                </div>

                <div className="w-px h-6 bg-amber-500/30 mx-2"></div>

                {/* Lists and Alignment */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleFormatting('bulletlist')}
                    className="p-1.5 sm:p-2 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded transition-colors text-xs sm:text-sm"
                    title="Bullet List"
                  >
                    •
                  </button>
                  <button
                    onClick={() => handleFormatting('numberlist')}
                    className="p-1.5 sm:p-2 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded transition-colors text-xs sm:text-sm"
                    title="Numbered List"
                  >
                    1.
                  </button>
                </div>

                <div className="w-px h-6 bg-amber-500/30 mx-2"></div>

                {/* Media and Special */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleFormatting('image')}
                    className="p-1.5 sm:p-2 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded transition-colors text-xs sm:text-sm"
                    title="Insert Image"
                  >
                    📷
                  </button>
                  <button
                    onClick={() => handleFormatting('link')}
                    className="p-1.5 sm:p-2 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded transition-colors text-xs sm:text-sm"
                    title="Insert Link"
                  >
                    🔗
                  </button>
                  <button
                    onClick={() => handleFormatting('formula')}
                    className="p-1.5 sm:p-2 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded transition-colors text-xs sm:text-sm"
                    title="Insert Formula"
                  >
                    ∑
                  </button>
                  <button
                    onClick={() => handleFormatting('quote')}
                    className="p-1.5 sm:p-2 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded transition-colors text-xs sm:text-sm"
                    title="Block Quote"
                  >
                    📝
                  </button>
                  <button
                    onClick={() => handleFormatting('code')}
                    className="p-1.5 sm:p-2 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded transition-colors text-xs sm:text-sm"
                    title="Code Block"
                  >
                    📋
                  </button>
                  <button
                    onClick={() => handleFormatting('table')}
                    className="p-1.5 sm:p-2 hover:bg-amber-500/20 text-amber-300 hover:text-amber-200 rounded transition-colors text-xs sm:text-sm"
                    title="Insert Table"
                  >
                    📊
                  </button>
                </div>
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 p-4 sm:p-8 overflow-y-auto">
              <div
                ref={editorRef}
                contentEditable
                className="prose prose-invert max-w-none min-h-[500px] focus:outline-none text-white text-sm sm:text-base leading-relaxed"
                style={{ fontFamily: selectedFont }}
                onInput={updateContent}
                suppressContentEditableWarning={true}
                dangerouslySetInnerHTML={{ __html: formData.content || '' }}
              />
              
              {/* Enhanced Styling */}
              <style jsx>{`
                [contenteditable] {
                  line-height: 1.8;
                }
                
                [contenteditable] h1 {
                  font-size: 2.5rem;
                  font-weight: 700;
                  color: #fbbf24;
                  margin: 2rem 0 1rem 0;
                  font-family: 'Playfair Display', serif;
                }
                
                [contenteditable] h2 {
                  font-size: 2rem;
                  font-weight: 600;
                  color: #fbbf24;
                  margin: 1.5rem 0 1rem 0;
                  font-family: 'Playfair Display', serif;
                }
                
                [contenteditable] h3 {
                  font-size: 1.5rem;
                  font-weight: 600;
                  color: #fbbf24;
                  margin: 1.5rem 0 0.75rem 0;
                }
                
                [contenteditable] h4 {
                  font-size: 1.25rem;
                  font-weight: 600;
                  color: #fbbf24;
                  margin: 1.25rem 0 0.75rem 0;
                }
                
                [contenteditable] p {
                  margin: 1rem 0;
                  color: #e5e7eb;
                }
                
                [contenteditable] blockquote {
                  border-left: 4px solid #f59e0b;
                  padding-left: 1rem;
                  font-style: italic;
                  color: #fef3c7;
                  margin: 1rem 0;
                  background: rgba(0, 0, 0, 0.2);
                  padding: 0.5rem 0 0.5rem 1rem;
                }
                
                [contenteditable] code {
                  background: #374151;
                  color: #10b981;
                  padding: 0.125rem 0.25rem;
                  border-radius: 0.25rem;
                  font-family: 'Courier New', monospace;
                }
                
                [contenteditable] pre {
                  background: #1f2937;
                  border: 1px solid #4b5563;
                  border-radius: 0.5rem;
                  padding: 1rem;
                  margin: 1rem 0;
                  overflow-x: auto;
                }
                
                [contenteditable] table {
                  width: 100%;
                  border-collapse: collapse;
                  margin: 1rem 0;
                }
                
                [contenteditable] th,
                [contenteditable] td {
                  border: 1px solid rgba(245, 158, 11, 0.3);
                  padding: 0.75rem;
                  text-align: left;
                }
                
                [contenteditable] th {
                  background: rgba(245, 158, 11, 0.1);
                  color: #fbbf24;
                  font-weight: 600;
                }
                
                [contenteditable] img {
                  max-width: 100%;
                  height: auto;
                  border-radius: 0.5rem;
                  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
                  margin: 1rem 0;
                }
                
                [contenteditable] ul,
                [contenteditable] ol {
                  margin: 1rem 0;
                  padding-left: 2rem;
                }
                
                [contenteditable] li {
                  margin: 0.5rem 0;
                  line-height: 1.6;
                }
              `}</style>
            </div>
          </div>
        </div>
      </div>

      {/* Image Selector Modal */}
      {showImageSelector && (
        <ImageSelectorModal
          mediaFiles={filteredImages}
          onSelect={(imageUrl) => {
            insertImage(imageUrl);
            setShowImageSelector(false);
          }}
          onUpload={handleSingleImageUpload}
          onClose={() => setShowImageSelector(false)}
        />
      )}

      {/* Enhanced Formula Editor Modal */}
      {showFormulaEditor && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-60 flex items-center justify-center p-4"
             onClick={() => setShowFormulaEditor(false)}>
          <div className="bg-gray-900 rounded-xl border border-gray-700 w-full max-w-3xl max-h-[90vh] overflow-y-auto"
               onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 border-b border-gray-700">
              <h3 className="text-lg sm:text-xl font-bold text-white">Mathematical Formula Editor</h3>
              <p className="text-sm sm:text-base text-gray-400">Create beautiful mathematical expressions using LaTeX syntax</p>
            </div>
            
            <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              {/* Formula Input */}
              <div>
                <label className="block text-sm font-medium text-white mb-2">Formula (LaTeX Syntax)</label>
                <textarea
                  value={formulaInput}
                  onChange={(e) => setFormulaInput(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 font-mono text-sm sm:text-base"
                  rows={4}
                  placeholder="Enter LaTeX formula... e.g., \\frac{a}{b} or x^2 + y^2 = z^2"
                />
              </div>
              
              {/* Quick Templates */}
              <div>
                <label className="block text-sm font-medium text-white mb-3">Quick Templates</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                  {[
                    { label: 'Fraction', formula: '\\frac{a}{b}' },
                    { label: 'Square Root', formula: '\\sqrt{x}' },
                    { label: 'Power', formula: 'x^{n}' },
                    { label: 'Subscript', formula: 'x_{i}' },
                    { label: 'Sum', formula: '\\sum_{i=1}^{n} x_i' },
                    { label: 'Integral', formula: '\\int_{a}^{b} f(x) dx' },
                    { label: 'Limit', formula: '\\lim_{x \\to \\infty} f(x)' },
                    { label: 'Matrix', formula: '\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}' }
                  ].map((template) => (
                    <button
                      key={template.label}
                      onClick={() => setFormulaInput(template.formula)}
                      className="text-left p-2 sm:p-3 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 rounded text-amber-300 text-xs sm:text-sm transition-colors hover:border-amber-500/40"
                    >
                      <div className="font-medium">{template.label}</div>
                      <div className="text-xs text-gray-400 font-mono mt-1 break-all">{template.formula}</div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
                <button
                  onClick={() => {
                    setShowFormulaEditor(false);
                    setFormulaInput('');
                  }}
                  className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={insertFormula}
                  disabled={!formulaInput.trim()}
                  className="bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black px-6 py-2 rounded-lg font-medium transition-colors text-sm sm:text-base"
                >
                  Insert Formula
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}