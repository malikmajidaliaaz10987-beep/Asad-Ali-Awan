import React, { useState } from 'react';
import { getDefaultWhatsAppUrl, ASAD_WHATSAPP_NUMBER } from '../utils/whatsapp';

export const FloatingWhatsApp: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const waUrl = getDefaultWhatsAppUrl('Hello Asad Ali Awan! I saw your portfolio and would like to discuss a project with you.');

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip */}
      <div
        className={`hidden md:block px-3 py-1.5 rounded-lg bg-slate-900/95 text-slate-200 text-xs font-medium border border-slate-700/80 shadow-xl transition-all duration-200 ${
          showTooltip ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2 pointer-events-none'
        }`}
      >
        <span>Chat with Asad on WhatsApp</span>
      </div>

      {/* Floating Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Asad on WhatsApp"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:shadow-[#25D366]/30 hover:scale-105 active:scale-95 transition-all duration-300"
      >
        {/* Subtle breathing glow */}
        <span className="absolute -inset-1 rounded-full bg-[#25D366]/40 blur-md opacity-70 group-hover:opacity-100 transition-opacity pointer-events-none" />

        {/* Official WhatsApp SVG Icon */}
        <svg
          className="w-7 h-7 relative z-10 fill-white"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path d="M17.507 14.307l-.009.075c-.238-.12-1.406-.694-1.624-.773-.219-.079-.378-.12-.538.12-.16.239-.617.773-.756.932-.14.16-.279.18-.518.06-.239-.12-1.008-.372-1.92-1.185-.709-.633-1.188-1.415-1.327-1.654-.14-.239-.015-.368.105-.487.108-.107.239-.279.359-.418.12-.14.16-.239.24-.399.08-.16.04-.299-.02-.418-.06-.12-.538-1.295-.737-1.773-.194-.465-.391-.402-.538-.41-.14-.007-.299-.009-.458-.009s-.418.06-.638.299c-.219.239-.837.817-.837 1.993 0 1.176.857 2.312.977 2.472.12.16 1.685 2.572 4.083 3.607.57.246 1.016.393 1.364.503.573.182 1.095.156 1.507.095.46-.069 1.406-.575 1.605-1.13.199-.555.199-1.031.14-1.13-.06-.099-.219-.16-.458-.279zm-5.507 7.693c-1.802 0-3.504-.482-4.981-1.325l-.357-.202-3.662.96 0.977-3.57-.222-.353c-.927-1.474-1.416-3.187-1.416-4.954 0-5.183 4.218-9.401 9.401-9.401 2.511 0 4.872.978 6.648 2.754 1.776 1.776 2.753 4.137 2.753 6.647 0 5.184-4.218 9.402-9.401 9.402zm8.016-17.417c-2.14-2.141-4.986-3.32-8.016-3.32-6.242 0-11.321 5.079-11.321 11.32 0 1.994.521 3.941 1.512 5.657l-1.606 5.865 6.002-1.574c1.652.9 3.511 1.374 5.413 1.374 6.241 0 11.32-5.079 11.32-11.32 0-3.029-1.179-5.875-3.32-8.016z" />
        </svg>
      </a>
    </div>
  );
};
