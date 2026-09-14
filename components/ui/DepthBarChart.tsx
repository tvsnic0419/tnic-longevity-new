'use client';

import { useId, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  ChartGrid,
  ChartTooltip,
  ChartDepthBarDefs,
  axisProps,
  barCursor,
} from '@/components/ui/ChartKit';
import { cn } from '@/lib/utils';

export interface DepthBarDatum {
  name: string;
  value: number;
  /** Optional full label for tooltip */
  fullName?: string;
  /** CSS color or accent token for this bar */
  color?: string;
}

interface DepthBarChartProps {
  data: DepthBarDatum[];
  height?: number;
  className?: string;
  /** Default series color when a row omits `color`. */
  color?: string;
  valueLabel?: string;
  max?: number;
  layout?: 'horizontal' | 'vertical';
}

/**
 * Premium depth-filled bar chart — shared instrument for diligence-grade
 * screenshots. Uses volumetric gradients + soft glow; flat bars under
 * prefers-reduced-motion via CSS class on the wrapper.
 */
export function DepthBarChart({
  data,
  height = 300,
  className,
  color = 'var(--accent-cyan)',
  valueLabel = 'Score',
  max,
  layout = 'horizontal',
}: DepthBarChartProps) {
  const uid = useId().replace(/:/g, '');
  const seriesId = `depth-bar-${uid}`;

  const colors = useMemo(() => {
    const set = new Map<string, string>();
    data.forEach((d, i) => {
      const c = d.color ?? color;
      if (!set.has(c)) set.set(c, `${seriesId}-${i}`);
    });
    return set;
  }, [data, color, seriesId]);

  const domainMax = max ?? Math.max(100, ...data.map((d) => d.value), 1);

  return (
    <div className={cn('depth-bar-chart relative w-full', className)}>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-4 top-2 h-px bg-gradient-to-r from-transparent via-accent-cyan/35 to-transparent"
      />
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={layout === 'vertical' ? 'vertical' : 'horizontal'}
          margin={{ top: 16, right: 12, left: 8, bottom: layout === 'horizontal' ? 48 : 12 }}
        >
          <defs>
            {[...colors.entries()].map(([c, id]) => (
              <ChartDepthBarDefs key={id} id={id} color={c} />
            ))}
          </defs>
          <ChartGrid />
          {layout === 'horizontal' ? (
            <>
              <XAxis
                dataKey="name"
                {...axisProps}
                angle={-28}
                textAnchor="end"
                height={56}
                interval={0}
              />
              <YAxis domain={[0, domainMax]} {...axisProps} />
            </>
          ) : (
            <>
              <XAxis type="number" domain={[0, domainMax]} {...axisProps} />
              <YAxis type="category" dataKey="name" width={108} {...axisProps} />
            </>
          )}
          <Tooltip
            cursor={barCursor}
            content={<ChartTooltip />}
            formatter={(v) => [`${v}`, valueLabel]}
            labelFormatter={(_, payload) =>
              (payload?.[0]?.payload as DepthBarDatum | undefined)?.fullName ??
              (payload?.[0]?.payload as DepthBarDatum | undefined)?.name ??
              ''
            }
          />
          <Bar
            dataKey="value"
            name={valueLabel}
            radius={layout === 'horizontal' ? [8, 8, 3, 3] : [3, 8, 8, 3]}
            maxBarSize={48}
            isAnimationActive
          >
            {data.map((entry, i) => {
              const c = entry.color ?? color;
              const id = colors.get(c) ?? `${seriesId}-${i}`;
              return (
                <Cell
                  key={`${entry.name}-${i}`}
                  fill={`url(#${id}-depth)`}
                  stroke={`url(#${id}-side)`}
                  strokeWidth={1}
                  filter={`url(#${id}-glow)`}
                />
              );
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
