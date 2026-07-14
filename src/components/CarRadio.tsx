import { Play, Pause, SkipForward, Radio } from 'lucide-react';
import { City } from '../data/cities';
import { Song } from '../data/songs';

interface CarRadioProps {
  cities: City[];
  selectedCity: City;
  onCityChange: (city: City) => void;
  year: number;
  onYearChange: (year: number) => void;
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextTrack: () => void;
}

export const CarRadio = ({
  cities,
  selectedCity,
  onCityChange,
  year,
  onYearChange,
  currentSong,
  isPlaying,
  onPlayPause,
  onNextTrack,
}: CarRadioProps) => {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 w-full max-w-2xl px-4">
      <div
        className="backdrop-blur-xl bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90 rounded-3xl border-2 border-slate-700/50 shadow-2xl overflow-hidden"
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        }}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-red-500 animate-pulse" />
              <span className="text-red-500 text-xs font-bold tracking-wider uppercase">Live Radio</span>
            </div>
            <div className="text-amber-400 text-xs font-mono tracking-widest">
              FM {(88.1 + (year - 1990) * 0.1).toFixed(1)}
            </div>
          </div>

          <div className="mb-6 bg-black/60 rounded-lg p-4 border border-slate-700/50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-slate-500/10 to-transparent animate-scan" />

            <div className="relative">
              <div
                className="text-center text-amber-400 font-mono text-2xl tracking-wider mb-2 truncate"
                style={{ textShadow: '0 0 10px rgba(251, 191, 36, 0.5)' }}
              >
                {currentSong ? currentSong.title.toUpperCase() : 'TUNING...'}
              </div>
              <div className="text-center text-amber-300/70 font-mono text-sm tracking-wide">
                {currentSong ? currentSong.artist : '---'}
              </div>
            </div>
          </div>

          <div className="mb-5">
            <label className="block text-slate-300 text-xs font-semibold mb-2 uppercase tracking-wider">
              Destination
            </label>
            <div className="grid grid-cols-3 gap-2">
              {cities.map((city) => (
                <button
                  key={city.id}
                  onClick={() => onCityChange(city)}
                  className={`py-2 px-3 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    selectedCity.id === city.id
                      ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/50 scale-105'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50 hover:scale-102'
                  }`}
                >
                  {city.name}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <label className="text-slate-300 text-xs font-semibold uppercase tracking-wider">
                Time Travel
              </label>
              <span className="text-amber-400 font-mono text-lg font-bold">{year}</span>
            </div>
            <input
              type="range"
              min="1990"
              max="2024"
              step="1"
              value={year}
              onChange={(e) => onYearChange(parseInt(e.target.value))}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${
                  ((year - 1990) / (2024 - 1990)) * 100
                }%, rgb(51, 65, 85) ${((year - 1990) / (2024 - 1990)) * 100}%, rgb(51, 65, 85) 100%)`,
              }}
            />
            <div className="flex justify-between text-xs text-slate-400 mt-1">
              <span>1990s</span>
              <span>2000s</span>
              <span>Modern</span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onPlayPause}
              className="w-14 h-14 rounded-full bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white flex items-center justify-center shadow-lg shadow-red-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
            >
              {isPlaying ? <Pause className="w-6 h-6" fill="white" /> : <Play className="w-6 h-6 ml-1" fill="white" />}
            </button>

            <button
              onClick={onNextTrack}
              className="w-12 h-12 rounded-full bg-slate-700/70 hover:bg-slate-600/70 text-slate-300 hover:text-white flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95"
            >
              <SkipForward className="w-5 h-5" fill="currentColor" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
