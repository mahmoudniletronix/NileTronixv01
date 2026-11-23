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
import { LanguageService } from '../../../../core/i18n/language.service';

@Component({
  selector: 'app-hero',
  imports: [RouterLink],
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  private readonly lang = inject(LanguageService);
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);

  protected readonly content = this.lang.content;

  private gsapCtx: gsap.Context | null = null;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const reducedMotion =
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) return;

    this.gsapCtx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Subtle architectural visual settle
      tl.fromTo(
        '.hero-image-bg, .hero-image-inline',
        { scale: 1.055, opacity: 0.78 },
        { scale: 1, opacity: 1, duration: 0.95, ease: 'power2.out', clearProps: 'transform' },
        0
      );

      // Eyebrow fade & rise
      tl.from(
        '.hero-eyebrow',
        { opacity: 0, y: 12, duration: 0.44, clearProps: 'transform,opacity' },
        0.08
      );

      // Staggered headline line reveal
      tl.from(
        '.hero-headline-row',
        {
          opacity: 0,
          y: 20,
          duration: 0.56,
          stagger: 0.1,
          clearProps: 'transform,opacity',
        },
        0.16
      );

      // Supporting description
      tl.from(
        '.hero-description',
        { opacity: 0, y: 12, duration: 0.44, clearProps: 'transform,opacity' },
        0.34
      );

      // CTA buttons staggered entrance
      tl.from(
        '.hero-actions a',
        {
          opacity: 0,
          y: 12,
          duration: 0.4,
          stagger: 0.08,
          clearProps: 'transform,opacity',
        },
        0.44
      );

      // Solution indicators sequential reveal
      tl.from(
        '.indicator-item',
        {
          opacity: 0,
          y: 14,
          duration: 0.42,
          stagger: 0.09,
          clearProps: 'transform,opacity',
        },
        0.54
      );
    }, this.hostRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.gsapCtx?.revert();
    this.gsapCtx = null;
  }
}
