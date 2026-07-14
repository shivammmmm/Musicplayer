import { Home, Search, Heart, Compass } from 'lucide-react';

interface MobileNavBarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  likedCount: number;
  onEnterDriveMode: () => void;
}

export const MobileNavBar = ({
  currentView,
  setCurrentView,
  likedCount,
  onEnterDriveMode,
}: MobileNavBarProps) => {
  return (
    <div className="fixed bottom-24 left-0 right-0 h-16 bg-white/90 backdrop-blur-xl border-t border-slate-200/60 flex items-center justify-around z-40 md:hidden shadow-lg select-none px-6">
      
      {/* Home Tab */}
      <button 
        onClick={() => setCurrentView('home')}
        className={`flex flex-col items-center gap-1 p-2 ${
          currentView === 'home' ? 'text-[var(--theme-accent)]' : 'text-slate-400'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[9px] font-bold">Home</span>
      </button>

      {/* Search Tab */}
      <button 
        onClick={() => setCurrentView('search')}
        className={`flex flex-col items-center gap-1 p-2 ${
          currentView === 'search' ? 'text-[var(--theme-accent)]' : 'text-slate-400'
        }`}
      >
        <Search className="w-5 h-5" />
        <span className="text-[9px] font-bold">Search</span>
      </button>

      {/* Liked Songs Tab */}
      <button 
        onClick={() => setCurrentView('liked')}
        className={`flex flex-col items-center gap-1 p-2 relative ${
          currentView === 'liked' ? 'text-[var(--theme-accent)]' : 'text-slate-400'
        }`}
      >
        <Heart className={`w-5 h-5 ${currentView === 'liked' ? 'fill-[var(--theme-accent)]' : ''}`} />
        <span className="text-[9px] font-bold">Liked</span>
        {likedCount > 0 && (
          <span className="absolute top-1 right-2 bg-pink-500 text-white text-[7px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white">
            {likedCount}
          </span>
        )}
      </button>

      {/* Zen Drive Tab */}
      <button 
        onClick={onEnterDriveMode}
        className="flex flex-col items-center gap-1 p-2 text-slate-400"
      >
        <Compass className="w-5 h-5 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
        <span className="text-[9px] font-bold">Zen Drive</span>
      </button>

    </div>
  );
};
