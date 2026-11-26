import type GsapType from 'gsap';
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger';

let gsapPromise: Promise<typeof GsapType> | null = null;
let scrollTriggerPromise: Promise<{
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
}> | null = null;

/**
 * Lazily loads GSAP core once and caches the module promise across all animations.
 */
export function loadGsap(): Promise<typeof GsapType> {
  if (!gsapPromise) {
    gsapPromise = import('gsap').then((m) => m.default);
  }
  return gsapPromise;
}

/**
 * Lazily loads GSAP + ScrollTrigger together and registers the plugin once.
 */
export function loadGsapWithScrollTrigger(): Promise<{
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
}> {
  if (!scrollTriggerPromise) {
    scrollTriggerPromise = Promise.all([loadGsap(), import('gsap/ScrollTrigger')]).then(
      ([gsap, { ScrollTrigger }]) => {
        gsap.registerPlugin(ScrollTrigger);
        return { gsap, ScrollTrigger };
      }
    );
  }
  return scrollTriggerPromise;
}
