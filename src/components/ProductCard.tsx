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
      className={`group cursor-pointer relative bg-white border-[3px] border-black p-3 transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${isOutOfStock ? 'opacity-75 grayscale' : ''}`} 
      onClick={onClick}
    >
      <div className="relative aspect-square mb-4 bg-gray-100 border-[3px] border-black overflow-hidden">
        {/* Edgy background pattern or solid color for the image container */}
        <div className="absolute inset-0 bg-white" /> 
        
        <img
          src={image}
          alt={name}
          className="relative z-10 w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-500 ease-in-out"
        />
        
        {/* Aggressive Typography Badges */}
        {isOutOfStock && (
          <Badge className="absolute z-20 top-2 right-2 bg-black text-white text-xs font-black uppercase tracking-widest border-2 border-white rounded-none">
            SOLD OUT
          </Badge>
        )}
        {isLowStock && !isClearance && (
          <Badge className="absolute z-20 top-2 right-2 bg-red-600 text-white text-xs font-black uppercase tracking-widest border-2 border-black rounded-none">
            {stockQuantity} LEFT
          </Badge>
        )}
        
        {isClearance && !isOutOfStock && (
          <Badge className="absolute z-20 top-2 right-2 bg-yellow-400 text-black text-xs font-black uppercase tracking-widest border-2 border-black rounded-none">
            SALE
          </Badge>
        )}
        
        {team && (
          <Badge className="absolute z-20 top-2 left-2 bg-white text-black text-[10px] font-black uppercase tracking-widest border-2 border-black rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {team}
          </Badge>
        )}
        
        {/* Brutalist Cart Button */}
        {!isOutOfStock && (
          <Button
            size="icon"
            className="absolute z-20 bottom-2 right-2 bg-red-600 hover:bg-black text-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] opacity-0 group-hover:opacity-100 transition-all hidden sm:flex"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <ShoppingCart className="w-5 h-5" />
          </Button>
        )}
      </div>
      
      <div className="pt-2 border-t-2 border-black">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{category}</p>
        <h3 className="text-sm sm:text-base font-black uppercase leading-tight mb-2 line-clamp-2 text-black">{name}</h3>
        
        <div className="flex items-end justify-between mt-auto">
           <div className="flex flex-col">
            {originalPrice && (
              <span className="text-xs text-gray-500 line-through font-bold">
                LKR {originalPrice.toFixed(2)}
              </span>
            )}
            <span className="text-lg sm:text-xl font-black text-red-600 tracking-tighter">
              LKR {price.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}