import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
import { BREADCRUMB_PATHS } from '../../../core/constants/breadcrumb-paths.const';
import { ParameterDeTarifaService, ParameterDeTarifas } from '../service/parameter-de-tarifa.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parametro-alta-nueva-tarifa',
  templateUrl: './parametro-alta-nueva-tarifa.component.html',
  styleUrls: ['./parametro-alta-nueva-tarifa.component.scss']
})
export class ParametroAltaNuevaTarifaComponent implements OnInit {
  breadcrumb: any[];
  breadcrumbPaths: any;
  literals: any = {
    paramTarifas: ''
  };
  constructor(
    private translationService: TranslateService,
    private alertService: AlertsService,
    private parameterDeTarifaService: ParameterDeTarifaService,
    private router: Router
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

  formSubmittion(userData: ParameterDeTarifas) {
    this.parameterDeTarifaService.saveParametroDeTarifaData(userData).subscribe(data => {
      this.alertService.success(this.literals.successRecord);
      this.router.navigate(['/parametros-tarifa']);
    }, error => {
      this.alertService.danger(this.literals.generic_error_title);
    });
  }

}
