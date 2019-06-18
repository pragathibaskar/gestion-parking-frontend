import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BREADCRUMB_PATHS } from '../../../core/constants/breadcrumb-paths.const';
import { ParameterDeTarifaService, ParameterDeTarifas } from '../service/parameter-de-tarifa.service';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';

interface ParameterDeTarifaSearchData {
  tipodeTarifa: string;
  description: string;
  vigenciaDesde: {
    begin: Date;
    end: Date;
  };
}

@Component({
  selector: 'app-parameter-de-tarifa-home',
  templateUrl: './parameter-de-tarifa-home.component.html',
  styleUrls: ['./parameter-de-tarifa-home.component.scss']
})
export class ParameterDeTarifaHomeComponent implements OnInit {
  breadcrumb: any[];
  breadcrumbPaths: any;
  literals: any = {};
  dataSource: any[] = [];
  whileLoading = false;
  columns = [
    { name: 'tipodeTarifa', label: 'Tipo de tarifa', width: 100},
    { name: 'description', label: 'Descripción', width: 100},
    { name: 'fechaDesdeVigencia', label: 'Vegencia desde', width: 100},
    { name: 'importeParkingMax', label: 'Import maximo', width: 100},
    { name: 'importeMinSinCompra', label: 'Importe Min SinCompra', width: 100},
    { name: 'tiempoMaxSinCompra', label: 'Tiempo Max SinCompra', width: 100},
    { name: 'importeMin1Hora', label: 'Importe Min1 Hora', width: 100},
    { name: 'importeMin2Hora', label: 'Importe Min 2Hora', width: 100},
    { name: 'fraccionFacturacion', label: 'Fraccion Facturacion', width: 100},
    { name: 'costeFraccion', label: 'Coste Fraccion', width: 100},
    { name: 'tiempoMaxSalida', label: 'Tiempo Max Salida', width: 100},
    { name: 'numberOfCentros', label: 'Number Of Centros', width: 100}
  ];
  constructor(
    private translationService: TranslateService,
    private parameterDeTarifaService: ParameterDeTarifaService,
    private router: Router,
    private route: ActivatedRoute,
    private alertSerive: AlertsService
  ) { }

  ngOnInit() {
    this.getTranslations();
    this.initialLoad();
  }

  private initialLoad() {
    this.parameterDeTarifaService.findAllParametrosTarifa().subscribe(data => {
      this.dataSource = data.reverse();
      this.whileLoading = true;
    });
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

  search(data: ParameterDeTarifaSearchData) {
    this.whileLoading = false;
    const beginDate = data.vigenciaDesde.begin ? moment(new Date(data.vigenciaDesde.begin)).format('YYYY-MM-DD').replace(/-/g, '') : null;
    const endDate = data.vigenciaDesde.end ? moment(new Date(data.vigenciaDesde.end)).format('YYYY-MM-DD').replace(/-/g, '') : null;
    this.parameterDeTarifaService.searchParametrosTarifaData({
      tipodeTarifa: data.tipodeTarifa ? data.tipodeTarifa : null,
      description: data.description ? data.description : null,
      startDate: beginDate,
      endDate: endDate
    }).subscribe(list => {
      this.whileLoading = true;
      if (list.length) {
        this.dataSource = list;
      } else {
        this.dataSource = [];
        this.alertSerive.warning(this.literals.noRecord);
      }
    }, error => {
      this.whileLoading = true;
      this.alertSerive.danger(this.literals.generic_error_title);
    });
  }

  cancel() {
    this.whileLoading = false;
    this.initialLoad();
  }

  delete(parametroDeTarifafData: ParameterDeTarifas) {
    this.whileLoading = false;
    this.parameterDeTarifaService.deleteParametrosTarifaData(parametroDeTarifafData['id']).subscribe(data => {
      this.alertSerive.success(this.literals.successDelete);
      this.whileLoading = true;
      this.dataSource = this.dataSource.filter(dataT => dataT.id !== parametroDeTarifafData['id']);
    }, error => {
      this.whileLoading = true;
      this.alertSerive.danger(this.literals.generic_error_title);
     });
  }

  edit(data: ParameterDeTarifas) {
    this.parameterDeTarifaService.setParamatroTarifaSelectedData(data);
    this.router.navigate(['parametroAltaNuevo', data.tipodeTarifa, data.id], { relativeTo: this.route });
  }

}
