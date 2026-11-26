import { AfterViewInit, ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SmoothScrollService } from './core/animation/smooth-scroll.service';
import { LanguageService } from './core/i18n/language.service';
import { BackToTopComponent } from './layout/back-to-top/back-to-top.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SocialFabComponent } from './layout/social-fab/social-fab.component';

@Component({
  selector: 'app-root',
  imports: [HeaderComponent, RouterOutlet, FooterComponent, SocialFabComponent, BackToTopComponent],
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App implements AfterViewInit, OnDestroy {
  private readonly smoothScroll = inject(SmoothScrollService);
  protected readonly content = inject(LanguageService).content;

  ngAfterViewInit(): void {
    void this.smoothScroll.init();
  }

  ngOnDestroy(): void {
    this.smoothScroll.destroy();
  }
}
