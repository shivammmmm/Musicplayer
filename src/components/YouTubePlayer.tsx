// Copy and paste this complete file content into src/components/YouTubePlayer.tsx

import { useEffect, useRef } from 'react';

interface YouTubePlayerProps {
  videoId: string;
  nightMode: boolean;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export const YouTubePlayer = ({ videoId, nightMode }: YouTubePlayerProps) => {
  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        initPlayer();
      };
    } else {
      initPlayer();
    }

    function initPlayer() {
      if (playerRef.current) return;

      playerRef.current = new window.YT.Player(containerRef.current, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 1,
          fs: 0,
          iv_load_policy: 3,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          loop: 1,
          playlist: videoId,
          mute: 1,
          start: 180, // 👈 FIX APPLIED: Missing value 180 added here
          origin: window.location.origin
        },
        events: {
          onReady: (event: any) => {
            event.target.playVideo();
          },
        },
      });
    }
  }, []);

  useEffect(() => {
    if (playerRef.current && playerRef.current.loadVideoById) {
      // Load video starting at 180 seconds
      playerRef.current.loadVideoById({ videoId: videoId, startSeconds: 180 });
    }
  }, [videoId]);

  return (
    <>
      <div className="fixed inset-0 w-full h-full overflow-hidden z-0">
        <div
          ref={containerRef}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '100vw',
            height: '56.25vw',
            minHeight: '100vh',
            minWidth: '177.77vh',
            pointerEvents: 'none'
          }}
        />
      </div>

      <div
        className={`fixed inset-0 pointer-events-none transition-all duration-700 z-0 ${
          nightMode ? 'bg-black/60' : 'bg-black/20'
        }`}
      />
    </>
  );
};