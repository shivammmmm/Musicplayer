import { useState, useEffect, useCallback } from 'react';
import { Song, getSongsForEra, getEraFromYear } from '../data/songs';

export const useMusicPlayer = (year: number, region?: string) => {
  const [playlist, setPlaylist] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const era = getEraFromYear(year);
    const songs = getSongsForEra(era, region);

    const shuffled = [...songs].sort(() => Math.random() - 0.5);
    setPlaylist(shuffled);
    setCurrentIndex(0);
  }, [year, region]);

  const currentSong = playlist.length > 0 ? playlist[currentIndex] : null;

  const playStatic = useCallback(() => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const bufferSize = audioContext.sampleRate * 0.3;
    const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = audioContext.createBufferSource();
    whiteNoise.buffer = buffer;

    const gainNode = audioContext.createGain();
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    whiteNoise.connect(gainNode);
    gainNode.connect(audioContext.destination);
    whiteNoise.start(0);

    setTimeout(() => {
      whiteNoise.stop();
    }, 300);
  }, []);

  const nextTrack = useCallback(() => {
    playStatic();

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % playlist.length);
    }, 300);
  }, [playlist.length, playStatic]);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => !prev);
  }, []);

  return {
    currentSong,
    isPlaying,
    togglePlay,
    nextTrack,
  };
};
