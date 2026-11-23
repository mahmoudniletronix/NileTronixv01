import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  PLATFORM_ID,
  effect,
  inject,
  signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import gsap from 'gsap';
import { LanguageService } from '../../core/i18n/language.service';

export type NavSectionId = 'home' | 'solutions' | 'industries' | 'hardware' | 'references' | 'contact';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);

  protected readonly lang = inject(LanguageService);
  protected readonly content = this.lang.content;

  protected readonly solutionsOpen = signal(false);
  protected readonly mobileDrawerOpen = signal(false);
  protected readonly mobileSolutionsOpen = signal(false);
  protected readonly activeSection = signal<NavSectionId>('home');

  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private openedViaHover = false;
  private scrollTween: gsap.core.Tween | null = null;

  constructor() {
    effect(() => {
      const locked = this.mobileDrawerOpen();
      this.document.body?.classList.toggle('nt-scroll-locked', locked);
    });
  }

  ngOnDestroy(): void {
    this.clearCloseTimer();
    this.scrollTween?.kill();
    this.document.body?.classList.remove('nt-scroll-locked');
  }

  @HostListener('window:scroll')
  protected onWindowScroll(): void {
    if (!this.isBrowser) return;

    const currentUrl = this.router.url.split('#')[0];
    if (currentUrl.startsWith('/solutions/')) {
      this.activeSection.set('solutions');
      return;
    }

    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const offset = 140;
    const sectionOrder: Exclude<NavSectionId, 'home'>[] = [
      'contact',
      'references',
      'hardware',
      'industries',
      'solutions',
    ];

    for (const id of sectionOrder) {
      const el = this.document.getElementById(id);
      if (el && el.offsetTop - offset <= scrollY) {
        this.activeSection.set(id);
        return;
      }
    }

    this.activeSection.set('home');
  }

  protected navigateToSection(section: NavSectionId, event?: Event): void {
    event?.preventDefault();
    this.onNavigate();
    this.activeSection.set(section);

    if (!this.isBrowser) return;

    const currentPath = this.router.url.split('#')[0];
    if (currentPath !== '/' && currentPath !== '') {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => this.smoothScrollTo(section), 60);
      });
      return;
    }

    this.smoothScrollTo(section);
  }

  private smoothScrollTo(section: NavSectionId): void {
    const headerHeight = 76;
    let targetY = 0;

    if (section !== 'home') {
      const el = this.document.getElementById(section);
      if (!el) return;
      const rect = el.getBoundingClientRect();
      targetY = Math.max(0, rect.top + window.scrollY - headerHeight);
    }

    const reducedMotion =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reducedMotion) {
      window.scrollTo(0, targetY);
      return;
    }

    this.scrollTween?.kill();
    const state = { y: window.scrollY || document.documentElement.scrollTop || 0 };
    const distance = Math.abs(targetY - state.y);
    const duration = Math.min(1.05, Math.max(0.45, distance / 2600));

    this.scrollTween = gsap.to(state, {
      y: targetY,
      duration,
      ease: 'power3.inOut',
      onUpdate: () => window.scrollTo(0, state.y),
      onComplete: () => {
        this.scrollTween = null;
      },
    });
  }

  protected openSolutionsMenu(): void {
    this.clearCloseTimer();
    if (!this.solutionsOpen()) {
      this.openedViaHover = true;
      this.solutionsOpen.set(true);
    }
  }

  protected scheduleCloseSolutionsMenu(): void {
    this.clearCloseTimer();
    this.closeTimer = setTimeout(() => {
      this.solutionsOpen.set(false);
      this.openedViaHover = false;
    }, 140);
  }

  protected toggleSolutionsMenu(): void {
    this.clearCloseTimer();
    if (this.solutionsOpen() && this.openedViaHover) {
      this.openedViaHover = false;
      return;
    }
    this.openedViaHover = false;
    this.solutionsOpen.update((open) => !open);
  }

  protected closeSolutionsMenu(): void {
    this.clearCloseTimer();
    this.openedViaHover = false;
    this.solutionsOpen.set(false);
  }

  protected toggleMobileDrawer(): void {
    this.mobileDrawerOpen.update((open) => !open);
  }

  protected closeMobileDrawer(): void {
    this.mobileDrawerOpen.set(false);
    this.mobileSolutionsOpen.set(false);
  }

  protected toggleMobileSolutions(): void {
    this.mobileSolutionsOpen.update((open) => !open);
  }

  protected onNavigate(): void {
    this.closeSolutionsMenu();
    this.closeMobileDrawer();
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    if (this.solutionsOpen()) {
      this.closeSolutionsMenu();
    }
    if (this.mobileDrawerOpen()) {
      this.closeMobileDrawer();
    }
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    if (!this.solutionsOpen()) {
      return;
    }
    const target = event.target as Node | null;
    if (target && !this.hostRef.nativeElement.contains(target)) {
      this.closeSolutionsMenu();
    }
  }

  private clearCloseTimer(): void {
    if (this.closeTimer !== null) {
      clearTimeout(this.closeTimer);
      this.closeTimer = null;
    }
  }
}
