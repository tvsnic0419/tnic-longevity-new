export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-accent-cyan focus:text-black focus:px-5 focus:py-3 focus:rounded-xl focus:font-semibold focus:text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-[#030712]"
    >
      Skip to main content
    </a>
  );
}