import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './table.component';
import { CoreModule } from '../core.module';

@NgModule({
  imports: [
    CommonModule,
    CoreModule
  ],
  declarations: [TableComponent],
  exports: [TableComponent]
})
export class TableModule { }
