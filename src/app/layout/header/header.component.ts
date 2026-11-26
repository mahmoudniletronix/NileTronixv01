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

  private closeTimer: ReturnType<typeof setTimeout> | null = null;
  private openedViaHover = false;
  private scrollRafId: number | null = null;
  private routerSub: Subscription | null = null;

  private readonly boundPassiveScroll = () => {
    if (this.scrollRafId !== null) return;
    this.scrollRafId = requestAnimationFrame(() => {
      this.scrollRafId = null;
      this.syncScrollState();
    });
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
        if (this.isBrowser) {
          this.syncScrollState();
        }
      });

    if (!this.isBrowser) return;
    this.syncScrollState();
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('scroll', this.boundPassiveScroll, { passive: true });
      window.addEventListener('resize', this.boundPassiveScroll, { passive: true });
    });
  }

  ngOnDestroy(): void {
    this.clearCloseTimer();
    this.routerSub?.unsubscribe();
    this.routerSub = null;
    if (this.scrollRafId !== null) {
      cancelAnimationFrame(this.scrollRafId);
      this.scrollRafId = null;
    }
    if (this.isBrowser) {
      window.removeEventListener('scroll', this.boundPassiveScroll);
      window.removeEventListener('resize', this.boundPassiveScroll);
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

  private syncScrollState(): void {
    const scrollY = window.scrollY || document.documentElement.scrollTop || 0;
    const viewportHeight = window.innerHeight || 800;
    const nextScrolled = scrollY >= viewportHeight * 0.8;

    const currentUrl = this.router.url.split('#')[0];
    let nextSection: NavSectionId = 'home';

    if (currentUrl.startsWith('/solutions/')) {
      nextSection = 'solutions';
    } else {
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
          nextSection = id;
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
