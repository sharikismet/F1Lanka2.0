import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { Zap } from 'lucide-react';

const F1_TEAMS = [
  { name: 'Red Bull', value: 'red-bull', color: '#0600EF', logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/red-bull-racing-logo.png.transform/2col/image.png' },
  { name: 'Ferrari', value: 'ferrari', color: '#DC0000', logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/ferrari-logo.png.transform/2col/image.png' },
  { name: 'Mercedes', value: 'mercedes', color: '#00D2BE', logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mercedes-logo.png.transform/2col/image.png' },
  { name: 'McLaren', value: 'mclaren', color: '#FF8700', logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/mclaren-logo.png.transform/2col/image.png' },
  { name: 'Aston Martin', value: 'aston-martin', color: '#006F62', logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/aston-martin-logo.png.transform/2col/image.png' },
  { name: 'Alpine', value: 'alpine', color: '#0090FF', logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/alpine-logo.png.transform/2col/image.png' },
  { name: 'Williams', value: 'williams', color: '#005AFF', logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/williams-logo.png.transform/2col/image.png' },
  { name: 'AlphaTauri', value: 'alphatauri', color: '#2B4562', logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/rb-logo.png.transform/2col/image.png' },
  { name: 'Alfa Romeo', value: 'alfa-romeo', color: '#900000', logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/kick-sauber-logo.png.transform/2col/image.png' },
  { name: 'Haas', value: 'haas', color: '#B6BABD', logo: 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/2024/haas-f1-team-logo.png.transform/2col/image.png' },
];

interface ShopByTeamScrollProps {
  onTeamSelect: (team: string) => void;
}

export function ShopByTeamScroll({ onTeamSelect }: ShopByTeamScrollProps) {
  const navigate = useNavigate();
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const scrollContainer = trackRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;
    let currentScroll = scrollContainer.scrollLeft;

    const scrollLoop = () => {
      currentScroll += 1;
      scrollContainer.scrollLeft = currentScroll;

      const singleBlockWidth = scrollContainer.scrollWidth / 4;

      if (currentScroll >= singleBlockWidth) {
        currentScroll -= singleBlockWidth;
        scrollContainer.scrollLeft = currentScroll;
      }

      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    animationFrameId = requestAnimationFrame(scrollLoop);

    const pauseScroll = () => cancelAnimationFrame(animationFrameId);
    
    const resumeScroll = () => {
      currentScroll = scrollContainer.scrollLeft;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = requestAnimationFrame(scrollLoop);
    };

    scrollContainer.addEventListener('mouseenter', pauseScroll);
    scrollContainer.addEventListener('mouseleave', resumeScroll);
    scrollContainer.addEventListener('touchstart', pauseScroll, { passive: true });
    scrollContainer.addEventListener('touchend', resumeScroll);

    return () => {
      cancelAnimationFrame(animationFrameId);
      scrollContainer.removeEventListener('mouseenter', pauseScroll);
      scrollContainer.removeEventListener('mouseleave', resumeScroll);
      scrollContainer.removeEventListener('touchstart', pauseScroll);
      scrollContainer.removeEventListener('touchend', resumeScroll);
    };
  }, []);

  return (
    <section className="relative py-16 bg-[#0a0a0c] bg-carbon scanlines overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60rem] h-[20rem] rounded-full blur-3xl opacity-20"
             style={{ background: 'radial-gradient(closest-side, #FF2800, transparent)' }} />
      </div>

      <div className="relative container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 text-[#FF2800]" />
            <div>
              <div className="text-[11px] tracking-[0.35em] text-[#FF2800] font-racing uppercase">// Garage Select</div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white uppercase tracking-wide">
                Shop by Team
              </h2>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs font-racing tracking-widest text-white/40 uppercase">
            <span className="inline-block w-2 h-2 rounded-full bg-[#FF2800] neon-pulse" />
            Live Feed
          </div>
        </div>

        <div className="relative w-full overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-r from-[#0a0a0c] to-transparent" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none bg-gradient-to-l from-[#0a0a0c] to-transparent" />

          <div 
            ref={trackRef}
            className="flex overflow-x-auto scrollbar-none w-full"
            style={{ WebkitOverflowScrolling: 'touch' }}
          >
            {[1, 2, 3, 4].map((setIndex) => (
              <div key={setIndex} className="flex gap-6 md:gap-8 pr-6 md:pr-8 py-6 px-4 flex-shrink-0">
                {F1_TEAMS.map((team, i) => (
                  <button
                    key={`${setIndex}-${team.value}-${i}`}
                    onClick={() => {
                      onTeamSelect(team.value);
                      navigate(`/shop?team=${encodeURIComponent(team.name)}`);
                      window.scrollTo(0, 0); 
                    }}
                    className="group relative flex-shrink-0 flex flex-col items-center gap-3 cursor-pointer"
                  >
                    <div className="relative w-28 h-28 lg:w-32 lg:h-32">
                      <div
                        className="absolute inset-0 rounded-full animate-spin-slow opacity-80 group-hover:opacity-100"
                        style={{
                          background: `conic-gradient(from 0deg, ${team.color}, #FF2800 35%, transparent 50%, ${team.color} 75%, #FF2800)`,
                          padding: '3px',
                          maskImage: 'radial-gradient(circle, transparent 58%, #000 60%)',
                          WebkitMaskImage: 'radial-gradient(circle, transparent 58%, #000 60%)',
                        }}
                      />
                      <div
                        className="absolute inset-0 rounded-full blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500"
                        style={{ background: team.color }}
                      />
                      <div
                        className="relative w-full h-full rounded-full flex items-center justify-center border-2 bg-[#13131a] p-4 overflow-hidden transition-transform duration-500 group-hover:scale-110 group-hover:-translate-y-1"
                        style={{ borderColor: team.color, boxShadow: `inset 0 0 30px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)` }}
                      >
                        <img
                          src={team.logo}
                          alt={`${team.name} logo`}
                          className="w-full h-full object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `<span style="color:${team.color};font-family:sans-serif;font-weight:900;font-size:1.2rem;letter-spacing:.05em;">${team.name.split(' ').map(w => w[0]).join('')}</span>`;
                            }
                          }}
                        />
                      </div>
                    </div>
                    <span className="font-racing text-[11px] font-bold text-white/80 group-hover:text-[#FF2800] transition-colors text-center max-w-[120px] tracking-[0.2em] uppercase">
                      {team.name}
                    </span>
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        
        @keyframes simpleSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: simpleSpin 6s linear infinite;
        }

        .group:hover .animate-spin-slow {
          animation-duration: 2s;
        }
      `}</style>
    </section>
  );
}