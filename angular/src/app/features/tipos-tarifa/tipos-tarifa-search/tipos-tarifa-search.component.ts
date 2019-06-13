import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TipoTarifaService, TipoTarifa, TipoTarifaEto } from '../service/tipo-tarifa.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertsService } from '../../../core/services/alerts/alerts.service';

@Component({
  selector: 'app-tipos-tarifa-search',
  templateUrl: './tipos-tarifa-search.component.html',
  styleUrls: ['./tipos-tarifa-search.component.scss']
})
export class TiposTarifaSearchComponent implements OnInit {
  literals: any;
  @Input() compName: string;
  pageHeight: number;
  pageSize = 0;
  tipoDeTarifaControl;
  tipoDeDescriptionControl;
  tipoTarifaData: TipoTarifa;
  parkingRateManagement: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private translationService: TranslateService,
    private tipoTarifaService: TipoTarifaService,
    private router: Router,
    private route: ActivatedRoute,
    private alertService: AlertsService
  ) {
    this.parkingRateManagement = formBuilder.group({
      tipodeTarifa: '',
      description: ''
    });
    this.tipoDeTarifaControl = this.parkingRateManagement.get('tipodeTarifa');
    this.tipoDeDescriptionControl = this.parkingRateManagement.get('description');
  }

  ngOnInit() {
    this.getTranslations();
    this.pageSize = window.innerHeight;
    if (this.compName === 'alta') {
      this.tipoTarifaData = this.tipoTarifaService.getTipoTarifaSelectedData();
      this.pageHeight = window.innerHeight - 200;
      this.validatorsForTipoDeTarifaControl();
      this.validatorsForTipoDeDescriptionControl();
      if (this.tipoTarifaData) {
        this.parkingRateManagement.setValue({
          tipodeTarifa: this.tipoTarifaData.tipodeTarifa,
          description: this.tipoTarifaData.description
        });
      }
    } else {
      this.pageSize = 0;
      this.parkingRateManagement.setValue({
        tipodeTarifa: '',
        description: ''
      });
    }
  }

  private getTranslations() {
    const currentLang = this.translationService.currentLang;
    this.translationService.getTranslation(currentLang).subscribe(translations => {
      this.literals = translations;
    });

    this.translationService.onLangChange.subscribe( translations => {
      this.literals = translations.translations;
    });
  }

  parkingRateManagementSubmit() {
    const params = this.route.snapshot.params;
    if (this.parkingRateManagement.valid) {
      if (Object.keys(params).length) {
        this.tipoTarifaService.editTipoTarifaData(this.parkingRateManagement.value).subscribe(data => {
          this.alertService.success(this.literals.successRecord);
          this.router.navigate(['/tipos-tarifa']);
        }, error => {
          this.alertService.danger(this.literals.generic_error_title);
        });
      } else {
        this.tipoTarifaService.addTipoTarifaData(this.parkingRateManagement.value).subscribe(data => {
          this.alertService.success('Successfully Added Record');
          this.router.navigate(['/tipos-tarifa']);
        }, error => {
          this.alertService.danger(this.literals.generic_error_title);
        });
      }
    }
  }

  private validatorsForTipoDeTarifaControl() {
    this.tipoDeTarifaControl.setValidators([Validators.required]);
    this.tipoDeTarifaControl.updateValueAndValidity();
  }

  private validatorsForTipoDeDescriptionControl() {
    this.tipoDeDescriptionControl.setValidators([Validators.required]);
    this.tipoDeDescriptionControl.updateValueAndValidity();
  }

}
