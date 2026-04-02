import { Button } from './ui/button';

const HERO_IMAGE = 'https://images.unsplash.com/photo-1742412615437-4cefe005d82c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxGb3JtdWxhJTIwMSUyMHJhY2luZyUyMGNhciUyMHNwZWVkfGVufDF8fHx8MTc3NTE0MDc2MHww&ixlib=rb-4.1.0&q=80&w=1080';

export function HeroBanner({ onShopNow }: { onShopNow: () => void }) {
  return (
    <section className="relative w-full h-[340px] md:h-[440px] lg:h-[520px] overflow-hidden">
      <img
        src={HERO_IMAGE}
        alt="Formula 1 Racing"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
      <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
        <div className="max-w-lg">
          <p className="text-[#FF2800] font-semibold text-sm md:text-base uppercase tracking-widest mb-2">
            Official F1 Merchandise
          </p>
          <h1 className="text-white text-3xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4">
            Race Day <br />Collection 2025
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
    </section>
  );
}
