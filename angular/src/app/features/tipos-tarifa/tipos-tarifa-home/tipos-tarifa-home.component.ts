import { Component, OnInit, OnDestroy, ViewContainerRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { TipoTarifaService, TipoTarifa } from '../service/tipo-tarifa.service';
import { Subscription, Observable, of } from 'rxjs';
import { BREADCRUMB_PATHS } from 'src/app/core/constants/breadcrumb-paths.const';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertsService } from '../../../core/services/alerts/alerts.service';
import { AbandonProcessService } from 'src/app/core/services/abandon-process/abandon-process.service';

@Component({
  selector: 'app-tipos-tarifa-home',
  templateUrl: './tipos-tarifa-home.component.html',
  styleUrls: ['./tipos-tarifa-home.component.scss']
})
export class TiposTarifaHomeComponent implements OnInit, OnDestroy {
  dataSource: TipoTarifa[] = [];
  subscription: Subscription;
  store$: Observable<TipoTarifa[]>;
  whileLoading = false;
  columns = [
    { name: 'tipodeTarifa', label: 'Tipo de tarifa'},
    { name: 'description', label: 'Descripción'}
  ];
  literals: any = {};
  breadcrumb: any[];
  breadcrumbPaths: any;
  constructor(
    private readonly translationService: TranslateService,
    private tipoTarifaService: TipoTarifaService,
    private router: Router,
    private route: ActivatedRoute,
    private alertSerive: AlertsService,
    private abandonProcessService: AbandonProcessService
  ) {
      this.tipoTarifaService.setTipoTarifaSelectedData(null);
  }

  ngOnInit() {
    this.getTranslations();
    this.initialLoad();
    this.abandonProcessService.deactivate();
  }

  private initialLoad() {
    this.subscription = this.tipoTarifaService.findAllTipoTarifaData().subscribe((data: TipoTarifa[]) => {
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
