import { useState, useEffect, useRef } from 'react';
import { Trophy, Flag, Clock, Calendar, MapPin, Loader2 } from 'lucide-react';

interface Driver {
  id: string; // OpenF1 uses driver_number as the primary ID
  pos: number;
  name: string;
  acronym: string;
  team: string;
  number: string;
  points: number; 
  color: string;
  time?: string;
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
  
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Refs for drag-to-scroll functionality
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const fetchHybridData = async () => {
      try {
        setLoading(true);
        
        // ====================================================================
        // 1. FETCH OPENF1 DATA (Colors, Acronyms, Live Schedule)
        // ====================================================================
        const sessionsRes = await fetch('https://api.openf1.org/v1/sessions?year=2026&session_type=Race');
        const sessionsData = await sessionsRes.json();
        
        const driversRes = await fetch('https://api.openf1.org/v1/drivers?session_key=latest');
        const openF1Drivers = await driversRes.json();

        // ====================================================================
        // 2. FETCH JOLPICA DATA (Points, Classifications, Times for 2026)
        // ====================================================================
        const standingsRes = await fetch('https://api.jolpi.ca/ergast/f1/2026/driverStandings.json');
        const standingsData = await standingsRes.json();
        
        const resultsRes = await fetch('https://api.jolpi.ca/ergast/f1/2026/results.json?limit=1000');
        const resultsData = await resultsRes.json();
        const completedRaces = resultsData.MRData.RaceTable.Races;

        // Map Championship Standings & Merge with OpenF1 Colors
        const championshipList = standingsData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings.map((d: any) => {
          const number = d.Driver.permanentNumber || '0';
          const f1Driver = openF1Drivers.find((of1: any) => of1.driver_number.toString() === number);
          
          return {
            id: number,
            pos: parseInt(d.position),
            name: `${d.Driver.givenName} ${d.Driver.familyName}`,
            acronym: f1Driver?.name_acronym || d.Driver.familyName.substring(0, 3).toUpperCase(),
            team: d.Constructors[0]?.name || 'Unknown',
            number: number,
            points: parseFloat(d.points),
            color: f1Driver?.team_colour ? `#${f1Driver.team_colour}` : '#505050'
          };
        }) || [];
        
        setStandings(championshipList);

        // Map Schedule & Race Results
        const formattedSchedule = sessionsData.map((session: any) => {
          // Find matching Jolpica results by matching the round/country
          const completedData = completedRaces.find((cr: any) => 
            cr.Circuit.circuitName.toLowerCase().includes(session.location.toLowerCase()) ||
            session.location.toLowerCase().includes(cr.Circuit.Location.country.toLowerCase())
          );
          
          let raceResults = undefined;
          if (completedData && completedData.Results) {
            raceResults = completedData.Results.map((res: any) => {
              const number = res.number;
              const f1Driver = openF1Drivers.find((of1: any) => of1.driver_number.toString() === number);
              
              return {
                id: number,
                pos: parseInt(res.position),
                name: `${res.Driver.givenName} ${res.Driver.familyName}`,
                acronym: f1Driver?.name_acronym || res.Driver.familyName.substring(0, 3).toUpperCase(),
                team: res.Constructor.name,
                number: number,
                points: parseFloat(res.points),
                color: f1Driver?.team_colour ? `#${f1Driver.team_colour}` : '#505050',
                time: res.Time ? res.Time.time : res.status
              };
            });
          }

          const raceDate = new Date(session.date_start);
          const isCompleted = raceDate < new Date();

          return {
            id: session.session_key.toString(),
            round: session.session_key,
            name: session.meeting_name || session.session_name,
            track: session.location || session.country_name,
            date: raceDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            status: isCompleted ? 'completed' : 'upcoming',
            results: raceResults
          };
        });

        // Sort schedule by date
        formattedSchedule.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
        setSchedule(formattedSchedule);
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch F1 data:", err);
        setError("Failed to load live F1 data. Please try again later.");
        setLoading(false);
      }
    };

    fetchHybridData();
  }, []);

  const handleImageError = (driverNumber: string) => {
    setImageErrors(prev => ({ ...prev, [driverNumber]: true }));
  };

  // Mouse Drag Events
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const onMouseLeave = () => { isDragging.current = false; };
  const onMouseUp = () => { isDragging.current = false; };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5; 
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-[#0a0a0c] border border-white/10 rounded-sm flex flex-col items-center justify-center text-[#FF2800]">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest">Connecting to OpenF1 Live Telemetry...</p>
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
      <div className="bg-[#121216] border-b border-white/10">
        <div className="p-4 md:p-6 flex items-center gap-3 border-b border-white/5">
          <Trophy className="w-6 h-6 text-[#FF2800]" />
          <h2 className="text-xl md:text-2xl font-serif text-white uppercase tracking-wide">
            2026 Grid Standings
          </h2>
        </div>
        
        {/* DRAG-TO-SCROLL CONTAINER */}
        <div 
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={onMouseLeave}
          onMouseUp={onMouseUp}
          onMouseMove={onMouseMove}
          className="flex overflow-x-auto custom-scrollbar pb-2 cursor-grab active:cursor-grabbing select-none"
        >
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

      <div className="p-4 md:p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
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

        {currentRace?.status === 'upcoming' ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Clock className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-mono text-sm uppercase tracking-widest">Race has not started yet</p>
          </div>
        ) : displayData.length === 0 && activeTab !== 'champ' ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-500">
            <Trophy className="w-12 h-12 mb-4 opacity-20" />
            <p className="font-mono text-sm uppercase tracking-widest">Awaiting Official OpenF1 Telemetry</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center px-4 py-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest sticky top-0 bg-[#0a0a0c] z-10">
              <div className="w-12 text-center">Pos</div>
              <div className="flex-1 pl-4">Driver</div>
              {activeTab !== 'champ' && (
                <div className="hidden md:block w-32 text-right">Time/Gap</div>
              )}
              <div className="w-20 text-right">Pts</div>
            </div>

            {displayData.map((driver) => {
              const hasImageError = imageErrors[driver.number];

              return (
                <div 
                  key={driver.id}
                  className="flex items-center bg-[#121216] border border-white/5 rounded-sm p-3 hover:border-white/20 transition-colors"
                >
                  <div className="w-12 text-center font-mono text-lg font-bold text-gray-400">
                    {driver.pos}
                  </div>

                  <div className="flex-1 flex items-center gap-4 pl-4 border-l border-white/5">
                    
                    {!hasImageError ? (
                      <div 
                        className="w-12 h-12 rounded-full overflow-hidden bg-black border-b-2"
                        style={{ borderColor: driver.color }}
                      >
                        {/* Loads from public/drivers/44.png, 16.png, etc. */}
                        <img 
                          src={`/drivers/${driver.number}.png`} 
                          alt={driver.name}
                          onError={() => handleImageError(driver.number)}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-12 h-12 flex items-center justify-center font-mono text-xs font-bold tracking-tighter rounded-full select-none shadow-sm border-b-2 text-white bg-zinc-800"
                        style={{ borderColor: driver.color }}
                      >
                        {driver.acronym}
                      </div>
                    )}

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

                  {activeTab !== 'champ' && driver.time && (
                    <div className="hidden md:block w-32 text-right font-mono text-xs text-gray-400 tracking-wider">
                      {driver.time}
                    </div>
                  )}

                  <div className="w-20 text-right">
                    <span className="bg-[#FF2800]/10 text-[#FF2800] px-3 py-1.5 rounded-sm font-mono text-sm font-bold border border-[#FF2800]/20">
                      {driver.points}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}