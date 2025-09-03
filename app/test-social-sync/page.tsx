'use client';

import React from 'react';
import SocialMediaDisplay from '../../components/SocialMediaDisplay';
import { useSocialMedia } from '../../lib/useSocialMedia';

export default function TestSocialSyncPage() {
  const { socialMedia, loading, error, refetch } = useSocialMedia(true);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Social Media Auto-Sync Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This page demonstrates the real-time auto-sync system for social media links. 
            When you update social media settings in the admin panel, all components on this page 
            will automatically update without requiring a page refresh.
          </p>
        </div>

        {/* Status Panel */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Sync Status</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${
                loading ? 'bg-yellow-400 animate-pulse' : 'bg-green-400'
              }`}></div>
              <span className="text-sm">
                Status: {loading ? 'Loading...' : 'Connected'}
              </span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-400 mr-2 animate-pulse"></div>
              <span className="text-sm">Auto-sync: Enabled</span>
            </div>
            <div className="flex items-center">
              <button
                onClick={refetch}
                className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
              >
                Manual Refresh
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              Error: {error}
            </div>
          )}
        </div>

        {/* Multiple Social Media Display Components */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <SocialMediaDisplay 
              title="Header Style" 
              iconSize="lg" 
              enableAutoSync={true}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <SocialMediaDisplay 
              title="Sidebar Style" 
              iconSize="md" 
              enableAutoSync={true}
            />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <SocialMediaDisplay 
              title="Footer Style" 
              iconSize="sm" 
              enableAutoSync={true}
            />
          </div>
        </div>

        {/* Raw Data Display */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Current Social Media Data</h2>
          <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
            {JSON.stringify(socialMedia, null, 2)}
          </pre>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
          <h2 className="text-xl font-semibold text-blue-900 mb-4">How to Test Auto-Sync</h2>
          <ol className="list-decimal list-inside space-y-2 text-blue-800">
            <li>Open the admin panel in another tab: <code className="bg-blue-100 px-2 py-1 rounded">/admin</code></li>
            <li>Navigate to the Social Media section</li>
            <li>Update any social media link and save</li>
            <li>Return to this tab and watch all components update automatically</li>
            <li>No page refresh required!</li>
          </ol>
          
          <div className="mt-4 p-3 bg-blue-100 rounded">
            <strong>Note:</strong> The system uses Server-Sent Events (SSE) for real-time updates, 
            with automatic fallback to polling if SSE is not supported.
          </div>
        </div>
      </div>
    </div>
  );
}