/**
 * Global OS-chrome event names.
 *
 * These live in their own dependency-free module so that components which
 * only *dispatch* an event (Nav, SiteSearch, ContextBar, Dashboard) don't
 * pull the heavy overlay implementations — and their content-index
 * dependency graphs — into every page bundle.
 */
export const COMMAND_PALETTE_EVENT = 'tnic:command-palette-open';
export const EXPORT_KIT_EVENT = 'tnic:export-kit-open';
