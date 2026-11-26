import { isPlatformBrowser } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  PLATFORM_ID,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
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
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly content = this.lang.content;
  protected readonly isDesktop = signal<boolean>(this.detectDesktop());

  private desktopQuery: MediaQueryList | null = null;
  private visibilityObserver: IntersectionObserver | null = null;

  private readonly onBreakpointChange = (e: MediaQueryListEvent) => {
    if (e.matches !== this.isDesktop()) {
      this.ngZone.run(() => this.isDesktop.set(e.matches));
    }
  };

  protected scrollToSection(sectionId: string, event: Event): void {
    event.preventDefault();
    this.smoothScroll.scrollToElement(sectionId, { offset: -76, duration: 1.05 });
  }

  ngAfterViewInit(): void {
    if (!this.isBrowser) return;

    if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
      this.desktopQuery = window.matchMedia('(min-width: 1024px)');
      this.ngZone.runOutsideAngular(() => {
        this.desktopQuery?.addEventListener('change', this.onBreakpointChange);
      });
    }

    if (typeof IntersectionObserver !== 'undefined') {
      this.ngZone.runOutsideAngular(() => {
        this.visibilityObserver = new IntersectionObserver(
          (entries) => {
            const entry = entries[0];
            if (!entry) return;
            this.hostRef.nativeElement.classList.toggle('is-offscreen', !entry.isIntersecting);
          },
          { threshold: 0.01 }
        );
        this.visibilityObserver.observe(this.hostRef.nativeElement);
      });
    }
  }

  ngOnDestroy(): void {
    this.desktopQuery?.removeEventListener('change', this.onBreakpointChange);
    this.desktopQuery = null;
    this.visibilityObserver?.disconnect();
    this.visibilityObserver = null;
  }

  private detectDesktop(): boolean {
    if (
      this.isBrowser &&
      typeof window !== 'undefined' &&
      typeof window.matchMedia === 'function'
    ) {
      return window.matchMedia('(min-width: 1024px)').matches;
    }
    return true;
  }
}
