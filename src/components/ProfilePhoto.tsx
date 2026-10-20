import React, { useState, useEffect, useRef } from 'react';
import { Camera, Upload, Check, Info } from 'lucide-react';

interface ProfilePhotoProps {
  className?: string;
  variant?: 'hero' | 'about' | 'compact';
  showUploadAction?: boolean;
}

const PHOTO_STORAGE_KEY = 'asad_custom_profile_photo_v1';
const PRIMARY_ASSET_PATH = '/assets/aistudio/WhatsApp_Image_2026-09-22_at_6.24.47_AM_0c51cb34.jpeg';
const SECONDARY_ASSET_PATH = '/assets/asad-ali-awan.jpg';

export const ProfilePhoto: React.FC<ProfilePhotoProps> = ({
  className = '',
  variant = 'hero',
  showUploadAction = true
}) => {
  const [photoSrc, setPhotoSrc] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showHelperModal, setShowHelperModal] = useState(false);
  const [copiedPath, setCopiedPath] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load photo on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(PHOTO_STORAGE_KEY);
      if (stored) {
        setPhotoSrc(stored);
        setHasError(false);
        return;
      }
    } catch {
      // ignore
    }

    // Default to primary uploaded asset path
    setPhotoSrc(PRIMARY_ASSET_PATH);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setPhotoSrc(result);
      setHasError(false);
      try {
        localStorage.setItem(PHOTO_STORAGE_KEY, result);
        // Dispatch storage event so other components (Hero and About) sync instantly
        window.dispatchEvent(new Event('asad_profile_photo_updated'));
      } catch (err) {
        console.error('Failed to store profile photo in localStorage', err);
      }
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Sync across hero and about in real time
  useEffect(() => {
    const handleSync = () => {
      try {
        const stored = localStorage.getItem(PHOTO_STORAGE_KEY);
        if (stored) {
          setPhotoSrc(stored);
          setHasError(false);
        }
      } catch {
        // ignore
      }
    };
    window.addEventListener('asad_profile_photo_updated', handleSync);
    return () => window.removeEventListener('asad_profile_photo_updated', handleSync);
  }, []);

  const handleImageError = () => {
    if (photoSrc === PRIMARY_ASSET_PATH) {
      setPhotoSrc(SECONDARY_ASSET_PATH);
    } else {
      setHasError(true);
    }
  };

  const copyPath = () => {
    navigator.clipboard.writeText('/public/assets/asad-ali-awan.jpg');
    setCopiedPath(true);
    setTimeout(() => setCopiedPath(false), 2000);
  };

  const isCompact = variant === 'compact';
  const isAbout = variant === 'about';

  return (
    <div className={`relative group ${className}`}>
      {/* Hidden file input for photo upload */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        aria-label="Upload personal profile photo"
      />

      {/* Outer ambient decorative glow */}
      <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-600/30 via-indigo-600/20 to-blue-500/30 blur-xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Main Container */}
      <div className="relative w-full h-full rounded-2xl overflow-hidden bg-[#0F121C] border border-slate-800/80 shadow-2xl flex flex-col items-center justify-center">
        {photoSrc && !hasError ? (
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
            
            {/* Subtle bottom identity badge */}
            <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-900/80 backdrop-blur-md border border-slate-700/50">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-semibold text-white tracking-tight">Asad Ali Awan</h4>
                  <p className="text-xs text-purple-300">Web Developer & AI Creator</p>
                </div>
                {showUploadAction && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    title="Change or upload new photo"
                    className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-purple-600/40 transition-colors text-xs flex items-center gap-1.5"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-[11px]">Change</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* Honest Transparent Profile Frame when image file is pending */
          <div className="w-full h-full min-h-[380px] lg:min-h-[460px] p-6 flex flex-col items-center justify-center text-center bg-gradient-to-b from-[#131726] to-[#0A0D15]">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white text-3xl font-extrabold shadow-lg shadow-purple-900/40 mb-4">
              AA
            </div>
            <h4 className="text-lg font-semibold text-white mb-1">Asad Ali Awan</h4>
            <p className="text-xs text-purple-300 font-medium mb-4">
              Web Developer | AI Content Creator
            </p>
            <p className="text-xs text-slate-400 max-w-xs mb-5 leading-relaxed">
              Upload your photo directly now, or place <code className="text-slate-300 bg-slate-900 px-1 py-0.5 rounded font-mono">asad-ali-awan.jpg</code> in <code className="text-slate-300 bg-slate-900 px-1 py-0.5 rounded font-mono">public/assets/</code>.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="px-4 py-2 text-xs font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 rounded-lg shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                {isUploading ? 'Loading Photo...' : 'Upload My Photo Now'}
              </button>

              <button
                type="button"
                onClick={() => setShowHelperModal(true)}
                className="px-3 py-2 text-xs font-medium text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Info className="w-3.5 h-3.5" />
                <span>Instructions</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Instructions Modal if user wants to see the exact static asset instructions */}
      {showHelperModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md p-6 bg-[#0F1322] border border-slate-700 rounded-2xl shadow-2xl text-left">
            <h3 className="text-lg font-bold text-white mb-2">Connecting Your Profile Photograph</h3>
            <p className="text-xs text-slate-300 mb-4 leading-relaxed">
              In accordance with your requirement to preserve your actual identity and face without using stock images:
            </p>

            <div className="space-y-3 mb-5 text-xs">
              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="font-semibold text-purple-300 block mb-1">Option 1: In-Browser Quick Upload (Immediate)</span>
                Click the <strong>Upload My Photo Now</strong> button to select your image file from your device. It instantly renders across the Hero and About Me sections!
              </div>

              <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                <span className="font-semibold text-blue-300 block mb-1">Option 2: Permanent Asset Storage</span>
                Save your photograph file as:
                <div className="mt-1 flex items-center justify-between p-2 rounded bg-black/60 font-mono text-[11px] text-slate-300">
                  <span>public/assets/asad-ali-awan.jpg</span>
                  <button
                    onClick={copyPath}
                    className="text-purple-400 hover:text-purple-300 text-[10px] ml-2 flex items-center gap-1"
                  >
                    {copiedPath ? <Check className="w-3 h-3" /> : 'Copy'}
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowHelperModal(false)}
              className="w-full py-2.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
