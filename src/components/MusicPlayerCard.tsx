import { Play, Pause, SkipForward, SkipBack } from 'lucide-react';
import { Song } from '../data/songs';

interface MusicPlayerCardProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  progress: number;
  onProgressChange: (progress: number) => void;
}

export const MusicPlayerCard = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNextTrack,
  onPrevTrack,
  progress,
  onProgressChange,
}: MusicPlayerCardProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="backdrop-blur-xl bg-gradient-to-br from-slate-900/80 via-slate-800/80 to-slate-900/80 rounded-2xl border border-slate-700/50 p-6 shadow-2xl">
      <div className="mb-6 h-40 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-xl border border-slate-700/50 flex items-center justify-center overflow-hidden">
        <div className="text-center px-4">
          {currentSong ? (
            <>
              <div className="text-3xl font-bold text-blue-400 mb-2 truncate">{currentSong.title}</div>
              <div className="text-sm text-slate-400">{currentSong.artist}</div>
              <div className="text-xs text-slate-500 mt-2">{currentSong.year}</div>
            </>
          ) : (
            <div className="text-slate-500 text-sm">No song selected</div>
          )}
        </div>
      </div>

      <div className="mb-4">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => onProgressChange(parseInt(e.target.value))}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, rgb(59, 130, 246) 0%, rgb(59, 130, 246) ${progress}%, rgb(51, 65, 85) ${progress}%, rgb(51, 65, 85) 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-slate-500 mt-2">
          <span>{formatTime(progress)}</span>
          <span>{formatTime(180)}</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2">
        <button
          onClick={onPrevTrack}
          className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <SkipBack className="w-4 h-4" fill="currentColor" />
        </button>

        <button
          onClick={onPlayPause}
          className="flex-1 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white flex items-center justify-center shadow-lg shadow-blue-500/50 transition-all hover:scale-105 active:scale-95"
        >
          {isPlaying ? <Pause className="w-5 h-5" fill="white" /> : <Play className="w-5 h-5 ml-1" fill="white" />}
        </button>

        <button
          onClick={onNextTrack}
          className="w-10 h-10 rounded-full bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <SkipForward className="w-4 h-4" fill="currentColor" />
        </button>
      </div>
    </div>
  );
};
