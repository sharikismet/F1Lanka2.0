import { useState, useEffect } from 'react';
import { Trophy, Flag, Clock, Calendar, MapPin, Loader2 } from 'lucide-react';

interface Driver {
  id: string;
  pos: number;
  name: string;
  team: string;
  number: string;
  points: number;
  time?: string; // For race results
}

interface Race {
  id: string;
  round: number;
  name: string;
  track: string;
  date: string;
  status: 'completed' | 'upcoming';
  results?: Driver[];
}

export function Leaderboard() {
  const [activeTab, setActiveTab] = useState<string>('champ');
  const [loading, setLoading] = useState(true);
  const [standings, setStandings] = useState<Driver[]>([]);
  const [schedule, setSchedule] = useState<Race[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch live 2026 data from Jolpica (Ergast compatible) API
    const fetchF1Data = async () => {
      try {
        setLoading(true);
        
        // 1. Fetch Current Championship Standings
        const standingsRes = await fetch('https://api.jolpi.ca/ergast/f1/2026/driverStandings.json');
        const standingsData = await standingsRes.json();
        
        const driversList = standingsData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings.map((d: any) => ({
          id: d.Driver.driverId,
          pos: parseInt(d.position),
          name: `${d.Driver.givenName} ${d.Driver.familyName}`,
          team: d.Constructors[0]?.name || 'Unknown',
          number: d.Driver.permanentNumber || '0',
          points: parseFloat(d.points),
        })) || [];
        
        setStandings(driversList);

        // 2. Fetch Full 2026 Schedule & Results
        const scheduleRes = await fetch('https://api.jolpi.ca/ergast/f1/2026/results.json?limit=1000');
        const scheduleData = await scheduleRes.json();
        const completedRaces = scheduleData.MRData.RaceTable.Races;

        // Fetch remaining schedule to get upcoming races
        const upcomingRes = await fetch('https://api.jolpi.ca/ergast/f1/2026.json');
        const upcomingData = await upcomingRes.json();
        const allRaces = upcomingData.MRData.RaceTable.Races;

        const formattedSchedule = allRaces.map((race: any) => {
          const completedData = completedRaces.find((cr: any) => cr.round === race.round);
          
          let results = undefined;
          if (completedData && completedData.Results) {
            results = completedData.Results.map((res: any) => ({
              id: res.Driver.driverId,
              pos: parseInt(res.position),
              name: `${res.Driver.givenName} ${res.Driver.familyName}`,
              team: res.Constructor.name,
              number: res.number,
              points: parseFloat(res.points),
              time: res.Time ? res.Time.time : res.status
            }));
          }

          // Determine if race is in the past based on current date
          const raceDate = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
          const isCompleted = raceDate < new Date();

          return {
            id: `round-${race.round}`,
            round: parseInt(race.round),
            name: race.raceName,
            track: race.Circuit.circuitName,
            date: raceDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            status: isCompleted ? 'completed' : 'upcoming',
            results: results
          };
        });

        setSchedule(formattedSchedule);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch F1 data:", err);
        setError("Failed to load live F1 data. Please try again later.");
        setLoading(false);
      }
    };

    fetchF1Data();
  }, []);

  // Helper to grab driver images (Fallback to F1 default silhouette if missing)
  const getDriverImage = (driverId: string) => {
    // You can map specific IDs to your own hosted images here if needed
    return `https://media.formula1.com/d_driver_fallback_image.png`;
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-[#0a0a0c] border border-white/10 rounded-sm flex flex-col items-center justify-center text-[#FF2800]">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest">Connecting to FIA Data Center...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-6 bg-[#0a0a0c] border border-red-900 rounded-sm text-center">
        <p className="font-mono text-sm text-red-500 uppercase">{error}</p>
      </div>
    );
  }

  const currentRace = schedule.find(r => r.id === activeTab);
  const displayData = activeTab === 'champ' ? standings : (currentRace?.results || []);

  return (
    <div className="w-full bg-[#0a0a0c] border border-white/10 rounded-sm overflow-hidden mb-12">
      {/* Header & Tabs */}
      <div className="bg-[#121216] border-b border-white/10">
        <div className="p-4 md:p-6 flex items-center gap-3 border-b border-white/5">
          <Trophy className="w-6 h-6 text-[#FF2800]" />
          <h2 className="text-xl md:text-2xl font-serif text-white uppercase tracking-wide">
            2026 Grid Standings
          </h2>
        </div>
        
        {/* Scrollable Tabs */}
        <div className="flex overflow-x-auto scrollbar-none">
          <button
            onClick={() => setActiveTab('champ')}
            className={`flex-shrink-0 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-colors border-b-2 ${
              activeTab === 'champ'
                ? 'border-[#FF2800] text-white bg-white/5'
                : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
            }`}
          >
            <div className="flex items-center gap-2 whitespace-nowrap">
              <Trophy className="w-3 h-3" />
              Championship
            </div>
          </button>

          {schedule.map((race) => (
            <button
              key={race.id}
              onClick={() => setActiveTab(race.id)}
              className={`flex-shrink-0 px-6 py-4 font-mono text-xs uppercase tracking-widest transition-colors border-b-2 ${
                activeTab === race.id
                  ? 'border-[#FF2800] text-white bg-white/5'
                  : 'border-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-2 whitespace-nowrap">
                {race.status === 'completed' ? <Flag className="w-3 h-3 text-white" /> : <Clock className="w-3 h-3" />}
                {race.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard List / Race Results */}
      <div className="p-4 md:p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
        
        {/* Race Meta Data */}
        {currentRace && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-gray-400 font-mono text-xs tracking-widest uppercase">
                <Calendar className="w-4 h-4 text-[#FF2800]" />
                {currentRace.date}
              </div>
              <div className="flex items-center gap-2 text-gray-400 font-mono text-xs tracking-widest uppercase">
                <MapPin className="w-4 h-4 text-[#FF2800]" />
                {currentRace.track}
              </div>
            </div>
          </div>
        )}

        {/* Notice for upcoming races */}
        {currentRace?.status === 'upcoming' ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Clock className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-mono text-sm uppercase tracking-widest">Race has not started yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Table Header */}
            <div className="flex items-center px-4 py-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest sticky top-0 bg-[#0a0a0c] z-10">
              <div className="w-12 text-center">Pos</div>
              <div className="flex-1 pl-4">Driver</div>
              {activeTab !== 'champ' && (
                <div className="hidden md:block w-32 text-right">Time/Gap</div>
              )}
              <div className="w-20 text-right">Pts</div>
            </div>

            {/* Drivers Loop */}
            {displayData.map((driver) => (
              <div 
                key={driver.id}
                className="flex items-center bg-[#121216] border border-white/5 rounded-sm p-3 hover:border-white/20 transition-colors"
              >
                {/* Position */}
                <div className="w-12 text-center font-mono text-lg font-bold text-gray-400">
                  {driver.pos}
                </div>

                {/* Driver Info & Image */}
                <div className="flex-1 flex items-center gap-4 pl-4 border-l border-white/5">
                  <div className={`hidden sm:block w-10 h-10 rounded-full overflow-hidden bg-black border-b-2 border-gray-700`}>
                    <img 
                      src={getDriverImage(driver.id)} 
                      alt={driver.name}
                      className="w-full h-full object-cover object-top opacity-80"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-white font-bold text-sm md:text-base uppercase tracking-wide">
                        {driver.name}
                      </h3>
                      <span className="text-[10px] font-mono text-gray-600">#{driver.number}</span>
                    </div>
                    <p className="text-gray-500 text-[10px] md:text-xs font-mono tracking-widest uppercase">
                      {driver.team}
                    </p>
                  </div>
                </div>

                {/* Time / Gap (Only for specific races, not championship) */}
                {activeTab !== 'champ' && driver.time && (
                  <div className="hidden md:block w-32 text-right font-mono text-xs text-gray-400 tracking-wider">
                    {driver.time}
                  </div>
                )}

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