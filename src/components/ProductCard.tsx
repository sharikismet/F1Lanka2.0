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
    <div className={`group cursor-pointer ${isOutOfStock ? 'opacity-75' : ''}`} onClick={onClick}>
      <div className="relative aspect-square mb-3 sm:mb-4 bg-gray-100 rounded-lg overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Stock Status Badges */}
        {isOutOfStock && (
          <Badge className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-gray-800 text-white text-xs">
            Out of Stock
          </Badge>
        )}
        {isLowStock && !isClearance && (
          <Badge className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-orange-600 text-white text-xs">
            Only {stockQuantity} left!
          </Badge>
        )}
        
        {/* Clearance Badge */}
        {isClearance && !isOutOfStock && (
          <Badge className="absolute top-1 sm:top-2 right-1 sm:right-2 bg-red-600 text-xs">
            Clearance
          </Badge>
        )}
        
        {/* Team Badge */}
        {team && (
          <Badge className="absolute top-1 sm:top-2 left-1 sm:left-2 bg-black text-xs">
            {team}
          </Badge>
        )}
        
        {/* Cart Button - Hidden on Mobile */}
        {!isOutOfStock && (
          <Button
            size="icon"
            className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:flex"
            onClick={(e) => {
              e.stopPropagation();
              onClick?.();
            }}
          >
            <ShoppingCart className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      <div>
        <p className="text-xs sm:text-sm text-gray-600 mb-1">{category}</p>
        <h3 className="text-sm sm:text-base font-medium mb-1 sm:mb-2 line-clamp-2">{name}</h3>
        <div className="flex items-center gap-1 sm:gap-2">
          <span className="text-sm sm:text-base font-bold">LKR {price.toFixed(2)}</span>
          {originalPrice && (
            <span className="text-xs sm:text-sm text-gray-500 line-through">
              LKR {originalPrice.toFixed(2)}
            </span>
          )}
        </div>
        
        {/* Stock Status Text */}
        {isOutOfStock && (
          <p className="text-xs sm:text-sm text-red-600 mt-1">Currently unavailable</p>
        )}
        {isLowStock && (
          <p className="text-xs sm:text-sm text-orange-600 mt-1">Low stock - order soon!</p>
        )}
      </div>
    </div>
  );
}