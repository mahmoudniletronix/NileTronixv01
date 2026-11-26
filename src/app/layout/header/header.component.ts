import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { Subscription, filter } from 'rxjs';
import { SmoothScrollService } from '../../core/animation/smooth-scroll.service';
import { LanguageService } from '../../core/i18n/language.service';
import { NtMagneticDirective } from '../../shared/directives/nt-magnetic.directive';
import { NtIconComponent } from '../../shared/ui/nt-icon.component';

export type NavSectionId = 'home' | 'solutions' | 'industries' | 'hardware' | 'references' | 'contact';

@Component({
  selector: 'app-header',
  imports: [RouterLink, NtIconComponent, NtMagneticDirective],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly document = inject(DOCUMENT);
  private readonly hostRef = inject(ElementRef<HTMLElement>);
  private readonly router = inject(Router);
  private readonly ngZone = inject(NgZone);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly isBrowser = isPlatformBrowser(this.platformId);
  private readonly smoothScroll = inject(SmoothScrollService);

  protected readonly lang = inject(LanguageService);
  protected readonly content = this.lang.content;

  private static readonly HOME_PATHS = new Set([
    '',
    '/',
    '/solutions',
    '/industries',
    '/projects',
    '/about',
    '/contact',
    '/consultation',
  ]);

  protected readonly solutionsOpen = signal(false);
  protected readonly mobileDrawerOpen = signal(false);
  protected readonly mobileSolutionsOpen = signal(false);
  protected readonly activeSection = signal<NavSectionId>('home');
  protected readonly isScrolled = signal(false);
  protected readonly isHomeRoute = signal(true);
  protected readonly isOverDarkHero = computed(
    () => this.isHomeRoute() && !this.isScrolled() && !this.solutionsOpen()
  );

  private static readonly SECTION_ORDER: readonly Exclude<NavSectionId, 'home'>[] = [
    'contact',
    'references',
    'hardware',
    'industries',
    'solutions',
  ];

  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private openedViaHover = false;
  private scrollRafId: number | null = null;
  private routerSub: Subscription | null = null;
  private resizeObserver: ResizeObserver | null = null;
  private cachedViewportHeight = 800;
  private cachedSectionOffsets: Array<{ id: Exclude<NavSectionId, 'home'>; top: number }> = [];
  private offsetsDirty = true;

  private readonly boundPassiveScroll = () => {
    if (this.scrollRafId !== null) return;
    this.scrollRafId = requestAnimationFrame(() => {
      this.scrollRafId = null;
      this.syncScrollState();
    });
  };

  private readonly boundResize = () => {
    this.offsetsDirty = true;
    this.cachedViewportHeight = window.innerHeight || 800;
    this.boundPassiveScroll();
  };

  constructor() {
    this.syncRouteState(this.router.url);

    effect(() => {
      const locked = this.mobileDrawerOpen();
      this.document.body?.classList.toggle('nt-scroll-locked', locked);
      if (locked) {
        this.smoothScroll.stop();
      } else {
        this.smoothScroll.start();
      }
    });
  }

  ngOnInit(): void {
    this.routerSub = this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.syncRouteState(event.urlAfterRedirects);
        this.offsetsDirty = true;
        if (this.isBrowser) {
          this.syncScrollState();
        }
      });

    if (!this.isBrowser) return;
    this.cachedViewportHeight = window.innerHeight || 800;
    this.syncScrollState();
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.boundPassiveScroll, { passive: true });
      window.addEventListener('resize', this.boundResize, { passive: true });
      if (typeof ResizeObserver !== 'undefined' && this.document.body) {
        this.resizeObserver = new ResizeObserver(() => {
          this.offsetsDirty = true;
        });
        this.resizeObserver.observe(this.document.body);
      }
    });
  }

  ngOnDestroy(): void {
    this.clearCloseTimer();
    this.routerSub?.unsubscribe();
    this.routerSub = null;
    this.resizeObserver?.disconnect();
    this.resizeObserver = null;
    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = null;
    }
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.boundPassiveScroll);
      window.removeEventListener('resize', this.boundResize);
    }
    this.smoothScroll.start();
    this.document.body?.classList.remove('nt-scroll-locked');
  }

  private syncRouteState(url: string): void {
    const cleanPath = url.split(/[?#]/)[0];
    const isHome = HeaderComponent.HOME_PATHS.has(cleanPath);
    if (isHome !== this.isHomeRoute()) {
      this.isHomeRoute.set(isHome);
    }
  }

  private refreshSectionOffsets(): void {
    const next: Array<{ id: Exclude<NavSectionId, 'home'>; top: number }> = [];
    for (const id of HeaderComponent.SECTION_ORDER) {
      const el = this.document.getElementById(id);
      if (el) {
        next.push({ id, top: el.offsetTop });
      }
    }
    this.cachedSectionOffsets = next;
    this.offsetsDirty = false;
  }

  private syncScrollState(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const nextScrolled = scrollY >= this.cachedViewportHeight * 0.8;

    const currentUrl = this.router.url.split('#')[0];
    let nextSection: NavSectionId = 'home';

    if (currentUrl.startsWith('/solutions/')) {
      nextSection = 'solutions';
    } else if (this.isHomeRoute()) {
      if (this.offsetsDirty || this.cachedSectionOffsets.length === 0) {
        this.refreshSectionOffsets();
      }
      const offset = 140;
      for (const entry of this.cachedSectionOffsets) {
        if (entry.top - offset <= scrollY) {
          nextSection = entry.id;
          break;
        }
      }
    }

    if (nextScrolled !== this.isScrolled() || nextSection !== this.activeSection()) {
      this.ngZone.run(() => {
        if (nextScrolled !== this.isScrolled()) {
          this.isScrolled.set(nextScrolled);
        }
        if (nextSection !== this.activeSection()) {
          this.activeSection.set(nextSection);
        }
      });
    }
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
    if (section === 'home') {
      this.smoothScroll.scrollToTop();
      return;
    }

    this.smoothScroll.scrollToElement(section, {
      offset: -headerHeight,
      duration: 1.05,
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
