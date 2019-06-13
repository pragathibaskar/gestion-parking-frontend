import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BREADCRUMB_PATHS } from '../../../core/constants/breadcrumb-paths.const';

@Component({
  selector: 'app-parameter-de-tarifa-home',
  templateUrl: './parameter-de-tarifa-home.component.html',
  styleUrls: ['./parameter-de-tarifa-home.component.scss']
})
export class ParameterDeTarifaHomeComponent implements OnInit {
  breadcrumb: any[];
  breadcrumbPaths: any;
  literals: any;
  constructor(
    private translationService: TranslateService
  ) { }

  ngOnInit() {
    this.getTranslations();
  }

  private getTranslations() {
    const currentLang = this.translationService.currentLang;
    this.translationService.getTranslation(currentLang).subscribe(translations => {
      this.literals = translations;
      this.breadcrumbPaths = BREADCRUMB_PATHS(this.literals);
      this.breadcrumb = [
        this.breadcrumbPaths.HOME,
        this.breadcrumbPaths.MANTENIMIENTOS,
        { name: this.breadcrumbPaths.PARAM_TARIFAS.name }
      ];
    });
    this.translationService.onLangChange.subscribe( translations => {
      this.literals = translations.translations;
      this.breadcrumbPaths = BREADCRUMB_PATHS(this.literals);
      this.breadcrumb = [
        this.breadcrumbPaths.HOME,
        this.breadcrumbPaths.MANTENIMIENTOS,
        { name: this.breadcrumbPaths.TIPOS_TARIFA.name }
      ];
    });
  }

}
