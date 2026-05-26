import { Search, ShoppingCart } from 'lucide-react';
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
    <header className="sticky top-0 z-50 bg-white border-b-[4px] border-black">
      
      {/* Brutalist Promo Banner */}
      <div className="bg-black text-white text-center py-2 text-xs md:text-sm font-black tracking-[0.2em] uppercase overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-[marquee_20s_linear_infinite]">
           🔥 LIMITED DROP ALERT // UP TO 50% OFF SELECTED ITEMS // FREE SHIPPING OVER LKR 15,000 🔥 
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-4 gap-4">
          
          {/* Logo Area */}
          <div 
            className="flex flex-col cursor-pointer flex-shrink-0 group" 
            onClick={onLogoClick}
          >
            <img 
              src={logo} 
              alt="F1 Lanka" 
              className="h-10 md:h-14 w-auto object-contain group-hover:scale-105 transition-transform"
            />
          </div>

          {/* Search Bar - Edgy Style */}
          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-black w-5 h-5 z-10" />
              <Input
                type="text"
                placeholder="SEARCH ARCHIVE..."
                className="pl-12 w-full h-12 bg-gray-100 border-2 border-black rounded-none font-bold uppercase tracking-widest focus:ring-0 focus:border-red-600 transition-colors"
                onChange={(e) => onSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Cart Button */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <Button 
              variant="outline" 
              className="relative h-12 w-12 border-2 border-black rounded-none hover:bg-black hover:text-white transition-colors"
              onClick={onCartClick}
            >
              <ShoppingCart className="w-6 h-6" />
              {totalItems > 0 && (
                <Badge className="absolute -top-3 -right-3 h-7 w-7 flex items-center justify-center p-0 bg-red-600 text-white border-2 border-black rounded-none text-xs font-black">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Navigation - Bold Uppercase */}
        <nav className="border-t-2 border-black overflow-x-auto no-scrollbar">
          <ul className="flex items-center justify-start md:justify-center py-4 text-sm whitespace-nowrap gap-8 min-w-max">
            <li>
              <a 
                href="#" 
                className="font-black text-black uppercase tracking-[0.15em] hover:text-red-600 hover:line-through transition-all"
                onClick={(e) => { 
                  e.preventDefault(); 
                  onTeamSelectorClick();
                }}
              >
                Teams
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="font-black text-black uppercase tracking-[0.15em] hover:text-red-600 hover:line-through transition-all"
                onClick={(e) => handleGenderClick(e, 'men')}
              >
                Men
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="font-black text-black uppercase tracking-[0.15em] hover:text-red-600 hover:line-through transition-all"
                onClick={(e) => handleGenderClick(e, 'women')}
              >
                Women
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="font-black text-black uppercase tracking-[0.15em] hover:text-red-600 hover:line-through transition-all"
                onClick={(e) => handleCategoryClick(e, 'Caps & Hats')}
              >
                Headwear
              </a>
            </li>
            <li>
              <a 
                href="#" 
                className="font-black text-black uppercase tracking-[0.15em] hover:text-red-600 hover:line-through transition-all"
                onClick={(e) => handleCategoryClick(e, 'Accessories')}
              >
                Accessories
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}