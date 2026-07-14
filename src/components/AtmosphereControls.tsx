import { CloudRain, Moon } from 'lucide-react';

interface AtmosphereControlsProps {
  rainMode: boolean;
  nightMode: boolean;
  onRainToggle: () => void;
  onNightToggle: () => void;
}

export const AtmosphereControls = ({
  rainMode,
  nightMode,
  onRainToggle,
  onNightToggle,
}: AtmosphereControlsProps) => {
  return (
    <div className="fixed top-8 right-8 z-30 flex flex-col gap-3">
      <button
        onClick={onRainToggle}
        className={`w-14 h-14 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          rainMode
            ? 'bg-blue-500/90 text-white shadow-lg shadow-blue-500/50'
            : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800/70 border border-slate-700/50'
        }`}
        title="Toggle Rain"
      >
        <CloudRain className="w-6 h-6" />
      </button>

      <button
        onClick={onNightToggle}
        className={`w-14 h-14 rounded-full backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 ${
          nightMode
            ? 'bg-indigo-600/90 text-white shadow-lg shadow-indigo-500/50'
            : 'bg-slate-900/70 text-slate-300 hover:bg-slate-800/70 border border-slate-700/50'
        }`}
        title="Toggle Night Mode"
      >
        <Moon className="w-6 h-6" />
      </button>
    </div>
  );
};
