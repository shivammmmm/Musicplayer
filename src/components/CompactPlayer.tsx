import { Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { Song } from '../data/songs';

interface CompactPlayerProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  progress: number;
  onProgressChange: (progress: number) => void; // 👈 Add this
}

export const CompactPlayer = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNextTrack,
  onPrevTrack,
  progress,
  onProgressChange, // 👈 Destructure this
}: CompactPlayerProps) => {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4">
      <div className="bg-black/75 backdrop-blur-xl border border-white/10 rounded-lg p-3 shadow-2xl flex items-center gap-3">
        
        {/* Album Art */}
        <div className="w-12 h-12 rounded-lg bg-gray-800 flex-shrink-0 overflow-hidden border border-white/10 relative">
          {currentSong?.image ? (
            <img 
              src={currentSong.image} 
              alt="Art" 
              className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse' : ''}`} 
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Music className="w-6 h-6 text-gray-500" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="text-white font-medium truncate text-sm">
            {currentSong?.title || "No Song Selected"}
          </div>
          <div className="text-gray-400 text-xs truncate">
            {currentSong?.artist || "Search to play"}
          </div>
          {/* Progress Bar (Seekable) */}
          <div className="w-full h-1 bg-gray-700 rounded-full mt-2 relative">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => onProgressChange(parseInt(e.target.value))}
              className="w-full h-full appearance-none cursor-pointer absolute top-0 left-0 bg-transparent"
              style={{
                // Custom background to show progress bar fill
                background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${progress}%, #4b5563 ${progress}%, #4b5563 100%)`,
                WebkitAppearance: 'none',
                height: '100%',
                borderRadius: '9999px',
                // Remove thumb visually, since we are using CSS utility for it
                // If the slider thumb style is defined in index.css, this will work.
              }}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-2">
          <button onClick={onPrevTrack} className="p-2 text-gray-400 hover:text-white">
            <SkipBack className="w-5 h-5" fill="currentColor" />
          </button>
          
          <button 
            onClick={onPlayPause}
            className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" fill="black" />
            ) : (
              <Play className="w-5 h-5 ml-1" fill="black" />
            )}
          </button>

          <button onClick={onNextTrack} className="p-2 text-gray-400 hover:text-white">
            <SkipForward className="w-5 h-5" fill="currentColor" />
          </button>
        </div>
      </div>
    </div>
  );
};
