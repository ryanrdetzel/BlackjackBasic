interface ProgressCircleProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  active?: boolean;
  locked?: boolean;
}

export default function ProgressCircle({
  progress,
  size = 60,
  strokeWidth = 4,
  active = false,
  locked = false,
}: ProgressCircleProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={locked ? '#4B5563' : '#1F2937'}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        {!locked && (
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={active ? '#FFD700' : '#16A34A'}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={active ? 'animate-pulse' : ''}
          />
        )}
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {locked ? (
          <span className="text-gray-500 text-xl">🔒</span>
        ) : (
          <span className={`text-xs font-bold ${active ? 'text-casino-gold' : 'text-green-500'}`}>
            {Math.round(progress)}%
          </span>
        )}
      </div>
    </div>
  );
}
