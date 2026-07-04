'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, CheckCheck, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { starterStack } from '@/lib/journey';
import { useStack } from '@/context/PlatformContext';
import { getProductPick, type ProductPick } from '@/lib/product-picks';

function PickThumbnail({ pick }: { pick: ProductPick }) {
  const [src, setSrc] = useState(pick.imageSrc);
  return (
    <Image
      src={src}
      alt={`${pick.brand} ${pick.productName}`}
      width={72}
      height={90}
      className="object-contain bg-muted/30"
      onError={() => {
        if (src !== pick.fallbackImageSrc) setSrc(pick.fallbackImageSrc);
      }}
      unoptimized={src.endsWith('.svg')}
    />
  );
}

export function StarterStackCTA() {
  const { applyPreset } = useStack();
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const stackText = [
    `# ${starterStack.name}`,
    starterStack.subtitle,
    '',
    ...starterStack.compounds.map(
      (c) => `• ${c.name} — ${c.dose} (${c.timing})\n  Tier ${c.tier}: ${c.why}`,
    ),
    '',
    starterStack.disclaimer,
    '',
    'Build your custom stack: https://tnic.help/#stacks',
  ].join('\n');

  const copyStack = () => {
    navigator.clipboard.writeText(stackText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const loadInArchitect = () => {
    applyPreset('starter');
    document.getElementById('stacks')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-24 relative border-y border-border bg-gradient-to-b from-accent-violet/5 to-transparent">
      <div className="max-w-5xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-mono text-[10px] text-accent-violet tracking-widest mb-3">FREE LEAD MAGNET</p>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Get the Starter Defense Stack
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Three Tier-A compounds, clinical doses, AM timing, and the science behind each —
              the same entry protocol behind TNiC. Copy instantly or load into Stack Architect.
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={copyStack}
                className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-semibold text-sm hover:bg-accent-violet transition-all"
              >
                {copied ? <CheckCheck className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Stack Now'}
              </button>
              <button
                onClick={loadInArchitect}
                className="flex items-center gap-2 glass px-6 py-3 rounded-xl font-semibold text-sm hover:border-accent-violet/30 transition-all"
              >
                Load in Architect <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="gradient-border p-6">
            <p className="text-[10px] font-mono text-muted-foreground uppercase mb-4">{starterStack.name}</p>
            {starterStack.compounds.map((c) => {
              const pick = getProductPick(c.id);
              return (
                <div key={c.name} className="border-b border-border py-4 last:border-0">
                  <div className="flex gap-3">
                    {pick && (
                      <a
                        href={pick.purchaseUrl}
                        target="_blank"
                        rel="noopener noreferrer sponsored"
                        className="focus-ring shrink-0 rounded-xl overflow-hidden border border-border hover:border-accent-violet/40 transition"
                        aria-label={`${pick.productName} by ${pick.brand} — shop on manufacturer site`}
                      >
                        <PickThumbnail pick={pick} />
                      </a>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex justify-between items-start mb-1 gap-2">
                        <h3 className="font-bold">{c.name}</h3>
                        <span className="text-[10px] font-mono text-accent-emerald shrink-0">
                          Tier {c.tier}
                        </span>
                      </div>
                      <p className="text-xs font-mono text-muted-foreground mb-1">
                        {c.dose} · {c.timing}
                      </p>
                      <p className="text-xs text-muted-foreground">{c.why}</p>
                      {pick && (
                        <p className="text-[10px] text-accent-cyan mt-1.5">
                          Tap image → {pick.brand}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <p className="text-[10px] text-caption mt-4">{starterStack.disclaimer}</p>

            {!submitted ? (
              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground mb-3">Or email it to yourself:</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 bg-muted/50 border border-border rounded-lg px-3 py-2 text-sm outline-none focus:border-accent-violet/50"
                  />
                  <button
                    onClick={() => email.includes('@') && setSubmitted(true)}
                    disabled={!email.includes('@')}
                    className="flex items-center gap-1 bg-accent-violet text-black px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-30"
                  >
                    <Download className="w-4 h-4" />
                    Send
                  </button>
                </div>
              </div>
            ) : (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-sm text-accent-emerald mt-6 pt-4 border-t border-border"
              >
                Stack summary queued for {email}. (Connect Resend/ConvertKit in production.)
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}