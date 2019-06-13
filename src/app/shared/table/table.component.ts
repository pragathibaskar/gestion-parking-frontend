import { Component, OnInit, HostBinding, ViewChild, Input, HostListener, EventEmitter, Output } from '@angular/core';

import { ITdDataTableColumn } from '@covalent/core/data-table';
import { TdDialogService, IPageChangeEvent, TdPagingBarComponent, TdDataTableService } from '@covalent/core';
import { TipoTarifa } from '../../features/tipos-tarifa/service/tipo-tarifa.service';


@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() data: any[];
  @Input() columns: ITdDataTableColumn[];
  @ViewChild(TdPagingBarComponent) pagingBar: TdPagingBarComponent;
  @Output() editData = new EventEmitter<TipoTarifa>();
  selectedRow: TipoTarifa;
  tdOffsetTop: number;
  tdOffsetLeft: number;
  prevTarget: HTMLElement;
  view = false;
  basicData: any[];
  eventLinks: IPageChangeEvent;
  fromRow: any = 1;
  currentPage: any = 1;
  pageSize: any = 5;
  filteredData: any[];
  filteredTotal: number;

  constructor(private _dataTableService: TdDataTableService) {}

  ngOnInit(): void {
    this.basicData = this.data.slice(0, 10);
    this.filter();
  }

  dataTableModification(evt: Event, value: TipoTarifa) {
    this.selectedRow = value;
    const ele: HTMLElement = <HTMLElement> evt.target;
    this.tdOffsetTop = ele.closest('td').offsetTop - 52;
    this.tdOffsetLeft = ele.closest('td').offsetLeft - 180;
    if (this.prevTarget === ele) {
      this.view = false;
      this.prevTarget = null;
    } else {
      this.prevTarget = ele;
      this.view = true;
    }
  }

  @HostListener('body:click', ['$event'])
  onclick(event) {
    const ele: HTMLElement = <HTMLElement> event.target;
    console.log(ele.className);
    if (ele.className && !ele.classList.contains('tdDataTableIcon') && !ele.classList.contains('dataTableModification')) {
      this.view = false;
      this.prevTarget = null;
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.view = false;
  }

  changeLinks(pagingEvent: IPageChangeEvent): void {
    this.eventLinks = pagingEvent;
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  async filter(): Promise<void> {
    let newData: any[] = this.data;
    newData = await this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }

  showAlert(event: any): void {
    console.log(this._dataTableService.filterData);
    console.log(this._dataTableService.sortData);
  }

  edit() {
    this.editData.emit(this.selectedRow);
  }

}
