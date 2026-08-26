import { SubPageLayout } from '@/components/layouts/SubPageLayout';

export default function ToolsLayout({ children }: { children: React.ReactNode }) {
  // hideStackReadout: /tools/pathway-architect renders its own stack-coverage
  // analysis, so the ContextBar's persisted-stack readout would show a second
  // coverage number for the same stack. The /tools index doesn't rely on that
  // readout, so scoping it to the whole folder is the clean single-source fix
  // (the page previously double-wrapped SubPageLayout to get this).
  return <SubPageLayout hideStackReadout>{children}</SubPageLayout>;
}