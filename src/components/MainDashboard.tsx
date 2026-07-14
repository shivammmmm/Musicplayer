import { useState, useEffect, useRef } from 'react';
import { 
  Heart, Play, Plus, Trash2, Music, Loader2, FolderPlus, ListMusic,
  ChevronLeft, ChevronRight, Search, Download
} from 'lucide-react';
import { Song, songs as defaultSongs } from '../data/songs';

interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

interface MainDashboardProps {
  currentView: string;
  selectedPlaylistId: string | null;
  playlists: Playlist[];
  likedSongs: Song[];
  recentlyPlayed: Song[];
  onPlaySong: (song: Song, queueContext: Song[]) => void;
  onToggleLike: (song: Song) => void;
  isLiked: (songId: string) => boolean;
  onAddSongToPlaylist: (song: Song, playlistId: string) => void;
  onRemoveSongFromPlaylist: (songId: string, playlistId: string) => void;
  onDeletePlaylist: (playlistId: string) => void;
  onPlayPlaylist: (playlistId: string) => void;
  setCurrentView: (view: string) => void;
  currentSong: Song | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchLoading: boolean;
  searchResults: Song[];
  onExecuteSearch: (query: string) => void;
  onDownloadSong: (song: Song) => void;
}

// Carousel Scroll Row Helper Component
const ScrollRow = ({ title, children, id }: { title: string; children: React.ReactNode; id?: string }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 400;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id={id} className="flex flex-col gap-4 relative group/row">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-black tracking-tight text-slate-900">{title}</h3>
        <div className="flex items-center gap-1.5 opacity-0 group-hover/row:opacity-100 transition-opacity duration-300">
          <button 
            onClick={() => scroll('left')}
            className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button 
            onClick={() => scroll('right')}
            className="w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div 
        ref={scrollRef}
        className="flex gap-5 overflow-x-auto no-scrollbar scroll-smooth pb-2"
      >
        {children}
      </div>
    </section>
  );
};

