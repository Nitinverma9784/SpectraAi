interface ScoreRingProps {
  score: number; // 0-100
  size?: number;
}

export function ScoreRing({ score, size = 56 }: ScoreRingProps) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const colorClass =
    score >= 75 ? "score-ring-fill-high" :
    score >= 45 ? "score-ring-fill-medium" :
    "score-ring-fill-low";

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          className="score-ring-track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={4}
        />
        <circle
          className={colorClass}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={4}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 600ms ease-out 200ms" }}
        />
      </svg>
      <span
        className="absolute text-center leading-none font-mono"
        style={{
          fontSize: size < 50 ? "10px" : "13px",
          fontFamily: "var(--font-jetbrains)",
          fontWeight: 500,
          color: "var(--text-primary)",
        }}
      >
        {score}
      </span>
    </div>
  );
}
