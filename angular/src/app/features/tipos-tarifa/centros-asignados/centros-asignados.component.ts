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
      this.tipoDeTarifaControl.setValidators([Validators.required]);
      this.tipoDeTarifaControl.updateValueAndValidity();
      this.tipoDeDescriptionControl.setValidators([Validators.required]);
      this.tipoDeDescriptionControl.updateValueAndValidity();
  }

  ngOnInit() {
    this.getTranslations();
    this.initialLoad();
  }

  private initialLoad() {
    const selectedTipoTarifa: TipoTarifa = this.tipoTarifaService.getTipoTarifaSelectedData();
    const tipoTarifaPayload: TipoTarifaEto = {tipodeTarifa: selectedTipoTarifa.tipodeTarifa, description: selectedTipoTarifa.description};
    this.subscription = this.tipoTarifaService.findAllCentrosData(tipoTarifaPayload).subscribe((data: TipoTarifa[]) => {
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
    if (this.parkingRateManagement.valid) {
      const selectedTipoTarifa: TipoTarifa = this.tipoTarifaService.getTipoTarifaSelectedData();
      const payload = {
        tipodeTarifa: selectedTipoTarifa.tipodeTarifa,
        description: selectedTipoTarifa.description,
        centreCode: this.tipoDeTarifaControl.value,
        centreDesc: this.tipoDeDescriptionControl.value
      };
      console.log(payload);
      this.subscription = this.tipoTarifaService.searchCentrosData(payload).subscribe((data: TipoTarifa[]) => {
        this.dataSource = data.reverse();
        console.log(this.dataSource);
        this.whileLoading = true;
      });
    }
  }

  discard() {
    this.parkingRateManagement.reset();
    this.initialLoad();
  }

  edit(data: TipoTarifa) {
    this.tipoTarifaService.setTipoTarifaSelectedData(data);
    this.router.navigate(['alta', data.id], { relativeTo: this.route });
  }

  delete(tipoTarifData: TipoTarifa) {
    this.whileLoading = false;
    this.tipoTarifaService.deleteTipoTarifaData(tipoTarifData).subscribe(data => {
      this.alertSerive.success(this.literals.successDelete);
      this.whileLoading = true;
      this.dataSource = this.dataSource.filter(dataT => dataT.id !== tipoTarifData.id);
    }, error => {
      this.whileLoading = true;
      this.alertSerive.danger(this.literals.generic_error_title);
     });
  }

  search(data) {
    this.whileLoading = false;
    this.tipoTarifaService.searchTipoTarifaData(data).subscribe(list => {
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
