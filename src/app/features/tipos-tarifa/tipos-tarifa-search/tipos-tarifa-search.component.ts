import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { TipoTarifaService, TipoTarifa } from '../service/tipo-tarifa.service';

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
  parkingRateManagement: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private translationService: TranslateService,
    private tipoTarifaService: TipoTarifaService
  ) {
    this.parkingRateManagement = formBuilder.group({
      tipoDeTarifa: '',
      tipoDeDescription: ''
    });
    this.tipoDeTarifaControl = this.parkingRateManagement.get('tipoDeTarifa');
    this.tipoDeDescriptionControl = this.parkingRateManagement.get('tipoDeDescription');
  }

  ngOnInit() {
    this.getTranslations();
    this.pageSize = window.innerHeight;
    if (this.compName === 'alta') {
      const tipoTarifaData: TipoTarifa = this.tipoTarifaService.getTipoTarifaSelectedData();
      this.pageHeight = window.innerHeight - 200;
      this.validatorsForTipoDeTarifaControl();
      this.validatorsForTipoDeDescriptionControl();
      if (tipoTarifaData) {
        this.parkingRateManagement.setValue({
          tipoDeTarifa: tipoTarifaData.tipodeTarifa,
          tipoDeDescription: tipoTarifaData.description
        });
      }
    } else {
      this.pageSize = 0;
      this.parkingRateManagement.setValue({
        tipoDeTarifa: '',
        tipoDeDescription: ''
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
    console.log(this.parkingRateManagement.value);
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
