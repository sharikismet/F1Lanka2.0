import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  isClearance?: boolean;
  team?: string;
  onClick?: () => void;
  stockQuantity?: number;
}

export function ProductCard({
  name,
  price,
  originalPrice,
  image,
  category,
  isClearance,
  team,
  onClick,
  stockQuantity,
}: ProductCardProps) {
  const isOutOfStock = stockQuantity === 0;
  const isLowStock = stockQuantity !== undefined && stockQuantity > 0 && stockQuantity < 10;

  return (
    <div 
      className={`group cursor-pointer bg-[#0f0f13] border border-white/5 rounded-none p-3 hover:border-[#cba153]/50 transition-all duration-500 flex flex-col h-full ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} 
      onClick={onClick}
    >
      <div className="relative w-full aspect-square shrink-0 mb-4 bg-[#0a0a0c] overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
        />
        
        {/* Status Badges anchored safely to Top-Right */}
        {isOutOfStock && (
          <Badge className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white border border-white/10 text-[10px] font-mono tracking-widest uppercase rounded-none z-10">
            Sold Out
          </Badge>
        )}
        {isLowStock && !isClearance && (
          <Badge className="absolute top-2 right-2 bg-[#cba153]/20 backdrop-blur-md text-[#cba153] border border-[#cba153]/30 text-[10px] font-mono tracking-widest uppercase rounded-none z-10">
            {stockQuantity} Left
          </Badge>
        )}
        {isClearance && !isOutOfStock && (
          <Badge className="absolute top-2 right-2 bg-red-900/60 backdrop-blur-md text-red-300 border border-red-900/50 text-[10px] font-mono tracking-widest uppercase rounded-none z-10">
            Clearance
          </Badge>
        )}

        {/* 🚨 FIX: Moved Team Badge to Bottom-Left so it never crashes into the Status Badges on mobile grids */}
        {team && (
          <Badge className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white border border-white/20 text-[8px] sm:text-[9px] font-sans tracking-[0.2em] uppercase rounded-none z-10 max-w-[65%] truncate">
            {team}
          </Badge>
        )}
        
        {!isOutOfStock && (
          <Button
            size="icon"
            className="absolute bottom-3 right-3 z-20 bg-white hover:bg-[#cba153] text-black border-none rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hidden sm:flex shadow-[0_0_20px_rgba(0,0,0,0.5)]"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div className="flex flex-col flex-1">
        <p className="text-[10px] text-gray-300 font-mono tracking-widest uppercase mb-1.5">{category}</p>
        
        <h3 className="text-sm font-medium text-white mb-3 line-clamp-2 leading-snug transition-colors">
          {name}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2 mt-auto pt-3 border-t border-white/5">
          <span className="text-sm font-semibold text-[#cba153]">LKR {price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-xs text-gray-500 line-through">
              LKR {originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}