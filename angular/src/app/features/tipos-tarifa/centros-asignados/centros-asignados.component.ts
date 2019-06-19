import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TipoTarifaService, TipoTarifa, TipoTarifaEto } from '../service/tipo-tarifa.service';
import { Subscription, Observable, of } from 'rxjs';
import { BREADCRUMB_PATHS } from 'src/app/core/constants/breadcrumb-paths.const';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-centros-asignados',
  templateUrl: './centros-asignados.component.html',
  styleUrls: ['./centros-asignados.component.scss']
})
export class CentrosAsignadosComponent implements OnInit, OnDestroy {
  dataSource: TipoTarifa[] = [];
  subscription: Subscription;
  store$: Observable<TipoTarifa[]>;
  whileLoading = false;
  columns = [
    { name: 'centro', label: 'Código centro'},
    { name: 'descripcion', label: 'Description'},
    { name: 'fechaDesdeVigencia', label: 'Vigencia Desde'}
  ];
  literals: any = {};
  breadcrumb: any[];
  breadcrumbPaths: any;
  selectedTab = 'centros';
  tipoDeTarifaControl;
  tipoDeDescriptionControl;
  parkingRateManagement: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private readonly translationService: TranslateService,
    private tipoTarifaService: TipoTarifaService,
    private router: Router,
    private route: ActivatedRoute,
    private alertSerive: AlertsService
  ) {
      // this.tipoTarifaService.setTipoTarifaSelectedData(null);
      this.parkingRateManagement = this.formBuilder.group({
        tipodeTarifa: '',
        description: ''
      });
      this.tipoDeTarifaControl = this.parkingRateManagement.get('tipodeTarifa');
      this.tipoDeDescriptionControl = this.parkingRateManagement.get('description');
      // this.tipoDeTarifaControl.setValidators([Validators.required]);
      this.tipoDeTarifaControl.updateValueAndValidity();
      // this.tipoDeDescriptionControl.setValidators([Validators.required]);
      this.tipoDeDescriptionControl.updateValueAndValidity();
  }

  ngOnInit() {
    this.getTranslations();
    this.initialLoad();
  }

  private initialLoad() {
    const selectedTipoTarifa: TipoTarifa = this.tipoTarifaService.getTipoTarifaSelectedData();
    const tipoTarifaPayload: TipoTarifaEto = {tipodeTarifa: selectedTipoTarifa.tipodeTarifa, description: selectedTipoTarifa.description};
    this.tipoTarifaService.findAllCentrosData(tipoTarifaPayload).subscribe((data: TipoTarifa[]) => {
      this.dataSource = data.reverse();
      console.log(this.dataSource);
      this.whileLoading = true;
    });
  }

  private getTranslations() {
    const currentLang = this.translationService.currentLang;
    this.translationService.getTranslation(currentLang).subscribe(translations => {
      this.literals = translations;
      console.log(this.literals);
      this.breadcrumbPaths = BREADCRUMB_PATHS(this.literals);
      this.breadcrumb = [
        this.breadcrumbPaths.HOME,
        this.breadcrumbPaths.MANTENIMIENTOS,
        this.breadcrumbPaths.TIPOS_TARIFA,
        { name: this.breadcrumbPaths.CENTROS_ASIGNADOS_TIPO_TARIFA.name }
      ];
    });
    this.translationService.onLangChange.subscribe( translations => {
      this.literals = translations.translations;
      this.breadcrumbPaths = BREADCRUMB_PATHS(this.literals);
      this.breadcrumb = [
        this.breadcrumbPaths.HOME,
        this.breadcrumbPaths.MANTENIMIENTOS,
        this.breadcrumbPaths.TIPOS_TARIFA,
        { name: this.breadcrumbPaths.CENTROS_ASIGNADOS_TIPO_TARIFA.name }
      ];
    });
  }

  parkingRateManagementSubmit() {
    const selectedTipoTarifa: TipoTarifa = this.tipoTarifaService.getTipoTarifaSelectedData();
    this.whileLoading = false;
    const searchData = {};
    searchData['tipodeTarifa'] = selectedTipoTarifa.tipodeTarifa;
    searchData['description'] = selectedTipoTarifa.description;
    if (this.tipoDeTarifaControl.value !== '') {
      searchData['centro'] = this.tipoDeTarifaControl.value;
    }
    if (this.tipoDeDescriptionControl.value !== '') {
      searchData['mastroDescripcion'] = this.tipoDeDescriptionControl.value;
    }

    console.log(searchData);
    // return false;

    this.tipoTarifaService.searchTipoCentrosData(searchData).subscribe(list => {
      this.whileLoading = true;
      if (list['content'].length) {
        this.dataSource = list['content'];
      } else {
        this.dataSource = [];
        this.alertSerive.warning(this.literals.noRecord);
      }
    }, error => {
      this.whileLoading = true;
      this.alertSerive.danger(this.literals.generic_error_title);
    });
  }

  discard() {
    this.parkingRateManagement.reset();
    this.initialLoad();
  }

  edit(data: TipoTarifa) {
    this.tipoTarifaService.setTipoTarifaSelectedData(data);
    this.router.navigate(['alta', data.id], { relativeTo: this.route });
  }

  delete(tipoTarifData: any) {
    console.log(tipoTarifData);
    this.whileLoading = false;
    this.tipoTarifaService.deleteCentroTarifaData(tipoTarifData).subscribe(data => {
      this.alertSerive.success(this.literals.successDelete);
      this.whileLoading = true;
      // this.dataSource = this.dataSource.filter(dataT => dataT.id !== tipoTarifData.id);
      this.initialLoad();
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
