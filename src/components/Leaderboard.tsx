
import { useState } from 'react';
import { Trophy, Flag, Clock } from 'lucide-react';

// Mock Data: You can update this manually or fetch from an F1 API later
const DRIVERS = [
  { id: 'max', name: 'Max Verstappen', team: 'Red Bull Racing', points: 136, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/M/MAXVER01_Max_Verstappen/maxver01.png', teamColor: 'border-blue-600' },
  { id: 'checo', name: 'Sergio Perez', team: 'Red Bull Racing', points: 103, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/S/SERPER01_Sergio_Perez/serper01.png', teamColor: 'border-blue-600' },
  { id: 'charles', name: 'Charles Leclerc', team: 'Ferrari', points: 98, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CHALEC01_Charles_Leclerc/chalec01.png', teamColor: 'border-red-600' },
  { id: 'lando', name: 'Lando Norris', team: 'McLaren', points: 83, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/L/LANNOR01_Lando_Norris/lannor01.png', teamColor: 'border-orange-500' },
  { id: 'carlos', name: 'Carlos Sainz', team: 'Ferrari', points: 83, image: 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/C/CARSAI01_Carlos_Sainz/carsai01.png', teamColor: 'border-red-600' },
];

const RACES = [
  { id: 'champ', name: '2024 Championship', type: 'standing', status: 'live' },
  { id: 'bhr', name: 'Bahrain GP', type: 'race', status: 'completed' },
  { id: 'sau', name: 'Saudi Arabian GP', type: 'race', status: 'completed' },
  { id: 'aus', name: 'Australian GP', type: 'race', status: 'completed' },
  { id: 'jpn', name: 'Japanese GP', type: 'race', status: 'completed' },
  { id: 'mia', name: 'Miami GP', type: 'race', status: 'upcoming' },
  { id: 'emi', name: 'Emilia Romagna GP', type: 'race', status: 'upcoming' },
];

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState('champ');

  return (
    <div className="w-full bg-[#0a0a0c] border border-white/10 rounded-sm overflow-hidden">
      {/* Header & Tabs */}
      <div className="bg-[#121216] border-b border-white/10">
        <div className="p-4 md:p-6 flex items-center gap-3 border-b border-white/5">
          <Trophy className="w-6 h-6 text-[#FF2800]" />
          <h2 className="text-xl md:text-2xl font-serif text-white uppercase tracking-wide">
            Formula 1 Standings
          </h2>
        </div>
        
        {/* Scrollable Tabs */}
        <div className="flex overflow-x-auto scrollbar-none">
          {RACES.map((race) => (
            <button
              key={race.id}
              onClick={() => setActiveTab(race.id)}
              className={`flex-shrink-0 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-colors border-b-2 ${
                activeTab === race.id
                  ? 'border-[#FF2800] text-white bg-white/5'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2">
                {race.status === 'completed' && <Flag className="w-3 h-3" />}
                {race.status === 'upcoming' && <Clock className="w-3 h-3" />}
                {race.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List */}
      <div className="p-4 md:p-6">
        {/* Notice for upcoming races */}
        {RACES.find(r => r.id === activeTab)?.status === 'upcoming' ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Clock className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-mono text-sm uppercase tracking-widest">Race has not started yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table Header */}
            <div className="flex items-center px-4 py-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest">
              <div className="w-12 text-center">Pos</div>
              <div className="flex-1 pl-4">Driver</div>
              <div className="w-20 text-right">PTS</div>
            </div>

            {/* Drivers Loop */}
            {DRIVERS.map((driver, index) => (
              <div 
                key={driver.id}
                className="flex items-center bg-[#121216] border border-white/5 rounded-sm p-3 hover:border-white/20 transition-colors"
              >
                {/* Position */}
                <div className="w-12 text-center font-mono text-lg font-bold text-gray-400">
                  {index + 1}
                </div>

                {/* Driver Info & Image */}
                <div className="flex-1 flex items-center gap-4 pl-4 border-l border-white/5">
                  <div className={`w-12 h-12 rounded-full overflow-hidden bg-white/5 border-b-2 ${driver.teamColor}`}>
                    <img 
                      src={driver.image} 
                      alt={driver.name}
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm md:text-base uppercase tracking-wide">
                      {driver.name}
                    </h3>
                    <p className="text-gray-500 text-[10px] md:text-xs font-mono tracking-widest uppercase">
                      {driver.team}
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="w-20 text-right">
                  <span className="bg-[#FF2800]/10 text-[#FF2800] px-3 py-1.5 rounded-sm font-mono text-sm font-bold border border-[#FF2800]/20">
                    {driver.points}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}