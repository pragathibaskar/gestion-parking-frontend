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

@Injectable({
  providedIn: 'root'
})
export class TipoTarifaService {
  selectedData: TipoTarifa;
  private readonly tipo_tarifa = environment.serverUrl + 'services/rest/tipotarifamanagement/v1/tipotarifa/findAll';
  constructor(
    private http: HttpClient
  ) { }

  public findAllTipoTarifaData(): Observable<TipoTarifa[]> {
    return this.http.get<TipoTarifa[]>(this.tipo_tarifa);
  }

  setTipoTarifaSelectedData(data: TipoTarifa) {
    this.selectedData = data;
  }

  getTipoTarifaSelectedData() {
    return this.selectedData;
  }
}
