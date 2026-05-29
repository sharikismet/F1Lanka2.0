import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

const HERO_SLIDES = [
  {
    chapter: "01 / 03",
    volume: "VOL. 01 — MIAMI SPEC",
    subtitle: "SCUDERIA FERRARI",
    titleStart: "Premium ",
    titleGold: "Charles Leclerc",
    titleEnd: " Race Wear",
    description: "Custom-fit race wear, breathable cotton blends, and official team branding. Tailored for the ultimate fan, ships nationwide.",
    image: "https://sqgqsdexujosloavpuso.supabase.co/storage/v1/object/public/products/2025-drivers-hero-shot-3.jpg",
    status: "AVAILABLE NOW",
    release: "Season 2026",
    edition: "Official Merchandise"
  },
  {
    chapter: "02 / 03",
    volume: "VOL. 02 — SILVER ARROWS",
    subtitle: "MERCEDES AMG",
    titleStart: "Exclusive ",
    titleGold: "Lewis Hamilton",
    titleEnd: " Drop",
    description: "Heavyweight hoodies, minimal branding, and perfect fits. Engineered for the streets and the grandstands.",
    image: "https://images.unsplash.com/photo-1742412615437-4cefe005d82c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGb3JtdWxhJTIwMSUyMHJhY2luZyUyMGNhciUyMHNwZWVkfGVufDF8fHx8MTc3NTE0MDc2MHww&ixlib=rb-4.1.0&q=80&w=1080",
    status: "LIMITED DROP",
    release: "Made to order",
    edition: "Bespoke Collection"
  },
  {
    chapter: "03 / 03",
    volume: "VOL. 03 — CHAMPIONS",
    subtitle: "RED BULL RACING",
    titleStart: "The ",
    titleGold: "Max Verstappen",
    titleEnd: " Archive",
    description: "Precision-engineered outerwear designed to withstand the elements. Featuring advanced moisture-wicking technology.",
    image: "https://sqgqsdexujosloavpuso.supabase.co/storage/v1/object/public/products/wp7380258.jpg",
    status: "PRE-ORDER",
    release: "Ships in 2 weeks",
    edition: "Limited Run"
  }
];

export function HeroBanner({ onShopNow }: { onShopNow: () => void }) {
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <section className="relative w-full bg-[#0a0a0c] overflow-hidden text-white font-sans selection:bg-[#cba153] selection:text-black border-b border-white/5">
      <Carousel opts={{ loop: true }} plugins={[plugin.current]} className="w-full">
        <CarouselContent>
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={index}>
              
              {/* 🚨 FIX: Forced an explicit fixed height (75vh to 90vh) so it cannot collapse to 0px */}
              <div className="relative w-full h-[75vh] lg:h-[90vh]">
                
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/40 to-transparent z-10" />
                
                <img 
                  src={slide.image} 
                  alt={slide.subtitle}
                  className="absolute right-0 top-0 w-full md:w-[85%] h-full object-cover opacity-60 mix-blend-luminosity"
                />

                <div className="absolute right-10 top-[25%] z-20 text-right pointer-events-none opacity-30 hidden md:block">
                   <p className="text-[#cba153] tracking-[0.3em] text-xs uppercase mb-4">Now Featuring</p>
                   <h2 className="text-7xl lg:text-9xl font-serif italic text-white/20 blur-[1px]">{slide.subtitle.split(' ')[0]}</h2>
                </div>

                <div className="absolute left-4 md:left-16 lg:left-24 top-[20%] lg:top-[25%] z-30 max-w-2xl pr-4">
                  <div className="flex items-center gap-4 text-[#7aa2f7] text-[10px] md:text-xs font-mono tracking-widest mb-6 uppercase">
                    <span className="text-[#cba153]">◇</span> {slide.chapter} 
                    <span className="w-8 md:w-12 h-[1px] bg-gray-700"></span> 
                    <span className="text-gray-400">{slide.volume}</span>
                  </div>

                  <p className="text-gray-400 tracking-[0.2em] text-xs md:text-sm mb-4 uppercase">{slide.subtitle}</p>
                  
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] mb-6">
                    {slide.titleStart} 
                    <span className="text-[#cba153] italic">{slide.titleGold}</span> <br/>
                    {slide.titleEnd}
                  </h1>

                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed max-w-lg mb-8 border-l border-gray-800 pl-4">
                    {slide.description}
                  </p>

                  <div className="flex items-center gap-6">
                    <button 
                      onClick={onShopNow}
                      className="bg-[#e5e5e5] hover:bg-white text-black rounded-full px-6 py-2.5 md:px-8 md:py-3 text-xs md:text-sm font-semibold tracking-wide transition-colors flex items-center gap-2"
                    >
                      SHOP COLLECTION <ChevronRight className="w-4 h-4" />
                    </button>
                    <button className="text-[10px] md:text-xs text-gray-500 tracking-widest uppercase hover:text-[#cba153] transition-colors hidden sm:block">
                      View Specifications
                    </button>
                  </div>
                </div>

                <div className="absolute bottom-12 left-4 md:left-16 lg:left-24 z-30 flex gap-8 md:gap-20 border-t border-white/10 pt-6 pr-10 w-[90%] md:w-auto">
                  <div>
                    <p className="text-[9px] md:text-[10px] text-[#cba153] tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
                      <span className="text-sm leading-none">✧</span> Status
                    </p>
                    <p className="text-[10px] md:text-xs text-[#7aa2f7] tracking-widest uppercase">{slide.status}</p>
                  </div>
                  <div>
                    <p className="text-[9px] md:text-[10px] text-[#cba153] tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
                      <span className="text-sm leading-none">📅</span> Release
                    </p>
                    <p className="text-[10px] md:text-xs text-white tracking-widest uppercase">{slide.release}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[9px] md:text-[10px] text-[#cba153] tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
                      <span className="text-sm leading-none">🛡️</span> Edition
                    </p>
                    <p className="text-[10px] md:text-xs text-white tracking-widest uppercase">{slide.edition}</p>
                  </div>
                </div>
              </div>

            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 border border-white/10 hover:bg-black hover:border-[#cba153] text-white/50 hover:text-[#cba153] transition-all backdrop-blur-sm w-12 h-12" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 border border-white/10 hover:bg-black hover:border-[#cba153] text-white/50 hover:text-[#cba153] transition-all backdrop-blur-sm w-12 h-12" />
        </div>
      </Carousel>
    </section>
  );
}