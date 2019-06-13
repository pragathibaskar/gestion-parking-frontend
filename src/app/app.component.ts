import { Component, OnInit } from '@angular/core';
import { TdMediaService } from '@covalent/core';
import { TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { environment } from '../environments/environment';
import { I18nService } from './core/i18n/i18n.service';
import { MENU_SECTIONS } from './core/constants/menu.const';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  title = 'gestion-parking';
  literals: any = {};
  supportedLanguages: string[] = [];
  currentLang: string;
  menuLinks: any[];

  constructor(public media: TdMediaService,
    private readonly i18nService: I18nService,
    public router: Router,
    public translate: TranslateService) {

      this.translate.onLangChange.subscribe(
        translations => {
          this.literals = translations.translations;
          this.menuLinks = MENU_SECTIONS(this.literals);
        }
      );

  }

  ngOnInit(): void {
    // NGX Translate
    this.i18nService.init(environment.defaultLanguage, environment.supportedLanguages);

    // this.translate.init();
    // this.translate.setDefaultLang(environment.defaultLanguage);
    // this.translate.use(environment.defaultLanguage);
    this.supportedLanguages = environment.supportedLanguages;
    this.currentLang = environment.defaultLanguage;


  }

  setLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;
  }

}
