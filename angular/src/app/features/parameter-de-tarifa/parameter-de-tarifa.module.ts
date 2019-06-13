import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParameterDeTarifaRoutingModule } from './parameter-de-tarifa-routing.module';
import { ParameterDeTarifaComponent } from './parameter-de-tarifa.component';
import { ParameterDeTarifaHomeComponent } from './parameter-de-tarifa-home/parameter-de-tarifa-home.component';
import { BreadcrumbModule } from '../../shared/breadcrumb/breadcrumb.module';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from '../../shared/core.module';
import { TableModule } from '../../shared/table/table.module';
import { ParameterDeTarifaSearchComponent } from './parameter-de-tarifa-search/parameter-de-tarifa-search.component';

@NgModule({
  declarations: [
    ParameterDeTarifaComponent,
    ParameterDeTarifaHomeComponent,
    ParameterDeTarifaSearchComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ReactiveFormsModule,
    CoreModule,
    TableModule,
    ParameterDeTarifaRoutingModule,
    BreadcrumbModule
  ]
})
export class ParameterDeTarifaModule { }
