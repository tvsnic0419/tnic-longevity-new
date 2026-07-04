import { Beaker, Dna } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { DataTable } from '@/components/ui/DataTable';
import { Progress } from '@/components/ui/Progress';
import { HallmarkIcon } from '@/components/library/HallmarkIcon';
import { PathwayDiagram } from '@/components/library/PathwayDiagram';
import { InterventionCompare } from '@/components/library/InterventionCompare';
import { hallmarkVisualRegistry } from '@/lib/hallmark-visuals';

/** Live reference for TNiC v2 tokens — import in docs or dev previews */
export function DesignSystemExamples() {
  return (
    <section className="space-y-10" aria-label="Design system examples">
      <div>
        <p className="text-label mb-3">Buttons</p>
        <div className="flex flex-wrap gap-3">
          <Button>Primary CTA</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline" theme="emerald" icon={Beaker}>
            Emerald
          </Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card variant="scientific">
          <CardHeader>
            <CardTitle>Scientific card</CardTitle>
            <CardDescription>Glass surfaces adapt to light and dark themes.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-2">
            <Badge variant="success">Optimal</Badge>
            <Badge variant="warning">Watch</Badge>
            <Badge variant="info">Tier B</Badge>
          </CardContent>
        </Card>
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Progress & status</CardTitle>
            <CardDescription>Hopeful emerald-cyan gradients for trajectories.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={72} label="Protocol adherence" color="emerald" />
            <Progress value={45} label="Biomarker coverage" color="cyan" />
          </CardContent>
        </Card>
      </div>

      <div>
        <p className="text-label mb-3">Data table</p>
        <DataTable caption="Example biomarker targets">
          <thead>
            <tr>
              <th>Marker</th>
              <th>Target</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>hs-CRP</td>
              <td>&lt; 1.0 mg/L</td>
              <td className="text-accent-emerald">Optimal</td>
            </tr>
            <tr>
              <td>HbA1c</td>
              <td>&lt; 5.4%</td>
              <td className="text-accent-amber">Watch</td>
            </tr>
          </tbody>
        </DataTable>
      </div>

      <div>
        <p className="text-label mb-3">Hallmark icons (12)</p>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-12 gap-3">
          {Object.values(hallmarkVisualRegistry).map((h) => (
            <div
              key={h.id}
              className="flex flex-col items-center gap-1.5 rounded-lg border border-border bg-card/40 p-2"
              title={h.label}
            >
              <HallmarkIcon type={h.id} size={32} />
              <span className="text-[9px] font-mono text-caption text-center leading-tight">
                {h.shortLabel}
              </span>
            </div>
          ))}
        </div>
      </div>

      <PathwayDiagram
        title="Example pathway — nutrient sensing"
        nodes={[
          { id: 'diet', label: 'Caloric input', sublabel: 'Diet', accent: 'amber' },
          { id: 'mtor', label: 'mTOR', sublabel: 'Growth', accent: 'rose' },
          { id: 'ampk', label: 'AMPK', sublabel: 'Repair', accent: 'emerald' },
          { id: 'autophagy', label: 'Autophagy', sublabel: 'Cleanup', accent: 'cyan' },
        ]}
        edges={[
          { from: 'diet', to: 'mtor', label: 'feeds' },
          { from: 'mtor', to: 'ampk', label: 'inhibits' },
          { from: 'ampk', to: 'autophagy', label: 'activates' },
        ]}
      />

      <InterventionCompare
        title="Educational before/after (not personal advice)"
        metrics={[
          { label: 'Inflammation (hs-CRP)', before: '2.4 mg/L', after: '1.1 mg/L' },
          { label: 'Metabolic (HbA1c)', before: '5.8%', after: '5.4%' },
          { label: 'Recovery score', before: '62 / 100', after: '78 / 100' },
        ]}
        summary="Illustrative trajectory when diet, sleep, and evidence-graded supplements align — individual results vary."
      />

      <div className="flex items-center gap-3 text-body-sm">
        <Dna className="w-4 h-4 text-accent-cyan shrink-0" aria-hidden="true" />
        <span>
          Tokens: <code className="text-accent-cyan">bg-background</code>,{' '}
          <code className="text-accent-cyan">text-accent-emerald</code>,{' '}
          <code className="text-accent-cyan">border-border</code> — see{' '}
          <code className="text-accent-cyan">app/globals.css</code> and{' '}
          <code className="text-accent-cyan">lib/design-system.ts</code>
        </span>
      </div>
    </section>
  );
}