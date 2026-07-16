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
  const [selectedSeason, setSelectedSeason] = useState<string>('2026');
  const [activeTab, setActiveTab] = useState<string>('champ');
  const [loading, setLoading] = useState(true);
  const [standings, setStandings] = useState<Driver[]>([]);
  const [schedule, setSchedule] = useState<Race[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const scrollRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const seasons = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];

  useEffect(() => {
    const fetchSeasonData = async () => {
      try {
        setLoading(true);
        setError(null);

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
          // JOLPICA API DELAY OVERRIDE
          // Points injection removed - relying purely on the live API standings
          // ====================================================================
          if (selectedSeason === '2026' && !completedInfo) {
            
            // Monaco Override (Round 6)
            if (race.round === "6") { 
              raceClassifications = [
                { id: 'antonelli', pos: 1, name: 'Kimi Antonelli', acronym: 'ANT', team: 'Mercedes', number: '12', points: 25, time: '2:23:31.243' },
                { id: 'hamilton', pos: 2, name: 'Lewis Hamilton', acronym: 'HAM', team: 'Ferrari', number: '44', points: 18, time: '+6.271s' },
                { id: 'gasly', pos: 3, name: 'Pierre Gasly', acronym: 'GAS', team: 'Alpine', number: '10', points: 15, time: '+20.369s' },
                { id: 'hadjar', pos: 4, name: 'Isack Hadjar', acronym: 'HAD', team: 'Red Bull Racing', number: '6', points: 12, time: '+23.394s' },
                { id: 'piastri', pos: 5, name: 'Oscar Piastri', acronym: 'PIA', team: 'McLaren', number: '81', points: 10, time: '+24.261s' },
                { id: 'lawson', pos: 6, name: 'Liam Lawson', acronym: 'LAW', team: 'Racing Bulls', number: '30', points: 8, time: '+26.553s' },
                { id: 'lindblad', pos: 7, name: 'Arvid Lindblad', acronym: 'LIN', team: 'Racing Bulls', number: '41', points: 6, time: '+29.010s' },
                { id: 'albon', pos: 8, name: 'Alexander Albon', acronym: 'ALB', team: 'Williams', number: '23', points: 4, time: '+33.413s' },
                { id: 'ocon', pos: 9, name: 'Esteban Ocon', acronym: 'OCO', team: 'Haas F1 Team', number: '31', points: 2, time: '+37.140s' },
                { id: 'alonso', pos: 10, name: 'Fernando Alonso', acronym: 'ALO', team: 'Aston Martin', number: '14', points: 1, time: '+41.899s' },
                { id: 'bortoleto', pos: 11, name: 'Gabriel Bortoleto', acronym: 'BOR', team: 'Audi', number: '5', points: 0, time: '+42.748s' },
                { id: 'russell', pos: 12, name: 'George Russell', acronym: 'RUS', team: 'Mercedes', number: '63', points: 0, time: '+43.353s' },
                { id: 'hulkenberg', pos: 13, name: 'Nico Hulkenberg', acronym: 'HUL', team: 'Audi', number: '27', points: 0, time: '+44.102s' },
                { id: 'colapinto', pos: 14, name: 'Franco Colapinto', acronym: 'COL', team: 'Alpine', number: '43', points: 0, time: '+48.964s' },
                { id: 'perez', pos: 15, name: 'Sergio Perez', acronym: 'PER', team: 'Cadillac', number: '11', points: 0, time: '+49.153s' },
                { id: 'sainz', pos: 16, name: 'Carlos Sainz', acronym: 'SAI', team: 'Williams', number: '55', points: 0, time: 'DNF' },
                { id: 'leclerc', pos: 17, name: 'Charles Leclerc', acronym: 'LEC', team: 'Ferrari', number: '16', points: 0, time: 'DNF' },
                { id: 'stroll', pos: 18, name: 'Lance Stroll', acronym: 'STR', team: 'Aston Martin', number: '18', points: 0, time: 'DNF' },
                { id: 'norris', pos: 19, name: 'Lando Norris', acronym: 'NOR', team: 'McLaren', number: '1', points: 0, time: 'DNF' },
                { id: 'bearman', pos: 20, name: 'Oliver Bearman', acronym: 'BEA', team: 'Haas F1 Team', number: '87', points: 0, time: 'DNF' },
                { id: 'bottas', pos: 21, name: 'Valtteri Bottas', acronym: 'BOT', team: 'Cadillac', number: '77', points: 0, time: 'DNF' },
                { id: 'verstappen', pos: 22, name: 'Max Verstappen', acronym: 'VER', team: 'Red Bull Racing', number: '3', points: 0, time: 'DNF' }
              ];
            }

            // Barcelona Override (Round 7)
            if (race.round === "7") { 
              raceClassifications = [
                { id: 'hamilton', pos: 1, name: 'Lewis Hamilton', acronym: 'HAM', team: 'Ferrari', number: '44', points: 25, time: '1:32:28.105' },
                { id: 'russell', pos: 2, name: 'George Russell', acronym: 'RUS', team: 'Mercedes', number: '63', points: 18, time: '+19.561s' },
                { id: 'norris', pos: 3, name: 'Lando Norris', acronym: 'NOR', team: 'McLaren', number: '1', points: 15, time: '+23.719s' },
                { id: 'verstappen', pos: 4, name: 'Max Verstappen', acronym: 'VER', team: 'Red Bull Racing', number: '3', points: 12, time: '+40.497s' },
                { id: 'piastri', pos: 5, name: 'Oscar Piastri', acronym: 'PIA', team: 'McLaren', number: '81', points: 10, time: '+58.661s' },
                { id: 'hadjar', pos: 6, name: 'Isack Hadjar', acronym: 'HAD', team: 'Red Bull Racing', number: '6', points: 8, time: '+1 lap' },
                { id: 'gasly', pos: 7, name: 'Pierre Gasly', acronym: 'GAS', team: 'Alpine', number: '10', points: 6, time: '+1 lap' },
                { id: 'lawson', pos: 8, name: 'Liam Lawson', acronym: 'LAW', team: 'Racing Bulls', number: '30', points: 4, time: '+1 lap' },
                { id: 'lindblad', pos: 9, name: 'Arvid Lindblad', acronym: 'LIN', team: 'Racing Bulls', number: '41', points: 2, time: '+1 lap' },
                { id: 'colapinto', pos: 10, name: 'Franco Colapinto', acronym: 'COL', team: 'Alpine', number: '43', points: 1, time: '+1 lap' },
                { id: 'bortoleto', pos: 11, name: 'Gabriel Bortoleto', acronym: 'BOR', team: 'Audi', number: '5', points: 0, time: '+2 laps' },
                { id: 'sainz', pos: 12, name: 'Carlos Sainz', acronym: 'SAI', team: 'Williams', number: '55', points: 0, time: '+2 laps' },
                { id: 'ocon', pos: 13, name: 'Esteban Ocon', acronym: 'OCO', team: 'Haas F1 Team', number: '31', points: 0, time: '+2 laps' },
                { id: 'perez', pos: 14, name: 'Sergio Perez', acronym: 'PER', team: 'Cadillac', number: '11', points: 0, time: '+3 laps' },
                { id: 'leclerc', pos: 15, name: 'Charles Leclerc', acronym: 'LEC', team: 'Ferrari', number: '16', points: 0, time: 'DNF' },
                { id: 'antonelli', pos: 16, name: 'Kimi Antonelli', acronym: 'ANT', team: 'Mercedes', number: '12', points: 0, time: 'DNF' },
                { id: 'bearman', pos: 17, name: 'Oliver Bearman', acronym: 'BEA', team: 'Haas F1 Team', number: '87', points: 0, time: 'DNF' },
                { id: 'albon', pos: 18, name: 'Alexander Albon', acronym: 'ALB', team: 'Williams', number: '23', points: 0, time: 'DNF' },
                { id: 'alonso', pos: 19, name: 'Fernando Alonso', acronym: 'ALO', team: 'Aston Martin', number: '14', points: 0, time: 'DNF' },
                { id: 'hulkenberg', pos: 20, name: 'Nico Hulkenberg', acronym: 'HUL', team: 'Audi', number: '27', points: 0, time: 'DNF' },
                { id: 'bottas', pos: 21, name: 'Valtteri Bottas', acronym: 'BOT', team: 'Cadillac', number: '77', points: 0, time: 'DNF' },
                { id: 'stroll', pos: 22, name: 'Lance Stroll', acronym: 'STR', team: 'Aston Martin', number: '18', points: 0, time: 'DNF' }
              ];
            }

            // Austria Override (Round 8)
            if (race.round === "8") { 
              raceClassifications = [
                { id: 'russell', pos: 1, name: 'George Russell', acronym: 'RUS', team: 'Mercedes', number: '63', points: 25, time: '1:26:37.979' },
                { id: 'verstappen', pos: 2, name: 'Max Verstappen', acronym: 'VER', team: 'Red Bull Racing', number: '3', points: 18, time: '+1.611s' },
                { id: 'antonelli', pos: 3, name: 'Kimi Antonelli', acronym: 'ANT', team: 'Mercedes', number: '12', points: 15, time: '+1.986s' },
                { id: 'piastri', pos: 4, name: 'Oscar Piastri', acronym: 'PIA', team: 'McLaren', number: '81', points: 12, time: '+21.809s' },
                { id: 'hamilton', pos: 5, name: 'Lewis Hamilton', acronym: 'HAM', team: 'Ferrari', number: '44', points: 10, time: '+26.393s' },
                { id: 'hadjar', pos: 6, name: 'Isack Hadjar', acronym: 'HAD', team: 'Red Bull Racing', number: '6', points: 8, time: '+29.399s' },
                { id: 'norris', pos: 7, name: 'Lando Norris', acronym: 'NOR', team: 'McLaren', number: '1', points: 6, time: '+31.505s' },
                { id: 'leclerc', pos: 8, name: 'Charles Leclerc', acronym: 'LEC', team: 'Ferrari', number: '16', points: 4, time: '+45.659s' },
                { id: 'lawson', pos: 9, name: 'Liam Lawson', acronym: 'LAW', team: 'Racing Bulls', number: '30', points: 2, time: '+1 lap' },
                { id: 'lindblad', pos: 10, name: 'Arvid Lindblad', acronym: 'LIN', team: 'Racing Bulls', number: '41', points: 1, time: '+1 lap' },
                { id: 'bortoleto', pos: 11, name: 'Gabriel Bortoleto', acronym: 'BOR', team: 'Audi', number: '5', points: 0, time: '+1 lap' },
                { id: 'hulkenberg', pos: 12, name: 'Nico Hulkenberg', acronym: 'HUL', team: 'Audi', number: '27', points: 0, time: '+1 lap' },
                { id: 'gasly', pos: 13, name: 'Pierre Gasly', acronym: 'GAS', team: 'Alpine', number: '10', points: 0, time: '+1 lap' },
                { id: 'bearman', pos: 14, name: 'Oliver Bearman', acronym: 'BEA', team: 'Haas F1 Team', number: '87', points: 0, time: '+1 lap' },
                { id: 'colapinto', pos: 15, name: 'Franco Colapinto', acronym: 'COL', team: 'Alpine', number: '43', points: 0, time: '+1 lap' },
                { id: 'ocon', pos: 16, name: 'Esteban Ocon', acronym: 'OCO', team: 'Haas F1 Team', number: '31', points: 0, time: '+2 laps' },
                { id: 'albon', pos: 17, name: 'Alexander Albon', acronym: 'ALB', team: 'Williams', number: '23', points: 0, time: '+2 laps' },
                { id: 'alonso', pos: 18, name: 'Fernando Alonso', acronym: 'ALO', team: 'Aston Martin', number: '14', points: 0, time: '+3 laps' },
                { id: 'stroll', pos: 19, name: 'Lance Stroll', acronym: 'STR', team: 'Aston Martin', number: '18', points: 0, time: 'DNF' },
                { id: 'sainz', pos: 20, name: 'Carlos Sainz', acronym: 'SAI', team: 'Williams', number: '55', points: 0, time: 'DNF' },
                { id: 'perez', pos: 21, name: 'Sergio Perez', acronym: 'PER', team: 'Cadillac', number: '11', points: 0, time: 'DNF' },
                { id: 'bottas', pos: 22, name: 'Valtteri Bottas', acronym: 'BOT', team: 'Cadillac', number: '77', points: 0, time: 'DNF' }
              ];
            }

            // British Override (Round 9)
            if (race.round === "9" || race.name.includes("British")) {
              raceClassifications = [
                { id: 'leclerc', pos: 1, name: 'Charles Leclerc', acronym: 'LEC', team: 'Ferrari', number: '16', points: 25, time: '1:27:11.335' },
                { id: 'russell', pos: 2, name: 'George Russell', acronym: 'RUS', team: 'Mercedes', number: '63', points: 18, time: '+0.427s' },
                { id: 'hamilton', pos: 3, name: 'Lewis Hamilton', acronym: 'HAM', team: 'Ferrari', number: '44', points: 15, time: '+0.772s' },
                { id: 'norris', pos: 4, name: 'Lando Norris', acronym: 'NOR', team: 'McLaren', number: '1', points: 12, time: '+1.149s' },
                { id: 'hadjar', pos: 5, name: 'Isack Hadjar', acronym: 'HAD', team: 'Red Bull Racing', number: '6', points: 10, time: '+1.598s' },
                { id: 'lawson', pos: 6, name: 'Liam Lawson', acronym: 'LAW', team: 'Racing Bulls', number: '30', points: 8, time: '+2.023s' },
                { id: 'lindblad', pos: 7, name: 'Arvid Lindblad', acronym: 'LIN', team: 'Racing Bulls', number: '41', points: 6, time: '+2.214s' },
                { id: 'bortoleto', pos: 8, name: 'Gabriel Bortoleto', acronym: 'BOR', team: 'Audi', number: '5', points: 4, time: '+2.413s' },
                { id: 'colapinto', pos: 9, name: 'Franco Colapinto', acronym: 'COL', team: 'Alpine', number: '43', points: 2, time: '+3.229s' },
                { id: 'gasly', pos: 10, name: 'Pierre Gasly', acronym: 'GAS', team: 'Alpine', number: '10', points: 1, time: '+3.445s' },
                { id: 'piastri', pos: 11, name: 'Oscar Piastri', acronym: 'PIA', team: 'McLaren', number: '81', points: 0, time: '+4.014s' },
                { id: 'bearman', pos: 12, name: 'Oliver Bearman', acronym: 'BEA', team: 'Haas F1 Team', number: '87', points: 0, time: '+5.245s' },
                { id: 'ocon', pos: 13, name: 'Esteban Ocon', acronym: 'OCO', team: 'Haas F1 Team', number: '31', points: 0, time: '+5.512s' },
                { id: 'perez', pos: 14, name: 'Sergio Perez', acronym: 'PER', team: 'Cadillac', number: '11', points: 0, time: '+7.403s' },
                { id: 'antonelli', pos: 15, name: 'Kimi Antonelli', acronym: 'ANT', team: 'Mercedes', number: '12', points: 0, time: '+8.005s' },
                { id: 'bottas', pos: 16, name: 'Valtteri Bottas', acronym: 'BOT', team: 'Cadillac', number: '77', points: 0, time: '+8.162s' },
                { id: 'sainz', pos: 17, name: 'Carlos Sainz', acronym: 'SAI', team: 'Williams', number: '55', points: 0, time: '+1 lap' },
                { id: 'alonso', pos: 18, name: 'Fernando Alonso', acronym: 'ALO', team: 'Aston Martin', number: '14', points: 0, time: '+1 lap' },
                { id: 'stroll', pos: 19, name: 'Lance Stroll', acronym: 'STR', team: 'Aston Martin', number: '18', points: 0, time: '+1 lap' },
                { id: 'verstappen', pos: 20, name: 'Max Verstappen', acronym: 'VER', team: 'Red Bull Racing', number: '3', points: 0, time: 'DNF' },
                { id: 'albon', pos: 21, name: 'Alexander Albon', acronym: 'ALB', team: 'Williams', number: '23', points: 0, time: 'DNF' },
                { id: 'hulkenberg', pos: 22, name: 'Nico Hulkenberg', acronym: 'HUL', team: 'Audi', number: '27', points: 0, time: 'DNF' }
              ];
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

        // Re-sort the Championship standings
        driversList.sort((a: Driver, b: Driver) => b.points - a.points);
        driversList.forEach((d: Driver, i: number) => d.pos = i + 1);

        setStandings(driversList);
        setSchedule(formattedSchedule);
        
        // Always default to Championship Scores on load
        setActiveTab('champ');

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
              CHAMPIONSHIP SCORES
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