import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { useRef } from 'react';
import { useNavigate } from 'react-router';

const F1_TEAMS = [
  { 
    name: 'Red Bull', 
    value: 'red-bull', 
    color: '#0600EF',
    logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/red-bull-racing-logo.png.transform/2col/image.png'
  },
  { 
    name: 'Ferrari', 
    value: 'ferrari', 
    color: '#DC0000',
    logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/ferrari-logo.png.transform/2col/image.png'
  },
  { 
    name: 'Mercedes', 
    value: 'mercedes', 
    color: '#00D2BE',
    logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mercedes-logo.png.transform/2col/image.png'
  },
  { 
    name: 'McLaren', 
    value: 'mclaren', 
    color: '#FF8700',
    logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mclaren-logo.png.transform/2col/image.png'
  },
  { 
    name: 'Aston Martin', 
    value: 'aston-martin', 
    color: '#006F62',
    logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/aston-martin-logo.png.transform/2col/image.png'
  },
  { 
    name: 'Alpine', 
    value: 'alpine', 
    color: '#0090FF',
    logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/alpine-logo.png.transform/2col/image.png'
  },
  { 
    name: 'Williams', 
    value: 'williams', 
    color: '#005AFF',
    logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/williams-logo.png.transform/2col/image.png'
  },
  { 
    name: 'AlphaTauri', 
    value: 'alphatauri', 
    color: '#2B4562',
    logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/rb-logo.png.transform/2col/image.png'
  },
  { 
    name: 'Alfa Romeo', 
    value: 'alfa-romeo', 
    color: '#900000',
    logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/kick-sauber-logo.png.transform/2col/image.png'
  },
  { 
    name: 'Haas', 
    value: 'haas', 
    color: '#B6BABD',
    logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/haas-f1-team-logo.png.transform/2col/image.png'
  },
];

interface ShopByTeamScrollProps {
  onTeamSelect: (team: string) => void;
}

export function ShopByTeamScroll({ onTeamSelect }: ShopByTeamScrollProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const newScrollLeft =
        scrollRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      scrollRef.current.scrollTo({ left: newScrollLeft, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900">Shop by Team</h2>
          <div className="hidden md:flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('left')}
              className="rounded-full border-gray-300 hover:border-[#FF2800] hover:text-[#FF2800]"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => scroll('right')}
              className="rounded-full border-gray-300 hover:border-[#FF2800] hover:text-[#FF2800]"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth pb-4"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {F1_TEAMS.map((team) => (
            <button
              key={team.value}
              onClick={() => {
                onTeamSelect(team.value);
                navigate(`/shop?team=${encodeURIComponent(team.name)}`);
              }}
              className="flex-shrink-0 flex flex-col items-center gap-3 group cursor-pointer"
            >
              <div className="relative">
                {/* Outer colorful ring */}
                <div
                  className="absolute inset-0 rounded-full blur-sm opacity-60 group-hover:opacity-100 transition-opacity"
                  style={{
                    background: `conic-gradient(from 0deg, ${team.color}, #FF2800, ${team.color})`,
                    padding: '4px',
                  }}
                />
                {/* Inner circle with logo */}
                <div
                  className="relative w-24 h-24 lg:w-28 lg:h-28 rounded-full flex items-center justify-center border-4 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-2xl bg-white p-3 overflow-hidden"
                  style={{
                    borderColor: team.color,
                  }}
                >
                  <img 
                    src={team.logo} 
                    alt={`${team.name} logo`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      // Fallback to team initials if logo fails to load
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.style.background = team.color === '#FFFFFF'
                          ? 'linear-gradient(135deg, #f0f0f0 0%, #e0e0e0 100%)'
                          : `linear-gradient(135deg, ${team.color} 0%, ${adjustColor(team.color, -20)} 100%)`;
                        parent.innerHTML = `<span class="font-black text-xl lg:text-2xl drop-shadow-2xl tracking-wider" style="color: ${team.color === '#FFFFFF' ? '#333' : '#fff'}; font-family: 'F1Black', 'Impact', sans-serif; text-shadow: ${team.color === '#FFFFFF' ? 'none' : '0 2px 8px rgba(0,0,0,0.5)'}">${team.name.split(' ').map(word => word[0]).join('')}</span>`;
                      }
                    }}
                  />
                </div>
              </div>
              <span
                className="text-sm font-bold text-gray-800 group-hover:text-[#FF2800] transition-colors text-center max-w-[100px] tracking-wide uppercase"
                style={{ fontFamily: '"F1Bold", "Arial Black", sans-serif' }}
              >
                {team.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}

// Helper function to darken colors
function adjustColor(color: string, amount: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}