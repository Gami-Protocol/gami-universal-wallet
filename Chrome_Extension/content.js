(function () {
  const hasGami = !!document.querySelector('meta[name="gami-protocol"]') || window.__GAMI_CONFIG__;

  if (!hasGami) return;

  function sendEvent(type, payload) {
    window.postMessage({ type: 'GAMI_EVENT', payload: { type, ...payload } });
  }

  document.addEventListener('click', (e) => {
    const el = e.target;
    if (!el) return;

    sendEvent('click', { tag: el.tagName });
  });

  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const scrollPercent = (window.scrollY / document.body.scrollHeight) * 100;
    if (scrollPercent - lastScroll > 25) {
      lastScroll = scrollPercent;
      sendEvent('scroll', { percent: Math.round(scrollPercent) });
    }
  });
})();
