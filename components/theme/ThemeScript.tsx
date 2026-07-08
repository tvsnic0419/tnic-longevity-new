/** Inline script to set theme before paint — prevents flash */
export function ThemeScript() {
  const script = `(function(){try{var k='tnic-theme';var s=localStorage.getItem(k);var r=s==='light'?'light':'dark';document.documentElement.setAttribute('data-theme',r);document.documentElement.style.colorScheme=r;}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}