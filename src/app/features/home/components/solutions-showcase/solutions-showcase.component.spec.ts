import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { routes } from '../../../../app.routes';
import { LanguageService } from '../../../../core/i18n/language.service';
import { SolutionsShowcaseComponent } from './solutions-showcase.component';

describe('SolutionsShowcaseComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SolutionsShowcaseComponent],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should render all 5 layered product deck cards with Q-Control active by default', () => {
    const fixture = TestBed.createComponent(SolutionsShowcaseComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const cards = el.querySelectorAll('.deck-card');
    expect(cards.length).toBe(5);
    expect(cards[0].classList.contains('is-active')).toBe(true);
    expect(el.querySelector('.pill-code')?.textContent?.trim()).toBe('Q-Control');
    expect(el.querySelector('.counter-active')?.textContent?.trim()).toBe('01');
  });

  it('should wrap around cleanly on next and previous arrow clicks', () => {
    const fixture = TestBed.createComponent(SolutionsShowcaseComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const prevBtn = el.querySelector('.stage-arrow-prev') as HTMLButtonElement;
    const nextBtn = el.querySelector('.stage-arrow-next') as HTMLButtonElement;

    // Wrap backward 01 -> 05
    prevBtn.click();
    fixture.detectChanges();
    expect(el.querySelector('.counter-active')?.textContent?.trim()).toBe('05');
    expect(el.querySelector('.pill-code')?.textContent?.trim()).toBe('AI Vision & Security');

    // Wrap forward 05 -> 01
    nextBtn.click();
    fixture.detectChanges();
    expect(el.querySelector('.counter-active')?.textContent?.trim()).toBe('01');
    expect(el.querySelector('.pill-code')?.textContent?.trim()).toBe('Q-Control');
  });

  it('should bring a clicked selector tab or side card to the front', () => {
    const fixture = TestBed.createComponent(SolutionsShowcaseComponent);
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    const selectorTabs = el.querySelectorAll('.selector-item') as NodeListOf<HTMLButtonElement>;
    selectorTabs[2].click();
    fixture.detectChanges();

    expect(el.querySelector('.counter-active')?.textContent?.trim()).toBe('03');
    expect(el.querySelector('.pill-code')?.textContent?.trim()).toBe('Feedback & Surveys');
    expect(el.querySelector('.explore-cta')?.getAttribute('href')).toBe(
      '/solutions/customer-feedback'
    );
  });

  it('should switch deck copy to Arabic when language changes', () => {
    const fixture = TestBed.createComponent(SolutionsShowcaseComponent);
    const lang = TestBed.inject(LanguageService);
    lang.setLanguage('ar');
    fixture.detectChanges();

    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('.section-headline')?.textContent).toContain('أنظمة حقيقية');

    lang.setLanguage('en');
    fixture.detectChanges();
  });
});
