import { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu } from 'lucide-react';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { useCart } from '../lib/CartContext';
import logo from 'sharikismet/F1Lanka2.0/src/assets/F1 dark logo (2).png';

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
  const [time, setTime] = useState('');

  // Live clock synced to Colombo time (+05:30)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const colomboTime = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Colombo',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      }).format(now);
      setTime(colomboTime);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (e: React.MouseEvent<HTMLAnchorElement>, category: string) => {
    e.preventDefault();
    onCategoryClick(category);
  };

  const handleGenderClick = (e: React.MouseEvent<HTMLAnchorElement>, gender: string) => {
    e.preventDefault();
    onGenderClick(gender);
  };

  return (
    <div className="sticky top-0 z-50 w-full flex flex-col">
      {/* --- NEW: TOP UTILITY BAR --- */}
      <div className="bg-[#000000] text-white text-[10px] sm:text-xs font-mono tracking-widest uppercase py-2 px-4 flex justify-between items-center border-b border-white/10">
        <div className="hidden sm:block text-white/70">EN / LKR</div>
        <div className="text-center flex-1 font-medium tracking-[0.15em]">Free shipping on qualifying orders</div>
        <div className="hidden sm:block text-[#FF2800]">{time || 'LOADING...'}</div>
      </div>

      <header className="border-b border-border bg-background/85 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.5)] text-foreground">
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
                className="h-8 object-contain drop-shadow-md group-hover:brightness-110 transition-all dark:invert dark:hue-rotate-180 dark:mix-blend-screen"
              />
              <div className="hidden sm:block">
                <span className="text-sm text-muted-foreground hidden md:inline">Formula 1 Experience in Sri Lanka</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-xl mx-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 w-full bg-input-background border-border text-foreground focus:border-[#FF2800]"
                  onChange={(e) => onSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Cart */}
            <div className="flex items-center gap-4 flex-shrink-0">
              <Button 
                variant="ghost" 
                size="icon"
                className="relative hover:bg-accent"
                onClick={onCartClick}
              >
                <ShoppingCart className="w-6 h-6" />
                {totalItems > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#FF2800] text-white text-xs">
                    {totalItems}
                  </Badge>
                )}
              </Button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="border-t border-border overflow-x-auto">
            <ul className="flex items-center justify-between py-3 text-sm whitespace-nowrap gap-4 min-w-max">
              <li>
                <a 
                  href="#" 
                  className="hover:text-[#FF2800] transition-colors font-medium"
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
                  className="hover:text-[#FF2800] transition-colors"
                  onClick={(e) => { e.preventDefault(); }}
                >
                  Shop By Driver
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-[#FF2800] transition-colors font-medium"
                  onClick={(e) => handleGenderClick(e, 'men')}
                >
                  Men
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-[#FF2800] transition-colors font-medium"
                  onClick={(e) => handleGenderClick(e, 'women')}
                >
                  Women
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-[#FF2800] transition-colors font-medium"
                  onClick={(e) => handleGenderClick(e, 'kids')}
                >
                  Kids
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-[#FF2800] transition-colors"
                  onClick={(e) => handleCategoryClick(e, 'Caps & Hats')}
                >
                  Headwear
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-[#FF2800] transition-colors"
                  onClick={(e) => handleCategoryClick(e, 'Accessories')}
                >
                  Gifts & Accessories
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="hover:text-[#FF2800] transition-colors"
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
    </div>
  );
}