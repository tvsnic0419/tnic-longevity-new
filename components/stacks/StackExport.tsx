'use client';

import { useState } from 'react';
import { Copy, CheckCheck, Download, FileJson, Share2 } from 'lucide-react';
import { useStack } from '@/context/PlatformContext';
import { analyzeStack, formatStackExport, formatStackJson } from '@/lib/stack-analysis';
import {
  formatSimulatorExport,
  type StackSimulatorResult,
} from '@/lib/tools/stack-simulator';

interface StackExportProps {
  stackName?: string;
  /** When provided, export includes age-adjusted doses and risk profile */
  simulatorResult?: StackSimulatorResult;
  age?: number;
}

export function StackExport({ stackName, simulatorResult, age }: StackExportProps) {
  const { selected, shareUrl } = useStack();
  const [copied, setCopied] = useState<'text' | 'json' | 'url' | null>(null);
  const analysis = simulatorResult?.analysis ?? analyzeStack(selected);

  const textExport = simulatorResult
    ? formatSimulatorExport(simulatorResult, shareUrl, age ?? 48)
    : formatStackExport(selected, analysis, shareUrl);

  const jsonExport = () => {
    const base = JSON.parse(formatStackJson(selected, analysis, stackName));
    if (simulatorResult) {
      return JSON.stringify(
        {
          ...base,
          simulator: {
            age: age ?? 48,
            riskScore: simulatorResult.riskScore,
            riskLevel: simulatorResult.riskLevel,
            personalizedDoses: simulatorResult.personalizedDoses,
            summaryVerdict: simulatorResult.summaryVerdict,
          },
        },
        null,
        2,
      );
    }
    return formatStackJson(selected, analysis, stackName);
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(textExport);
    setCopied('text');
    setTimeout(() => setCopied(null), 2000);
  };

  const copyJson = async () => {
    await navigator.clipboard.writeText(jsonExport());
    setCopied('json');
    setTimeout(() => setCopied(null), 2000);
  };

  const downloadJson = () => {
    const blob = new Blob([jsonExport()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tnic-stack-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const share = async () => {
    if (navigator.share) {
      await navigator.share({ title: stackName ?? 'My TNiC Stack', url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      setCopied('url');
      setTimeout(() => setCopied(null), 2000);
    }
  };

  if (selected.length === 0) return null;

  return (
    <div className="glass rounded-2xl p-5">
      <p className="text-label text-accent-violet mb-4">Export protocol</p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <button
          type="button"
          onClick={copyText}
          className="focus-ring interactive flex flex-col items-center gap-1.5 glass py-3 rounded-xl text-xs font-semibold hover:border-accent-violet/30"
        >
          {copied === 'text' ? <CheckCheck className="w-4 h-4 text-accent-emerald" /> : <Copy className="w-4 h-4" />}
          {copied === 'text' ? 'Copied!' : 'Copy Text'}
        </button>
        <button
          type="button"
          onClick={copyJson}
          className="focus-ring interactive flex flex-col items-center gap-1.5 glass py-3 rounded-xl text-xs font-semibold hover:border-accent-violet/30"
        >
          {copied === 'json' ? <CheckCheck className="w-4 h-4 text-accent-emerald" /> : <FileJson className="w-4 h-4" />}
          {copied === 'json' ? 'Copied!' : 'Copy JSON'}
        </button>
        <button
          type="button"
          onClick={downloadJson}
          className="focus-ring interactive flex flex-col items-center gap-1.5 glass py-3 rounded-xl text-xs font-semibold hover:border-accent-violet/30"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          Download
        </button>
        <button
          type="button"
          onClick={share}
          className="focus-ring interactive flex flex-col items-center gap-1.5 bg-accent-violet text-primary-foreground py-3 rounded-xl text-xs font-semibold hover:bg-accent-cyan"
        >
          {copied === 'url' ? <CheckCheck className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          {copied === 'url' ? 'Copied!' : 'Share'}
        </button>
      </div>
    </div>
  );
}