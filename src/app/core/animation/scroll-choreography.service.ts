import { Injectable } from '@angular/core';
import gsap from 'gsap';

/**
 * Coordinates safe, GPU-accelerated GSAP ScrollTrigger choreography across
 * homepage sections: masked editorial headline lifts (Arabic RTL safe), subtle
 * desktop photography parallax, hairline datum draws, and progressive staggers.
 *
 * Critical guarantee: Content ALWAYS remains at opacity: 1 in its resting CSS state
 * (no immediateRender opacity: 0 hiding). Entrances fire strictly inside
 * ScrollTrigger `onEnter` callbacks once per section, ensuring full visibility during
 * deep-link jumps, fast scrolling, delayed JS, and full-page rendering.
 */
@Injectable({ providedIn: 'root' })
export class ScrollChoreographyService {
  async initHomeScrollAnimations(
    scopeEl: HTMLElement,
    isRtl: boolean
  ): Promise<(() => void) | null> {
    if (
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return null;
    }

    const { ScrollTrigger } = await import('gsap/ScrollTrigger');
    gsap.registerPlugin(ScrollTrigger);

    const dirSign = isRtl ? -1 : 1;

    const animateEditorialHeader = (
      tl: gsap.core.Timeline,
      root: HTMLElement,
      eyebrowSel: string,
      titleSel: string,
      leadSel?: string
    ) => {
      const eyebrow = root.querySelector(eyebrowSel);
      const title = root.querySelector(titleSel);
      const lead = leadSel ? root.querySelector(leadSel) : null;

      if (eyebrow) {
        tl.fromTo(
          eyebrow,
          { opacity: 0.25, x: -12 * dirSign },
          { opacity: 1, x: 0, duration: 0.55, ease: 'power3.out', clearProps: 'transform,opacity' },
          0
        );
      }

      if (title) {
        // Clip-path vertical reveal preserves connected Arabic glyphs cleanly
        tl.fromTo(
          title,
          { opacity: 0.35, y: 22, clipPath: 'inset(0 0 100% 0)' },
          {
            opacity: 1,
            y: 0,
            clipPath: 'inset(0 0 0% 0)',
            duration: 0.72,
            ease: 'power4.out',
            clearProps: 'clipPath,transform,opacity',
          },
          0.05
        );
      }

      if (lead) {
        tl.fromTo(
          lead,
          { opacity: 0.35, y: 16 },
          { opacity: 1, y: 0, duration: 0.58, ease: 'power3.out', clearProps: 'transform,opacity' },
          0.14
        );
      }
    };

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      // 0. Subtle Desktop Hero Photography Parallax on Scroll Exit
      mm.add('(min-width: 1024px)', () => {
        const heroSection = scopeEl.querySelector<HTMLElement>('app-hero .hero');
        const heroBg = scopeEl.querySelector<HTMLElement>('app-hero .hero-image-bg');
        if (heroSection && heroBg) {
          gsap.to(heroBg, {
            yPercent: 10,
            scale: 1.05,
            ease: 'none',
            scrollTrigger: {
              trigger: heroSection,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          });
        }
      });

      // 1. Solutions Showcase (#solutions)
      const solutionsRoot = scopeEl.querySelector<HTMLElement>('#solutions');
      if (solutionsRoot) {
        ScrollTrigger.create({
          trigger: solutionsRoot,
          start: 'top 86%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            animateEditorialHeader(tl, solutionsRoot, '.section-eyebrow', '.section-headline');

            const navGroup = solutionsRoot.querySelector('.header-nav-group');
            const stage = solutionsRoot.querySelector('.cinema-stage');

            if (navGroup) {
              tl.fromTo(
                navGroup,
                { opacity: 0.35, y: 12 },
                { opacity: 1, y: 0, duration: 0.52, clearProps: 'transform,opacity' },
                0.12
              );
            }

            if (stage) {
              tl.fromTo(
                stage,
                { opacity: 0.5, y: 24, scale: 0.985 },
                {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  duration: 0.72,
                  ease: 'power3.out',
                  clearProps: 'transform,opacity',
                },
                0.14
              );
            }
          },
        });
      }

      // 2. Industries We Serve (#industries)
      const industriesRoot = scopeEl.querySelector<HTMLElement>('#industries');
      if (industriesRoot) {
        ScrollTrigger.create({
          trigger: industriesRoot,
          start: 'top 86%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            animateEditorialHeader(
              tl,
              industriesRoot,
              '.section-eyebrow',
              '.section-headline',
              '.header-desc'
            );

            const deck = industriesRoot.querySelector('.panels-deck');
            const panels = industriesRoot.querySelectorAll('.industry-panel');
            const caps = industriesRoot.querySelectorAll('.stage-cap-item');

            if (deck) {
              tl.fromTo(
                deck,
                { y: 22 },
                { y: 0, duration: 0.68, clearProps: 'transform' },
                0.12
              );
            }

            if (panels.length) {
              tl.fromTo(
                panels,
                { opacity: 0.6, y: 14 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.52,
                  stagger: 0.045,
                  clearProps: 'transform,opacity',
                },
                0.14
              );
            }

            if (caps.length) {
              tl.fromTo(
                caps,
                { opacity: 0.35, x: -10 * dirSign },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.38,
                  stagger: 0.055,
                  clearProps: 'transform,opacity',
                },
                0.26
              );
            }
          },
        });
      }

      // 3. Hardware (#hardware) coordinates its own safe onEnter reveal

      // 4. Clients & References (#references)
      const refsRoot = scopeEl.querySelector<HTMLElement>('#references');
      if (refsRoot) {
        ScrollTrigger.create({
          trigger: refsRoot,
          start: 'top 86%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            animateEditorialHeader(
              tl,
              refsRoot,
              '.section-eyebrow',
              '.section-headline',
              '.header-desc'
            );

            const headerActions = refsRoot.querySelector('.header-actions');
            const marquee = refsRoot.querySelector('.marquee-shell, .references-grid');
            const countEl = refsRoot.querySelector<HTMLElement>('.partner-count strong');

            if (headerActions) {
              tl.fromTo(
                headerActions,
                { opacity: 0.35, y: 12 },
                { opacity: 1, y: 0, duration: 0.5, clearProps: 'transform,opacity' },
                0.12
              );
            }

            if (marquee) {
              tl.fromTo(
                marquee,
                { opacity: 0.45, y: 16 },
                { opacity: 1, y: 0, duration: 0.62, clearProps: 'transform,opacity' },
                0.18
              );
            }

            if (countEl) {
              const targetNum = parseInt(countEl.textContent ?? '0', 10);
              if (targetNum > 0) {
                const counter = { val: 1 };
                tl.to(
                  counter,
                  {
                    val: targetNum,
                    duration: 0.95,
                    ease: 'power3.out',
                    onUpdate: () => {
                      countEl.textContent = `${Math.round(counter.val)}+`;
                    },
                  },
                  0.14
                );
              }
            }
          },
        });
      }

      // 5. Contact Us (#contact)
      const contactRoot = scopeEl.querySelector<HTMLElement>('#contact');
      if (contactRoot) {
        ScrollTrigger.create({
          trigger: contactRoot,
          start: 'top 86%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            animateEditorialHeader(
              tl,
              contactRoot,
              '.section-eyebrow',
              '.section-headline',
              '.section-desc'
            );

            const infoRows = contactRoot.querySelectorAll('.info-row');
            const mapFrame = contactRoot.querySelector('.map-frame');
            const formCol = contactRoot.querySelector('.contact-form-col');

            if (infoRows.length) {
              tl.fromTo(
                infoRows,
                { opacity: 0.35, x: -10 * dirSign },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.44,
                  stagger: 0.06,
                  clearProps: 'transform,opacity',
                },
                0.16
              );
            }

            if (mapFrame) {
              tl.fromTo(
                mapFrame,
                { opacity: 0.55, y: 18 },
                { opacity: 1, y: 0, duration: 0.6, clearProps: 'transform,opacity' },
                0.22
              );
            }

            if (formCol) {
              tl.fromTo(
                formCol,
                { opacity: 0.55, y: 22 },
                { opacity: 1, y: 0, duration: 0.64, clearProps: 'transform,opacity' },
                0.16
              );
            }
          },
        });
      }
    }, scopeEl);

    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }
}
