import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ChevronDown, Menu, X, ShoppingCart, Search } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useCart } from '../lib/CartContext';
import logo from 'figma:asset/30477617e4c72de57d223325aec5d70bfd5a6419.png';

const F1_TEAMS = [
  'Red Bull', 'Ferrari', 'Mercedes', 'McLaren', 'Aston Martin', 'Alpine', 'Williams', 'AlphaTauri', 'Alfa Romeo', 'Haas'
];

const CLOTHING_CATEGORIES = ['T-Shirts', 'Hoodies', 'Pants', 'Caps', 'Accessories'];
const GIFT_CATEGORIES = ['Keychains', 'Mugs', 'Posters', 'Stickers', 'Phone Cases'];
const COLLECTIBLE_CATEGORIES = ['Model Cars', 'Posters', 'Photo Cards', 'Decors', 'Keychains', 'Phone Cases'];

interface MegaMenuProps {
  onSearch: (query: string) => void;
  onCartClick: () => void;
  onCategorySelect: (category: string) => void;
  onGenderSelect: (gender: string) => void;
  onTeamSelect: (team: string) => void;
}

export function MegaMenu({ onSearch, onCartClick, onCategorySelect, onGenderSelect, onTeamSelect }: MegaMenuProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { items } = useCart();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
    }
    onSearch(searchQuery);
  };

  const navigateToShop = (params: { category?: string; gender?: string; team?: string }) => {
    const sp = new URLSearchParams();
    if (params.category) sp.set('category', params.category);
    if (params.gender && params.gender !== 'all') sp.set('gender', params.gender);
    if (params.team) sp.set('team', params.team);
    navigate(`/shop?${sp.toString()}`);
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  };

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16 lg:h-20 gap-4">
            <a href="/" className="flex items-center gap-3 flex-shrink-0">
              <img src={logo} alt="F1 Lanka" className="h-10 lg:h-12 w-auto object-contain" />
              <span className="hidden md:block text-sm text-gray-500 border-l border-gray-300 pl-3">
                Formula 1 Experience in Sri Lanka
              </span>
            </a>

            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    onSearch(e.target.value);
                  }}
                  className="w-full pl-10 bg-gray-50 border-gray-200 focus:border-[#FF2800] focus:ring-[#FF2800]"
                />
              </div>
            </form>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" onClick={onCartClick} className="relative hover:bg-gray-100">
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#FF2800] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartItemCount}
                  </span>
                )}
              </Button>

              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-6 h-6 text-gray-700" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 p-0">
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b">
                      <span className="font-bold text-lg">Menu</span>
                      <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                        <X className="w-5 h-5" />
                      </Button>
                    </div>
                    <div className="p-4 border-b">
                      <form onSubmit={handleSearch}>
                        <Input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full bg-gray-50"
                        />
                      </form>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      {[
                        { label: 'Shop By Team', key: 'teams', items: F1_TEAMS.map(t => ({ label: t, onClick: () => navigateToShop({ team: t }) })) },
                        { label: 'Men', key: 'men', items: CLOTHING_CATEGORIES.map(c => ({ label: c, onClick: () => navigateToShop({ category: c, gender: 'men' }) })) },
                        { label: 'Women', key: 'women', items: CLOTHING_CATEGORIES.map(c => ({ label: c, onClick: () => navigateToShop({ category: c, gender: 'women' }) })) },
                        { label: 'Kids', key: 'kids', items: CLOTHING_CATEGORIES.map(c => ({ label: c, onClick: () => navigateToShop({ category: c, gender: 'kids' }) })) },
                        { label: 'Gifts & Accessories', key: 'gifts', items: GIFT_CATEGORIES.map(c => ({ label: c, onClick: () => navigateToShop({ category: c }) })) },
                        { label: 'Collectibles', key: 'collectibles', items: COLLECTIBLE_CATEGORIES.map(c => ({ label: c, onClick: () => navigateToShop({ category: c }) })) },
                      ].map(section => (
                        <div key={section.key}>
                          <button
                            onClick={() => setActiveDropdown(activeDropdown === section.key ? null : section.key)}
                            className="w-full flex items-center justify-between py-2 font-medium text-gray-900"
                          >
                            {section.label}
                            <ChevronDown className={`w-4 h-4 transition-transform ${activeDropdown === section.key ? 'rotate-180' : ''}`} />
                          </button>
                          {activeDropdown === section.key && (
                            <div className="pl-4 pt-1 space-y-1">
                              {section.items.map(item => (
                                <button
                                  key={item.label}
                                  onClick={item.onClick}
                                  className="block w-full text-left py-2 text-sm text-gray-600 hover:text-[#FF2800]"
                                >
                                  {item.label}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-4">
          <nav className="hidden lg:flex items-center justify-between py-0">
            <NavDropdown label="Shop By Team" active={activeDropdown === 'teams'} onEnter={() => setActiveDropdown('teams')} onLeave={() => setActiveDropdown(null)}>
              <div className="grid grid-cols-2 gap-1 p-4 w-72">
                {F1_TEAMS.map(team => (
                  <button key={team} onClick={() => navigateToShop({ team })} className="text-left px-3 py-2 text-sm text-gray-700 hover:text-[#FF2800] hover:bg-gray-50 rounded transition-colors">
                    {team}
                  </button>
                ))}
              </div>
            </NavDropdown>

            <button onClick={() => navigateToShop({})} className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#FF2800] transition-colors">
              Shop By Driver
            </button>

            {/* Men */}
            <NavDropdown label="Men" active={activeDropdown === 'men'} onEnter={() => setActiveDropdown('men')} onLeave={() => setActiveDropdown(null)}>
              <div className="p-4 w-48 space-y-1">
                <button onClick={() => navigateToShop({ gender: 'men' })} className="w-full text-left px-3 py-2 text-sm font-medium text-[#FF2800] hover:bg-gray-50 rounded">
                  View All Men's
                </button>
                {CLOTHING_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => navigateToShop({ category: cat, gender: 'men' })} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#FF2800] hover:bg-gray-50 rounded transition-colors">
                    {cat}
                  </button>
                ))}
              </div>
            </NavDropdown>

            {/* Women */}
            <NavDropdown label="Women" active={activeDropdown === 'women'} onEnter={() => setActiveDropdown('women')} onLeave={() => setActiveDropdown(null)}>
              <div className="p-4 w-48 space-y-1">
                <button onClick={() => navigateToShop({ gender: 'women' })} className="w-full text-left px-3 py-2 text-sm font-medium text-[#FF2800] hover:bg-gray-50 rounded">
                  View All Women's
                </button>
                {CLOTHING_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => navigateToShop({ category: cat, gender: 'women' })} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#FF2800] hover:bg-gray-50 rounded transition-colors">
                    {cat}
                  </button>
                ))}
              </div>
            </NavDropdown>

            {/* Kids */}
            <NavDropdown label="Kids" active={activeDropdown === 'kids'} onEnter={() => setActiveDropdown('kids')} onLeave={() => setActiveDropdown(null)}>
              <div className="p-4 w-48 space-y-1">
                <button onClick={() => navigateToShop({ gender: 'kids' })} className="w-full text-left px-3 py-2 text-sm font-medium text-[#FF2800] hover:bg-gray-50 rounded">
                  View All Kids'
                </button>
                {CLOTHING_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => navigateToShop({ category: cat, gender: 'kids' })} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#FF2800] hover:bg-gray-50 rounded transition-colors">
                    {cat}
                  </button>
                ))}
              </div>
            </NavDropdown>

            <button onClick={() => navigateToShop({ category: 'Caps' })} className="px-4 py-3 text-sm font-medium text-gray-700 hover:text-[#FF2800] transition-colors">
              Headwear
            </button>

            {/* Gifts & Accessories */}
            <NavDropdown label="Gifts & Accessories" active={activeDropdown === 'gifts'} onEnter={() => setActiveDropdown('gifts')} onLeave={() => setActiveDropdown(null)}>
              <div className="p-4 w-48 space-y-1">
                {GIFT_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => navigateToShop({ category: cat })} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#FF2800] hover:bg-gray-50 rounded transition-colors">
                    {cat}
                  </button>
                ))}
              </div>
            </NavDropdown>

            {/* Collectibles */}
            <NavDropdown label="Collectibles" active={activeDropdown === 'collectibles'} onEnter={() => setActiveDropdown('collectibles')} onLeave={() => setActiveDropdown(null)}>
              <div className="p-4 w-48 space-y-1">
                {COLLECTIBLE_CATEGORIES.map(cat => (
                  <button key={cat} onClick={() => navigateToShop({ category: cat })} className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:text-[#FF2800] hover:bg-gray-50 rounded transition-colors">
                    {cat}
                  </button>
                ))}
              </div>
            </NavDropdown>
          </nav>
        </div>
      </div>
    </header>
  );
}

function NavDropdown({ label, active, onEnter, onLeave, children }: {
  label: string; active: boolean; onEnter: () => void; onLeave: () => void; children: React.ReactNode;
}) {
  return (
    <div className="relative" onMouseEnter={onEnter} onMouseLeave={onLeave}>
      <button className={`px-4 py-3 text-sm font-medium transition-colors flex items-center gap-1 ${active ? 'text-[#FF2800]' : 'text-gray-700 hover:text-[#FF2800]'}`}>
        {label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${active ? 'rotate-180' : ''}`} />
      </button>
      {active && (
        <div className="absolute left-0 top-full bg-white border border-gray-200 shadow-lg rounded-lg z-50">
          {children}
        </div>
      )}
    </div>
  );
}
