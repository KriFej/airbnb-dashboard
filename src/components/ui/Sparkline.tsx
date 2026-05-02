type Props = {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
  filled?: boolean;
};

export function Sparkline({
  data,
  color = "#22C55E",
  height = 40,
  width = 100,
  filled = false,
}: Props) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pad = 2;

  const points = data.map((v, i) => {
    const x = pad + (i / (data.length - 1)) * (width - pad * 2);
    const y = pad + ((max - v) / range) * (height - pad * 2);
    return [x, y] as [number, number];
  });

  const pathD = points
    .map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`)
    .join(" ");

  const fillD = filled
    ? `${pathD} L ${points[points.length - 1][0].toFixed(1)} ${height} L ${points[0][0].toFixed(1)} ${height} Z`
    : "";

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width={width}
      height={height}
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      {filled && (
        <defs>
          <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
      )}
      {filled && (
        <path
          d={fillD}
          fill={`url(#sg-${color.replace("#", "")})`}
        />
      )}
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
