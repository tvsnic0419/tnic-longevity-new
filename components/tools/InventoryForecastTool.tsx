'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { Package, CalendarClock, Boxes, ShoppingCart } from 'lucide-react';
import { usePlatform } from '@/context/PlatformContext';
import {
  forecastInventory,
  CYCLE_WEEKS,
  DAYS_PER_WEEK,
  DEFAULT_SERVINGS_PER_CONTAINER,
} from '@/lib/tools/inventory-forecast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Slider } from '@/components/ui/Slider';
import { Badge } from '@/components/ui/Badge';
import { ToolDisclaimer } from './ToolDisclaimer';

export function InventoryForecastTool() {
  const { selected } = usePlatform();

  const [cycleWeeks, setCycleWeeks] = useState<number>(CYCLE_WEEKS);
  const [adherencePct, setAdherencePct] = useState<number>(90);
  const [servingsPerContainer, setServingsPerContainer] = useState<number>(
    DEFAULT_SERVINGS_PER_CONTAINER,
  );

  const forecast = useMemo(
    () =>
      forecastInventory({
        compoundIds: selected,
        adherencePct,
        cycleDays: cycleWeeks * DAYS_PER_WEEK,
        servingsPerContainer,
      }),
    [selected, adherencePct, cycleWeeks, servingsPerContainer],
  );

  const hasStack = forecast.items.length > 0;

  return (
    <div className="space-y-6">
      <ToolDisclaimer variant="info" />

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Controls */}
        <div className="lg:col-span-4 space-y-5">
          <Card elevated>
            <CardHeader>
              <CardTitle>Cycle inputs</CardTitle>
              <CardDescription>
                Reads your active stack and projects how much you&apos;ll go through over an
                adherence-weighted protocol cycle.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <Slider
                label="Cycle length"
                value={cycleWeeks}
                onChange={setCycleWeeks}
                min={4}
                max={52}
                unit=" wk"
                hint={`${cycleWeeks * DAYS_PER_WEEK}-day cycle`}
              />
              <Slider
                label="Adherence"
                value={adherencePct}
                onChange={setAdherencePct}
                min={0}
                max={100}
                unit="%"
                hint="Share of scheduled doses you expect to actually take"
              />
              <Slider
                label="Servings / container"
                value={servingsPerContainer}
                onChange={setServingsPerContainer}
                min={15}
                max={180}
                step={5}
                hint="Bottle or pouch count. Adjust per product label."
              />
              <div className="text-xs space-y-1 pt-2 border-t border-border">
                <p className="text-muted-foreground">
                  Active stack:{' '}
                  <span className="text-accent-violet">{selected.length} compounds</span>
                </p>
                <p className="text-muted-foreground">
                  Cycle: <span className="text-accent-cyan">{forecast.cycleWeeks} weeks</span> ·{' '}
                  <span className="text-accent-cyan">{forecast.cycleDays} days</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results */}
        <div className="lg:col-span-8 space-y-5">
          <div className="grid sm:grid-cols-3 gap-4">
            <Card elevated className="text-center">
              <p className="text-label text-accent-cyan mb-1 flex items-center justify-center gap-1.5">
                <ShoppingCart className="w-3.5 h-3.5" /> Containers / cycle
              </p>
              <p className="text-4xl font-bold text-foreground">
                {forecast.totals.containersNeeded}
              </p>
              <p className="text-caption text-muted-foreground mt-1">
                at {forecast.adherencePct}% adherence
              </p>
            </Card>
            <Card elevated className="text-center">
              <p className="text-label text-accent-violet mb-1 flex items-center justify-center gap-1.5">
                <Boxes className="w-3.5 h-3.5" /> Containers / month
              </p>
              <p className="text-4xl font-bold text-foreground">
                {forecast.totals.containersPerMonth}
              </p>
              <p className="text-caption text-muted-foreground mt-1">reorder cadence</p>
            </Card>
            <Card elevated className="text-center">
              <p className="text-label text-accent-emerald mb-1 flex items-center justify-center gap-1.5">
                <CalendarClock className="w-3.5 h-3.5" /> Doses / cycle
              </p>
              <p className="text-4xl font-bold text-foreground">
                {forecast.totals.expectedDoses.toLocaleString()}
              </p>
              <p className="text-caption text-muted-foreground mt-1">expected servings</p>
            </Card>
          </div>

          <Card elevated>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-4 h-4 text-accent-cyan" /> Projected inventory
              </CardTitle>
              <CardDescription>
                Per-compound consumption and containers needed to cover a full{' '}
                {forecast.cycleWeeks}-week cycle without running out.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasStack ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-caption text-muted-foreground border-b border-border">
                        <th className="py-2 pr-3 font-medium">Compound</th>
                        <th className="py-2 px-3 font-medium text-center">Timing</th>
                        <th className="py-2 px-3 font-medium text-right">Doses/day</th>
                        <th className="py-2 px-3 font-medium text-right">Expected doses</th>
                        <th className="py-2 px-3 font-medium text-right">Container lasts</th>
                        <th className="py-2 pl-3 font-medium text-right">Containers</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecast.items.map((item) => (
                        <tr key={item.compoundId} className="border-b border-border/40">
                          <td className="py-2.5 pr-3">
                            <span className="font-medium text-foreground">{item.name}</span>
                            <span className="block text-caption text-muted-foreground">
                              {item.dose}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-center">
                            <Badge variant="outline">{item.timing}</Badge>
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-muted-foreground">
                            {item.dosesPerDay}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-foreground">
                            {item.expectedDoses.toLocaleString()}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-muted-foreground">
                            {item.daysPerContainer === null ? '—' : `${item.daysPerContainer}d`}
                          </td>
                          <td className="py-2.5 pl-3 text-right font-mono tabular-nums text-accent-cyan font-semibold">
                            {item.containersNeeded}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="font-semibold">
                        <td className="py-2.5 pr-3" colSpan={3}>
                          Total
                        </td>
                        <td className="py-2.5 px-3 text-right font-mono tabular-nums text-foreground">
                          {forecast.totals.expectedDoses.toLocaleString()}
                        </td>
                        <td className="py-2.5 px-3" />
                        <td className="py-2.5 pl-3 text-right font-mono tabular-nums text-accent-cyan">
                          {forecast.totals.containersNeeded}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="w-8 h-8 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-body-sm text-muted-foreground mb-3">
                    Your active stack is empty. Add compounds to project inventory requirements.
                  </p>
                  <Link
                    href="/stacks"
                    className="text-sm text-accent-cyan hover:text-accent-emerald"
                  >
                    Build your stack →
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
