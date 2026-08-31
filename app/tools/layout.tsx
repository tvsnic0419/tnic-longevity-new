import { SubPageLayout } from '@/components/layouts/SubPageLayout';

// `hideStackReadout` lives here, on the segment layout, rather than on the
// individual tool pages: every route under /tools scores a stack against its
// own curated dataset, so the ContextBar's persisted-stack readout would put a
// second, differently-derived coverage number on the same screen. Setting it
// once here also keeps tool pages from re-wrapping in their own SubPageLayout
// to get it — which previously rendered the whole shell twice (two <nav>, two
// <main id="main-content">, two <footer>) on /tools/pathway-architect.
export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  return <SubPageLayout hideStackReadout>{children}</SubPageLayout>;
}