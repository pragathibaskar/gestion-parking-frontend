import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BREADCRUMB_PATHS } from 'src/app/core/constants/breadcrumb-paths.const';
import { ParameterDeTarifaService } from '../service/parameter-de-tarifa.service';
import { Subscription, Observable } from 'rxjs';
import { AlertsService } from 'src/app/core/services/alerts/alerts.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TipoTarifaEto, TipoTarifa } from '../../tipos-tarifa/service/tipo-tarifa.service';
import * as moment from 'moment';

@Component({
  selector: 'app-centros-asignadoa',
  templateUrl: './centros-asignadoa.component.html',
  styleUrls: ['./centros-asignadoa.component.scss']
})
export class CentrosAsignadoaComponent implements OnInit, OnDestroy {

  @Output() searchData = new EventEmitter<TipoTarifaEto>();
  dataSource: any[] = [];
  subscription: Subscription;
  whileLoading = false;
  view = true;
  showView = false;
  columns = [
    { name: 'centro', label: 'Código Centro'},
    { name: 'description', label: 'Description'},
    { name: 'fechaDesdeVigencia', label: 'Fecha desde'},
    { name: 'fechaFin', label: 'Fecha fin'}
  ];
  literals: any = {};
  breadcrumb: any[];
  breadcrumbPaths: any;
  postData: any = {};
  tipoDeTarifaControl;
  tipoDeDescriptionControl;
  tipoTarifaData: TipoTarifa;
  parkingRateManagement: FormGroup;
  constantData: any;
  constructor(
    private formBuilder: FormBuilder,
    private readonly translationService: TranslateService,
    private parameterDeTarifaService: ParameterDeTarifaService,
    private alertSerive: AlertsService,
    private router: Router,
    private route: ActivatedRoute
    ) {
      this.parkingRateManagement = formBuilder.group({
        centro: '',
        description: ''
      });
      this.tipoDeTarifaControl = this.parkingRateManagement.get('centro');
      this.tipoDeDescriptionControl = this.parkingRateManagement.get('description');
     }

  ngOnInit() {
    this.constantData = this.parameterDeTarifaService.getParamatroTarifaSelectedData();
    this.getTranslations();
    this.initialLoad();
    console.log('constantData', this.constantData);
  }

  private getTranslations() {
    const currentLang = this.translationService.currentLang;
    this.translationService.getTranslation(currentLang).subscribe(translations => {
      this.literals = translations;
      this.breadcrumbPaths = BREADCRUMB_PATHS(this.literals);
      this.breadcrumb = [
        this.breadcrumbPaths.HOME,
        this.breadcrumbPaths.MANTENIMIENTOS,
        this.breadcrumbPaths.PARAM_TARIFAS,
        { name: this.literals.paramTarifas.detalleCentrosTitle }
      ];
    });
    this.translationService.onLangChange.subscribe( translations => {
      this.literals = translations.translations;
      this.breadcrumbPaths = BREADCRUMB_PATHS(this.literals);
      this.breadcrumb = [
        this.breadcrumbPaths.HOME,
        this.breadcrumbPaths.MANTENIMIENTOS,
        this.breadcrumbPaths.PARAM_TARIFAS,
        { name: this.literals.paramTarifas.detalleCentrosTitle }
      ];
    });
  }

  private initialLoad() {
    this.postData = {
      'tipodeTarifa': this.constantData.tipodeTarifa,
      'description': this.constantData.description,
      'fechaDesdeVigencia': this.constantData.fechaDesdeVigencia,
      'centro': this.constantData.centro,
    };
    this.subscription = this.parameterDeTarifaService.findAllCentrosAssignedData(this.postData).subscribe((data: any[]) => {
      this.dataSource = data.reverse();
      this.whileLoading = true;
    });
  }

  dateFormat(value: number): any {
    const val = value.toString();
    const dateFormatString = val.slice(0, 4) + '/' + val.slice(4, 6) + '/' + val.slice(6, 8);
    return moment(new Date(dateFormatString)).format('DD/MM/YYYY');
  }

  parkingRateManagementSubmit() {
    const data = this.parkingRateManagement.value;
    this.constantData = this.parameterDeTarifaService.getParamatroTarifaSelectedData();
    this.postData = {
      'tipodeTarifa': this.constantData.tipodeTarifa,
      'description': this.constantData.description,
      'centro': data.centro,
      'mastroDescripcion': data.description,
      'fechaDesdeVigencia': this.constantData.fechaDesdeVigencia
    };
    console.log('postData', this.postData);
    this.whileLoading = false;
    this.parameterDeTarifaService.searchTipoTarifaData(this.postData).subscribe(list => {
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
