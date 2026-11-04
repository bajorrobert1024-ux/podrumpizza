/* Silent illustrative motion made from the site's photographs. */
(() => {
  'use strict';
  const video=document.getElementById('hero-video');
  const button=document.getElementById('hero-video-toggle');
  const fallback=document.getElementById('hero-video-fallback');
  if (!video || !button) return;
  const motion=matchMedia('(prefers-reduced-motion: reduce)');
  let inView=true, userPaused=false, userRequested=false, failed=false;
  video.muted=true;
  function updateButton() {
    const playing=!video.paused && !video.ended;
    button.dataset.state=playing ? 'playing' : 'paused';
    button.setAttribute('aria-label',playing ? 'Pauziraj video' : 'Pokreni video');
    button.setAttribute('aria-pressed',String(playing));
  }
  function reconcile() {
    if (failed) return;
    if (inView && !document.hidden && !userPaused && (!motion.matches || userRequested)) {
      video.play().catch(playbackFailure);
    } else video.pause();
  }
  if (motion.matches) { video.autoplay=false; video.removeAttribute('autoplay'); video.pause(); }
  button.addEventListener('click',() => {
    if (video.paused) { userPaused=false; userRequested=true; video.play().catch(playbackFailure); }
    else { userPaused=true; video.pause(); }
  });
  video.addEventListener('play',updateButton);
  video.addEventListener('pause',updateButton);
  function showFallback() {
    failed=true; video.pause(); video.hidden=true; button.hidden=true;
    if (fallback) fallback.hidden=false;
  }
  function playbackFailure() {
    if (video.error || video.networkState === video.NETWORK_NO_SOURCE) showFallback();
    else updateButton();
  }
  video.addEventListener('error',showFallback);
  video.querySelector('source')?.addEventListener('error',showFallback);
  // A cached or early network failure can occur before deferred scripts attach.
  if (video.error || video.networkState === video.NETWORK_NO_SOURCE) showFallback();
  video.addEventListener('loadeddata',reconcile);
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    inView=entries[0].isIntersecting; reconcile();
  },{threshold:.1}).observe(video);
  document.addEventListener('visibilitychange',reconcile);
  motion.addEventListener('change',() => { userRequested=false; reconcile(); });
  updateButton(); reconcile();
})();
