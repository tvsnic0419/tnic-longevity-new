/**
 * Bootstraps the CSS scroll-reveal (see "Scroll reveal" in globals.css).
 *
 * Mounted once, app-wide. Replaces what used to be ~100 framer-motion
 * `motion.div`s hydrating on the homepage alone: the marker class is set
 * before paint so items start hidden without a flash, and a single
 * IntersectionObserver reveals them — including any added later, via a
 * MutationObserver — instead of one observer per item.
 *
 * Renders no DOM of its own and ships no React runtime work: it is a plain
 * inline script, so the sections using RevealItem stay server components.
 */
const BOOTSTRAP = `(function(){
  var d = document, el = d.documentElement;
  // Respect reduced motion by simply never hiding anything.
  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!('IntersectionObserver' in window)) return;
  el.classList.add('js-reveal');
  function start(){
    var io = new IntersectionObserver(function(entries){
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.classList.add('is-visible');
          io.unobserve(entries[i].target);
        }
      }
    }, { rootMargin: '0px 0px -80px 0px' });
    function observeAll(root){
      var nodes = (root || d).querySelectorAll('.reveal-item:not(.is-visible)');
      for (var i = 0; i < nodes.length; i++) io.observe(nodes[i]);
    }
    observeAll();
    // Client-rendered sections can mount reveal items after hydration.
    new MutationObserver(function(muts){
      for (var i = 0; i < muts.length; i++) {
        var added = muts[i].addedNodes;
        for (var j = 0; j < added.length; j++) {
          if (added[j].nodeType === 1) {
            if (added[j].classList && added[j].classList.contains('reveal-item')) io.observe(added[j]);
            observeAll(added[j]);
          }
        }
      }
    }).observe(d.body, { childList: true, subtree: true });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', start);
  else start();
})();`;

export function RevealScript() {
  return <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />;
}
