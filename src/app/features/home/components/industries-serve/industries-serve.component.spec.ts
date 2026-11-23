import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../../../app.routes';
import { LanguageService } from '../../../../core/i18n/language.service';
import { IndustriesServeComponent } from './industries-serve.component';

describe('IndustriesServeComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndustriesServeComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should render all 5 industries with Healthcare active by default', () => {
    const fixture = TestBed.createComponent(IndustriesServeComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const tabs = el.querySelectorAll('.industry-option');
    expect(tabs.length).toBe(5);
    expect(tabs[0].classList.contains('is-active')).toBe(true);
    expect(el.querySelector('.detail-title')?.textContent?.trim()).toBe('Healthcare');
    expect(el.querySelector('.architectural-img')?.getAttribute('src')).toBe(
      'industries/healthcare.webp'
    );
  });

  it('should update active industry, image, capabilities, and CTA when selecting another industry', () => {
    const fixture = TestBed.createComponent(IndustriesServeComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const tabs = el.querySelectorAll('.industry-option') as NodeListOf<HTMLButtonElement>;
    tabs[3].click(); // Parking & Mobility
    fixture.detectChanges();

    expect(el.querySelector('.detail-title')?.textContent?.trim()).toBe('Parking & Mobility');
    expect(el.querySelector('.architectural-img')?.getAttribute('src')).toBe(
      'industries/parking.webp'
    );
    expect(el.querySelector('.counter-current')?.textContent?.trim()).toBe('04');
    expect(el.querySelector('.explore-solutions-cta')?.getAttribute('href')).toBe(
      '/solutions/parking-management'
    );
  });

  it('should wrap around cleanly on next and previous arrow clicks', () => {
    const fixture = TestBed.createComponent(IndustriesServeComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const prevBtn = el.querySelector('.col-nav .arrow-prev') as HTMLButtonElement;
    const nextBtn = el.querySelector('.col-nav .arrow-next') as HTMLButtonElement;

    prevBtn.click(); // 01 -> 05 Government
    fixture.detectChanges();
    expect(el.querySelector('.counter-current')?.textContent?.trim()).toBe('05');
    expect(el.querySelector('.detail-title')?.textContent?.trim()).toBe(
      'Government & Public Services'
    );

    nextBtn.click(); // 05 -> 01 Healthcare
    fixture.detectChanges();
    expect(el.querySelector('.counter-current')?.textContent?.trim()).toBe('01');
  });

  it('should switch industry copy to Arabic when language changes', () => {
    const fixture = TestBed.createComponent(IndustriesServeComponent);
    const lang = TestBed.inject(LanguageService);
    lang.setLanguage('ar');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.section-headline')?.textContent).toContain('تكنولوجيا تتكيّف');
    expect(el.querySelector('.detail-title')?.textContent?.trim()).toBe('الرعاية الصحية');

    lang.setLanguage('en');
    fixture.detectChanges();
  });
});
