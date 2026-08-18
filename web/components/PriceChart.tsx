"use client";

type Point = { x: number; y: number; label: string; price: number };

export function PriceChart({
  title,
  points,
}: {
  title: string;
  points: Point[];
}) {
  const width = 920;
  const height = 240;
  const pad = { top: 28, right: 24, bottom: 36, left: 56 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  if (points.length === 0) {
    return (
      <div className="panel chart-panel">
        <div className="panel-head">
          <span>Price history</span>
          <span>no signal</span>
        </div>
        <div className="chart-empty">Select a product after the first scrape</div>
      </div>
    );
  }

  const values = points.map((p) => p.price);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const mapped = points.map((p, i) => {
    const x =
      pad.left + (points.length === 1 ? innerW / 2 : (i / (points.length - 1)) * innerW);
    const y = pad.top + innerH - ((p.price - min) / span) * innerH;
    return { ...p, x, y };
  });
  const d = mapped
    .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
    .join(" ");

  return (
    <div className="panel chart-panel">
      <div className="panel-head">
        <span>Price history</span>
        <span>{title}</span>
      </div>
      <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} role="img">
        <title>{title} price history</title>
        {[0, 0.5, 1].map((t) => {
          const y = pad.top + innerH * (1 - t);
          const value = min + span * t;
          return (
            <g key={t}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={y}
                y2={y}
                stroke="#2c261c"
                strokeDasharray="3 6"
              />
              <text
                x={12}
                y={y + 4}
                fill="#8d7f6c"
                fontFamily="Azeret Mono, monospace"
                fontSize="11"
              >
                {value.toFixed(2)}
              </text>
            </g>
          );
        })}
        <path d={d} fill="none" stroke="#c9843a" strokeWidth="2.4" />
        {mapped.map((p) => (
          <g key={`${p.x}-${p.label}`}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#0b0a08" stroke="#efb056" strokeWidth="2" />
            <text
              x={p.x}
              y={height - 12}
              textAnchor="middle"
              fill="#8d7f6c"
              fontFamily="Azeret Mono, monospace"
              fontSize="10"
            >
              {p.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
