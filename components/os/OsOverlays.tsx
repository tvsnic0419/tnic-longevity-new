'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { COMMAND_PALETTE_EVENT, EXPORT_KIT_EVENT } from './os-events';

// Both overlays pull in the full compound / hallmark / comparison data layer
// (~250 kB of source) through the command-palette index and export kit. They
// are only ever opened on interaction (⌘K, "/", or an in-app button), so we
// keep them out of the shared client bundle and load them on first use.
const CommandPalette = dynamic(
  () => import('./CommandPalette').then((m) => m.CommandPalette),
  { ssr: false },
);
const ExportKitModal = dynamic(
  () => import('./ExportKitModal').then((m) => m.ExportKitModal),
  { ssr: false },
);

/**
 * Lightweight launcher for the OS overlays. It owns the global open triggers
 * (keyboard shortcuts + window events) and only mounts a heavy overlay once it
 * has actually been requested. After first use an overlay stays mounted and is
 * shown/hidden via its `open` prop, so reopening is instant.
 */
export function OsOverlays() {
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [exportLoaded, setExportLoaded] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const openPalette = useCallback(() => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setPaletteLoaded(true);
    setPaletteOpen(true);
  }, []);

  const closePalette = useCallback(() => {
    setPaletteOpen(false);
    requestAnimationFrame(() => returnFocusRef.current?.focus());
  }, []);

  const openExport = useCallback(() => {
    setExportLoaded(true);
    setExportOpen(true);
  }, []);

  const closeExport = useCallback(() => setExportOpen(false), []);

  useEffect(() => {
    const onPaletteEvent = () => openPalette();
    const onExportEvent = () => openExport();
    window.addEventListener(COMMAND_PALETTE_EVENT, onPaletteEvent);
    window.addEventListener(EXPORT_KIT_EVENT, onExportEvent);
    return () => {
      window.removeEventListener(COMMAND_PALETTE_EVENT, onPaletteEvent);
      window.removeEventListener(EXPORT_KIT_EVENT, onExportEvent);
    };
  }, [openPalette, openExport]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const meta = e.metaKey || e.ctrlKey;

      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (paletteOpen) closePalette();
        else openPalette();
        return;
      }

      if (
        e.key === '/' &&
        !paletteOpen &&
        !(e.target instanceof HTMLInputElement) &&
        !(e.target instanceof HTMLTextAreaElement)
      ) {
        e.preventDefault();
        openPalette();
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [paletteOpen, openPalette, closePalette]);

  return (
    <>
      {paletteLoaded && <CommandPalette open={paletteOpen} onClose={closePalette} />}
      {exportLoaded && <ExportKitModal open={exportOpen} onClose={closeExport} />}
    </>
  );
}
