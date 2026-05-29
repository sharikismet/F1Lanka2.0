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
      className={`group cursor-pointer bg-card border border-border rounded-md p-3 hover:border-[#FF2800]/50 transition-all duration-500 flex flex-col h-full ${isOutOfStock ? 'opacity-50 grayscale' : ''}`} 
      onClick={onClick}
    >
      <div className="relative w-full aspect-square shrink-0 mb-4 bg-background overflow-hidden rounded-sm">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-in-out"
        />
        
        {isOutOfStock && (
          <Badge className="absolute top-2 right-2 bg-black/80 backdrop-blur-md text-white border border-white/10 text-[10px] font-mono tracking-widest uppercase rounded-sm z-10">
            Sold Out
          </Badge>
        )}
        
        {/* 🚨 FIX: "6 Left" Tag is now solid Gold with Black text for maximum visibility */}
        {isLowStock && !isClearance && (
          <Badge className="absolute top-2 right-2 bg-[#cba153] text-black border-none text-[10px] font-bold tracking-widest uppercase rounded-sm z-10 shadow-md">
            {stockQuantity} Left
          </Badge>
        )}
        
        {isClearance && !isOutOfStock && (
          <Badge className="absolute top-2 right-2 bg-[#FF2800] text-white border-none text-[10px] font-bold tracking-widest uppercase rounded-sm z-10 shadow-md">
            Clearance
          </Badge>
        )}
        
        {team && (
          <Badge className="absolute top-2 left-2 bg-black/80 backdrop-blur-md text-white border border-white/20 text-[9px] font-sans tracking-[0.2em] uppercase rounded-sm z-10">
            {team}
          </Badge>
        )}
        
        {!isOutOfStock && (
          <Button
            size="icon"
            className="absolute bottom-3 right-3 z-20 bg-foreground hover:bg-[#FF2800] text-background hover:text-white border-none rounded-full opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 hidden sm:flex shadow-[0_0_20px_rgba(0,0,0,0.5)]"
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
        <p className="text-[10px] text-muted-foreground font-mono tracking-widest uppercase mb-1.5">{category}</p>
        
        <h3 className="text-sm font-medium text-foreground mb-3 line-clamp-2 leading-snug transition-colors group-hover:text-[#FF2800]">
          {name}
        </h3>
        
        <div className="flex flex-wrap items-center gap-2 mt-auto pt-3 border-t border-border">
          <span className="text-sm font-semibold text-foreground">LKR {price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-xs text-muted-foreground line-through">
              LKR {originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}