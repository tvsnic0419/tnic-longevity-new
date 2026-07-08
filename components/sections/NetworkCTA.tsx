'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2 } from 'lucide-react';

const interests = [
  { id: 'stacks', label: 'Stack Protocols' },
  { id: 'research', label: 'Research Briefs' },
  { id: 'biomarkers', label: 'Biomarker Beta' },
  { id: 'clinical', label: 'Clinical Network' },
];

export function NetworkCTA() {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [selected, setSelected] = useState<string[]>(['stacks', 'research']);
  const [done, setDone] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  if (done) {
    return (
      <section className="py-32 relative">
        <div className="section-divider absolute top-0 left-0 right-0" />
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg mx-auto px-6 text-center"
        >
          <CheckCircle2 className="w-16 h-16 text-accent-emerald mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-3">You&apos;re In The Network</h2>
          <p className="text-muted-foreground">
            Defense protocols and intelligence briefs will arrive at {email}.
            Your first stack recommendation is being calibrated.
          </p>
        </motion.div>
      </section>
    );
  }

  return (
    <section className="py-32 relative">
      <div className="section-divider absolute top-0 left-0 right-0" />
      <div className="max-w-xl mx-auto px-6">
        <div className="text-center mb-10">
          <p className="font-mono text-[10px] text-accent-cyan tracking-widest mb-3">MOD-NET-07</p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">
            Join The Defense Network
          </h2>
          <p className="text-muted-foreground text-sm">
            Step {step + 1} of 2 — tell us what intelligence you need.
          </p>
          <div className="flex gap-2 justify-center mt-4">
            {[0, 1].map((s) => (
              <div
                key={s}
                className={`h-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'w-8 bg-accent-cyan' : 'w-4 bg-zinc-700'
                }`}
              />
            ))}
          </div>
        </div>

        <div className="gradient-border p-8 md:p-10">
          {step === 0 ? (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-sm text-muted-foreground mb-6">Select your intelligence interests:</p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {interests.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggle(item.id)}
                    className={`p-4 rounded-xl text-sm font-semibold transition-all ${
                      selected.includes(item.id)
                        ? 'bg-accent-cyan/10 border border-accent-cyan/30 text-accent-cyan'
                        : 'glass text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setStep(1)}
                disabled={selected.length === 0}
                className="w-full flex items-center justify-center gap-2 bg-white text-black py-4 rounded-2xl font-semibold hover:bg-accent-cyan transition-all disabled:opacity-30"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <p className="text-sm text-muted-foreground mb-4">
                Receiving {selected.length} intelligence stream{selected.length > 1 ? 's' : ''}:
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {selected.map((id) => (
                  <span key={id} className="text-xs bg-accent-cyan/10 text-accent-cyan px-3 py-1 rounded-full">
                    {interests.find((i) => i.id === id)?.label}
                  </span>
                ))}
              </div>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted/50 border border-border rounded-xl px-5 py-4 text-sm placeholder:text-caption focus:outline-none focus:border-accent-cyan/50 transition mb-4"
              />
              <button
                onClick={() => email.includes('@') && setDone(true)}
                disabled={!email.includes('@')}
                className="w-full bg-accent-cyan text-black py-4 rounded-2xl font-bold hover:bg-accent-emerald transition-all disabled:opacity-30"
              >
                Activate Network Access
              </button>
              <button
                onClick={() => setStep(0)}
                className="w-full text-xs text-muted-foreground hover:text-foreground/80 mt-3 py-2 transition"
              >
                ← Back
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}