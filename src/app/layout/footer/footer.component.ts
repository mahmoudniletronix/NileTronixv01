import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly langService = inject(LanguageService);

  @ViewChild('footerRoot', { static: true }) private footerRootRef!: ElementRef<HTMLElement>;

  protected readonly lang = this.langService.lang;
  protected readonly content = this.langService.content;
  protected readonly currentYear = new Date().getFullYear();
  protected readonly mapsLink = 'https://maps.app.goo.gl/wRaZuHYx6UQc4bCj9';

  private gsapCtx: gsap.Context | null = null;
  private destroyed = false;

  ngAfterViewInit(): void {
    if (
      !isPlatformBrowser(this.platformId) ||
      typeof window === 'undefined' ||
      typeof window.matchMedia !== 'function' ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      return;
    }

    void import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (this.destroyed) return;
      gsap.registerPlugin(ScrollTrigger);

      const root = this.footerRootRef.nativeElement;
      const isRtl = this.langService.isRtl();

      this.gsapCtx = gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: 'power3.out', clearProps: 'transform,opacity' },
          scrollTrigger: {
            trigger: root,
            start: 'top 86%',
            once: true,
          },
        });

        const topLine = root.querySelector('.footer-top-line');
        const brandLockup = root.querySelector('.footer-brand-lockup');
        const tagline = root.querySelector('.footer-tagline');
        const socialBtns = root.querySelectorAll('.social-btn');
        const cols = root.querySelectorAll('.footer-col');
        const bottomBar = root.querySelector('.footer-bottom');
        const watermark = root.querySelector('.footer-watermark');

        if (topLine) {
          tl.from(
            topLine,
            {
              scaleX: 0,
              transformOrigin: isRtl ? 'right center' : 'left center',
              duration: 0.75,
              ease: 'power2.out',
            },
            0
          );
        }
        if (brandLockup) tl.from(brandLockup, { opacity: 0, y: 18, duration: 0.52 }, 0.08);
        if (tagline) tl.from(tagline, { opacity: 0, y: 14, duration: 0.48 }, 0.16);
        if (socialBtns.length) {
          tl.from(
            socialBtns,
            {
              opacity: 0,
              y: 12,
              scale: 0.85,
              duration: 0.4,
              stagger: 0.06,
              ease: 'back.out(1.5)',
            },
            0.22
          );
        }
        if (cols.length) {
          tl.from(cols, { opacity: 0, y: 22, duration: 0.55, stagger: 0.09 }, 0.14);
        }
        if (bottomBar) tl.from(bottomBar, { opacity: 0, y: 12, duration: 0.45 }, 0.36);
        if (watermark) tl.from(watermark, { opacity: 0, y: 24, duration: 0.8 }, 0.25);
      }, root);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.gsapCtx?.revert();
    this.gsapCtx = null;
  }
}
