import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';
import { LanguageService } from './core/i18n/language.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter(routes)],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render corporate header with brand logo and primary navigation', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();

    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('header.site-header')).toBeTruthy();
    expect(compiled.querySelector('img.brand-logo')?.getAttribute('src')).toBe(
      'images/niletronix-logo.png'
    );
    expect(compiled.querySelector('.header-cta')?.textContent).toContain('Request a Consultation');
  });

  it('should toggle language and update document direction to RTL', async () => {
    const fixture = TestBed.createComponent(App);
    const langService = TestBed.inject(LanguageService);
    fixture.detectChanges();

    langService.setLanguage('ar');
    fixture.detectChanges();
    await fixture.whenStable();

    expect(document.documentElement.lang).toBe('ar');
    expect(document.documentElement.dir).toBe('rtl');
    expect(fixture.nativeElement.querySelector('.header-cta')?.textContent).toContain('اطلب استشارة');

    // Reset to English for clean state
    langService.setLanguage('en');
    fixture.detectChanges();
  });
});
