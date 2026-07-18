import type { ToolId } from '@/lib/registry';

/** Tiny inline-SVG stand-in for each tool's real output — a synergy gauge,
 *  a network graph, ranked bars — so the tool picker reads as a gallery of
 *  what you'll get, not just an icon + label. Purely decorative. */
export function ToolPreviewGlyph({ tool, color }: { tool: ToolId; color: string }) {
  const common = { 'aria-hidden': true as const, viewBox: '0 0 64 24', className: 'w-full h-6' };

  switch (tool) {
    case 'simulator':
      return (
        <svg {...common}>
          <path d="M4 20 A 28 28 0 0 1 60 20" fill="none" stroke={color} strokeOpacity={0.25} strokeWidth={3} />
          <path d="M4 20 A 28 28 0 0 1 42 3" fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" />
          <circle cx={42} cy={3} r={2.5} fill={color} />
        </svg>
      );
    case 'network':
      return (
        <svg {...common}>
          <line x1={8} y1={18} x2={30} y2={6} stroke={color} strokeOpacity={0.5} strokeWidth={1.5} />
          <line x1={30} y1={6} x2={54} y2={14} stroke={color} strokeOpacity={0.5} strokeWidth={1.5} />
          <line x1={8} y1={18} x2={54} y2={14} stroke={color} strokeOpacity={0.3} strokeWidth={1.5} />
          <circle cx={8} cy={18} r={3} fill={color} />
          <circle cx={30} cy={6} r={3} fill={color} />
          <circle cx={54} cy={14} r={3} fill={color} />
        </svg>
      );
    case 'protocol':
      return (
        <svg {...common}>
          {[0, 1, 2].map((i) => (
            <rect key={i} x={4} y={2 + i * 8} width={12 + i * 18} height={4} rx={2} fill={color} fillOpacity={0.85 - i * 0.2} />
          ))}
        </svg>
      );
    case 'biomarker':
      return (
        <svg {...common}>
          <polyline
            points="4,18 16,14 26,16 36,8 48,10 60,4"
            fill="none"
            stroke={color}
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={60} cy={4} r={2.5} fill={color} />
        </svg>
      );
    case 'impact':
      return (
        <svg {...common}>
          {[22, 15, 9].map((w, i) => (
            <rect key={i} x={4} y={2 + i * 7} width={w} height={4} rx={2} fill={color} fillOpacity={1 - i * 0.25} />
          ))}
        </svg>
      );
    case 'healthspan':
      return (
        <svg {...common}>
          <circle cx={12} cy={12} r={9} fill="none" stroke={color} strokeOpacity={0.2} strokeWidth={3} />
          <circle
            cx={12}
            cy={12}
            r={9}
            fill="none"
            stroke={color}
            strokeWidth={3}
            strokeDasharray={`${2 * Math.PI * 9 * 0.7} ${2 * Math.PI * 9}`}
            strokeLinecap="round"
            transform="rotate(-90 12 12)"
          />
        </svg>
      );
    default:
      return null;
  }
}
