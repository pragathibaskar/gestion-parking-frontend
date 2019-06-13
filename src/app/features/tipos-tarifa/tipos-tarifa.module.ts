import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { TiposTarifaRoutingModule } from './tipos-tarifa-routing.module';
import { TiposTarifaComponent } from './tipos-tarifa.component';
import { CoreModule } from 'src/app/shared/core.module';
import { TableModule } from 'src/app/shared/table/table.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TiposTarifaSearchComponent } from './tipos-tarifa-search/tipos-tarifa-search.component';
import { AltaNuevoComponent } from './alta-nuevo/alta-nuevo.component';
import { TiposTarifaHomeComponent } from './tipos-tarifa-home/tipos-tarifa-home.component';
import { BreadcrumbModule } from '../../shared/breadcrumb/breadcrumb.module';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    TiposTarifaRoutingModule,
    CoreModule,
    TableModule,
    BreadcrumbModule
  ],
  declarations: [
    TiposTarifaComponent,
    TiposTarifaSearchComponent,
    AltaNuevoComponent,
    TiposTarifaHomeComponent
  ],
  bootstrap: [TiposTarifaComponent]
})
export class TiposTarifaModule { }
