import * as React from "react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronRight, Play, Pause } from 'lucide-react';
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
    volume: "VOL. 01 — Deppresion",
    subtitle: "Charles X Lewis",
    titleStart: "Premium ",
    titleGold: "FERRARI",
    titleEnd: " Race Wear",
    description: "Custom-fit race wear, breathable cotton blends, and official team branding. Tailored for the ultimate fan, ships nationwide.",
    image: "https://sqgqsdexujosloavpuso.supabase.co/storage/v1/object/public/Logos/Hero%20banners/ferrari%20hero%20banner.svg",
    status: "LIMITED STOCK",
    release: "Season 2026",
    edition: "High-Quality Merchandise"
  },
  {
    chapter: "02 / 03",
    volume: "VOL. 02 — CHAMPIONS",
    subtitle: "Kimi X George",
    titleStart: "Exclusive ",
    titleGold: "MERCEDES AMG",
    titleEnd: " Drop",
    description: "Heavyweight hoodies, minimal branding, and perfect fits. Engineered for the streets and the grandstands.",
    image: "https://sqgqsdexujosloavpuso.supabase.co/storage/v1/object/public/Logos/Hero%20banners/Mercedes%20hero%20banner.svg",
    status: "LIMITED DROP",
    release: "Made to order",
    edition: "Limited Collection"
  },
  {
    chapter: "03 / 03",
    volume: "VOL. 03 — Winner takes it all",
    subtitle: "MAX X Hadjar",
    titleStart: "The ",
    titleGold: "REDBULL",
    titleEnd: " Archive",
    description: "Precision-engineered outerwear designed to withstand the elements. Featuring advanced moisture-wicking technology.",
    image: "https://sqgqsdexujosloavpuso.supabase.co/storage/v1/object/public/Logos/Hero%20banners/REDBULL%20hero%20banner.svg",
    status: "PRE-ORDER",
    release: "Ships in 2 weeks",
    edition: "Limited Run"
  }
];

