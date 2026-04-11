import { MessageCircle } from 'lucide-react';

const WHATSAPP_NUMBER = '94710773717';
const WHATSAPP_MESSAGE = encodeURIComponent(
  "Hi F1 Lanka! 👋 I'm interested in your F1 merchandise. Could you help me with more information?"
);
const INSTAGRAM_URL = 'https://www.instagram.com/f1lanka/';

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

export function FloatingButtons() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
      
      {/* Instagram Button */}
      <a
        href={INSTAGRAM_URL}
        target="_blank"
        rel="noopener noreferrer"
        // Added 'relative' so the pulse stays contained
        className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-white overflow-visible"
        style={{
          background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)',
        }}
        title="Follow us on Instagram" 
      >
        <InstagramIcon />
        {/* Pink pulse for Instagram */}
        <span className="absolute inset-0 rounded-full bg-[#cc2366] animate-ping opacity-55 -z-10"></span>
      </a>

      {/* WhatsApp Button */}
      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        // Added 'relative' and 'bg-[#25D366]'
        className="relative w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform text-white"
        title="Chat with us on WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        {/* Green pulse for WhatsApp */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-75 -z-10"></span>
      </a>
      
    </div>
  );
}