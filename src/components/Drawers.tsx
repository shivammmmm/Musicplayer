import { X, Trash2, Music, Loader2, Volume2 } from 'lucide-react';
import { Song } from '../data/songs';

interface LyricsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentSong: Song | null;
  lyrics: string;
  loading: boolean;
}

export const LyricsDrawer = ({ isOpen, onClose, currentSong, lyrics, loading }: LyricsDrawerProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-24 w-full md:w-96 bg-white/95 backdrop-blur-2xl border-l border-slate-200/60 z-40 flex flex-col text-slate-800 shadow-2xl animate-slideLeft overflow-hidden">
      {/* Dynamic cover art backdrop blur */}
      {currentSong?.image && (
        <div 
          className="absolute inset-0 opacity-5 blur-3xl pointer-events-none scale-150 transition-all duration-700 z-0"
          style={{
            backgroundImage: `url(${currentSong.image})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        />
      )}

      {/* Header */}
      <div className="relative z-10 p-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <h3 className="text-sm font-black text-slate-900">Lyrics</h3>
          {currentSong && (
            <p className="text-[10px] text-[var(--theme-accent)] font-bold truncate max-w-[200px] mt-0.5">
              {currentSong.title}
            </p>
          )}
        </div>
        <button 
          onClick={onClose} 
          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 overflow-y-auto px-6 py-8 flex flex-col justify-start">
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin text-[var(--theme-accent)]" />
            <span className="text-xs">Fetching lyrics...</span>
          </div>
        ) : currentSong ? (
          <div className="whitespace-pre-line text-center text-sm md:text-base leading-loose font-bold text-slate-700 select-text font-sans max-w-xs mx-auto pb-10">
            {lyrics || "Lyrics not found for this track. Tune in and enjoy the vibes!"}
          </div>
        ) : (
          <div className="flex-grow flex flex-col items-center justify-center text-slate-400 text-xs">
            <span>No song playing</span>
          </div>
        )}
      </div>
    </div>
  );
};

interface QueueDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  queue: Song[];
  currentIndex: number;
  onPlayIndex: (index: number) => void;
  onRemoveIndex: (index: number) => void;
  onClearQueue: () => void;
}

export const QueueDrawer = ({
  isOpen,
  onClose,
  queue,
  currentIndex,
  onPlayIndex,
  onRemoveIndex,
  onClearQueue,
}: QueueDrawerProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed right-0 top-0 bottom-24 w-full md:w-96 bg-white/95 backdrop-blur-2xl border-l border-slate-200/60 z-40 flex flex-col text-slate-800 shadow-2xl animate-slideLeft overflow-hidden">
      
      {/* Header */}
      <div className="p-5 flex items-center justify-between border-b border-slate-100">
        <div>
          <h3 className="text-sm font-black text-slate-900">Play Queue</h3>
          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{queue.length} songs total</p>
        </div>
        
        <div className="flex items-center gap-1.5">
          {queue.length > 0 && (
            <button
              onClick={onClearQueue}
              className="px-2.5 py-1.5 hover:bg-red-50 text-slate-500 hover:text-red-500 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              title="Clear Queue"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
          <button 
            onClick={onClose} 
            className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Queue list */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {queue.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 gap-2">
            <Music className="w-8 h-8 text-slate-200" />
            <span className="text-xs">Queue is empty</span>
          </div>
        ) : (
          queue.map((song, idx) => {
            const isPlaying = idx === currentIndex;
            return (
              <div
                key={`${song.id}-${idx}`}
                className={`p-2.5 rounded-xl flex items-center justify-between border transition-all ${
                  isPlaying
                    ? 'bg-pink-50/50 border-pink-200 text-[var(--theme-accent)] shadow-sm'
                    : 'bg-slate-50/50 border-slate-200/50 hover:bg-slate-50 hover:border-slate-300'
                }`}
              >
                <button
                  onClick={() => onPlayIndex(idx)}
                  className="flex items-center gap-3 min-w-0 flex-1 text-left"
                >
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/50">
                    {song.image ? (
                      <img src={song.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Music className="w-5 h-5 text-slate-400" /></div>
                    )}
                    {isPlaying && (
                      <div className="absolute inset-0 bg-black/10 flex items-center justify-center">
                        <Volume2 className="w-4 h-4 text-[var(--theme-accent)] animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className={`text-xs font-bold truncate ${isPlaying ? 'text-[var(--theme-accent)] font-extrabold' : 'text-slate-800'}`}>
                      {song.title}
                    </h4>
                    <p className="text-[10px] text-slate-450 truncate mt-0.5">{song.artist}</p>
                  </div>
                </button>

                <div className="flex items-center gap-1">
                  {!isPlaying && (
                    <button
                      onClick={() => onRemoveIndex(idx)}
                      className="p-1.5 text-slate-400 hover:text-red-500 rounded-lg transition-colors"
                      title="Remove"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