export function HeroBanner({ onShopNow }: { onShopNow: () => void }) {
  const plugin = React.useRef(
    Autoplay({ delay: 6000, stopOnInteraction: false })
  );
  
  const [api, setApi] = React.useState<any>();
  const [current, setCurrent] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);

  React.useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const togglePlay = () => {
    const autoplay = plugin.current;
    if (!autoplay) return;

    if (isPlaying) {
      autoplay.stop();
      setIsPlaying(false);
    } else {
      autoplay.play();
      setIsPlaying(true);
    }
  };

  return (
    <section className="relative w-full bg-[#0a0a0c] overflow-hidden text-white font-sans selection:bg-[#cba153] selection:text-black border-b border-white/5 group">
      <Carousel setApi={setApi} opts={{ loop: true }} plugins={[plugin.current]} className="w-full">
        <CarouselContent>
          {HERO_SLIDES.map((slide, index) => (
            <CarouselItem key={index}>
              
              {/* 🚨 FIX: Increased mobile height to 85vh to prevent vertical crushing */}
              <div className="relative w-full h-[85vh] lg:h-[90vh]">
                
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/60 to-transparent z-10" />
                
                <img 
                  src={slide.image} 
                  alt={slide.subtitle}
                  className="absolute right-0 top-0 w-full md:w-[85%] h-full object-cover opacity-60 mix-blend-luminosity"
                />

                <div className="absolute right-10 top-[25%] z-20 text-right pointer-events-none opacity-30 hidden md:block">
                   <p className="text-[#cba153] tracking-[0.3em] text-xs uppercase mb-4">Now Featuring</p>
                   <h2 className="text-7xl lg:text-9xl font-serif italic text-white/20 blur-[1px]">{slide.subtitle}</h2>
                </div>

                {/* 🚨 FIX: Shifted the title block up on mobile (top-[12%]) */}
                <div className="absolute left-4 md:left-16 lg:left-24 top-[12%] sm:top-[15%] lg:top-[25%] z-30 max-w-2xl pr-4">
                  <div className="flex items-center gap-4 text-[#7aa2f7] text-[10px] md:text-xs font-mono tracking-widest mb-4 md:mb-6 uppercase">
                    <span className="text-[#cba153]">◇</span> {slide.chapter} 
                    <span className="hidden sm:inline-block w-8 md:w-12 h-[1px] bg-gray-700"></span> 
                    <span className="text-gray-400">{slide.volume}</span>
                  </div>

                  <p className="text-gray-400 tracking-[0.2em] text-[10px] sm:text-xs md:text-sm mb-3 md:mb-4 uppercase">{slide.subtitle}</p>
                  
                  {/* 🚨 FIX: Scaled down text on mobile so it takes up fewer lines */}
                  <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-serif leading-[1.1] mb-4 md:mb-6">
                    {slide.titleStart} 
                    <span className="text-[#cba153] italic">{slide.titleGold}</span> <br className="hidden sm:block"/>
                    {slide.titleEnd}
                  </h1>

                  <p className="text-gray-400 text-[10px] sm:text-xs md:text-sm leading-relaxed max-w-lg mb-6 md:mb-8 border-l border-gray-800 pl-4 line-clamp-3 sm:line-clamp-none">
                    {slide.description}
                  </p>

                  <div className="flex items-center gap-6">
                    <button 
                      onClick={onShopNow}
                      className="bg-[#e5e5e5] hover:bg-white text-black rounded-full px-6 py-2.5 md:px-8 md:py-3 text-[10px] md:text-sm font-semibold tracking-wide transition-colors flex items-center gap-2"
                    >
                      SHOP COLLECTION <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* 🚨 FIX: Anchored safely above the footer (bottom-20) */}
                <div className="absolute bottom-20 md:bottom-24 left-4 md:left-16 lg:left-24 z-30 flex gap-6 md:gap-20 border-t border-white/10 pt-4 md:pt-6 w-[90%] md:w-auto">
                  <div>
                    <p className="text-[8px] md:text-[10px] text-[#cba153] tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
                      <span className="text-xs leading-none">✧</span> Status
                    </p>
                    <p className="text-[9px] md:text-xs text-[#7aa2f7] tracking-widest uppercase">{slide.status}</p>
                  </div>
                  <div>
                    <p className="text-[8px] md:text-[10px] text-[#cba153] tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
                      <span className="text-xs leading-none">📅</span> Release
                    </p>
                    <p className="text-[9px] md:text-xs text-white tracking-widest uppercase">{slide.release}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-[8px] md:text-[10px] text-[#cba153] tracking-[0.2em] uppercase mb-1 flex items-center gap-2">
                      <span className="text-xs leading-none">🛡️</span> Edition
                    </p>
                    <p className="text-[9px] md:text-xs text-white tracking-widest uppercase">{slide.edition}</p>
                  </div>
                </div>
              </div>

            </CarouselItem>
          ))}
        </CarouselContent>
        
        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <CarouselPrevious className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 bg-[#0a0a0c]/60 border border-white/10 hover:bg-[#0a0a0c] hover:border-[#cba153] text-white hover:text-[#cba153] transition-all backdrop-blur-sm w-12 h-12 flex items-center justify-center rounded-full z-40" />
          <CarouselNext className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 bg-[#0a0a0c]/60 border border-white/10 hover:bg-[#0a0a0c] hover:border-[#cba153] text-white hover:text-[#cba153] transition-all backdrop-blur-sm w-12 h-12 flex items-center justify-center rounded-full z-40" />
        </div>
      </Carousel>

      {/* 🚨 FIX: Added bg-gradient to separate text from images, and hid verbose text on mobile */}
      <div className="absolute bottom-0 w-full px-4 md:px-16 lg:px-24 pb-4 md:pb-6 z-40 flex items-center justify-between font-mono text-[10px] tracking-widest uppercase text-gray-500 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/80 to-transparent pt-10">
        
        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={togglePlay} 
            className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-700 flex items-center justify-center hover:bg-white/5 transition-colors focus:outline-none shrink-0"
          >
            {isPlaying ? <Pause className="w-3 h-3 text-white" /> : <Play className="w-3 h-3 text-white ml-0.5" />}
          </button>

          <div className="hidden sm:flex items-end gap-4 h-10 pb-1.5">
            {HERO_SLIDES.map((_, idx) => (
              <div 
                key={idx} 
                className="flex flex-col gap-2 cursor-pointer group" 
                onClick={() => api?.scrollTo(idx)}
              >
                <span className={`transition-colors ${current === idx ? "text-white" : "text-gray-600 group-hover:text-gray-400"}`}>
                  0{idx + 1}
                </span>
                <div className={`h-[1px] w-6 transition-colors ${current === idx ? "bg-[#cba153]" : "bg-gray-700 group-hover:bg-gray-500"}`} />
              </div>
            ))}
          </div>

          <div className="hidden sm:block ml-2 sm:ml-4 text-gray-400">
            {isPlaying ? "PLAYING • AUTO" : "PAUSED • HOVER"}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-end sm:justify-start sm:max-w-md sm:ml-8">
          <div className="h-[1px] flex-1 bg-gray-800 relative hidden sm:block">
            <div 
              className="absolute left-0 top-0 h-[1px] bg-[#cba153] transition-all duration-500" 
              style={{ width: `${((current + 1) / HERO_SLIDES.length) * 100}%` }} 
            />
          </div>
          <span className="flex-shrink-0 text-gray-600">
            <span className="text-white">0{current + 1}</span> — 0{HERO_SLIDES.length}
          </span>
        </div>

      </div>
    </section>
  );
}