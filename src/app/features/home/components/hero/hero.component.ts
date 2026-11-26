import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import gsap from 'gsap';
import { SmoothScrollService } from '../../../../core/animation/smooth-scroll.service';
import { LanguageService } from '../../../../core/i18n/language.service';
import { NtMagneticDirective } from '../../../../shared/directives/nt-magnetic.directive';
import { NtIconComponent } from '../../../../shared/ui/nt-icon.component';

@Component({
  selector: 'app-hero',
  imports: [RouterLink, NtIconComponent, NtMagneticDirective],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly lang = inject(LanguageService);
  private readonly smoothScroll = inject(SmoothScrollService);
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly content = this.lang.content;

  protected scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.smoothScroll.scrollToElement(sectionId, { offset: -76, duration: 1.05 });
  }

  private gsapCtx: gsap.Context | null = null;
  private visibilityObserver: IntersectionObserver | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (typeof IntersectionObserver !== 'undefined') {
      this.visibilityObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (!entry) return;
          this.hostRef.nativeElement.classList.toggle('is-offscreen', !entry.isIntersecting);
        },
        { threshold: 0.01 }
      );
      this.visibilityObserver.observe(this.hostRef.nativeElement);
    }

    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) return;

    this.gsapCtx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Controlled architectural image settle
      tl.fromTo(
        '.hero-image-bg, .hero-image-inline',
        { scale: 1.025, opacity: 0.88 },
        { scale: 1, opacity: 1, duration: 0.72, ease: 'power2.out', clearProps: 'transform,opacity' },
        0
      );

      // Eyebrow subtle rise
      tl.from(
        '.hero-eyebrow',
        { opacity: 0, y: 10, duration: 0.4, clearProps: 'transform,opacity' },
        0.06
      );

      // Staggered headline line reveal
      tl.from(
        '.hero-headline-row',
        {
          opacity: 0,
          y: 16,
          duration: 0.5,
          stagger: 0.08,
          clearProps: 'transform,opacity',
        },
        0.14
      );

      // Supporting description
      tl.from(
        '.hero-description',
        { opacity: 0, y: 10, duration: 0.42, clearProps: 'transform,opacity' },
        0.28
      );

      // CTA buttons staggered entrance
      tl.from(
        '.hero-actions a',
        {
          opacity: 0,
          y: 10,
          duration: 0.36,
          stagger: 0.06,
          clearProps: 'transform,opacity',
        },
        0.36
      );

      // Solution indicators sequential reveal
      tl.from(
        '.indicator-item',
        {
          opacity: 0,
          y: 10,
          duration: 0.38,
          stagger: 0.07,
          clearProps: 'transform,opacity',
        },
        0.44
      );

      // Bottom architectural datum line draw
      tl.from(
        '.hero-datum-line',
        {
          scaleX: 0,
          transformOrigin: this.lang.isRtl() ? 'right center' : 'left center',
          duration: 0.65,
          ease: 'power2.out',
          clearProps: 'transform',
        },
        0.32
      );
    }, this.hostRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.visibilityObserver?.disconnect();
    this.visibilityObserver = null;
    this.gsapCtx?.revert();
    this.gsapCtx = null;
  }
}
