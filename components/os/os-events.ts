// Window-event names used to open the OS overlays (command palette, export
// kit) from anywhere in the app. Kept in this dependency-free module so that
// call sites can dispatch/listen for them without importing the overlay
// components — those pull in the full compound/hallmark data layer, which we
// defer until an overlay is actually opened (see OsOverlays).
export const COMMAND_PALETTE_EVENT = 'tnic:command-palette-open';
export const EXPORT_KIT_EVENT = 'tnic:export-kit-open';

export interface CommandPaletteOpenDetail {
  query?: string;
}

/**
 * Open the global TNiC knowledge search, optionally pre-populated with a query.
 *
 * Keeping the payload on the launcher event means the header search box,
 * contextual "explore" actions and any future entity link can all enter the
 * same discovery surface without importing the heavy command-palette data
 * layer — which is the whole reason this module is dependency-free.
 */
export function openCommandPalette(query = '') {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(
    new CustomEvent<CommandPaletteOpenDetail>(COMMAND_PALETTE_EVENT, {
      detail: { query },
    }),
  );
}
