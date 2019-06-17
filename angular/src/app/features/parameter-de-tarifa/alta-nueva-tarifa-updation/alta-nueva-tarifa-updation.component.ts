import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { BREADCRUMB_PATHS } from '../../../core/constants/breadcrumb-paths.const';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../shared/dateAdapter/date.adapter';
import { HttpClient } from '@angular/common/http';
import { ParameterDeTarifaService, ParameterDeTarifas } from '../service/parameter-de-tarifa.service';
import { TipoTarifa } from '../../tipos-tarifa/service/tipo-tarifa.service';
import * as moment from 'moment';

@Component({
  selector: 'app-alta-nueva-tarifa-updation',
  templateUrl: './alta-nueva-tarifa-updation.component.html',
  styleUrls: ['./alta-nueva-tarifa-updation.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ]
})
export class AltaNuevaTarifaUpdationComponent implements OnInit {
  @Output() parametroAltaNuevaEvent = new EventEmitter<any>();
  pageHeight: number;
  parametroAltaNuevaTarifa: FormGroup;
  breadcrumb: any[];
  breadcrumbPaths: any;
  tipodeTarifas: TipoTarifa[];
  literals: any = {
    paramTarifas: ''
  };
  constructor(
    private http: HttpClient,
    private translationService: TranslateService,
    private formBuilder: FormBuilder,
    private parameterDeTarifaService: ParameterDeTarifaService
  ) {
    this.parametroAltaNuevaTarifa = formBuilder.group({
      fechaDesdeVigencia: ['', Validators.required],
      importeParkingMax: ['', Validators.required],
      importeMinSinCompra: ['', Validators.required],
      tiempoMaxSinCompra: ['', Validators.required],
      importeMin1Hora: ['', Validators.required],
      importeMin2Hora: ['', Validators.required],
      fraccionFacturacion: ['', Validators.required],
      costeFraccion: ['', Validators.required],
      tiempoMaxSalida: ['', Validators.required],
      tipodeTarifaId: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.pageHeight = window.innerHeight - 200;
    this.getTranslations();
    this.parameterDeTarifaService.findAllTipoTarifaData().subscribe(data => {
      this.tipodeTarifas = data;
    });
  }

  parametroAltaNuevaTarifaSubmit() {
    if (this.parametroAltaNuevaTarifa.valid) {
      const userValue: ParameterDeTarifas = this.parametroAltaNuevaTarifa.value;
      this.parametroAltaNuevaEvent.emit({
        costeFraccion: userValue.costeFraccion,
        fechaDesdeVigencia: moment(new Date(userValue.fechaDesdeVigencia)).format('YYYY-MM-DD').replace(/-/g, ''),
        endDate: null,
        startDate: null,
        fraccionFacturacion: userValue.fraccionFacturacion,
        tipodeTarifaId: userValue.tipodeTarifaId,
        importeMin1Hora: userValue.importeMin1Hora,
        importeMin2Hora: userValue.importeMin2Hora,
        importeMinSinCompra: userValue.importeMinSinCompra,
        importeParkingMax: userValue.importeParkingMax,
        modificationCounter: null,
        tiempoMaxSalida: userValue.tiempoMaxSalida,
        tiempoMaxSinCompra: userValue.tiempoMaxSinCompra
      });
    }
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

  public hasError = (controlName: string, errorName: string) => {
    return this.parametroAltaNuevaTarifa.controls[controlName].hasError(errorName);
  }

}
