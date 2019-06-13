import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ParameterDeTarifaComponent } from './parameter-de-tarifa.component';
import { ParameterDeTarifaHomeComponent } from './parameter-de-tarifa-home/parameter-de-tarifa-home.component';

const routes: Routes = [
  { path: '', component: ParameterDeTarifaComponent, children: [
    { path: '', component: ParameterDeTarifaHomeComponent },
  ]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParameterDeTarifaRoutingModule { }
