import type { HallmarkVisualType } from '@/lib/hallmark-visuals';
import { getHallmarkVisual } from '@/lib/hallmark-visuals';
import { cn } from '@/lib/utils';

interface HallmarkIconProps {
  type: HallmarkVisualType;
  size?: number;
  className?: string;
  /** Show soft accent ring behind glyph */
  ring?: boolean;
}

export function HallmarkIcon({ type, size = 40, className = '', ring = true }: HallmarkIconProps) {
  const meta = getHallmarkVisual(type);
  const half = size / 2;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={cn('shrink-0', className)}
      aria-hidden="true"
      role="img"
    >
      {ring && (
        <circle
          cx={half}
          cy={half}
          r={half - 2}
          fill="none"
          stroke={meta.colorVar}
          strokeWidth="1"
          opacity="0.2"
        />
      )}
      <Glyph type={type} cx={half} cy={half} color={meta.colorVar} scale={size / 40} />
    </svg>
  );
}

function Glyph({
  type,
  cx,
  cy,
  color,
  scale,
}: {
  type: HallmarkVisualType;
  cx: number;
  cy: number;
  color: string;
  scale: number;
}) {
  const s = scale;
  const stroke = { stroke: color, strokeWidth: 1.5 * s, fill: 'none' as const };

  switch (type) {
    case 'dna':
      return (
        <g {...stroke} opacity="0.85">
          <path d={`M${cx - 8 * s} ${cy - 10 * s} Q${cx} ${cy - 5 * s} ${cx + 8 * s} ${cy - 10 * s}`} />
          <path d={`M${cx - 8 * s} ${cy} Q${cx} ${cy + 5 * s} ${cx + 8 * s} ${cy}`} />
          <path d={`M${cx - 8 * s} ${cy + 10 * s} Q${cx} ${cy + 15 * s} ${cx + 8 * s} ${cy + 10 * s}`} />
          <line x1={cx - 5 * s} y1={cy - 7 * s} x2={cx + 5 * s} y2={cy - 6 * s} strokeWidth={1 * s} />
          <line x1={cx - 5 * s} y1={cy + 2 * s} x2={cx + 5 * s} y2={cy + 3 * s} strokeWidth={1 * s} />
        </g>
      );
    case 'telomere':
      return (
        <g>
          <line x1={cx - 10 * s} y1={cy} x2={cx + 10 * s} y2={cy} {...stroke} />
          <rect x={cx + 6 * s} y={cy - 4 * s} width={5 * s} height={8 * s} rx={1 * s} fill={color} opacity="0.5" />
          <rect x={cx - 11 * s} y={cy - 4 * s} width={5 * s} height={8 * s} rx={1 * s} fill={color} opacity="0.35" />
        </g>
      );
    case 'epigenetic':
      return (
        <g>
          <rect x={cx - 9 * s} y={cy - 6 * s} width={18 * s} height={12 * s} rx={2 * s} fill={color} opacity="0.12" stroke={color} strokeWidth={1 * s} />
          {[0, 1, 2].map((i) => (
            <circle key={i} cx={cx - 5 * s + i * 5 * s} cy={cy} r={1.5 * s} fill={color} opacity="0.7" />
          ))}
        </g>
      );
    case 'protein':
      return (
        <g fill={color} opacity="0.65">
          <circle cx={cx - 4 * s} cy={cy - 3 * s} r={3 * s} />
          <circle cx={cx + 5 * s} cy={cy - 4 * s} r={2.5 * s} />
          <circle cx={cx} cy={cy + 4 * s} r={3.5 * s} />
          <path d={`M${cx - 4 * s} ${cy - 3 * s} L${cx + 5 * s} ${cy - 4 * s} L${cx} ${cy + 4 * s} Z`} fill="none" stroke={color} strokeWidth={1 * s} />
        </g>
      );
    case 'autophagy':
      return (
        <g>
          <circle cx={cx} cy={cy} r={9 * s} fill="none" stroke={color} strokeWidth={1.5 * s} strokeDasharray={`${3 * s} ${2 * s}`} opacity="0.8" />
          <circle cx={cx} cy={cy} r={3 * s} fill={color} opacity="0.4" />
        </g>
      );
    case 'mito':
      return (
        <g>
          <ellipse cx={cx} cy={cy} rx={11 * s} ry={5 * s} fill={color} opacity="0.15" stroke={color} strokeWidth={1 * s} />
          <path d={`M${cx - 8 * s} ${cy} Q${cx - 2 * s} ${cy - 6 * s} ${cx + 2 * s} ${cy} Q${cx + 8 * s} ${cy + 6 * s} ${cx + 8 * s} ${cy}`} fill="none" stroke={color} strokeWidth={1.5 * s} />
        </g>
      );
    case 'senescence':
      return (
        <g>
          <circle cx={cx} cy={cy} r={8 * s} fill={color} opacity="0.2" stroke={color} strokeWidth={1 * s} />
          <text x={cx} y={cy + 3 * s} textAnchor="middle" fill={color} fontSize={8 * s} fontWeight="bold" opacity="0.7">SASP</text>
        </g>
      );
    case 'stem':
      return (
        <g fill={color} opacity="0.6">
          <circle cx={cx} cy={cy - 4 * s} r={2.5 * s} />
          <circle cx={cx - 5 * s} cy={cy + 3 * s} r={2 * s} />
          <circle cx={cx + 5 * s} cy={cy + 3 * s} r={2 * s} />
          <line x1={cx} y1={cy - 1.5 * s} x2={cx - 5 * s} y2={cy + 1 * s} stroke={color} strokeWidth={1 * s} />
          <line x1={cx} y1={cy - 1.5 * s} x2={cx + 5 * s} y2={cy + 1 * s} stroke={color} strokeWidth={1 * s} />
        </g>
      );
    case 'signaling':
      return (
        <g>
          <circle cx={cx - 6 * s} cy={cy} r={4 * s} fill={color} opacity="0.35" />
          <circle cx={cx + 6 * s} cy={cy} r={4 * s} fill={color} opacity="0.35" />
          <path d={`M${cx - 2 * s} ${cy} L${cx + 2 * s} ${cy}`} stroke={color} strokeWidth={1.5 * s} markerEnd="url(#arrow)" />
          <defs>
            <marker id="arrow" markerWidth="4" markerHeight="4" refX="3" refY="2" orient="auto">
              <path d="M0,0 L4,2 L0,4" fill={color} />
            </marker>
          </defs>
        </g>
      );
    case 'inflammation':
      return (
        <g>
          <circle cx={cx} cy={cy} r={5 * s} fill={color} opacity="0.5">
            <animate attributeName="r" values={`${4 * s};${6 * s};${4 * s}`} dur="2.5s" repeatCount="indefinite" />
          </circle>
          <circle cx={cx} cy={cy} r={9 * s} fill="none" stroke={color} strokeWidth={1 * s} opacity="0.3" />
        </g>
      );
    case 'gut':
      return (
        <g>
          <path
            d={`M${cx - 10 * s} ${cy} C${cx - 5 * s} ${cy - 8 * s}, ${cx + 5 * s} ${cy + 8 * s}, ${cx + 10 * s} ${cy}`}
            fill="none"
            stroke={color}
            strokeWidth={1.5 * s}
          />
          {[0, 1, 2, 3].map((i) => (
            <circle key={i} cx={cx - 6 * s + i * 4 * s} cy={cy + (i % 2 === 0 ? -2 : 2) * s} r={1.2 * s} fill={color} opacity="0.6" />
          ))}
        </g>
      );
    case 'nutrient':
      return (
        <g>
          <path d={`M${cx - 8 * s} ${cy + 4 * s} L${cx} ${cy - 6 * s} L${cx + 8 * s} ${cy + 4 * s}`} fill="none" stroke={color} strokeWidth={1.5 * s} />
          <line x1={cx - 4 * s} y1={cy} x2={cx + 4 * s} y2={cy} stroke={color} strokeWidth={1 * s} strokeDasharray={`${2 * s} ${2 * s}`} opacity="0.6" />
        </g>
      );
    default:
      return <circle cx={cx} cy={cy} r={4 * s} fill={color} opacity="0.5" />;
  }
}