// Window-event names used to open the OS overlays (command palette, export
// kit) from anywhere in the app. Kept in this dependency-free module so that
// call sites can dispatch/listen for them without importing the overlay
// components — those pull in the full compound/hallmark data layer, which we
// defer until an overlay is actually opened (see OsOverlays).
export const COMMAND_PALETTE_EVENT = 'tnic:command-palette-open';
export const EXPORT_KIT_EVENT = 'tnic:export-kit-open';
