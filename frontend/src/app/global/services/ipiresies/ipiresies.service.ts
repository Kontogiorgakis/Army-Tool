import { Injectable } from '@angular/core';
import { IpiresiesModel } from '../../models/items/ipiresies';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class IpiresiesService {
  private hostURl: string;

  constructor(private http: HttpClient) {
    this.hostURl = environment.host;
    // remove comment to delete all items
    // this.deleteAll();
  }

  public getAll(): Observable<IpiresiesModel[]> {
    return this.http
      .get<IpiresiesModel[]>(`${this.hostURl}/api/services`)
      .pipe(map(result => _.map(result, (t) => new IpiresiesModel(t))));
  }
  public create(resource: IpiresiesModel): Observable<IpiresiesModel> {
    return this.http
      .post<IpiresiesModel>(`${this.hostURl}/api/services`, resource)
      .pipe(map(result => new IpiresiesModel(result)));
  }
  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.hostURl}/api/services/${id}`);
  }

  public update(resource: IpiresiesModel): Observable<IpiresiesModel> {
    return this.http
      .put<IpiresiesModel>(`${this.hostURl}/api/services/${resource._id}`, resource)
      .pipe(map(result => new IpiresiesModel(result)));
  }

  public getById(id: string): Observable<IpiresiesModel> {
    return this.http
      .get<IpiresiesModel>(`${this.hostURl}/api/services/${id}`)
      .pipe(map(result => new IpiresiesModel(result)));
  }


  // Debug function for deleting all items
  private deleteAll() {
    this.getAll().subscribe((data: IpiresiesModel[]) => {
      data.forEach((item: IpiresiesModel) => {
        this.delete((item as any)._id).subscribe((data: any) => { });
      });
    });
  }

}