export const MainDashboard = ({
  currentView,
  selectedPlaylistId,
  playlists,
  likedSongs,
  recentlyPlayed,
  onPlaySong,
  onToggleLike,
  isLiked,
  onAddSongToPlaylist,
  onRemoveSongFromPlaylist,
  onDeletePlaylist,
  onPlayPlaylist,
  setCurrentView,
  currentSong,
  searchQuery,
  setSearchQuery,
  searchLoading,
  searchResults,
  onExecuteSearch,
  onDownloadSong,
}: MainDashboardProps) => {

  const [activeDropdownSongId, setActiveDropdownSongId] = useState<string | null>(null);
  const [showHeroDropdown, setShowHeroDropdown] = useState(false);

  // Active playlist for Detail View
  const activePlaylist = playlists.find(p => p.id === selectedPlaylistId);

  // Focus cleanup for click outside playlist selection menus
  useEffect(() => {
    const handleOutsideClick = () => {
      setActiveDropdownSongId(null);
      setShowHeroDropdown(false);
    };
    window.addEventListener('click', handleOutsideClick);
    return () => window.removeEventListener('click', handleOutsideClick);
  }, []);

  // Determine the song to present in the immersive Hero banner
  const heroSong = currentSong || defaultSongs[0];

  const handleHeroPlay = () => {
    if (heroSong) {
      onPlaySong(heroSong, defaultSongs);
    }
  };

  const handleGenreClick = (genre: string) => {
    setSearchQuery(genre);
    setCurrentView('search');
    onExecuteSearch(genre);
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-gradient-to-b from-slate-50/20 via-white to-white px-6 md:px-8 py-8 text-slate-800 font-sans pb-40">
      
      {/* 1. HOME VIEW */}
      {currentView === 'home' && (
        <div className="flex flex-col gap-9 animate-fadeIn">
          
          {/* IMMERSIVE 340px HERO BANNER - LIGHT MODE MATCH */}
          <div className="relative rounded-3xl h-[340px] overflow-hidden border border-slate-200/80 shadow-lg flex items-center px-6 md:px-10 z-10 group/hero bg-white">
            
            {/* Blurred Backdrop of Artwork */}
            {heroSong?.image ? (
              <div 
                className="absolute inset-0 bg-cover bg-center opacity-10 filter blur-3xl scale-110 pointer-events-none transition-all duration-700 z-0"
                style={{ backgroundImage: `url(${heroSong.image})` }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-tr from-[var(--theme-accent)]/5 via-transparent to-transparent pointer-events-none z-0" />
            )}

            {/* Backdrop Light Gradients */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent z-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/60 via-transparent to-transparent z-0" />

            {/* Hero Main Flex Row */}
            <div className="relative z-10 flex items-center gap-6 md:gap-8 w-full">
              
              {/* Artwork Box */}
              <div className="w-36 h-36 md:w-56 md:h-56 rounded-2xl overflow-hidden shadow-xl bg-slate-100 border border-slate-200/80 flex-shrink-0 relative group">
                {heroSong?.image ? (
                  <img src={heroSong.image} alt={heroSong.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center"><Music className="w-16 h-16 text-slate-400" /></div>
                )}
              </div>

              {/* Album/Track Info */}
              <div className="flex flex-col gap-3 max-w-xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 text-[var(--theme-accent)] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                    {currentSong ? "Now Playing" : "Featured Pick"}
                  </span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Released {heroSong?.year || 2024}</span>
                </div>
                
                <h2 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight leading-none truncate select-text">
                  {heroSong?.title || "Welcome"}
                </h2>
                <p className="text-slate-500 text-xs md:text-sm font-semibold leading-relaxed truncate select-text">
                  By {heroSong?.artist || "Shivammm"}
                </p>

                {/* Hero Actions */}
                <div className="flex items-center gap-3 mt-2">
                  <button 
                    onClick={handleHeroPlay}
                    className="px-5 py-2.5 bg-[var(--theme-accent)] text-white hover:opacity-90 rounded-full font-bold text-xs hover:scale-105 active:scale-95 transition-all shadow-md flex items-center gap-2"
                  >
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Play Now</span>
                  </button>

                  {heroSong && (
                    <button 
                      onClick={() => onToggleLike(heroSong)}
                      className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all hover:scale-105 active:scale-95 ${
                        isLiked(heroSong.id)
                          ? 'bg-pink-50 border-pink-200 text-pink-600 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-400 hover:text-slate-800'
                      }`}
                      title={isLiked(heroSong.id) ? "Remove from Library" : "Save to Library"}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isLiked(heroSong.id) ? 'fill-current' : ''}`} />
                    </button>
                  )}

                  {/* Download Song Button */}
                  {heroSong && (
                    <button 
                      onClick={() => onDownloadSong(heroSong)}
                      className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                      title="Download Track"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {/* Add to Playlist trigger */}
                  {heroSong && (
                    <div className="relative">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          setShowHeroDropdown(!showHeroDropdown);
                        }}
                        className="w-10 h-10 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-slate-800 flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                        title="Add to Playlist"
                      >
                        <Plus className="w-4 h-4" />
                      </button>

                      {showHeroDropdown && (
                        <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-2xl shadow-xl py-1.5 z-20 animate-fadeIn">
                          <div className="px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                            Save Track to Playlist
                          </div>
                          {playlists.length === 0 ? (
                            <div className="px-3 py-2 text-xs text-slate-400 italic">No playlists created</div>
                          ) : (
                            playlists.map((p) => (
                              <button
                                key={p.id}
                                onClick={() => onAddSongToPlaylist(heroSong, p.id)}
                                className="w-full text-left px-3 py-2.5 text-xs text-slate-700 hover:bg-slate-50 hover:text-[var(--theme-accent)] transition-colors truncate"
                              >
                                {p.name}
                              </button>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* CONTINUE LISTENING */}
          <ScrollRow title="Continue Listening">
            {(recentlyPlayed.length > 0 ? recentlyPlayed : defaultSongs.slice(0, 8)).map((song) => (
              <div 
                key={song.id}
                className="w-40 md:w-44 flex-shrink-0 bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md group relative"
              >
                <div className="w-full aspect-square rounded-xl bg-slate-50 overflow-hidden relative border border-slate-100 flex-shrink-0">
                  {song.image ? (
                    <img src={song.image} alt={song.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Music className="w-10 h-10 text-slate-300" /></div>
                  )}
                  <button 
                    onClick={() => onPlaySong(song, recentlyPlayed.length > 0 ? recentlyPlayed : defaultSongs)}
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                  >
                    <div className="w-10 h-10 bg-[var(--theme-accent)] hover:opacity-90 rounded-full flex items-center justify-center text-white shadow-lg scale-90 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </button>
                </div>
                <div className="min-w-0 px-0.5">
                  <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{song.title}</h4>
                  <p className="text-[10px] text-slate-450 truncate mt-1">{song.artist}</p>
                </div>
              </div>
            ))}
          </ScrollRow>

          {/* MADE FOR YOU */}
          <ScrollRow title="Made for You">
            {defaultSongs.slice().reverse().map((song) => (
              <div 
                key={song.id}
                className="w-40 md:w-44 flex-shrink-0 bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md group relative"
              >
                <div className="w-full aspect-square rounded-xl bg-slate-50 overflow-hidden relative border border-slate-100 flex-shrink-0">
                  {song.image ? (
                    <img src={song.image} alt={song.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Music className="w-10 h-10 text-slate-300" /></div>
                  )}
                  <button 
                    onClick={() => onPlaySong(song, defaultSongs)}
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                  >
                    <div className="w-10 h-10 bg-[var(--theme-accent)] hover:opacity-90 rounded-full flex items-center justify-center text-white shadow-lg scale-90 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </button>
                </div>
                <div className="min-w-0 px-0.5">
                  <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{song.title}</h4>
                  <p className="text-[10px] text-slate-450 truncate mt-1">{song.artist}</p>
                </div>
              </div>
            ))}
          </ScrollRow>

          {/* YOUR TIME MACHINE (Era editorial cards styled light) */}
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-black tracking-tight text-slate-900">Your Time Machine</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { name: "90s Retro Mix", desc: "Golden decade of retro Indian beats", era: "90s", gradient: "from-pink-500/10 via-pink-100/30 to-white border-pink-200" },
                { name: "2000s Pop Hits", desc: "Nostalgic melodies and chartbusters", era: "2000s", gradient: "from-teal-500/10 via-teal-100/30 to-white border-teal-200" },
                { name: "Modern Chartbusters", desc: "The biggest dynamic releases today", era: "modern", gradient: "from-amber-500/10 via-amber-100/30 to-white border-amber-200" }
              ].map((item, idx) => (
                <div 
                  key={idx}
                  className={`p-6 rounded-2xl bg-gradient-to-br ${item.gradient} border flex flex-col justify-between h-44 relative group overflow-hidden shadow-sm`}
                >
                  <div className="relative z-10">
                    <span className="text-[9px] bg-slate-900/5 text-slate-600 px-2 py-0.5 rounded-md font-bold uppercase tracking-wider">Editorial Mix</span>
                    <h4 className="text-lg font-black text-slate-800 mt-3">{item.name}</h4>
                    <p className="text-[11px] text-slate-450 mt-1 max-w-[210px]">{item.desc}</p>
                  </div>
                  
                  <button 
                    onClick={() => {
                      const eraSongs = defaultSongs.filter(s => s.era === item.era);
                      if (eraSongs.length > 0) onPlaySong(eraSongs[0], eraSongs);
                    }}
                    className="relative z-10 w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform mt-4 self-start"
                  >
                    <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* TRENDING NEAR YOU */}
          <ScrollRow title="Trending Near You">
            {defaultSongs.slice(2, 10).map((song) => (
              <div 
                key={song.id}
                className="w-40 md:w-44 flex-shrink-0 bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md group relative"
              >
                <div className="w-full aspect-square rounded-xl bg-slate-50 overflow-hidden relative border border-slate-100 flex-shrink-0">
                  {song.image ? (
                    <img src={song.image} alt={song.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Music className="w-10 h-10 text-slate-300" /></div>
                  )}
                  <button 
                    onClick={() => onPlaySong(song, defaultSongs)}
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                  >
                    <div className="w-10 h-10 bg-[var(--theme-accent)] hover:opacity-90 rounded-full flex items-center justify-center text-white shadow-lg scale-90 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </button>
                </div>
                <div className="min-w-0 px-0.5">
                  <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{song.title}</h4>
                  <p className="text-[10px] text-slate-450 truncate mt-1">{song.artist}</p>
                </div>
              </div>
            ))}
          </ScrollRow>

          {/* MOOD & ACTIVITY */}
          <section className="flex flex-col gap-4">
            <h3 className="text-lg font-black tracking-tight text-slate-900">Mood and Activity</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: 'Monsoon Rain Vibe', query: 'Monsoon Rain', color: 'from-blue-500/10 via-slate-50 to-white border-blue-200' },
                { name: 'Lo-Fi Chill & Code', query: 'Lofi Chill', color: 'from-pink-500/10 via-slate-50 to-white border-pink-200' },
                { name: 'High-Energy Gym', query: 'Gym Workout', color: 'from-red-500/10 via-slate-50 to-white border-red-200' },
                { name: 'Devotional Peace', query: 'Devotional', color: 'from-amber-500/10 via-slate-50 to-white border-amber-200' },
              ].map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleGenreClick(item.query)}
                  className={`p-5 rounded-2xl bg-gradient-to-br ${item.color} border text-left hover:scale-[1.03] active:scale-98 transition-all relative overflow-hidden shadow-sm`}
                >
                  <span className="text-[9px] text-slate-400 font-extrabold uppercase tracking-wider">Mood Radio</span>
                  <h4 className="text-xs font-bold text-slate-800 mt-1 leading-snug">{item.name}</h4>
                </button>
              ))}
            </div>
          </section>

          {/* NEW RELEASES */}
          <ScrollRow title="New Releases">
            {defaultSongs.filter(s => s.year >= 2018).map((song) => (
              <div 
                key={song.id}
                className="w-40 md:w-44 flex-shrink-0 bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md group relative"
              >
                <div className="w-full aspect-square rounded-xl bg-slate-50 overflow-hidden relative border border-slate-100 flex-shrink-0">
                  {song.image ? (
                    <img src={song.image} alt={song.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center"><Music className="w-10 h-10 text-slate-300" /></div>
                  )}
                  <button 
                    onClick={() => onPlaySong(song, defaultSongs)}
                    className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                  >
                    <div className="w-10 h-10 bg-[var(--theme-accent)] hover:opacity-90 rounded-full flex items-center justify-center text-white shadow-lg scale-90 group-hover:scale-100 transition-all duration-300">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </button>
                </div>
                <div className="min-w-0 px-0.5">
                  <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{song.title}</h4>
                  <p className="text-[10px] text-slate-450 truncate mt-1">{song.artist}</p>
                </div>
              </div>
            ))}
          </ScrollRow>

          {/* POPULAR ARTISTS */}
          <ScrollRow title="Popular Artists">
            {[
              { name: 'Arijit Singh', query: 'Arijit Singh', img: 'https://c.saavncdn.com/artists/Arijit_Singh_004_20241118063717_500x500.jpg' },
              { name: 'A.R. Rahman', query: 'A.R. Rahman', img: 'https://c.saavncdn.com/artists/AR_Rahman_002_20210120084455_500x500.jpg' },
              { name: 'Shreya Ghoshal', query: 'Shreya Ghoshal', img: 'https://c.saavncdn.com/artists/Shreya_Ghoshal_007_20241101074144_500x500.jpg' },
              { name: 'K.K.', query: 'KK', img: 'https://c.saavncdn.com/artists/KK_500x500.jpg' },
              { name: 'Diljit Dosanjh', query: 'Diljit Dosanjh', img: 'https://c.saavncdn.com/artists/Diljit_Dosanjh_005_20231025073054_500x500.jpg' },
              { name: 'Dua Lipa', query: 'Dua Lipa', img: 'https://c.saavncdn.com/artists/Dua_Lipa_004_20231120090922_500x500.jpg' },
              { name: 'The Weeknd', query: 'The Weeknd', img: 'https://c.saavncdn.com/artists/The_Weeknd_150x150.jpg' },
            ].map((item, idx) => (
              <div 
                key={idx}
                className="w-32 md:w-36 flex-shrink-0 flex flex-col items-center gap-3 hover:-translate-y-1 transition-all duration-300 group"
              >
                <button
                  onClick={() => handleGenreClick(item.query)}
                  className="w-24 h-24 md:w-28 md:h-28 rounded-full overflow-hidden bg-slate-50 border border-slate-200/60 flex items-center justify-center relative shadow-md"
                >
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white fill-white animate-pulse" />
                  </div>
                </button>
                <span className="text-xs font-bold text-slate-700 text-center truncate w-full group-hover:text-[var(--theme-accent)] transition-colors">{item.name}</span>
              </div>
            ))}
          </ScrollRow>

          {/* RECENTLY PLAYED */}
          {recentlyPlayed.length > 0 && (
            <ScrollRow title="Recently Played" id="recently-played-section">
              {recentlyPlayed.map((song) => (
                <div 
                  key={song.id}
                  className="w-40 md:w-44 flex-shrink-0 bg-white border border-slate-200/60 p-3 rounded-2xl flex flex-col gap-3 hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md group relative"
                >
                  <div className="w-full aspect-square rounded-xl bg-slate-50 overflow-hidden relative border border-slate-100 flex-shrink-0">
                    {song.image ? (
                      <img src={song.image} alt={song.title} className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Music className="w-10 h-10 text-slate-300" /></div>
                    )}
                    <button 
                      onClick={() => onPlaySong(song, recentlyPlayed)}
                      className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                    >
                      <div className="w-10 h-10 bg-[var(--theme-accent)] hover:opacity-90 rounded-full flex items-center justify-center text-white shadow-lg scale-90 group-hover:scale-100 transition-all duration-300">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                      </div>
                    </button>
                  </div>
                  <div className="min-w-0 px-0.5">
                    <h4 className="text-xs font-bold text-slate-800 truncate leading-snug">{song.title}</h4>
                    <p className="text-[10px] text-slate-450 truncate mt-1">{song.artist}</p>
                  </div>
                </div>
              ))}
            </ScrollRow>
          )}
        </div>
      )}

      {/* 2. SEARCH VIEW */}
      {currentView === 'search' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Header */}
          <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4">
            <h2 className="text-xl font-black text-slate-900">Search Results</h2>
            <p className="text-xs text-slate-400">Found matches for "{searchQuery}"</p>
          </div>

          {/* Quick tags */}
          <div className="flex flex-wrap gap-2">
            {['Lofi Study', 'Workout Power', 'KK Hits', 'Monsoon Rain', 'Bollywood Retro', 'Metal Core', 'Late Night Drive'].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  setSearchQuery(tag);
                  onExecuteSearch(tag);
                }}
                className="px-3.5 py-1.5 rounded-full bg-slate-50 border border-slate-200 hover:border-[var(--theme-accent)]/30 text-slate-650 hover:text-slate-900 transition-all text-xs font-bold"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* List results */}
          <div className="mt-2">
            {searchLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--theme-accent)]" />
                <span className="text-xs font-semibold">Locating audio streams...</span>
              </div>
            ) : searchResults.length > 0 ? (
              <div className="flex flex-col gap-2">
                <div className="flex flex-col divide-y divide-slate-100 border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
                  {searchResults.map((song) => (
                    <div
                      key={song.id}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group relative"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/50">
                          {song.image ? (
                            <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Music className="w-5 h-5 text-slate-450" /></div>
                          )}
                          <button
                            onClick={() => onPlaySong(song, searchResults)}
                            className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                          >
                            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                          </button>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{song.title}</h4>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{song.artist}</p>
                        </div>
                      </div>

                      {/* Right icons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleLike(song)}
                          className="p-2 text-slate-400 hover:text-slate-800 transition-colors"
                          title={isLiked(song.id) ? "Unlike" : "Like"}
                        >
                          <Heart
                            className={`w-4 h-4 transition-transform active:scale-125 ${
                              isLiked(song.id) ? 'text-pink-600 fill-pink-600' : ''
                            }`}
                          />
                        </button>

                        <button 
                          onClick={() => onDownloadSong(song)}
                          className="p-2 text-slate-450 hover:text-slate-800 transition-colors"
                          title="Download Song"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <div className="relative">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveDropdownSongId(activeDropdownSongId === song.id ? null : song.id);
                            }}
                            className="p-2 text-slate-400 hover:text-slate-800 rounded-lg transition-colors flex items-center justify-center hover:bg-slate-100"
                            title="Add to Playlist"
                          >
                            <FolderPlus className="w-4 h-4" />
                          </button>
                          
                          {activeDropdownSongId === song.id && (
                            <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-30">
                              <div className="px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                                Add to Playlist
                              </div>
                              {playlists.length === 0 ? (
                                <div className="px-3 py-2 text-xs text-slate-400 italic">No playlists created</div>
                              ) : (
                                playlists.map((p) => (
                                  <button
                                    key={p.id}
                                    onClick={() => onAddSongToPlaylist(song, p.id)}
                                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[var(--theme-accent)] transition-colors truncate"
                                  >
                                    {p.name}
                                  </button>
                                ))
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-slate-450 italic">
                <Search className="w-10 h-10 text-slate-300 mb-3" />
                <span className="text-xs">Type a search query above to browse tracks</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. LIKED SONGS VIEW */}
      {currentView === 'liked' && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="relative rounded-3xl p-8 overflow-hidden bg-gradient-to-r from-pink-500/10 via-white to-white border border-pink-200 shadow-sm flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-600 flex items-center justify-center shadow-md border border-white/10 flex-shrink-0">
              <Heart className="w-10 h-10 text-white fill-white" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Liked Songs</h2>
              <p className="text-xs text-slate-550 mt-1">{likedSongs.length} tracks saved in personal archive</p>
              {likedSongs.length > 0 && (
                <button
                  onClick={() => onPlaySong(likedSongs[0], likedSongs)}
                  className="mt-4 px-5 py-2.5 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-white text-white" />
                  <span>Play Mix</span>
                </button>
              )}
            </div>
          </div>

          {/* Table List */}
          <div className="mt-2">
            {likedSongs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                <Heart className="w-10 h-10 text-slate-200 mb-3" />
                <span className="text-xs">No liked tracks found</span>
                <p className="text-xs text-slate-400 mt-1 text-center max-w-xs">Hearts added on tracks during search will update this list!</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-slate-100 border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
                {likedSongs.map((song) => (
                  <div
                    key={song.id}
                    className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-4 min-w-0 flex-1">
                      <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/50">
                        {song.image ? (
                          <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center"><Music className="w-6 h-6 text-slate-455" /></div>
                        )}
                        <button
                          onClick={() => onPlaySong(song, likedSongs)}
                          className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                        >
                          <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                        </button>
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">{song.title}</h4>
                        <p className="text-xs text-slate-500 truncate mt-0.5">{song.artist}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onToggleLike(song)}
                        className="text-pink-600 hover:text-slate-450 p-2 transition-colors"
                        title="Remove from Likes"
                      >
                        <Heart className="w-4 h-4 fill-pink-600" />
                      </button>

                      <button 
                        onClick={() => onDownloadSong(song)}
                        className="p-2 text-slate-450 hover:text-slate-850 transition-colors"
                        title="Download Song"
                      >
                        <Download className="w-4 h-4" />
                      </button>

                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdownSongId(activeDropdownSongId === song.id ? null : song.id);
                          }}
                          className="p-2 text-slate-450 hover:text-slate-800 rounded-lg transition-colors flex items-center justify-center hover:bg-slate-100"
                        >
                          <FolderPlus className="w-4 h-4" />
                        </button>
                        
                        {activeDropdownSongId === song.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-30">
                            <div className="px-3 py-1.5 text-[9px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100">
                              Add to Playlist
                            </div>
                            {playlists.length === 0 ? (
                              <div className="px-3 py-2 text-xs text-slate-400 italic">No playlists created</div>
                            ) : (
                              playlists.map((p) => (
                                <button
                                  key={p.id}
                                  onClick={() => onAddSongToPlaylist(song, p.id)}
                                  className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 hover:text-[var(--theme-accent)] transition-colors truncate"
                                >
                                  {p.name}
                                </button>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. PLAYLIST DETAIL VIEW */}
      {currentView === 'playlist-detail' && activePlaylist && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Header Banner */}
          <div className="relative rounded-3xl p-8 overflow-hidden bg-gradient-to-r from-[var(--theme-accent)]/10 via-white to-white border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[var(--theme-accent)] to-slate-200 flex items-center justify-center shadow-md border border-slate-200 flex-shrink-0">
                <ListMusic className="w-10 h-10 text-slate-700" />
              </div>
              <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">{activePlaylist.name}</h2>
                <p className="text-xs text-slate-450 mt-1">{activePlaylist.songIds.length} tracks saved inside</p>
                {activePlaylist.songIds.length > 0 && (
                  <button
                    onClick={() => onPlayPlaylist(activePlaylist.id)}
                    className="mt-4 px-5 py-2.5 bg-[var(--theme-accent)] text-white rounded-full font-bold text-xs shadow-md active:scale-95 transition-all flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5 fill-white text-white" />
                    <span>Play Playlist</span>
                  </button>
                )}
              </div>
            </div>
            
            <button
              onClick={() => {
                if(confirm(`Are you sure you want to delete playlist "${activePlaylist.name}"?`)) {
                  onDeletePlaylist(activePlaylist.id);
                  setCurrentView('home');
                }
              }}
              className="px-4 py-2 border border-red-200 bg-red-50/5 hover:bg-red-50/10 text-red-500 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 self-start md:self-center"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete Playlist</span>
            </button>
          </div>

          {/* List Tracks */}
          <div className="mt-2">
            {activePlaylist.songIds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 border border-dashed border-slate-200 rounded-2xl text-slate-400">
                <Music className="w-12 h-12 text-slate-200 mb-3" />
                <span className="text-sm font-semibold">Playlist is empty</span>
                <p className="text-xs text-slate-400 mt-1 max-w-xs text-center font-medium">Browse search streams and add them using actions!</p>
                <button 
                  onClick={() => setCurrentView('search')}
                  className="mt-4 px-4 py-1.5 bg-slate-50 border border-slate-250 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Search Songs
                </button>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-slate-100 border border-slate-200 bg-white rounded-2xl overflow-hidden shadow-sm">
                {(() => {
                  const playlistSongs = activePlaylist.songIds.map(id => {
                    const defaultS = defaultSongs.find(s => s.id === id);
                    if (defaultS) return defaultS;
                    const likedS = likedSongs.find(s => s.id === id);
                    if (likedS) return likedS;
                    const recentS = recentlyPlayed.find(s => s.id === id);
                    if (recentS) return recentS;
                    return { id, title: "Loaded Track", artist: "Unknown Artist", year: 2024, era: "modern" as const };
                  });

                  return playlistSongs.map((song) => (
                    <div
                      key={song.id}
                      className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-100 border border-slate-200/50">
                          {song.image ? (
                            <img src={song.image} alt={song.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Music className="w-6 h-6 text-slate-400" /></div>
                          )}
                          <button
                            onClick={() => onPlaySong(song, playlistSongs)}
                            className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white"
                          >
                            <Play className="w-4 h-4 fill-white text-white ml-0.5" />
                          </button>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm font-bold text-slate-900 truncate">{song.title}</h4>
                          <p className="text-xs text-slate-500 truncate mt-0.5">{song.artist}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onToggleLike(song)}
                          className="p-2 text-slate-450 hover:text-slate-800 transition-colors"
                        >
                          <Heart
                            className={`w-4 h-4 transition-transform active:scale-125 ${
                              isLiked(song.id) ? 'text-pink-600 fill-pink-600' : ''
                            }`}
                          />
                        </button>
                        
                        <button 
                          onClick={() => onDownloadSong(song)}
                          className="p-2 text-slate-450 hover:text-slate-850 transition-colors"
                          title="Download Song"
                        >
                          <Download className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => onRemoveSongFromPlaylist(song.id, activePlaylist.id)}
                          className="p-2 text-slate-450 hover:text-red-650 transition-colors"
                          title="Remove from Playlist"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ));
                })()}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
