import { useEffect, useRef } from 'react';

interface RainEffectProps {
  enabled: boolean;
}

export const RainEffect = ({ enabled }: RainEffectProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      return;
    }

    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.loop = true;
      audioRef.current.volume = 0.15;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const drops: Array<{ x: number; y: number; length: number; speed: number; opacity: number }> = [];

    for (let i = 0; i < 150; i++) {
      drops.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        length: Math.random() * 20 + 10,
        speed: Math.random() * 3 + 2,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    let animationId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      drops.forEach((drop) => {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x, drop.y + drop.length);
        ctx.strokeStyle = `rgba(200, 220, 255, ${drop.opacity})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        drop.y += drop.speed;

        if (drop.y > canvas.height) {
          drop.y = -drop.length;
          drop.x = Math.random() * canvas.width;
        }
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-20"
        style={{ mixBlendMode: 'screen' }}
      />
      <div className="fixed inset-0 pointer-events-none z-20 bg-blue-900/10" />
    </>
  );
};
