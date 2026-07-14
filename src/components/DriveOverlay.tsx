import { Camera, Gauge, MoveLeft, MoveRight, CloudRain, Moon, LogOut, Play, Pause, SkipForward, SkipBack, Music } from 'lucide-react';
import { DriveInput } from './DriveGame';
import { MutableRefObject } from 'react';
import { Song } from '../data/songs';

interface DriveOverlayProps {
  inputRef: MutableRefObject<DriveInput>;
  speed: number;
  cameraMode: 'chase' | 'cockpit';
  onCameraToggle: () => void;
  rain: boolean;
  onRainToggle: () => void;
  night: boolean;
  onNightToggle: () => void;
  onExitDriveMode: () => void;
  currentSong: Song | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNextTrack: () => void;
  onPrevTrack: () => void;
  progress: number;
  onProgressChange: (progress: number) => void;
}

export const DriveOverlay = ({
  inputRef,
  speed,
  cameraMode,
  onCameraToggle,
  rain,
  onRainToggle,
  night,
  onNightToggle,
  onExitDriveMode,
  currentSong,
  isPlaying,
  onPlayPause,
  onNextTrack,
  onPrevTrack,
  progress,
  onProgressChange,
}: DriveOverlayProps) => {
  const hold = (key: keyof DriveInput, value: boolean) => () => {
    inputRef.current[key] = value;
  };

  const driveBtn = (key: keyof DriveInput, icon: React.ReactNode, label: string, extraClasses = '') => (
    <button
      aria-label={label}
      title={label}
      onPointerDown={hold(key, true)}
      onPointerUp={hold(key, false)}
      onPointerLeave={hold(key, false)}
      className={`w-14 h-14 rounded-xl border border-white/10 bg-slate-950/70 backdrop-blur-md text-white font-bold shadow-2xl active:bg-amber-500 active:text-slate-950 active:border-amber-400 transition-colors flex items-center justify-center select-none touch-none ${extraClasses}`}
    >
      {icon}
    </button>
  );

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none z-30 font-sans select-none">
      
      {/* HEADER LOGO */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-white text-center">
        <div className="flex items-center gap-2">
          <span className="text-amber-400 font-extrabold text-sm tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">ROAD RIYAAZ</span>
        </div>
        <span className="text-[8px] text-amber-300 font-bold tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">Zen drive mode</span>
      </div>

      {/* TOP LEFT: Exit Button */}
      <div className="absolute top-5 left-5 pointer-events-auto">
        <button
          onClick={onExitDriveMode}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 text-white hover:text-red-400 hover:border-red-500/30 transition-all font-bold text-xs shadow-2xl"
          title="Exit Drive Mode"
        >
          <LogOut className="w-4 h-4 text-red-500" />
          <span>Exit Drive</span>
        </button>
      </div>

      {/* TOP RIGHT: Environment Controls & Speedometer */}
      <div className="absolute top-5 right-5 flex items-center gap-3 pointer-events-auto">
        {/* Speedometer */}
        <div className="h-11 px-3.5 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center gap-2 text-white shadow-2xl">
          <Gauge className="w-4 h-4 text-amber-400" />
          <strong className="text-lg font-bold font-mono tracking-tight">{speed}</strong>
          <span className="text-[9px] text-slate-400 font-semibold uppercase">km/h</span>
        </div>

        {/* Camera mode switcher */}
        <button
          onClick={onCameraToggle}
          className="w-11 h-11 bg-slate-950/80 backdrop-blur-md border border-white/10 rounded-xl flex items-center justify-center text-white hover:bg-slate-900 shadow-2xl transition-colors"
          title={`Switch camera to ${cameraMode === 'chase' ? 'cockpit' : 'chase'}`}
        >
          <Camera className="w-4 h-4" />
        </button>

        {/* Atmosphere buttons */}
        <button
          onClick={onRainToggle}
          className={`w-11 h-11 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all ${
            rain
              ? 'bg-blue-600 border-blue-400 text-white shadow-lg shadow-blue-500/20'
              : 'bg-slate-950/80 border-white/10 text-slate-300 hover:bg-slate-900 shadow-2xl'
          }`}
          title="Toggle Rain"
        >
          <CloudRain className="w-4 h-4" />
        </button>

        <button
          onClick={onNightToggle}
          className={`w-11 h-11 rounded-xl backdrop-blur-md border flex items-center justify-center transition-all ${
            night
              ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/20'
              : 'bg-slate-950/80 border-white/10 text-slate-300 hover:bg-slate-900 shadow-2xl'
          }`}
          title="Toggle Night"
        >
          <Moon className="w-4 h-4" />
        </button>
      </div>

      {/* MOBILE STEERING WHEELS (BOTTOM LEFT) */}
      <div className="absolute left-5 bottom-28 flex gap-3 pointer-events-auto md:hidden">
        {driveBtn('left', <MoveLeft className="w-6 h-6" />, 'Steer Left')}
        {driveBtn('right', <MoveRight className="w-6 h-6" />, 'Steer Right')}
      </div>

      {/* MOBILE PEDALS (BOTTOM RIGHT) */}
      <div className="absolute right-5 bottom-28 flex gap-3 pointer-events-auto md:hidden">
        {driveBtn('brake', <span className="text-[10px] font-black">STOP</span>, 'Brake', 'active:bg-red-600 active:border-red-400')}
        {driveBtn('accelerate', <span className="text-[10px] font-black">GAS</span>, 'Accelerate', 'active:bg-green-600 active:border-green-400')}
      </div>

      {/* KEYBOARD DIRECTIONS CAPTION */}
      <div className="absolute bottom-28 left-1/2 -translate-x-1/2 text-center text-[10px] font-extrabold tracking-widest text-white/40 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hidden md:block">
        WASD / ARROWS TO DRIVE &nbsp;|&nbsp; C TO FLIP CAMERA
      </div>

      {/* FLOATING HUD PLAYER (BOTTOM CENTER) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-md px-4 pointer-events-auto">
        <div className="bg-slate-950/85 backdrop-blur-2xl border border-white/15 rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
          
          <div className="flex items-center gap-4">
            {/* Art */}
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-white/10 flex-shrink-0 overflow-hidden relative">
              {currentSong?.image ? (
                <img 
                  src={currentSong.image} 
                  alt="" 
                  className={`w-full h-full object-cover ${isPlaying ? 'animate-pulse' : ''}`} 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Music className="w-5 h-5 text-slate-500" />
                </div>
              )}
            </div>

            {/* Title & Progress slider */}
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <div className="min-w-0">
                  <h3 className="text-white text-xs font-bold truncate leading-none">{currentSong?.title || "Not Playing"}</h3>
                  <span className="text-slate-400 text-[10px] truncate block mt-1 leading-none">{currentSong?.artist || "Select a song"}</span>
                </div>
              </div>
              
              {/* Seek Bar */}
              <div className="w-full h-1 bg-white/10 rounded-full mt-2 relative">
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => onProgressChange(parseInt(e.target.value))}
                  className="w-full h-full appearance-none cursor-pointer absolute top-0 left-0 bg-transparent"
                  style={{
                    background: `linear-gradient(to right, #fbbf24 0%, #fbbf24 ${progress}%, rgba(255,255,255,0.1) ${progress}%, rgba(255,255,255,0.1) 100%)`,
                    WebkitAppearance: 'none',
                    height: '100%',
                    borderRadius: '9999px',
                  }}
                />
              </div>
            </div>

            {/* Simple player controls */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <button 
                onClick={onPrevTrack} 
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title="Prev Song"
              >
                <SkipBack className="w-4 h-4 fill-current" />
              </button>
              
              <button
                onClick={onPlayPause}
                className="w-9 h-9 rounded-full bg-white hover:bg-slate-200 text-slate-950 flex items-center justify-center transition-all scale-100 active:scale-90 shadow-lg"
                title="Play/Pause"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950 ml-0.5" />}
              </button>

              <button 
                onClick={onNextTrack} 
                className="p-1.5 text-slate-400 hover:text-white transition-colors"
                title="Next Song"
              >
                <SkipForward className="w-4 h-4 fill-current" />
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
