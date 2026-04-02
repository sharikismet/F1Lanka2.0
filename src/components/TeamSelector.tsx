import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';

interface Team {
  name: string;
  color: string;
  logo: string;
}

interface TeamSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTeamSelect: (team: string) => void;
}

export function TeamSelector({ open, onOpenChange, onTeamSelect }: TeamSelectorProps) {
  const teams: Team[] = [
    {
      name: 'Red Bull Racing',
      color: 'from-blue-900 to-blue-700',
      logo: '🏎️',
    },
    {
      name: 'Ferrari',
      color: 'from-red-700 to-red-600',
      logo: '🐎',
    },
    {
      name: 'Mercedes',
      color: 'from-cyan-500 to-teal-600',
      logo: '⭐',
    },
    {
      name: 'McLaren',
      color: 'from-orange-500 to-orange-600',
      logo: '🧡',
    },
    {
      name: 'Aston Martin',
      color: 'from-green-700 to-green-600',
      logo: '💚',
    },
    {
      name: 'Alpine',
      color: 'from-pink-500 to-blue-500',
      logo: '🔷',
    },
    {
      name: 'Williams',
      color: 'from-blue-600 to-blue-500',
      logo: '🔵',
    },
    {
      name: 'Alfa Romeo',
      color: 'from-red-900 to-red-800',
      logo: '🐍',
    },
    {
      name: 'Haas',
      color: 'from-gray-200 to-red-600',
      logo: '⚪',
    },
    {
      name: 'AlphaTauri',
      color: 'from-blue-500 to-white',
      logo: '🤍',
    },
    {
      name: 'Audi',
      color: 'from-red-600 to-black',
      logo: '⚫',
    },
  ];

  const handleTeamClick = (teamName: string) => {
    onTeamSelect(teamName);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Shop by F1 Team</DialogTitle>
          <DialogDescription>
            Select your favorite Formula 1 team to view their merchandise
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-6">
          {teams.map((team) => (
            <button
              key={team.name}
              onClick={() => handleTeamClick(team.name)}
              className="group relative overflow-hidden rounded-lg border-2 border-transparent hover:border-red-600 transition-all duration-300 hover:scale-105"
            >
              <div className={`bg-gradient-to-br ${team.color} p-6 aspect-square flex flex-col items-center justify-center text-white`}>
                <div className="text-5xl mb-3">{team.logo}</div>
                <h3 className="font-bold text-center text-sm leading-tight">
                  {team.name}
                </h3>
              </div>
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600 text-center">
            💡 <strong>Tip:</strong> Click on any team to view their exclusive merchandise collection
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
