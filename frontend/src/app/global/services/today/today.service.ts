import { Injectable } from '@angular/core';
import { TodayModel } from '../../models/items/today';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TodayService {
  private hostURl: string;

  constructor(private http: HttpClient) {
    this.hostURl = environment.host;
    // remove comment to delete all items
    // this.deleteAll();
  }

  public getAll(): Observable<TodayModel[]> {
    return this.http
      .get<TodayModel[]>(`${this.hostURl}/api/today`)
      .pipe(map(result => _.map(result, (t) => new TodayModel(t))));
  }
  public create(resource: TodayModel): Observable<TodayModel> {
    return this.http
      .post<TodayModel>(`${this.hostURl}/api/today`, resource)
      .pipe(map(result => new TodayModel(result)));
  }
  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.hostURl}/api/today/${id}`);
  }

  public update(resource: TodayModel): Observable<TodayModel> {
    return this.http
      .put<TodayModel>(`${this.hostURl}/api/today/${resource._id}`, resource)
      .pipe(map(result => new TodayModel(result)));
  }

  public getById(id: string): Observable<TodayModel> {
    return this.http
      .get<TodayModel>(`${this.hostURl}/api/today/${id}`)
      .pipe(map(result => new TodayModel(result)));
  }


  // Debug function for deleting all items
  private deleteAll() {
    this.getAll().subscribe((data: TodayModel[]) => {
      data.forEach((item: TodayModel) => {
        this.delete((item as any)._id).subscribe((data: any) => { });
      });
    });
  }

}
