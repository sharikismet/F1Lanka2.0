import { useState, useEffect, useRef } from 'react';
import { Trophy, Flag, Clock, Calendar, MapPin, Loader2, ChevronDown } from 'lucide-react';

interface Driver {
  id: string;
  pos: number;
  name: string;
  acronym: string;
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
  // Season tracking state - supporting historical archives back to 2020
  const [selectedSeason, setSelectedSeason] = useState<string>('2026');
  const [activeTab, setActiveTab] = useState<string>('champ');
  const [loading, setLoading] = useState(true);
  const [standings, setStandings] = useState<Driver[]>([]);
  const [schedule, setSchedule] = useState<Race[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  // Navigation drag reference anchors
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Available seasons in dropdown menu selection
  const seasons = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Fetch Selected Season Championship Standings
        const standingsRes = await fetch(`https://api.jolpi.ca/ergast/f1/${selectedSeason}/driverStandings.json`);
        if (!standingsRes.ok) throw new Error('Standings telemetry drop.');
        const standingsData = await standingsRes.json();
        
        let driversList = standingsData.MRData.StandingsTable.StandingsLists[0]?.DriverStandings.map((d: any) => ({
          id: d.Driver.driverId,
          pos: parseInt(d.position),
          name: `${d.Driver.givenName} ${d.Driver.familyName}`,
          acronym: d.Driver.code || d.Driver.familyName.substring(0, 3).toUpperCase(),
          team: d.Constructors[0]?.name || 'Unknown',
          number: d.Driver.permanentNumber || d.Driver.driverId.substring(0,2),
          points: parseFloat(d.points),
        })) || [];

        // 2. Fetch Selected Season Schedule and Classifications
        const scheduleRes = await fetch(`https://api.jolpi.ca/ergast/f1/${selectedSeason}/results.json?limit=1000`);
        if (!scheduleRes.ok) throw new Error('Results stream drop.');
        const scheduleData = await scheduleRes.json();
        const completedRaces = scheduleData.MRData.RaceTable.Races;

        const calendarRes = await fetch(`https://api.jolpi.ca/ergast/f1/${selectedSeason}.json`);
        if (!calendarRes.ok) throw new Error('Calendar master index drop.');
        const calendarData = await calendarRes.json();
        const allRaces = calendarData.MRData.RaceTable.Races;

        const formattedSchedule = allRaces.map((race: any) => {
          const completedInfo = completedRaces.find((cr: any) => cr.round === race.round);
          
          let raceClassifications = undefined;

          // ====================================================================
          // EMERGENCY 2026 OVERRIDE:
          // The API is currently stuck on the Canadian GP.
          // Add your Monaco and Barcelona results here to force them onto your site!
          // ====================================================================
          if (selectedSeason === '2026' && !completedInfo) {
            
            // Example: Force Monaco (Round 6) to show up
            if (race.round === "6") { 
              /* UNCOMMENT AND FILL THIS OUT WHEN YOU WANT TO ADD MONACO
              raceClassifications = [
                { id: 'leclerc', pos: 1, name: 'Charles Leclerc', acronym: 'LEC', team: 'Ferrari', number: '16', points: 25, time: '2:23:15.554' },
                { id: 'piastri', pos: 2, name: 'Oscar Piastri', acronym: 'PIA', team: 'McLaren', number: '81', points: 18, time: '+7.152s' },
                // add the rest of the grid here...
              ];
              // Auto-inject these points into the Championship standings tab!
              driversList = driversList.map((d: Driver) => d.number === '16' ? { ...d, points: d.points + 25 } : d);
              driversList = driversList.map((d: Driver) => d.number === '81' ? { ...d, points: d.points + 18 } : d);
              */
            }

            // Example: Force Barcelona (Round 7) to show up
            if (race.round === "7") {
               // Add Barcelona results here in the exact same format as above
            }
          }

          if (completedInfo && completedInfo.Results) {
            raceClassifications = completedInfo.Results.map((res: any) => ({
              id: res.Driver.driverId,
              pos: parseInt(res.position),
              name: `${res.Driver.givenName} ${res.Driver.familyName}`,
              acronym: res.Driver.code || res.Driver.familyName.substring(0, 3).toUpperCase(),
              team: res.Constructor.name,
              number: res.number,
              points: parseFloat(res.points),
              time: res.Time ? res.Time.time : res.status
            }));
          }

          const raceDate = new Date(`${race.date}T${race.time || '00:00:00Z'}`);
          const isCompleted = raceDate < new Date() || raceClassifications !== undefined;

          return {
            id: `round-${race.round}`,
            round: parseInt(race.round),
            name: race.raceName.replace('Grand Prix', 'GP'),
            track: race.Circuit.circuitName,
            date: raceDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
            status: isCompleted ? 'completed' : 'upcoming',
            results: raceClassifications
          };
        });

        // Re-sort the Championship standings just in case your overrides altered the points
        driversList.sort((a: Driver, b: Driver) => b.points - a.points);
        driversList.forEach((d: Driver, i: number) => d.pos = i + 1);

        setStandings(driversList);
        setSchedule(formattedSchedule);
        
        // Reset active focusing context layout default tabs 
        const finishedRounds = formattedSchedule.filter((r: any) => r.status === 'completed' && r.results);
        if (finishedRounds.length > 0) {
          setActiveTab(finishedRounds[finishedRounds.length - 1].id);
        } else {
          setActiveTab('champ');
        }

        setLoading(false);
      } catch (err) {
        console.error("Telemetry context allocation fault:", err);
        setError("Historical database node unreadable.");
        setLoading(false);
      }
    };

    fetchSeasonData();
  }, [selectedSeason]);

  const handleImageError = (driverNumber: string) => {
    setImageErrors(prev => ({ ...prev, [driverNumber]: true }));
  };

  const getTeamColor = (teamName: string) => {
    const name = teamName.toLowerCase();
    if (name.includes('mercedes')) return '#00A19B';
    if (name.includes('ferrari')) return '#E80020';
    if (name.includes('red bull')) return '#3671C6';
    if (name.includes('mclaren')) return '#FF8700';
    if (name.includes('alpine')) return '#0093CC';
    if (name.includes('aston martin')) return '#229971';
    if (name.includes('williams')) return '#37BEDD';
    if (name.includes('sauber') || name.includes('kick') || name.includes('alfa romeo')) return '#52E252';
    if (name.includes('haas')) return '#B6BABD';
    if (name.includes('rb') || name.includes('alphatauri') || name.includes('toro rosso')) return '#6692FF';
    if (name.includes('renault')) return '#FFF500';
    if (name.includes('racing point') || name.includes('force india')) return '#F596C8';
    return '#505050';
  };

  // Drag interaction physics
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
    const walk = (x - startX.current) * 1.8; 
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  if (loading) {
    return (
      <div className="w-full h-64 bg-[#0a0a0c] border border-white/10 rounded-sm flex flex-col items-center justify-center text-[#FF2800]">
        <Loader2 className="w-8 h-8 animate-spin mb-4" />
        <p className="font-mono text-xs uppercase tracking-widest animate-pulse">Querying Historical Database Core...</p>
      </div>
    );
  }

  const currentRace = schedule.find(r => r.id === activeTab);
  const displayData = activeTab === 'champ' ? standings : (currentRace?.results || []);

  return (
    <div className="w-full bg-[#0a0a0c] border border-white/10 rounded-sm overflow-hidden mb-12">
      <div className="bg-[#121216] border-b border-white/10">
        <div className="p-4 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5">
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-[#FF2800]" />
            <h2 className="text-xl md:text-2xl font-serif text-white uppercase tracking-wide">
              Historical Statistics Grid
            </h2>
          </div>
          
          {/* SEASON SELECTOR DROPDOWN */}
          <div className="relative inline-block w-40">
            <select
              value={selectedSeason}
              onChange={(e) => setSelectedSeason(e.target.value)}
              className="w-full h-10 bg-[#0a0a0c] text-white border border-white/10 rounded-sm font-mono text-xs tracking-widest uppercase px-4 pr-10 appearance-none focus:outline-none focus:border-[#FF2800] transition-colors cursor-pointer"
            >
              {seasons.map(s => (
                <option key={s} value={s} className="bg-[#121216]">{s} Season</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
        
        {/* HORIZONTAL SWIPE MENU TABS */}
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
              Standings
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

      <div className="p-4 md:p-6 max-h-[620px] overflow-y-auto custom-scrollbar">
        {error && (
          <div className="p-4 mb-4 bg-red-950/20 border border-red-900 rounded-sm text-center font-mono text-xs text-red-500 uppercase">
            {error}
          </div>
        )}

        {currentRace && activeTab !== 'champ' && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-gray-400 font-mono text-xs tracking-widest uppercase">
                <Calendar className="w-3.5 h-3.5 text-[#FF2800]" />
                {currentRace.date}
              </div>
              <div className="flex items-center gap-2 text-gray-400 font-mono text-xs tracking-widest uppercase">
                <MapPin className="w-3.5 h-3.5 text-[#FF2800]" />
                {currentRace.track}
              </div>
            </div>
          </div>
        )}

        {currentRace?.status === 'upcoming' ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Clock className="w-10 h-10 mb-3 opacity-30 animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-widest">Grand Prix weekend upcoming</p>
          </div>
        ) : displayData.length === 0 && activeTab !== 'champ' ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500">
            <Loader2 className="w-10 h-10 mb-3 opacity-30 animate-spin text-[#FF2800]" />
            <p className="font-mono text-xs uppercase tracking-widest">Awaiting Verification Records</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            <div className="flex items-center px-4 py-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest sticky top-0 bg-[#0a0a0c] z-10">
              <div className="w-12 text-center">Pos</div>
              <div className="flex-1 pl-4">Driver</div>
              {activeTab !== 'champ' && (
                <div className="hidden md:block w-32 text-right">Time/Gap</div>
              )}
              <div className="w-20 text-right">Pts</div>
            </div>

            {displayData.map((driver) => {
              if (!driver) return null;
              const hasImageError = imageErrors[driver.number];
              const accentColor = getTeamColor(driver.team);

              return (
                <div 
                  key={driver.id + '-' + driver.number}
                  className="flex items-center bg-[#121216] border border-white/5 rounded-sm p-2.5 hover:border-white/20 transition-colors"
                >
                  <div className="w-12 text-center font-mono text-base font-bold text-gray-400">
                    {driver.pos}
                  </div>

                  <div className="flex-1 flex items-center gap-4 pl-4 border-l border-white/5">
                    
                    {!hasImageError ? (
                      <div 
                        className="w-11 h-11 rounded-full overflow-hidden bg-zinc-950 border-b-2"
                        style={{ borderColor: accentColor }}
                      >
                        <img 
                          src={`/drivers/${driver.number}.png`} 
                          alt={driver.name}
                          onError={() => handleImageError(driver.number)}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    ) : (
                      <div 
                        className="w-11 h-11 flex items-center justify-center font-mono text-xs font-bold rounded-full border-b-2 bg-zinc-900 text-zinc-300"
                        style={{ borderColor: accentColor }}
                      >
                        {driver.acronym}
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-sm uppercase tracking-wide">
                          {driver.name}
                        </h3>
                        <span className="text-[10px] font-mono text-zinc-600">#{driver.number}</span>
                      </div>
                      <p className="text-zinc-500 text-[10px] font-mono tracking-widest uppercase">
                        {driver.team}
                      </p>
                    </div>
                  </div>

                  {activeTab !== 'champ' && driver.time && (
                    <div className="hidden md:block w-32 text-right font-mono text-xs text-zinc-400 tracking-wider">
                      {driver.time}
                    </div>
                  )}

                  <div className="w-20 text-right">
                    <span className="bg-[#FF2800]/10 text-[#FF2800] px-2.5 py-1 rounded-sm font-mono text-xs font-bold border border-[#FF2800]/20">
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