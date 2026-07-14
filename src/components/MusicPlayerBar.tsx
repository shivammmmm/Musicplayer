import { 
  Play, Pause, SkipForward, SkipBack, Shuffle, Repeat, 
  Volume2, VolumeX, Heart, ListMusic, AlignLeft, Compass, Music, Download
} from 'lucide-react';
import { Song } from '../data/songs';

interface MusicPlayerBarProps {
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  progress: number; // Percentage (0-100)
  onProgressChange: (progress: number) => void;
  currentTime: number; // In seconds
  duration: number; // In seconds
  
  // Library
  isLiked: boolean;
  onToggleLike: () => void;
  
  // Audio state options
  volume: number;
  onVolumeChange: (volume: number) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  repeatMode: 'off' | 'all' | 'one';
  onToggleRepeat: () => void;
  shuffle: boolean;
  onToggleShuffle: () => void;
  
  // Drawer Toggles
  isLyricsOpen: boolean;
  onToggleLyrics: () => void;
  isQueueOpen: boolean;
  onToggleQueue: () => void;
  
  // Zen drive toggle
  onEnterDriveMode: () => void;
  
  // Download capability
  onDownloadSong: (song: Song) => void;
}

export const MusicPlayerBar = ({
  currentSong,
  isPlaying,
  onPlayPause,
  onNextTrack,
  onPrevTrack,
  progress,
  onProgressChange,
  currentTime,
  duration,
  isLiked,
  onToggleLike,
  volume,
  onVolumeChange,
  isMuted,
  onToggleMute,
  repeatMode,
  onToggleRepeat,
  shuffle,
  onToggleShuffle,
  isLyricsOpen,
  onToggleLyrics,
  isQueueOpen,
  onToggleQueue,
  onEnterDriveMode,
  onDownloadSong,
}: MusicPlayerBarProps) => {

  const formatTime = (timeInSecs: number) => {
    if (isNaN(timeInSecs)) return '0:00';
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 h-24 bg-white/90 backdrop-blur-2xl border-t border-slate-200/60 px-6 md:px-8 flex items-center justify-between z-50 select-none text-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
      
      {/* COLUMN 1: Song Information (Width responsive) */}
      <div className="flex items-center gap-3 w-1/2 sm:w-[28%] min-w-0">
        <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl overflow-hidden bg-slate-100 border border-slate-200/50 flex-shrink-0 flex items-center justify-center relative shadow-sm">
          {currentSong?.image ? (
            <img src={currentSong.image} alt="" className="w-full h-full object-cover" />
          ) : (
            <Music className="w-5 h-5 text-slate-400" />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="text-xs md:text-sm font-bold text-slate-900 truncate leading-snug select-text">
            {currentSong?.title || "Not Playing"}
          </h4>
          <p className="text-[10px] md:text-xs text-slate-450 truncate mt-0.5 select-text">
            {currentSong?.artist || "Shivammm"}
          </p>
        </div>
        
        {currentSong && (
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button 
              onClick={onToggleLike}
              className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors"
              title={isLiked ? "Unlike" : "Like"}
            >
              <Heart 
                className={`w-3.5 h-3.5 transition-all active:scale-125 ${
                  isLiked ? 'text-pink-600 fill-pink-600' : 'text-slate-450'
                }`} 
              />
            </button>
            <button 
              onClick={() => onDownloadSong(currentSong)}
              className="p-1.5 text-slate-400 hover:text-slate-800 transition-colors"
              title="Download playing song"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* COLUMN 2: Playback Controls & Progress bar */}
      <div className="flex flex-col items-center gap-2 w-2/5 sm:w-[44%] max-w-md">
        {/* Buttons Row */}
        <div className="flex items-center gap-4 md:gap-5">
          <button
            onClick={onToggleShuffle}
            className={`p-1 transition-colors ${shuffle ? 'text-[var(--theme-accent)]' : 'text-slate-400 hover:text-slate-700'}`}
            title="Shuffle"
          >
            <Shuffle className="w-3.5 h-3.5" />
          </button>
          
          <button
            onClick={onPrevTrack}
            disabled={!currentSong}
            className="p-1 text-slate-500 hover:text-slate-900 disabled:text-slate-200 disabled:cursor-not-allowed transition-colors"
            title="Previous"
          >
            <SkipBack className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={onPlayPause}
            disabled={!currentSong}
            className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-slate-900 hover:bg-slate-850 text-white flex items-center justify-center hover:scale-105 active:scale-95 disabled:bg-slate-100 disabled:text-slate-300 disabled:cursor-not-allowed transition-all shadow-sm"
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 fill-white text-white" />
            ) : (
              <Play className="w-4 h-4 fill-white text-white ml-0.5" />
            )}
          </button>

          <button
            onClick={onNextTrack}
            disabled={!currentSong}
            className="p-1 text-slate-500 hover:text-slate-900 disabled:text-slate-200 disabled:cursor-not-allowed transition-colors"
            title="Next"
          >
            <SkipForward className="w-4 h-4 fill-current" />
          </button>

          <button
            onClick={onToggleRepeat}
            className={`p-1 transition-colors relative ${
              repeatMode !== 'off' ? 'text-[var(--theme-accent)]' : 'text-slate-400 hover:text-slate-700'
            }`}
            title={`Repeat: ${repeatMode}`}
          >
            <Repeat className="w-3.5 h-3.5" />
            {repeatMode === 'one' && (
              <span className="absolute -top-0.5 -right-0.5 bg-[var(--theme-accent)] text-white text-[6px] font-black w-2.5 h-2.5 rounded-full flex items-center justify-center leading-none">
                1
              </span>
            )}
          </button>
        </div>

        {/* Progress Seek bar */}
        <div className="flex items-center gap-2 w-full text-[9px] text-slate-450 font-mono">
          <span>{formatTime(currentTime)}</span>
          <div className="flex-1 h-1 bg-slate-200/80 rounded-full relative group">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => onProgressChange(parseInt(e.target.value))}
              disabled={!currentSong}
              className="w-full h-full appearance-none cursor-pointer absolute top-0 left-0 bg-transparent disabled:cursor-not-allowed slider"
              style={{
                background: `linear-gradient(to right, var(--theme-accent) 0%, var(--theme-accent) ${progress}%, rgba(15,23,42,0.06) ${progress}%, rgba(15,23,42,0.06) 100%)`,
                WebkitAppearance: 'none',
                height: '100%',
                borderRadius: '9999px',
              }}
            />
          </div>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* COLUMN 3: Utility Controls (Hidden on narrow mobile screens) */}
      <div className="hidden sm:flex items-center justify-end gap-3 w-[28%] min-w-[150px]">
        {/* Zen Drive Toggle */}
        <button
          onClick={onEnterDriveMode}
          className="p-1.5 text-slate-400 hover:text-[var(--theme-accent)] hover:bg-slate-50 rounded-xl transition-all"
          title="Enter Zen Drive Mode"
        >
          <Compass className="w-4 h-4" />
        </button>

        {/* Lyrics drawer trigger */}
        <button
          onClick={onToggleLyrics}
          disabled={!currentSong}
          className={`p-1.5 rounded-xl hover:bg-slate-50 transition-all ${
            isLyricsOpen ? 'text-[var(--theme-accent)] font-bold bg-slate-50' : 'text-slate-400 hover:text-slate-800'
          }`}
          title="Lyrics"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        {/* Queue drawer trigger */}
        <button
          onClick={onToggleQueue}
          className={`p-1.5 rounded-xl hover:bg-slate-50 transition-all ${
            isQueueOpen ? 'text-[var(--theme-accent)] font-bold bg-slate-50' : 'text-slate-400 hover:text-slate-800'
          }`}
          title="Play Queue"
        >
          <ListMusic className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-200" />

        {/* Volume controls */}
        <div className="flex items-center gap-1.5">
          <button 
            onClick={onToggleMute}
            className="p-1 text-slate-450 hover:text-slate-800 transition-colors"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted || volume === 0 ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume * 100}
            onChange={(e) => onVolumeChange(parseInt(e.target.value) / 100)}
            className="w-14 h-1 bg-slate-200 rounded-full appearance-none cursor-pointer slider"
            style={{
              background: `linear-gradient(to right, var(--theme-accent) 0%, var(--theme-accent) ${isMuted ? 0 : volume * 100}%, rgba(15,23,42,0.06) ${isMuted ? 0 : volume * 100}%, rgba(15,23,42,0.06) 100%)`,
              WebkitAppearance: 'none',
            }}
          />
        </div>
      </div>

    </div>
  );
};
