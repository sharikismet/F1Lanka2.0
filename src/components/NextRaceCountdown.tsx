import { useState, useEffect } from 'react';

interface NextRaceCountdownProps {
  targetDate: string;
  raceName: string;
  bgImageUrl?: string;
}

export function NextRaceCountdown({ 
  targetDate, 
  raceName,
  // Default to a cool F1 starting grid or track background
  bgImageUrl = "https://images.unsplash.com/photo-1534489354145-31ba006bdf25?q=80&w=2070&auto=format&fit=crop"
}: NextRaceCountdownProps) {
  
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="relative w-full py-20 lg:py-28 overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${bgImageUrl})` }}
      />
      
      {/* Dark gradient overlay to make text pop and look moody */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/70 to-black/95" />

      <div className="relative container mx-auto px-4 z-10 flex flex-col items-center text-center">
        {/* Race Header */}
        <span className="text-[#FF2800] font-bold tracking-[0.3em] uppercase text-xs md:text-sm mb-3">
          Next Grand Prix
        </span>
        <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white uppercase italic tracking-tight mb-12 drop-shadow-lg">
          {raceName}
        </h2>

        {/* Timer Container */}
        <div className="flex items-center justify-center gap-3 sm:gap-6">
          {/* Days */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-20 sm:w-24 sm:h-28 bg-black/50 backdrop-blur-md border-t-4 border-[#FF2800] rounded-b-lg flex items-center justify-center shadow-2xl">
              <span className="text-3xl sm:text-5xl font-black text-white tabular-nums tracking-tighter">
                {formatNumber(timeLeft.days)}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 mt-3 uppercase tracking-widest">Days</span>
          </div>
          
          <span className="text-2xl sm:text-4xl font-black text-[#FF2800] -mt-8 opacity-70">:</span>

          {/* Hours */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-20 sm:w-24 sm:h-28 bg-black/50 backdrop-blur-md border-t-4 border-[#FF2800] rounded-b-lg flex items-center justify-center shadow-2xl">
              <span className="text-3xl sm:text-5xl font-black text-white tabular-nums tracking-tighter">
                {formatNumber(timeLeft.hours)}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 mt-3 uppercase tracking-widest">Hrs</span>
          </div>

          <span className="text-2xl sm:text-4xl font-black text-[#FF2800] -mt-8 opacity-70">:</span>

          {/* Minutes */}
          <div className="flex flex-col items-center">
            <div className="w-16 h-20 sm:w-24 sm:h-28 bg-black/50 backdrop-blur-md border-t-4 border-[#FF2800] rounded-b-lg flex items-center justify-center shadow-2xl">
              <span className="text-3xl sm:text-5xl font-black text-white tabular-nums tracking-tighter">
                {formatNumber(timeLeft.minutes)}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 mt-3 uppercase tracking-widest">Mins</span>
          </div>

          <span className="text-2xl sm:text-4xl font-black text-[#FF2800] -mt-8 opacity-70 mb-1 md:block hidden">:</span>

          {/* Seconds (Hidden on very small screens to prevent wrap, visible on md+) */}
          <div className="hidden md:flex flex-col items-center">
            <div className="w-16 h-20 sm:w-24 sm:h-28 bg-black/50 backdrop-blur-md border-t-4 border-[#FF2800] rounded-b-lg flex items-center justify-center shadow-2xl">
              <span className="text-3xl sm:text-5xl font-black text-white tabular-nums tracking-tighter">
                {formatNumber(timeLeft.seconds)}
              </span>
            </div>
            <span className="text-[10px] sm:text-xs font-bold text-gray-400 mt-3 uppercase tracking-widest">Secs</span>
          </div>
        </div>
      </div>
    </div>
  );
}