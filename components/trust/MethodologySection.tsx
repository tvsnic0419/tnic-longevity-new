import { CheckCircle2 } from 'lucide-react';
import { RevealCard } from '@/components/ui/RevealCard';

interface MethodologySectionProps {
  id: string;
  title: string;
  steps: { step: string; title: string; desc: string }[];
}

export function MethodologySection({ id, title, steps }: MethodologySectionProps) {
  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="mb-10 last:mb-0">
      <h2 id={`${id}-heading`} className="heading-section text-xl md:text-2xl mb-6">
        {title}
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {steps.map((s, i) => (
          <RevealCard key={s.step} index={i} className="rounded-xl p-5">
            <span className="text-label text-accent-emerald">{s.step}</span>
            <h3 className="heading-card mt-2 mb-2">{s.title}</h3>
            <p className="text-body-sm flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent-emerald shrink-0 mt-0.5" aria-hidden="true" />
              {s.desc}
            </p>
          </RevealCard>
        ))}
      </div>
    </section>
  );
}