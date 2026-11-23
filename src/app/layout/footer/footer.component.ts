import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LanguageService } from '../../core/i18n/language.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  private readonly langService = inject(LanguageService);

  protected readonly lang = this.langService.lang;
  protected readonly content = this.langService.content;
  protected readonly currentYear = new Date().getFullYear();
  protected readonly mapsLink = 'https://maps.app.goo.gl/wRaZuHYx6UQc4bCj9';
}
