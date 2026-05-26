import { Search, ShoppingCart, Menu } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '../lib/CartContext';
import logo from 'figma:asset/30477617e4c72de57d223325aec5d70bfd5a6419.png';

interface HeaderProps {
  onSearch: (query: string) => void;
  onCategoryClick: (category: string) => void;
  onGenderClick: (gender: string) => void;
  onLogoClick: () => void;
  onCartClick: () => void;
  onTeamSelectorClick: () => void;
  onFiltersClick: () => void;
}

export function Header({ 
  onSearch, 
  onCategoryClick, 
  onGenderClick, 
  onLogoClick,
  onCartClick,
  onTeamSelectorClick,
  onFiltersClick,
}: HeaderProps) {
  const { totalItems } = useCart();

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, category: string) => {
    e.preventDefault();
    onCategoryClick(category);
  };

  const handleGenderClick = (e: React.MouseEvent<HTMLAnchorElement>, gender: string) => {
    e.preventDefault();
    onGenderClick(gender);
  };

  return (
    <header className="border-b border-white/5 sticky top-0 bg-[#0a0a0c]/85 backdrop-blur-md z-50 shadow-[0_4px_24px_rgba(0,0,0,0.5)] text-white">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4 gap-4">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 cursor-pointer flex-shrink-0" 
            onClick={onLogoClick}
          >
            <img 
              src={logo} 
              alt="F1 Lanka" 
              className="h-12 w-auto object-contain"
            />
            <div className="hidden sm:block">
              <span className="text-sm text-gray-500 hidden md:inline">Formula 1 Experience in Sri Lanka</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search products..."
                className="pl-10 w-full"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Cart */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Button 
              variant="ghost" 
              size="icon"
              className="relative"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-xs">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t overflow-x-auto">
          <ul className="flex items-center justify-between py-3 text-sm whitespace-nowrap gap-4 min-w-max">
            <li>
              <a 
                href="#" 
                className="hover:text-red-600 transition-colors font-medium"
                onClick={(e) => { 
                  e.preventDefault(); 
                  onTeamSelectorClick();
                }}
              >
                Shop By Team
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="hover:text-red-600 transition-colors"
                onClick={(e) => { e.preventDefault(); }}
              >
                Shop By Driver
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="hover:text-red-600 transition-colors font-medium"
                onClick={(e) => handleGenderClick(e, 'men')}
              >
                Men
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="hover:text-red-600 transition-colors font-medium"
                onClick={(e) => handleGenderClick(e, 'women')}
              >
                Women
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="hover:text-red-600 transition-colors font-medium"
                onClick={(e) => handleGenderClick(e, 'kids')}
              >
                Kids
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="hover:text-red-600 transition-colors"
                onClick={(e) => handleCategoryClick(e, 'Caps & Hats')}
              >
                Headwear
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="hover:text-red-600 transition-colors"
                onClick={(e) => handleCategoryClick(e, 'Accessories')}
              >
                Gifts & Accessories
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="hover:text-red-600 transition-colors"
                onClick={(e) => handleCategoryClick(e, 'Model Cars')}
              >
                Collectibles
              </a>
            </li>
          </ul>
        </nav>

        {/* Promo Banner */}
        <div className="bg-[#13131a] border-t border-white/5 text-center py-2 text-xs font-racing tracking-[0.2em] uppercase text-white/70">
          UP TO 50% OFF ON SELECTED ITEMS
        </div>
      </div>
    </header>
  );
}