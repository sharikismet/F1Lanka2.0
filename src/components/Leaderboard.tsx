import { useState, useEffect, useRef } from 'react';
import { Trophy, Flag, Clock, Calendar, MapPin, Loader2 } from 'lucide-react';

interface Driver {
  id: string;
  pos: number;
  name: string;
  team: string;
  number: string;
  points: number;
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

  // Scrolling interaction elements
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    const fetchF1Data = async () => {
      try {
        setLoading(true);

        // 1. Pull Championship Frame
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

        // 2. Pull Archived Results Stream
        const scheduleRes = await fetch('https://api.jolpi.ca/ergast/f1/2026/results.json?limit=1000');
        const scheduleData = await scheduleRes.json();
        const completedRaces = scheduleData.MRData.RaceTable.Races;

        // 3. Pull Master Calendar
        const upcomingRes = await fetch('https://api.jolpi.ca/ergast/f1/2026.json');
        const upcomingData = await upcomingRes.json();
        const allRaces = upcomingData.MRData.RaceTable.Races;

        const formattedSchedule = await Promise.all(allRaces.map(async (race: any) => {
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

          const raceDate = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
          const isCompleted = raceDate < new Date();

          // DUAL-STREAM FALLBACK: If the race time has passed but the verified API results 
          // are empty, fetch the real-time live classification timing feed instead of showing a blank board.
          if (isCompleted && !results) {
            try {
              const liveSessionRes = await fetch(`https://api.openf1.org/v1/sessions?year=2026&country_name=${encodeURIComponent(race.Circuit.Location.country)}&session_type=Race`);
              if (liveSessionRes.ok) {
                const liveSessionData = await liveSessionRes.json();
                if (liveSessionData.length > 0) {
                  const targetSessionKey = liveSessionData[0].session_key;
                  
                  // Fetch fast live classification positions
                  const positionsRes = await fetch(`https://api.openf1.org/v1/position?session_key=${targetSessionKey}`);
                  const driversRes = await fetch(`https://api.openf1.org/v1/drivers?session_key=${targetSessionKey}`);
                  
                  if (positionsRes.ok && driversRes.ok) {
                    const posData = await positionsRes.json();
                    const drvData = await driversRes.json();
                    
                    // Get latest position record per driver
                    const latestPositions: Record<string, number> = {};
                    posData.forEach((p: any) => {
                      latestPositions[p.driver_number] = p.position;
                    });

                    results = drvData.map((d: any) => {
                      const pos = latestPositions[d.driver_number] || 20;
                      return {
                        id: d.driver_number.toString(),
                        pos: pos,
                        name: d.full_name,
                        team: d.team_name,
                        number: d.driver_number.toString(),
                        points: pos === 1 ? 25 : pos === 2 ? 18 : pos === 3 ? 15 : pos === 4 ? 12 : pos === 5 ? 10 : pos === 6 ? 8 : pos === 7 ? 6 : pos === 8 ? 4 : pos === 9 ? 2 : pos === 10 ? 1 : 0,
                        time: 'Interval Live'
                      };
                    }).sort((a: any, b: any) => a.pos - b.pos);
                  }
                }
              }
            } catch (e) {
              console.warn("Live stream telemetry not ready yet:", e);
            }
          }

          return {
            id: `round-${race.round}`,
            round: parseInt(race.round),
            name: race.raceName.replace('Grand Prix', 'GP'),
            track: race.Circuit.circuitName,
            date: raceDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            status: isCompleted ? 'completed' : 'upcoming',
            results: results
          };
        }));

        setSchedule(formattedSchedule);

        // Snap active focus window to the latest finished race
        const completedRacesList = formattedSchedule.filter((r: any) => r.status === 'completed');
        if (completedRacesList.length > 0) {
          setActiveTab(completedRacesList[completedRacesList.length - 1].id);
        }

        setLoading(false);
      } catch (err) {
        console.error("Failed to parse cross-stream telemetry:", err);
        setError("Telemetry uplink interrupted. Please check connection filters.");
        setLoading(false);
      }
    };

