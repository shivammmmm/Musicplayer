import { useEffect, useRef, useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { StickyHeader } from './components/StickyHeader';
import { MobileNavBar } from './components/MobileNavBar';
import { MainDashboard } from './components/MainDashboard';
import { MusicPlayerBar } from './components/MusicPlayerBar';
import { LyricsDrawer, QueueDrawer } from './components/Drawers';
import { DriveGame, DriveInput } from './components/DriveGame';
import { DriveOverlay } from './components/DriveOverlay';
import { Song, songs as defaultSongs } from './data/songs';
import { fetchLyrics, searchSongs } from './services/musicApi';

interface Playlist {
  id: string;
  name: string;
  songIds: string[];
}

const getThemeForSong = (song: Song | null) => {
  if (!song) {
    return {
      accent: '#db2777', // FY Pink
      glow: 'rgba(219, 39, 119, 0.08)',
      gradient: 'linear-gradient(to bottom, rgba(219, 39, 119, 0.05), #ffffff, #ffffff)',
    };
  }

  // Hot pink / magenta dominant palette (Cloudie FY style) mixed with clear sky accents
  const themes = [
    { accent: '#db2777', glow: 'rgba(219, 39, 119, 0.08)', gradient: 'linear-gradient(to bottom, rgba(219, 39, 119, 0.06), #ffffff 340px, #ffffff)' }, // Pink/Magenta
    { accent: '#db2777', glow: 'rgba(219, 39, 119, 0.08)', gradient: 'linear-gradient(to bottom, rgba(219, 39, 119, 0.06), #ffffff 340px, #ffffff)' }, // Pink/Magenta
    { accent: '#be185d', glow: 'rgba(190, 24, 93, 0.08)', gradient: 'linear-gradient(to bottom, rgba(190, 24, 93, 0.06), #ffffff 340px, #ffffff)' },  // Deep Pink
    { accent: '#0284c7', glow: 'rgba(2, 132, 199, 0.08)', gradient: 'linear-gradient(to bottom, rgba(2, 132, 199, 0.06), #ffffff 340px, #ffffff)' },  // Sky Blue
    { accent: '#0d9488', glow: 'rgba(13, 148, 136, 0.08)', gradient: 'linear-gradient(to bottom, rgba(13, 148, 136, 0.06), #ffffff 340px, #ffffff)' },  // Teal
    { accent: '#059669', glow: 'rgba(5, 150, 105, 0.08)', gradient: 'linear-gradient(to bottom, rgba(5, 150, 105, 0.06), #ffffff 340px, #ffffff)' },  // Emerald
    { accent: '#ea580c', glow: 'rgba(234, 88, 12, 0.08)', gradient: 'linear-gradient(to bottom, rgba(234, 88, 12, 0.06), #ffffff 340px, #ffffff)' },   // Orange
  ];

  const hashKey = (song.title + song.artist).toLowerCase();
  let hash = 0;
  for (let i = 0; i < hashKey.length; i++) {
    hash = hashKey.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % themes.length;
  return themes[index];
};

function App() {
  // Navigation & Views
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState<Song[]>([]);
  const [suggestions, setSuggestions] = useState<Song[]>([]);

  // Library State (LocalStorage)
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('vibe_playlists');
    return saved ? JSON.parse(saved) : [];
  });
  const [likedSongs, setLikedSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('vibe_liked_songs');
    return saved ? JSON.parse(saved) : [];
  });
  const [recentlyPlayed, setRecentlyPlayed] = useState<Song[]>(() => {
    const saved = localStorage.getItem('vibe_recently_played');
    return saved ? JSON.parse(saved) : [];
  });

  // Playback States
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [queue, setQueue] = useState<Song[]>(defaultSongs);
  const [currentQueueIndex, setCurrentQueueIndex] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [progress, setProgress] = useState(0);

  // Audio settings
  const [volume, setVolume] = useState<number>(() => {
    const saved = localStorage.getItem('vibe_volume');
    return saved ? parseFloat(saved) : 0.8;
  });
  const [isMuted, setIsMuted] = useState(false);
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>('off');
  const [shuffle, setShuffle] = useState(false);

  // Drawers
  const [isLyricsOpen, setIsLyricsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [lyrics, setLyrics] = useState('');
  const [lyricsLoading, setLyricsLoading] = useState(false);

  // 3D Drive Mode States
  const [isDriveMode, setIsDriveMode] = useState(false);
  const [rain, setRain] = useState(false);
  const [night, setNight] = useState(true);
  const [speed, setSpeed] = useState(0);
  const [cameraMode, setCameraMode] = useState<'chase' | 'cockpit'>('chase');

  // Refs
  const audioRef = useRef<HTMLAudioElement>(null);
  const inputRef = useRef<DriveInput>({ left: false, right: false, accelerate: false, brake: false });

  // Persist Library details
  useEffect(() => {
    localStorage.setItem('vibe_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('vibe_liked_songs', JSON.stringify(likedSongs));
  }, [likedSongs]);

  useEffect(() => {
    localStorage.setItem('vibe_recently_played', JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  useEffect(() => {
    localStorage.setItem('vibe_volume', volume.toString());
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Handle Mute Status
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Drive Mode Key Listeners
  useEffect(() => {
    const down = (event: KeyboardEvent) => {
      if (!isDriveMode) return;
      if ((event.target as HTMLElement).tagName === 'INPUT') return;
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') inputRef.current.left = true;
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') inputRef.current.right = true;
      if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') inputRef.current.accelerate = true;
      if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') inputRef.current.brake = true;
      if (event.key.toLowerCase() === 'c') setCameraMode((mode) => mode === 'chase' ? 'cockpit' : 'chase');
    };
    const up = (event: KeyboardEvent) => {
      if (!isDriveMode) return;
      if (event.key === 'ArrowLeft' || event.key.toLowerCase() === 'a') inputRef.current.left = false;
      if (event.key === 'ArrowRight' || event.key.toLowerCase() === 'd') inputRef.current.right = false;
      if (event.key === 'ArrowUp' || event.key.toLowerCase() === 'w') inputRef.current.accelerate = false;
      if (event.key === 'ArrowDown' || event.key.toLowerCase() === 's') inputRef.current.brake = false;
    };
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, [isDriveMode]);

  // Audio Playback trigger
  useEffect(() => {
    if (!currentSong?.audioUrl || !audioRef.current) return;
    
    // Stop and load new source
    audioRef.current.pause();
    audioRef.current.src = currentSong.audioUrl;
    audioRef.current.load();
    
    // Set initial volume & mute state
    audioRef.current.volume = volume;
    audioRef.current.muted = isMuted;

    audioRef.current.play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.warn("Audio play failed, user interaction might be needed", err);
        setIsPlaying(false);
      });

    // Load lyrics in the background
    loadLyricsForSong(currentSong.id, currentSong.title, currentSong.artist);

  }, [currentSong]);

  // Sync play/pause state
  useEffect(() => {
    if (!audioRef.current || !audioRef.current.src) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Fetch lyrics helper
  const loadLyricsForSong = async (songId: string, title?: string, artist?: string) => {
    setLyricsLoading(true);
    setLyrics('');
    try {
      const response = await fetchLyrics(songId, title, artist);
      setLyrics(response);
    } catch (err) {
      setLyrics("Failed to load lyrics.");
    } finally {
      setLyricsLoading(false);
    }
  };

  // Search executions
  const executeSearch = async (queryStr: string) => {
    if (!queryStr.trim()) return;
    setSearchLoading(true);
    setSuggestions([]);
    try {
      const results = await searchSongs(queryStr);
      setSearchResults(results);
    } catch (err) {
      console.error(err);
    } finally {
      setSearchLoading(false);
    }
  };

  // Playback Operations
  const playSong = async (song: Song, queueContext: Song[] = []) => {
    let resolvedSong = { ...song };
    
    if (!resolvedSong.audioUrl) {
      setLyricsLoading(true);
      try {
        const results = await searchSongs(`${resolvedSong.title} ${resolvedSong.artist}`);
        if (results.length > 0) {
          resolvedSong.audioUrl = results[0].audioUrl;
          resolvedSong.image = results[0].image || resolvedSong.image;
        } else {
          alert("Audio URL not found for this track!");
          setLyricsLoading(false);
          return;
        }
      } catch (err) {
        console.error(err);
        setLyricsLoading(false);
        return;
      }
    }

    setCurrentSong(resolvedSong);
    setIsPlaying(true);

    if (queueContext.length > 0) {
      setQueue(queueContext);
      const idx = queueContext.findIndex((s) => s.id === song.id);
      if (idx !== -1) {
        setCurrentQueueIndex(idx);
      }
    } else {
      const idx = queue.findIndex((s) => s.id === resolvedSong.id);
      if (idx !== -1) {
        setCurrentQueueIndex(idx);
      } else {
        const newQueue = [...queue, resolvedSong];
        setQueue(newQueue);
        setCurrentQueueIndex(newQueue.length - 1);
      }
    }

    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((s) => s.id !== resolvedSong.id);
      return [resolvedSong, ...filtered].slice(0, 10);
    });
  };

  const playPlaylist = (playlistId: string) => {
    const targetPlaylist = playlists.find((p) => p.id === playlistId);
    if (!targetPlaylist || targetPlaylist.songIds.length === 0) return;

    const playlistSongs = targetPlaylist.songIds.map((id) => {
      const staticS = defaultSongs.find((s) => s.id === id);
      if (staticS) return staticS;
      const likedS = likedSongs.find((s) => s.id === id);
      if (likedS) return likedS;
      const recentS = recentlyPlayed.find((s) => s.id === id);
      if (recentS) return recentS;
      return { id, title: "Loaded Track", artist: "Unknown Artist", year: 2024, era: 'modern' as const };
    });

    playSong(playlistSongs[0], playlistSongs);
  };

  const nextTrack = () => {
    if (queue.length === 0) return;

    if (repeatMode === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
      return;
    }

    let nextIdx = currentQueueIndex;
    if (shuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else {
      nextIdx = currentQueueIndex + 1;
    }

    if (nextIdx < queue.length) {
      setCurrentQueueIndex(nextIdx);
      playSong(queue[nextIdx], queue);
    } else if (repeatMode === 'all') {
      setCurrentQueueIndex(0);
      playSong(queue[0], queue);
    } else {
      setIsPlaying(false);
      setProgress(0);
      setCurrentTime(0);
    }
  };

  const prevTrack = () => {
    if (queue.length === 0) return;

    if (currentTime > 5 && audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
      return;
    }

    let prevIdx = currentQueueIndex - 1;
    if (shuffle) {
      prevIdx = Math.floor(Math.random() * queue.length);
    }

    if (prevIdx >= 0) {
      setCurrentQueueIndex(prevIdx);
      playSong(queue[prevIdx], queue);
    } else if (repeatMode === 'all') {
      const lastIdx = queue.length - 1;
      setCurrentQueueIndex(lastIdx);
      playSong(queue[lastIdx], queue);
    } else if (audioRef.current) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
      setProgress(0);
    }
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    }
  };

  const handleDurationChange = () => {
    const audio = audioRef.current;
    if (audio) {
      setDuration(audio.duration || 0);
    }
  };

  const handleProgressChange = (percent: number) => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const newTime = (percent / 100) * audio.duration;
      audio.currentTime = newTime;
      setCurrentTime(newTime);
      setProgress(percent);
    }
  };

  // Library / Likes operations
  const toggleLike = (song: Song) => {
    const isAlreadyLiked = likedSongs.some((s) => s.id === song.id);
    if (isAlreadyLiked) {
      setLikedSongs((prev) => prev.filter((s) => s.id !== song.id));
    } else {
      setLikedSongs((prev) => [...prev, song]);
    }
  };

  const isLiked = (songId: string) => {
    return likedSongs.some((s) => s.id === songId);
  };

  // Playlists Operations
  const createPlaylist = (name: string) => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      songIds: [],
    };
    setPlaylists((prev) => [...prev, newPlaylist]);
  };

  const addSongToPlaylist = (song: Song, playlistId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          if (p.songIds.includes(song.id)) return p;
          return { ...p, songIds: [...p.songIds, song.id] };
        }
        return p;
      })
    );
  };

  const removeSongFromPlaylist = (songId: string, playlistId: string) => {
    setPlaylists((prev) =>
      prev.map((p) => {
        if (p.id === playlistId) {
          return { ...p, songIds: p.songIds.filter((id) => id !== songId) };
        }
        return p;
      })
    );
  };

  const deletePlaylist = (playlistId: string) => {
    setPlaylists((prev) => prev.filter((p) => p.id !== playlistId));
    if (selectedPlaylistId === playlistId) {
      setSelectedPlaylistId(null);
    }
  };

  // Download Trigger Handler
  const downloadSong = async (song: Song) => {
    let resolvedUrl = song.audioUrl;
    if (!resolvedUrl) {
      // Lookup URL first
      try {
        const results = await searchSongs(`${song.title} ${song.artist}`);
        if (results.length > 0 && results[0].audioUrl) {
          resolvedUrl = results[0].audioUrl;
        } else {
          alert("Could not resolve download path.");
          return;
        }
      } catch (err) {
        console.error(err);
        return;
      }
    }

    if (resolvedUrl) {
      triggerDownload(resolvedUrl, song.title, song.artist);
    }
  };

  const triggerDownload = async (url: string, title: string, artist: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const tempLink = document.createElement('a');
      tempLink.href = blobUrl;
      tempLink.download = `${title} - ${artist}.mp3`;
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      // CORS block fallback
      window.open(url, '_blank');
    }
  };

  // Calculate dynamic accent variables based on the playing track
  const theme = getThemeForSong(currentSong);
  const wrapperStyle = {
    '--theme-accent': theme.accent,
    '--theme-accent-glow': theme.glow,
    '--theme-gradient': theme.gradient,
  } as React.CSSProperties;

  return (
    <main 
      style={wrapperStyle}
      className="relative w-full h-screen bg-white overflow-hidden select-none"
    >
      
      {/* Immersive background glow */}
      <div 
        className="absolute top-0 left-0 right-0 h-[380px] pointer-events-none z-0 transition-all duration-700 opacity-80"
        style={{ background: 'var(--theme-gradient)' }}
      />
      
      {/* Audio element */}
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onDurationChange={handleDurationChange}
        onEnded={nextTrack}
      />

      {/* 3D ZEN DRIVE MODE OVERLAY */}
      {isDriveMode ? (
        <div className="absolute inset-0 w-full h-full z-20 animate-fadeIn">
          <DriveGame
            inputRef={inputRef}
            cameraMode={cameraMode}
            rain={rain}
            night={night}
            onSpeedChange={setSpeed}
          />
          <DriveOverlay
            inputRef={inputRef}
            speed={speed}
            cameraMode={cameraMode}
            onCameraToggle={() => setCameraMode(cameraMode === 'chase' ? 'cockpit' : 'chase')}
            rain={rain}
            onRainToggle={() => setRain(!rain)}
            night={night}
            onNightToggle={() => setNight(!night)}
            onExitDriveMode={() => setIsDriveMode(false)}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNextTrack={nextTrack}
            onPrevTrack={prevTrack}
            progress={progress}
            onProgressChange={handleProgressChange}
          />
        </div>
      ) : (
        /* STANDARD VIEW LAYOUT */
        <div className="w-full h-full flex flex-col justify-between relative z-10">
          
          <div className="flex-1 flex overflow-hidden h-[calc(100vh-96px)]">
            {/* Sidebar Navigation */}
            <Sidebar
              currentView={currentView}
              setCurrentView={setCurrentView}
              playlists={playlists}
              onCreatePlaylist={createPlaylist}
              onSelectPlaylist={(id) => {
                setSelectedPlaylistId(id);
                setCurrentView('playlist-detail');
              }}
              selectedPlaylistId={selectedPlaylistId}
              likedCount={likedSongs.length}
              onEnterDriveMode={() => setIsDriveMode(true)}
            />

            {/* Dashboard Workspace with Sticky Header */}
            <div className="flex-1 h-full flex flex-col overflow-hidden relative">
              {/* Sticky Top Header */}
              <StickyHeader
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchLoading={searchLoading}
                suggestions={suggestions}
                setSuggestions={setSuggestions}
                onExecuteSearch={executeSearch}
                currentView={currentView}
                setCurrentView={setCurrentView}
                onPlaySong={playSong}
              />

              {/* Main Content Workspace */}
              <MainDashboard
                currentView={currentView}
                selectedPlaylistId={selectedPlaylistId}
                playlists={playlists}
                likedSongs={likedSongs}
                recentlyPlayed={recentlyPlayed}
                onPlaySong={playSong}
                onToggleLike={toggleLike}
                isLiked={isLiked}
                onAddSongToPlaylist={addSongToPlaylist}
                onRemoveSongFromPlaylist={removeSongFromPlaylist}
                onDeletePlaylist={deletePlaylist}
                onPlayPlaylist={playPlaylist}
                setCurrentView={setCurrentView}
                currentSong={currentSong}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchLoading={searchLoading}
                searchResults={searchResults}
                onExecuteSearch={executeSearch}
                onDownloadSong={downloadSong}
              />
            </div>

            {/* Lyrics Drawer overlay */}
            <LyricsDrawer
              isOpen={isLyricsOpen}
              onClose={() => setIsLyricsOpen(false)}
              currentSong={currentSong}
              lyrics={lyrics}
              loading={lyricsLoading}
            />

            {/* Queue Drawer overlay */}
            <QueueDrawer
              isOpen={isQueueOpen}
              onClose={() => setIsQueueOpen(false)}
              queue={queue}
              currentIndex={currentQueueIndex}
              onPlayIndex={(idx) => {
                setCurrentQueueIndex(idx);
                playSong(queue[idx], queue);
              }}
              onRemoveIndex={(idx) => {
                setQueue((prev) => {
                  const copy = [...prev];
                  copy.splice(idx, 1);
                  return copy;
                });
                if (idx < currentQueueIndex) {
                  setCurrentQueueIndex((prev) => prev - 1);
                } else if (idx === currentQueueIndex) {
                  nextTrack();
                }
              }}
              onClearQueue={() => {
                setQueue([]);
                setCurrentQueueIndex(-1);
                setCurrentSong(null);
                setIsPlaying(false);
              }}
            />
          </div>

          {/* Floating Mobile bottom navigation buttons */}
          <MobileNavBar 
            currentView={currentView}
            setCurrentView={setCurrentView}
            likedCount={likedSongs.length}
            onEnterDriveMode={() => setIsDriveMode(true)}
          />

          {/* Fixed Bottom Music Player (96px) */}
          <MusicPlayerBar
            currentSong={currentSong}
            isPlaying={isPlaying}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onNextTrack={nextTrack}
            onPrevTrack={prevTrack}
            progress={progress}
            onProgressChange={handleProgressChange}
            currentTime={currentTime}
            duration={duration}
            isLiked={currentSong ? isLiked(currentSong.id) : false}
            onToggleLike={() => currentSong && toggleLike(currentSong)}
            volume={volume}
            onVolumeChange={setVolume}
            isMuted={isMuted}
            onToggleMute={() => setIsMuted(!isMuted)}
            repeatMode={repeatMode}
            onToggleRepeat={() => {
              setRepeatMode((prev) => {
                if (prev === 'off') return 'all';
                if (prev === 'all') return 'one';
                return 'off';
              });
            }}
            shuffle={shuffle}
            onToggleShuffle={() => setShuffle(!shuffle)}
            isLyricsOpen={isLyricsOpen}
            onToggleLyrics={() => {
              setIsLyricsOpen(!isLyricsOpen);
              setIsQueueOpen(false);
            }}
            isQueueOpen={isQueueOpen}
            onToggleQueue={() => {
              setIsQueueOpen(!isQueueOpen);
              setIsLyricsOpen(false);
            }}
            onEnterDriveMode={() => setIsDriveMode(true)}
            onDownloadSong={downloadSong}
          />
        </div>
      )}
    </main>
  );
}

export default App;
