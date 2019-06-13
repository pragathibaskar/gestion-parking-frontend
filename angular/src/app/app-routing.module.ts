import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PATHS } from './core/constants/paths.const';

const routes: Routes = [
  { path: PATHS.home, loadChildren: './features/home/home.module#HomeModule' },
  { path: PATHS.tiposTarifa, loadChildren: './features/tipos-tarifa/tipos-tarifa.module#TiposTarifaModule' },
  { path: '**', redirectTo: PATHS.home, pathMatch: 'full', canActivate: [] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
