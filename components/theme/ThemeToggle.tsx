'use client';

import { Moon, Sun, Monitor } from 'lucide-react';
import { useTheme, type ThemeMode } from './ThemeProvider';

const modes: { id: ThemeMode; icon: typeof Sun; label: string }[] = [
  { id: 'light', icon: Sun, label: 'Light' },
  { id: 'dark', icon: Moon, label: 'Dark' },
  { id: 'system', icon: Monitor, label: 'System' },
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme();

  if (compact) {
    const next = theme === 'dark' ? 'light' : theme === 'light' ? 'system' : 'dark';
    const Icon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;
    return (
      <button
        type="button"
        onClick={() => setTheme(next)}
        className="focus-ring interactive touch-target flex items-center justify-center rounded-lg text-muted-foreground hover:text-accent-cyan"
        aria-label={`Theme: ${theme}. Click to switch.`}
        title={`Theme: ${theme}`}
      >
        <Icon className="w-5 h-5" aria-hidden="true" />
      </button>
    );
  }

  return (
    <div
      className="inline-flex rounded-xl border border-border bg-surface/60 p-1 gap-0.5"
      role="group"
      aria-label="Color theme"
    >
      {modes.map(({ id, icon: Icon, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => setTheme(id)}
          aria-pressed={theme === id}
          className={`focus-ring interactive flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-colors ${
            theme === id
              ? 'bg-accent-cyan/15 text-accent-cyan border border-accent-cyan/25'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon className="w-3.5 h-3.5" aria-hidden="true" />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}