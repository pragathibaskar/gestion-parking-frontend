import { Component, OnInit, HostBinding, ViewChild, Input, HostListener, EventEmitter,
        Output, ElementRef, AfterViewInit } from '@angular/core';

import { ITdDataTableColumn } from '@covalent/core/data-table';
import { TdDialogService, IPageChangeEvent, TdPagingBarComponent, TdDataTableService, TdDataTableSortingOrder } from '@covalent/core';
import { TipoTarifa } from '../../features/tipos-tarifa/service/tipo-tarifa.service';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {
  @Input() data: TipoTarifa[];
  @Input() columns: any;
  @ViewChild(TdPagingBarComponent) pagingBar: TdPagingBarComponent;
  @Output() editData = new EventEmitter<TipoTarifa>();
  @Output() deleteData = new EventEmitter<TipoTarifa>();
  @Input() scrollable = false;
  selectedRow: TipoTarifa;
  tdOffsetTop: number;
  tdOffsetLeft: number;
  prevTarget: HTMLElement;
  view = false;
  fromRow: any = 1;
  currentPage: any = 1;
  pageSize: any = 10;
  filteredData: TipoTarifa[];
  filteredTotal: number;
  searchTerm = '';
  constructor(private _dataTableService: TdDataTableService) {}

  async ngOnInit(): Promise<void> {
    this.filteredData = this.data;
    this.filter();
  }

  dataTableModification(evt: Event, value: TipoTarifa) {
    this.selectedRow = value;
    const ele: HTMLElement = <HTMLElement> evt.target;
    this.tdOffsetTop = ele.closest('td').offsetTop - 8;
    this.tdOffsetLeft = ele.closest('td').offsetLeft - ele.closest('table').scrollLeft - 178;
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
    if (ele.className && !ele.classList.contains('tdDataTableIcon') && !ele.classList.contains('dataTableModification')) {
      this.view = false;
      this.prevTarget = null;
    }
  }

  onScroll($event) {
    this.view = false;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.view = false;
  }

  showAlert(event: any): void {
    console.log(this._dataTableService.filterData);
    console.log(this._dataTableService.sortData);
  }

  edit() {
    this.editData.emit(this.selectedRow);
  }

  delete() {
    this.deleteData.emit(this.selectedRow);
  }

  page(pagingEvent: IPageChangeEvent): void {
    this.fromRow = pagingEvent.fromRow;
    this.currentPage = pagingEvent.page;
    this.pageSize = pagingEvent.pageSize;
    this.filter();
  }

  async filter(): Promise<void> {
    let newData: any[] = this.data;
    this.filteredTotal = newData.length;
    newData = await this._dataTableService.pageData(newData, this.fromRow, this.currentPage * this.pageSize);
    this.filteredData = newData;
  }
}
