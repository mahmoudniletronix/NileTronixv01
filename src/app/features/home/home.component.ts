import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
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
    IndustriesServeComponent,
    SiteProductsComponent,
    ReferencesComponent,
    ContactSectionComponent,
  ],
  template: `
    <app-hero />
    <app-solutions-showcase id="solutions" />
    <app-industries-serve id="industries" />
    <app-site-products id="hardware" />
    <app-references id="references" />
    <app-contact-section id="contact" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {}
