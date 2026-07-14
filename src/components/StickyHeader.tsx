import { Search, ChevronLeft, ChevronRight, Loader2, X, Music } from 'lucide-react';
import { Song } from '../data/songs';

interface StickyHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchLoading: boolean;
  suggestions: Song[];
  setSuggestions: (songs: Song[]) => void;
  onExecuteSearch: (query: string) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  onPlaySong: (song: Song, queueContext: Song[]) => void;
}

export const StickyHeader = ({
  searchQuery,
  setSearchQuery,
  searchLoading,
  suggestions,
  setSuggestions,
  onExecuteSearch,
  currentView,
  setCurrentView,
  onPlaySong,
}: StickyHeaderProps) => {

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onExecuteSearch(searchQuery);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestions([]);
  };

  return (
    <header className="h-20 bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      
      {/* LEFT: Navigation controls & Search capsule */}
      <div className="flex items-center gap-4 flex-1 max-w-xl">
        {/* Back / Forward Controls */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button 
            onClick={() => currentView !== 'home' && setCurrentView('home')}
            className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200/50 flex items-center justify-center text-slate-500 hover:text-slate-900 transition-colors hover:bg-slate-200"
            title="Go to Home"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            disabled 
            className="w-8 h-8 rounded-full bg-slate-100/50 border border-slate-200/20 flex items-center justify-center text-slate-350 cursor-not-allowed opacity-40"
            title="Forward"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Search Capsule */}
        <div className="relative flex-1">
          <div className="relative flex items-center group">
            <Search className="absolute left-4 w-4 h-4 text-slate-400 group-focus-within:text-[var(--theme-accent)] transition-colors pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (currentView !== 'search') setCurrentView('search');
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search songs, artists, genres..."
              className="w-full bg-slate-100/80 border border-slate-200/60 rounded-full pl-11 pr-10 py-2 text-sm text-slate-800 placeholder-slate-450 focus:outline-none focus:border-[var(--theme-accent)] focus:ring-1 focus:ring-[var(--theme-accent)] shadow-sm focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-12 p-1 text-slate-400 hover:text-slate-800 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onExecuteSearch(searchQuery)}
              disabled={searchLoading || searchQuery.trim().length < 3}
              className="absolute right-1.5 p-1.5 bg-[var(--theme-accent)] hover:opacity-90 text-white rounded-full transition-all hover:scale-105 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {searchLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Search className="w-3.5 h-3.5 text-white" />}
            </button>
          </div>

          {/* Autocomplete suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden z-30 animate-fadeIn">
              {suggestions.map((song) => (
                <button
                  key={song.id}
                  onClick={() => {
                    setSearchQuery(song.title);
                    onExecuteSearch(song.title);
                    onPlaySong(song, [song]);
                    setSuggestions([]);
                  }}
                  className="w-full text-left p-3 flex items-center gap-3.5 hover:bg-slate-50 transition-colors border-b border-slate-100 last:border-b-0"
                >
                  {song.image ? (
                    <img src={song.image} alt="" className="w-9 h-9 rounded-lg object-cover border border-slate-200/50 flex-shrink-0" />
                  ) : (
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center border border-slate-250 flex-shrink-0">
                      <Music className="w-4 h-4 text-slate-400" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <div className="text-slate-900 text-xs font-bold truncate">{song.title}</div>
                    <div className="text-slate-500 text-[10px] truncate mt-0.5">{song.artist}</div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Simplified Right Side: Empty or spacing as Go Premium, bells, profile deleted */}
      <div className="w-4" />

    </header>
  );
};
