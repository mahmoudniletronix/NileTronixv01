import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { LanguageService } from '../../../../core/i18n/language.service';
import { SiteProductsComponent } from './site-products.component';

describe('SiteProductsComponent (3D Hardware Studio)', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteProductsComponent],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders Q-KIOSK AIO as the initial flagship product inside the 3D viewer', () => {
    const fixture = TestBed.createComponent(SiteProductsComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    expect(el.querySelector('app-product-3d-viewer')).toBeTruthy();
    expect(el.querySelector('.dossier-title')?.textContent).toContain(
      'All-in-One Curved Floor Kiosk'
    );
    expect(el.querySelectorAll('.cat-tab').length).toBe(4);
  });

  it('switches hardware categories and updates the active product and specs', () => {
    const fixture = TestBed.createComponent(SiteProductsComponent);
    fixture.detectChanges();
    const el = fixture.nativeElement as HTMLElement;

    const tabs = Array.from(el.querySelectorAll<HTMLButtonElement>('.cat-tab'));
    tabs[3].click(); // Counter Terminals -> QCT-101
    fixture.detectChanges();

    expect(el.querySelector('.dossier-title')?.textContent).toContain(
      'QCT-101 Hardware Calling Keypad'
    );
  });

  it('switches to Arabic labels when LanguageService changes to ar', () => {
    const fixture = TestBed.createComponent(SiteProductsComponent);
    const langService = TestBed.inject(LanguageService);
    langService.setLanguage('ar');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.section-headline')?.textContent).toContain(
      'أجهزة ميدانية مصممة للعمل المتواصل'
    );
  });
});
