import { Injectable } from '@angular/core';
import gsap from 'gsap';

/**
 * Coordinates GPU-accelerated GSAP ScrollTrigger entrance choreography across
 * all homepage sections while respecting reduced-motion and RTL direction.
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

    const ctx = gsap.context(() => {
      // 1. Subtle Hero Scroll Parallax (depth as user scrolls toward Solutions)
      const heroBg = scopeEl.querySelector('.hero-bg-image');
      const heroSection = scopeEl.querySelector('.hero-section');
      if (heroBg && heroSection) {
        gsap.to(heroBg, {
          yPercent: 10,
          ease: 'none',
          scrollTrigger: {
            trigger: heroSection,
            start: 'top top',
            end: 'bottom top',
            scrub: true,
          },
        });
      }

      // 2. Solutions Showcase (#solutions)
      const solutionsRoot = scopeEl.querySelector('#solutions');
      if (solutionsRoot) {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out', clearProps: 'transform,opacity' },
          scrollTrigger: {
            trigger: solutionsRoot,
            start: 'top 78%',
            once: true,
          },
        });

        const header = solutionsRoot.querySelector('.deck-header');
        const stage = solutionsRoot.querySelector('.deck-stage-wrap');
        const spotlight = solutionsRoot.querySelector('.spotlight-info');
        const pills = solutionsRoot.querySelectorAll('.selector-item');

        if (header) tl.from(header, { opacity: 0, y: 28, duration: 0.6 }, 0);
        if (stage) tl.from(stage, { opacity: 0, y: 34, scale: 0.95, duration: 0.72 }, 0.1);
        if (spotlight) tl.from(spotlight, { opacity: 0, y: 20, duration: 0.5 }, 0.24);
        if (pills.length) {
          tl.from(
            pills,
            { opacity: 0, y: 14, scale: 0.94, duration: 0.38, stagger: 0.055 },
            0.3
          );
        }
      }

      // 3. Industries We Serve (#industries)
      const industriesRoot = scopeEl.querySelector('#industries');
      if (industriesRoot) {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out', clearProps: 'transform,opacity' },
          scrollTrigger: {
            trigger: industriesRoot,
            start: 'top 78%',
            once: true,
          },
        });

        const header = industriesRoot.querySelector('.industries-header');
        const panels = industriesRoot.querySelectorAll('.industry-panel');
        const caps = industriesRoot.querySelectorAll('.stage-cap-item');

        if (header) tl.from(header, { opacity: 0, y: 26, duration: 0.58 }, 0);
        if (panels.length) {
          tl.from(
            panels,
            {
              opacity: 0,
              y: 30,
              scale: 0.96,
              duration: 0.62,
              stagger: 0.07,
              ease: 'power3.out',
            },
            0.12
          );
        }
        if (caps.length) {
          tl.from(
            caps,
            { opacity: 0, x: -16 * dirSign, duration: 0.36, stagger: 0.07 },
            0.38
          );
        }
      }

      // 5. Clients & References (#references)
      const refsRoot = scopeEl.querySelector('#references');
      if (refsRoot) {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out', clearProps: 'transform,opacity' },
          scrollTrigger: {
            trigger: refsRoot,
            start: 'top 80%',
            once: true,
          },
        });

        const headerCopy = refsRoot.querySelector('.header-copy');
        const headerActions = refsRoot.querySelector('.header-actions');
        const rows = refsRoot.querySelectorAll('.marquee-row');
        const countEl = refsRoot.querySelector<HTMLElement>('.partner-count strong');

        if (headerCopy) tl.from(headerCopy, { opacity: 0, y: 24, duration: 0.56 }, 0);
        if (headerActions) {
          tl.from(headerActions, { opacity: 0, y: 18, duration: 0.48 }, 0.12);
        }
        if (rows.length) {
          rows.forEach((row, idx) => {
            const slideFrom = (idx % 2 === 0 ? 34 : -34) * dirSign;
            tl.from(row, { opacity: 0, x: slideFrom, duration: 0.65 }, 0.2 + idx * 0.1);
          });
        }

        // Animated partner counter (0+ -> N+)
        if (countEl) {
          const targetNum = parseInt(countEl.textContent ?? '0', 10);
          if (targetNum > 0) {
            const counter = { val: 0 };
            tl.to(
              counter,
              {
                val: targetNum,
                duration: 1.1,
                ease: 'power2.out',
                onUpdate: () => {
                  countEl.textContent = `${Math.round(counter.val)}+`;
                },
              },
              0.15
            );
          }
        }
      }

      // 6. Contact Us (#contact)
      const contactRoot = scopeEl.querySelector('#contact');
      if (contactRoot) {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out', clearProps: 'transform,opacity' },
          scrollTrigger: {
            trigger: contactRoot,
            start: 'top 78%',
            once: true,
          },
        });

        const header = contactRoot.querySelector('.contact-header');
        const infoRows = contactRoot.querySelectorAll('.info-row');
        const mapFrame = contactRoot.querySelector('.map-frame');
        const formCol = contactRoot.querySelector('.contact-form-col');
        const topicPills = contactRoot.querySelectorAll('.topic-pill');

        if (header) tl.from(header, { opacity: 0, y: 24, duration: 0.55 }, 0);
        if (infoRows.length) {
          tl.from(
            infoRows,
            { opacity: 0, x: -18 * dirSign, duration: 0.42, stagger: 0.08 },
            0.12
          );
        }
        if (mapFrame) tl.from(mapFrame, { opacity: 0, y: 24, scale: 0.97, duration: 0.62 }, 0.24);
        if (formCol) {
          tl.from(formCol, { opacity: 0, x: 24 * dirSign, duration: 0.65 }, 0.16);
        }
        if (topicPills.length) {
          tl.from(
            topicPills,
            {
              opacity: 0,
              y: 10,
              scale: 0.92,
              duration: 0.34,
              stagger: 0.04,
              ease: 'back.out(1.3)',
            },
            0.34
          );
        }
      }

      // 7. Site Footer handles its own dedicated GSAP + ScrollTrigger entrance across all routes
    }, scopeEl);

    // Ensure trigger positions are accurate after initial layout settles
    ScrollTrigger.refresh();

    return () => {
      ctx.revert();
    };
  }
}