    fetchF1Data();
  }, []);

  const handleImageError = (driverNumber: string) => {
    setImageErrors(prev => ({ ...prev, [driverNumber]: true }));
  };

  const getDriverCode = (fullName: string) => {
    const parts = fullName.trim().split(' ');
    const mainPart = parts[parts.length - 1]; 
    return mainPart ? mainPart.substring(0, 3).toUpperCase() : 'DRV';
  };

  const getTeamColorClass = (teamName: string) => {
    const name = teamName.toLowerCase();
    if (name.includes('mercedes')) return 'bg-[#00A19B] text-black border-[#00A19B]';
    if (name.includes('ferrari')) return 'bg-[#E80020] text-white border-[#E80020]';
    if (name.includes('red bull')) return 'bg-[#3671C6] text-white border-[#3671C6]';
    if (name.includes('mclaren')) return 'bg-[#FF8700] text-black border-[#FF8700]';
    if (name.includes('alpine')) return 'bg-[#0093CC] text-white border-[#0093CC]';
    if (name.includes('aston martin')) return 'bg-[#229971] text-white border-[#229971]';
    if (name.includes('williams')) return 'bg-[#37BEDD] text-white border-[#37BEDD]';
    if (name.includes('sauber') || name.includes('kick')) return 'bg-[#52E252] text-black border-[#52E252]';
    if (name.includes('haas')) return 'bg-[#B6BABD] text-black border-[#B6BABD]';
    if (name.includes('rb') || name.includes('racing bulls')) return 'bg-[#6692FF] text-white border-[#6692FF]';
    return 'bg-zinc-800 text-gray-300 border-zinc-600';
  };

  // Click & Grab Horizontal Scroll Engine
  const onMouseDown = (e: React.MouseEvent) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    startX.current = e.pageX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.6;
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-[#0a0a0c] border border-white/10 rounded-sm flex flex-col items-center justify-center text-[#FF2800]">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest animate-pulse">Syncing Telemetry Core Array...</p>
      </div>
    );
  }

  if (error && standings.length === 0) {
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
            2026 Grid Dashboard
          </h2>
        </div>
        
        <div 
          ref={scrollRef}
          onMouseDown={onMouseDown}
          onMouseLeave={() => { isDragging.current = false; }}
          onMouseUp={() => { isDragging.current = false; }}
          onMouseMove={onMouseMove}
          className="flex overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none"
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
              <div className="flex items-center gap-2 whitespace-nowrap pointer-events-none">
                {race.status === 'completed' ? <Flag className="w-3 h-3 text-[#FF2800]" /> : <Clock className="w-3 h-3" />}
                {race.name}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 md:p-6 max-h-[600px] overflow-y-auto custom-scrollbar">
        {currentRace && activeTab !== 'champ' && (
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
            <p className="font-mono text-sm uppercase tracking-widest">Awaiting Official Classifications</p>
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
              const teamStyles = getTeamColorClass(driver.team);

              return (
                <div 
                  key={driver.id + '-' + driver.number}
                  className="flex items-center bg-[#121216] border border-white/5 rounded-sm p-3 hover:border-white/20 transition-colors"
                >
                  <div className="w-12 text-center font-mono text-lg font-bold text-gray-400">
                    {driver.pos}
                  </div>

                  <div className="flex-1 flex items-center gap-4 pl-4 border-l border-white/5">
                    
                    {!hasImageError ? (
                      <div className={`w-12 h-12 rounded-full overflow-hidden bg-black border-b-2 ${teamStyles}`}>
                        <img 
                          src={`/drivers/${driver.number}.png`} 
                          alt={driver.name}
                          onError={() => handleImageError(driver.number)}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div className={`w-12 h-12 flex items-center justify-center font-mono text-xs font-bold tracking-tighter rounded-full select-none shadow-sm border-b-2 ${teamStyles}`}>
                        {getDriverCode(driver.name)}
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