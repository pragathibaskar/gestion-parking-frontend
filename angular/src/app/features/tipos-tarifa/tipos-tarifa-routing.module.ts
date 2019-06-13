import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TiposTarifaComponent } from './tipos-tarifa.component';
import { AltaNuevoComponent } from './alta-nuevo/alta-nuevo.component';
import { TiposTarifaHomeComponent } from './tipos-tarifa-home/tipos-tarifa-home.component';

const routes: Routes = [
  { path: '', component: TiposTarifaComponent, children: [
    { path: 'alta', component: AltaNuevoComponent },
    { path: 'alta/:id', component: AltaNuevoComponent },
    { path: '', component: TiposTarifaHomeComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: []
})
export class TiposTarifaRoutingModule { }
