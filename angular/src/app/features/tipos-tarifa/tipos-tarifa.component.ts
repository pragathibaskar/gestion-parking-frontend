import { Component, OnInit, ViewChild } from '@angular/core';
import { TableComponent } from 'src/app/shared/table/table.component';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-tipos-tarifa',
  templateUrl: './tipos-tarifa.component.html',
  styleUrls: ['./tipos-tarifa.component.scss']
})
export class TiposTarifaComponent implements OnInit {

  subscriptions: Subscription = new Subscription();

  constructor(
    private router: Router,
    private readonly route: ActivatedRoute,
  ) {}

  @ViewChild(TableComponent) table: TableComponent;

  ngOnInit() {}

}
