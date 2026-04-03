import * as React from "react";
import { Button } from './ui/button';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "./ui/carousel";

// Your original image plus two additional placeholders for the slideshow
const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1742412615437-4cefe005d82c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGb3JtdWxhJTIwMSUyMHJhY2luZyUyMGNhciUyMHNwZWVkfGVufDF8fHx8MTc3NTE0MDc2MHww&ixlib=rb-4.1.0&q=80&w=1080',
  'https://sqgqsdexujosloavpuso.supabase.co/storage/v1/object/public/products/2025-drivers-hero-shot-3.jpg',
  'https://sqgqsdexujosloavpuso.supabase.co/storage/v1/object/public/products/wp7380258.jpg'
];

export function HeroBanner({ onShopNow }: { onShopNow: () => void }) {
  return (
    <section className="relative w-full overflow-hidden group">
      <Carousel 
        opts={{ loop: true }} 
        className="w-full"
      >
        <CarouselContent>
          {HERO_IMAGES.map((src, index) => (
            <CarouselItem key={index}>
              {/* Keep your exact height styling */}
              <div className="relative w-full h-[340px] md:h-[440px] lg:h-[520px]">
                <img
                  src={src}
                  alt={`Formula 1 Racing ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Your original gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                
                {/* Your original content wrapper */}
                <div className="absolute inset-0 flex flex-col justify-center">
                  <div className="container mx-auto px-4">
                    <div className="max-w-lg">
                      <p className="text-[#FF2800] font-semibold text-sm md:text-base uppercase tracking-widest mb-2">
                        Official F1 Merchandise
                      </p>
                      <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
                        Race Day <br />Collection 2026
                      </h1>
                      <p className="text-gray-300 text-sm md:text-base mb-6 max-w-md">
                        Gear up with authentic Formula 1 team apparel, collectibles, and accessories. Free shipping on orders over Rs. 15,000.
                      </p>
                      <Button
                        onClick={onShopNow}
                        className="bg-[#FF2800] hover:bg-[#E02400] text-white px-8 py-3 text-base font-semibold rounded-md"
                      >
                        Shop Now
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        
        {/* Navigation arrows - Hidden on mobile, visible on desktop */}
        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#FF2800] border-none text-white hover:text-white transition-colors" />
          <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-[#FF2800] border-none text-white hover:text-white transition-colors" />
        </div>
      </Carousel>
    </section>
  );
}