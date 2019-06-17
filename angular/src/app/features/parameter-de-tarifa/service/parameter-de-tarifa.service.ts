import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TipoTarifa } from '../../tipos-tarifa/service/tipo-tarifa.service';

export interface ParameterDeTarifas {
  costeFraccion: number;
  description: string;
  endDate: string;
  fechaDesdeVigencia: number;
  fechaModificacion: number;
  fraccionFacturacion: number;
  tipodeTarifaId: number;
  importeMin1Hora: number;
  importeMin2Hora: number;
  importeMinSinCompra: number;
  importeParkingMax: number;
  modificationCounter: number;
  numberOfCentros: number;
  startDate: string;
  tiempoMaxSalida: number;
  tiempoMaxSinCompra: number;
  tipodeTarifa: string;
}

export interface ParameterDeTarifaAdvanceSearch {
  tipodeTarifa: string;
  description: string;
  startDate: string;
  endDate: string;
}

@Injectable({
  providedIn: 'root'
})
export class ParameterDeTarifaService {
  private readonly findAllParametrotarifas = environment.serverUrl + 'services/rest/parametrotarifamanagement/v1/parametrotarifas/';
  private readonly search_parametro_tarifas = environment.serverUrl +
                                              'services/rest/parametrotarifamanagement/v1/parametrotarifa/advance-search';
  private readonly deleteParametrotarifas = environment.serverUrl + 'services/rest/parametrotarifamanagement/v1/parametrotarifa/';
  private readonly tipo_tarifa = environment.serverUrl + 'services/rest/tipotarifamanagement/v1/tipotarifa/findAll';
  private readonly saveParametroDeTarifa = environment.serverUrl + 'services/rest/parametrotarifamanagement/v1/parametrotarifa/';

  constructor(
    private http: HttpClient
  ) { }

  findAllParametrosTarifa(): Observable<ParameterDeTarifas[]> {
    return this.http.get<ParameterDeTarifas[]>(this.findAllParametrotarifas);
  }

  searchParametrosTarifaData(data: ParameterDeTarifaAdvanceSearch): Observable<ParameterDeTarifas[]> {
    return this.http.post<ParameterDeTarifas[]>(this.search_parametro_tarifas, data);
  }

  deleteParametrosTarifaData(id: number) {
    return this.http.delete(this.deleteParametrotarifas + id);
  }

  findAllTipoTarifaData(): Observable<TipoTarifa[]> {
    return this.http.get<TipoTarifa[]>(this.tipo_tarifa);
  }

  saveParametroDeTarifaData(data: ParameterDeTarifas): Observable<ParameterDeTarifas> {
    return this.http.post<ParameterDeTarifas>(this.saveParametroDeTarifa, data);
  }
}
