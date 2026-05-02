type Bar = { label: string; value: number };

type Props = {
  data: Bar[];
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
};

export function BarChart({ data, color = "#22C55E", height = 120, formatValue }: Props) {
  if (!data || data.length === 0) return null;

  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = 100 / data.length;
  const gap = 0.4;

  return (
    <svg
      viewBox={`0 0 100 ${height + 16}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height }}
      aria-hidden="true"
    >
      {data.map((bar, i) => {
        const barHeight = (bar.value / max) * height;
        const x = i * barW + gap / 2;
        const w = barW - gap;
        const y = height - barHeight;
        const isMax = bar.value === max;

        return (
          <g key={bar.label}>
            <rect
              x={`${x}%`}
              y={y}
              width={`${w}%`}
              height={barHeight}
              rx="2"
              fill={isMax ? color : `${color}40`}
            />
            {/* Value label on max bar */}
            {isMax && formatValue && (
              <text
                x={`${x + w / 2}%`}
                y={y - 4}
                textAnchor="middle"
                fontSize="5"
                fill={color}
                fontWeight="600"
              >
                {formatValue(bar.value)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}
