import React, { useState, useEffect } from 'react';

interface ProfilePhotoProps {
  className?: string;
  variant?: 'hero' | 'about' | 'compact';
}

const PRIMARY_ASSET_PATH = '/assets/aistudio/WhatsApp_Image_2026-09-22_at_6.24.47_AM_0c51cb34.jpeg';
const SECONDARY_ASSET_PATH = '/assets/asad-ali-awan.jpg';

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  className = '',
}) => {
  const [photoSrc, setPhotoSrc] = useState<string>(PRIMARY_ASSET_PATH);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Check if custom profile photo was previously set in local environment, otherwise use primary asset
    try {
      const stored = localStorage.getItem('asad_custom_profile_photo_v1');
      if (stored) {
        setPhotoSrc(stored);
        return;
      }
    } catch {
      // ignore
    }
    setPhotoSrc(PRIMARY_ASSET_PATH);
  }, []);

  const handleImageError = () => {
    if (photoSrc === PRIMARY_ASSET_PATH) {
      setPhotoSrc(SECONDARY_ASSET_PATH);
    } else {
      setHasError(true);
    }
  };

  return (
    <div className={`relative group ${className}`}>
      {/* Outer ambient decorative glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-blue-500/30 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0F121C] border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center">
        {!hasError ? (
          <div className="relative w-full h-full min-h-[380px] lg:min-h-[460px] flex items-center justify-center overflow-hidden bg-slate-950">
            <img
              src={photoSrc}
              alt="Asad Ali Awan – Web Developer & AI Content Creator"
              onError={handleImageError}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />
            {/* Subtle bottom contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-transparent opacity-80 pointer-events-none" />

            {/* Permanent Identity Badge */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50">
              <h4 className="text-sm font-semibold text-white tracking-tight">Asad Ali Awan</h4>
              <p className="text-xs text-purple-300">Web Developer & AI Creator</p>
            </div>
          </div>
        ) : (
          /* Fallback identity frame if image asset is unavailable */
          <div className="w-full h-full min-h-[380px] lg:min-h-[460px] p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#131726] to-[#0A0D15]">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-purple-900/40 mb-4">
              AA
            </div>
            <h4 className="text-lg font-semibold text-white mb-1">Asad Ali Awan</h4>
            <p className="text-xs text-purple-300 font-medium">
              Web Developer | AI Content Creator
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
