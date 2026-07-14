export const DashboardOverlay = () => {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      <svg
        viewBox="0 0 1920 1080"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="dashGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(0,0,0,0)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0.8)" />
          </linearGradient>
        </defs>

        <path
          d="M 0 900 Q 480 850 960 850 Q 1440 850 1920 900 L 1920 1080 L 0 1080 Z"
          fill="url(#dashGradient)"
          opacity="0.9"
        />

        <ellipse
          cx="960"
          cy="950"
          rx="400"
          ry="60"
          fill="rgba(0,0,0,0.4)"
          opacity="0.5"
        />

        <line
          x1="200"
          y1="880"
          x2="400"
          y2="860"
          stroke="rgba(100,100,100,0.3)"
          strokeWidth="2"
        />
        <line
          x1="1520"
          y1="860"
          x2="1720"
          y2="880"
          stroke="rgba(100,100,100,0.3)"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};
