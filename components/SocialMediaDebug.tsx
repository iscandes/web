'use client';

import { useSocialMedia } from '../lib/useSocialMedia';
import { useEffect } from 'react';

export default function SocialMediaDebug() {
  const { socialMedia, loading, error } = useSocialMedia();

  useEffect(() => {
    console.log('🐛 SocialMediaDebug - State changed:', {
      loading,
      error,
      socialMedia,
      socialMediaKeys: Object.keys(socialMedia || {}),
      hasInstagram: !!socialMedia?.instagram,
      hasTiktok: !!socialMedia?.tiktok
    });
  }, [socialMedia, loading, error]);

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50 max-w-md">
      <h3 className="font-bold">Social Media Debug</h3>
      <p>Loading: {loading ? 'true' : 'false'}</p>
      <p>Error: {error || 'none'}</p>
      <p>Keys: {Object.keys(socialMedia || {}).length}</p>
      <p>Instagram: {socialMedia?.instagram || 'none'}</p>
      <p>TikTok: {socialMedia?.tiktok || 'none'}</p>
      <div className="text-xs mt-2">
        <pre>{JSON.stringify(socialMedia, null, 2)}</pre>
      </div>
    </div>
  );
}