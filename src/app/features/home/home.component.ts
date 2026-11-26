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
import { ScrollChoreographyService } from '../../core/animation/scroll-choreography.service';
import { LanguageService } from '../../core/i18n/language.service';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { EditorialStatementComponent } from './components/editorial-statement/editorial-statement.component';
import { HeroComponent } from './components/hero/hero.component';
import { IndustriesServeComponent } from './components/industries-serve/industries-serve.component';
import { ReferencesComponent } from './components/references/references.component';
import { SiteProductsComponent } from './components/site-products/site-products.component';
import { SolutionsShowcaseComponent } from './components/solutions-showcase/solutions-showcase.component';

@Component({
  selector: 'app-home',
  imports: [
    HeroComponent,
    SolutionsShowcaseComponent,
    EditorialStatementComponent,
    IndustriesServeComponent,
    SiteProductsComponent,
    ReferencesComponent,
    ContactSectionComponent,
  ],
  template: `
    <app-hero />
    <app-solutions-showcase id="solutions" />
    <app-editorial-statement />
    <app-industries-serve id="industries" />
    <app-site-products id="hardware" />
    <app-references id="references" />
    @defer (on viewport; prefetch on idle) {
      <app-contact-section id="contact" />
    } @placeholder {
      <section id="contact" style="min-height: 760px" aria-hidden="true"></section>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements AfterViewInit, OnDestroy {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly hostEl = inject(ElementRef<HTMLElement>);
  private readonly langService = inject(LanguageService);
  private readonly scrollChoreography = inject(ScrollChoreographyService);

  private cleanupScroll: (() => void) | null = null;
  private destroyed = false;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    void this.scrollChoreography
      .initHomeScrollAnimations(this.hostEl.nativeElement, this.langService.isRtl())
      .then((cleanup) => {
        if (this.destroyed) {
          cleanup?.();
        } else {
          this.cleanupScroll = cleanup;
        }
      });
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.cleanupScroll?.();
    this.cleanupScroll = null;
  }
}
