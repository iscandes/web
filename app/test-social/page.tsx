'use client';

import { useSocialMedia } from '@/lib/useSocialMedia';
import { useEffect } from 'react';

export default function TestSocialPage() {
  const { socialMedia, loading, error } = useSocialMedia(true);

  useEffect(() => {
    console.log('🧪 TestSocialPage - Hook state:', {
      loading,
      error,
      socialMedia,
      socialMediaKeys: Object.keys(socialMedia || {}),
      hasInstagram: !!socialMedia?.instagram,
      hasTiktok: !!socialMedia?.tiktok
    });
  }, [socialMedia, loading, error]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Social Media Test Page</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Hook State:</h2>
        <p>Loading: {loading ? 'true' : 'false'}</p>
        <p>Error: {error || 'none'}</p>
        <p>Social Media Keys: {Object.keys(socialMedia || {}).length}</p>
      </div>

      <div className="bg-blue-100 p-4 rounded mb-4">
        <h2 className="font-bold mb-2">Social Media Data:</h2>
        <pre className="text-xs overflow-auto">
          {JSON.stringify(socialMedia, null, 2)}
        </pre>
      </div>

      <div className="bg-green-100 p-4 rounded">
        <h2 className="font-bold mb-2">Active Links:</h2>
        {Object.entries(socialMedia || {}).map(([platform, url]) => (
          url && typeof url === 'string' && url.trim() !== '' ? (
            <div key={platform} className="mb-1">
              <><strong>{platform}:</strong> {url}</>
            </div>
          ) : null
        ))}
      </div>
    </div>
  );
}