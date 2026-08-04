// Tiny pub/sub so HeroIntroOverlay (sibling component) can know when
// DesktopHeroVideo's <video> has buffered enough to play through without
// stalling. A plain module-level flag + listener set — DesktopHeroVideo and
// HeroIntroOverlay have no shared parent state, and this is simpler than
// wiring context for a single boolean. Storing the "already ready" flag
// avoids the race where the video fires canPlayThrough before the overlay's
// effect has subscribed.
let ready = false;
const listeners = new Set<() => void>();

export function markHeroVideoReady() {
  if (ready) return;
  ready = true;
  listeners.forEach((listener) => listener());
  listeners.clear();
}

export function onHeroVideoReady(callback: () => void) {
  if (ready) {
    callback();
    return () => {};
  }
  listeners.add(callback);
  return () => listeners.delete(callback);
}
