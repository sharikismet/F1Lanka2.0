'use client'; 

import React, { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';

const WHATSAPP_NUMBER = '94710773717';
const IG_USERNAME = 'f1lanka'; 

// Message Templates
const TEMPLATES = {
  product: "Hi F1 Lanka! 👋 I'm interested in your F1 merchandise. Could you help me with more information?",
  track: "Hi F1 Lanka! 📦 I'd like to track my recent order. My order details are: ",
  help: "Hi F1 Lanka! 🆘 I need some assistance.",
};

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export function FloatingButtons() {
  const [activePopup, setActivePopup] = useState<'whatsapp' | 'instagram' | null>(null);
  const [isRolling, setIsRolling] = useState<'whatsapp' | 'instagram' | null>(null);

  const handleToggle = (platform: 'whatsapp' | 'instagram') => {
    if (activePopup === platform) {
      setActivePopup(null);
      return;
    }

    setIsRolling(platform);
    setActivePopup(null); 

    setTimeout(() => {
      setIsRolling(null);
      setActivePopup(platform);
    }, 500); 
  };

  const getLink = (type: 'product' | 'track' | 'help') => {
    if (activePopup === 'whatsapp') {
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(TEMPLATES[type])}`;
    }
    if (activePopup === 'instagram') {
      return `https://ig.me/m/${IG_USERNAME}`;
    }
    return '#'; 
  };

  const handleOptionClick = (e: React.MouseEvent, type: 'product' | 'track' | 'help') => {
    e.preventDefault();
    const url = getLink(type);
    
    if (url !== '#') {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
    
    setActivePopup(null);
  };

  return (
    // 🚨 FIX 1: Added pointer-events-none to the outer wrapper
    <div className="fixed bottom-6 right-6 flex flex-col items-end gap-3 z-50 font-sans pointer-events-none">
      
      {/* Pop-up Menu */}
      <div
        className={`mb-2 w-80 bg-[#0a0a0a] text-white rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 origin-bottom-right ${
          activePopup
            // 🚨 FIX 2: Restore pointer-events-auto ONLY when the popup is visible
            ? 'scale-100 opacity-100 translate-y-0 pointer-events-auto'
            : 'scale-90 opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        <div className="p-5">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-bold tracking-widest text-green-500 uppercase">
                Live • F1 Lanka
              </span>
            </div>
            <button 
              onClick={() => setActivePopup(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="w-full h-px bg-white/10 mb-4"></div>

          <h3 className="text-[15px] font-medium text-gray-200 mb-5 leading-relaxed">
            Hi — how can we help? Choose a thread to start on {activePopup === 'whatsapp' ? 'WhatsApp' : 'Instagram'}.
          </h3>

          {/* Options List */}
          <div className="flex flex-col gap-2.5">
            {[
              { id: 'product', label: 'Product enquiry' },
              { id: 'track', label: 'Track an order' },
              { id: 'help', label: 'Need help' },
            ].map((option) => (
              <button
                key={option.id}
                onClick={(e) => handleOptionClick(e, option.id as 'product' | 'track' | 'help')} 
                className="w-full px-4 py-3.5 bg-transparent border border-white/10 rounded-xl flex items-center gap-3 text-sm font-medium hover:bg-white/5 hover:border-white/20 transition-all text-left"
              >
                <span className="text-gray-400 text-lg">✦</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 🚨 FIX 3: Wrapped the buttons in a div with pointer-events-auto so they can still be clicked */}
      <div className="flex flex-col gap-3 pointer-events-auto">
        {/* Instagram Button */}
        <button
          onClick={() => handleToggle('instagram')}
          className={`relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 text-white overflow-visible hover:scale-110 ${
            isRolling === 'instagram' ? '-rotate-[360deg]' : 'rotate-0'
          }`}
          style={{
            background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
          }}
          title="Chat with us on Instagram"
        >
          <InstagramIcon />
          {!activePopup && isRolling !== 'instagram' && (
            <span className="absolute inset-0 rounded-full bg-[#cc2366] animate-ping opacity-55 -z-10"></span>
          )}
        </button>

        {/* WhatsApp Button */}
        <button
          onClick={() => handleToggle('whatsapp')}
          className={`relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg transition-all duration-500 text-white hover:scale-110 ${
            isRolling === 'whatsapp' ? '-rotate-[360deg]' : 'rotate-0'
          }`}
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="w-7 h-7" />
          {!activePopup && isRolling !== 'whatsapp' && (
            <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75 -z-10"></span>
          )}
        </button>
      </div>
    </div>
  );
}