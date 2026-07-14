import { useState } from 'react';
import { Home, Search, Heart, Plus, ListMusic, Compass, Music2, Clock } from 'lucide-react';

interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  playlists: Playlist[];
  onCreatePlaylist: (name: string) => void;
  onSelectPlaylist: (playlistId: string) => void;
  selectedPlaylistId: string | null;
  likedCount: number;
  onEnterDriveMode: () => void;
}

export const Sidebar = ({
  currentView,
  setCurrentView,
  playlists,
  onCreatePlaylist,
  onSelectPlaylist,
  selectedPlaylistId,
  likedCount,
  onEnterDriveMode,
}: SidebarProps) => {
  const [showAddInput, setShowAddInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName('');
      setShowAddInput(false);
    }
  };

  const navItemClass = (view: string) => {
    const isActive = currentView === view;
    return `w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 ${
      isActive
        ? 'bg-slate-100 border border-slate-200/50 text-[var(--theme-accent)] shadow-sm'
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent'
    }`;
  };

  return (
    <aside className="hidden md:flex w-60 h-full bg-white border-r border-slate-200/60 flex-col justify-between p-5 text-slate-700 select-none z-10 flex-shrink-0">
      
      <div className="flex flex-col gap-7 overflow-y-auto pr-1">
        {/* Brand logo (Shivammm) */}
        <div className="flex items-center gap-3.5 px-1 py-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[var(--theme-accent)] to-pink-500 flex items-center justify-center shadow-lg shadow-[var(--theme-accent)]/15 border border-white/10 flex-shrink-0">
            <Music2 className="w-4.5 h-4.5 text-white animate-pulse" />
          </div>
          <div className="min-w-0">
            <h1 className="text-slate-900 font-black tracking-tight text-base leading-none">
              Shivam<span className="text-[var(--theme-accent)]">mm</span>
            </h1>
            <span className="text-[9px] text-[var(--theme-accent)] font-extrabold tracking-widest uppercase block mt-1">Premium music</span>
          </div>
        </div>

        {/* 1. DISCOVER SECTION */}
        <div className="flex flex-col gap-2">
          <span className="px-3 text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">Discover</span>
          <nav className="flex flex-col gap-0.5">
            <button onClick={() => setCurrentView('home')} className={navItemClass('home')}>
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>
            <button onClick={() => setCurrentView('search')} className={navItemClass('search')}>
              <Search className="w-4 h-4" />
              <span>Search</span>
            </button>
            <button 
              onClick={onEnterDriveMode} 
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent transition-all duration-200"
            >
              <Compass className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
              <span>Zen Drive Mode</span>
            </button>
          </nav>
        </div>

        {/* 2. YOUR MUSIC SECTION */}
        <div className="flex flex-col gap-2">
          <span className="px-3 text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">Your Music</span>
          <nav className="flex flex-col gap-0.5">
            <button onClick={() => setCurrentView('liked')} className={navItemClass('liked')}>
              <Heart className={`w-4 h-4 ${currentView === 'liked' ? 'text-pink-600 fill-pink-500' : 'text-slate-500'}`} />
              <div className="flex items-center justify-between w-full">
                <span>Liked Songs</span>
                {likedCount > 0 && (
                  <span className="text-[10px] bg-pink-500/10 text-pink-600 px-2 py-0.5 rounded-full font-extrabold">
                    {likedCount}
                  </span>
                )}
              </div>
            </button>
            <button 
              onClick={() => {
                setCurrentView('home');
                setTimeout(() => {
                  const recentEl = document.getElementById('recently-played-section');
                  if (recentEl) recentEl.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }} 
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs text-slate-500 hover:bg-slate-50 hover:text-slate-900 border border-transparent transition-all duration-200"
            >
              <Clock className="w-4 h-4 text-slate-450" />
              <span>Recently Played</span>
            </button>
          </nav>
        </div>

        {/* 3. PLAYLISTS SECTION */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between px-3 text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
            <span>Playlists</span>
            <button
              onClick={() => setShowAddInput(!showAddInput)}
              className="p-1 hover:bg-slate-100 hover:text-slate-900 rounded transition-colors"
              title="Create Playlist"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          {showAddInput && (
            <form onSubmit={handleCreate} className="px-2 mt-1">
              <input
                type="text"
                autoFocus
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name..."
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-[var(--theme-accent)]"
              />
              <div className="flex justify-end gap-1.5 mt-2">
                <button
                  type="button"
                  onClick={() => setShowAddInput(false)}
                  className="px-2 py-1 text-[10px] text-slate-450 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-2 py-1 text-[10px] bg-[var(--theme-accent)] hover:opacity-90 text-white rounded font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          )}

          <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
            {playlists.length === 0 ? (
              <span className="text-[11px] text-slate-400 px-3 py-2 italic">No custom playlists</span>
            ) : (
              playlists.map((playlist) => {
                const isActive = currentView === 'playlist-detail' && selectedPlaylistId === playlist.id;
                return (
                  <button
                    key={playlist.id}
                    onClick={() => onSelectPlaylist(playlist.id)}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left truncate transition-colors ${
                      isActive
                        ? 'bg-slate-100 text-[var(--theme-accent)] font-bold border border-slate-200/50'
                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <ListMusic className={`w-3.5 h-3.5 flex-shrink-0 ${isActive ? 'text-[var(--theme-accent)]' : 'text-slate-400'}`} />
                    <span className="truncate">{playlist.name}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* Bottom disclaimer */}
      <div className="pt-4 border-t border-slate-100 text-[9px] text-slate-400 font-semibold tracking-wide">
        SHIVAMMM © 2026
      </div>
    </aside>
  );
};