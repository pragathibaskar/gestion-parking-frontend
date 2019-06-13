import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TipoTarifaService, TipoTarifa } from '../service/tipo-tarifa.service';
import { Subscription } from 'rxjs';
import { BREADCRUMB_PATHS } from 'src/app/core/constants/breadcrumb-paths.const';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
@Component({
  selector: 'app-tipos-tarifa-home',
  templateUrl: './tipos-tarifa-home.component.html',
  styleUrls: ['./tipos-tarifa-home.component.scss']
})
export class TiposTarifaHomeComponent implements OnInit, OnDestroy {
  dataSource: TipoTarifa[] = [];
  subscription: Subscription;
  whileLoading = true;
  columns = [
    { name: 'tipodeTarifa', label: 'Tipo De Tarifa'},
    { name: 'description', label: 'Description'}
  ];
  literals: any = {};
  breadcrumb: any[];
  breadcrumbPaths: any;
  constructor(
    private readonly translationService: TranslateService,
    private tipoTarifaService: TipoTarifaService,
    private router: Router,
    private route: ActivatedRoute,
    private alertSerive: AlertsService
  ) {
      this.tipoTarifaService.setTipoTarifaSelectedData(null);
  }

  ngOnInit() {
    this.getTranslations();
    this.subscription = this.tipoTarifaService.findAllTipoTarifaData().subscribe((data: TipoTarifa[]) => {
      this.dataSource = data.reverse();
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
        { name: this.breadcrumbPaths.TIPOS_TARIFA.name }
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

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
