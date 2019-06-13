import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface TipoTarifa {
  id: number;
  modificationCounter: number;
  description: string;
  tipodeTarifa: string;
}

export interface TipoTarifaEto {
  tipodeTarifa: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class TipoTarifaService {
  selectedData: TipoTarifa;
  private readonly tipo_tarifa = environment.serverUrl + 'services/rest/tipotarifamanagement/v1/tipotarifa/findAll';
  private readonly edit_tipo_tarifa = environment.serverUrl + 'services/rest/tipotarifamanagement/v1/tipotarifa/update/';
  private readonly add_delete_tipo_tarifa = environment.serverUrl + 'services/rest/tipotarifamanagement/v1/tipotarifa/';
  private readonly search_tipo_tarifa = environment.serverUrl + 'services/rest/tipotarifamanagement/v1/tipotarifa/search/';
  constructor(
    private http: HttpClient
  ) { }

  findAllTipoTarifaData(): Observable<TipoTarifa[]> {
    return this.http.get<TipoTarifa[]>(this.tipo_tarifa);
  }

  editTipoTarifaData(data: TipoTarifa): Observable<TipoTarifa> {
    return this.http.put<TipoTarifa>(this.edit_tipo_tarifa + data.tipodeTarifa + '/'  + data.description, data);
  }

  addTipoTarifaData(data: TipoTarifaEto): Observable<TipoTarifaEto> {
    return this.http.post<TipoTarifaEto>(this.add_delete_tipo_tarifa, data);
  }

  deleteTipoTarifaData(data: TipoTarifa): Observable<TipoTarifa> {
    return this.http.delete<TipoTarifa>(this.add_delete_tipo_tarifa + data.id);
  }

  searchTipoTarifaData(data: TipoTarifaEto): Observable<TipoTarifa[]> {
    return this.http.post<TipoTarifa[]>(this.search_tipo_tarifa, data);
  }

  setTipoTarifaSelectedData(data: TipoTarifa) {
    this.selectedData = data;
  }

  getTipoTarifaSelectedData() {
    return this.selectedData;
  }
}
