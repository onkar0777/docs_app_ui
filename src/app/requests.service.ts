import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { IRequest } from './request';
import { DriverRequests } from './driver/driver.component';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  reqApi = '/api/request';

  constructor(private http: HttpClient) { }

  getRequests(): Promise<IRequest[]> {
    return this.http.get<IRequest[]>(this.reqApi).toPromise();
  }

  addRequest(id: string): Observable<any> {
    return this.http.post(this.reqApi, { customer: id });
  }

  getDriverRequests(driver: string): Promise<DriverRequests> {
    return this.http.get<DriverRequests>(`${this.reqApi}/driver_requests?driver=${driver}`).toPromise();
  }

  selectRequest(reqId: string, driver: string): any {
    return this.http.post(`${this.reqApi}/select_request`, { reqId, driver }).toPromise();
  }

}
