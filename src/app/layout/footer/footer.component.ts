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
import { NtSpotlightDirective } from '../../shared/directives/nt-spotlight.directive';
import { NtIconComponent } from '../../shared/ui/nt-icon.component';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, NtIconComponent, NtSpotlightDirective],
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
  private visibilityObserver: IntersectionObserver | null = null;
  private destroyed = false;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (typeof IntersectionObserver !== 'undefined') {
      this.visibilityObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          this.footerRootRef.nativeElement.classList.toggle('is-offscreen', !entry.isIntersecting);
        },
        { threshold: 0.01 }
      );
      this.visibilityObserver.observe(this.footerRootRef.nativeElement);
    }

    if (
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

      // Safe onEnter reveal: footer always stays at opacity: 1 in resting DOM
      this.gsapCtx = gsap.context(() => {
        ScrollTrigger.create({
          trigger: root,
          start: 'top 95%',
          once: true,
          onEnter: () => {
            const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
            const topLine = root.querySelector('.footer-top-line');
            const cols = root.querySelectorAll('.footer-brand, .footer-col');

            if (topLine) {
              tl.fromTo(
                topLine,
                { scaleX: 0, transformOrigin: isRtl ? 'right center' : 'left center' },
                { scaleX: 1, duration: 0.65, ease: 'power2.out', clearProps: 'transform' },
                0
              );
            }
            if (cols.length) {
              tl.fromTo(
                cols,
                { opacity: 0.55, y: 12 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.45,
                  stagger: 0.06,
                  clearProps: 'transform,opacity',
                },
                0.06
              );
            }
          },
        });
      }, root);
    });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.visibilityObserver?.disconnect();
    this.visibilityObserver = null;
    this.gsapCtx?.revert();
    this.gsapCtx = null;
  }
}
