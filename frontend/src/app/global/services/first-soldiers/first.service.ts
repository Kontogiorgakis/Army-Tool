import { Injectable } from '@angular/core';
import { FirstModel } from '../../models/items/first.model';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirstService {
  private hostURl: string;

  constructor(private http: HttpClient) {
    this.hostURl = environment.host;
    // remove comment to delete all items
    // this.deleteAll();
  }

  public getAll(): Observable<FirstModel[]> {
    return this.http
      .get<FirstModel[]>(`${this.hostURl}/api/first`)
      .pipe(map(result => _.map(result, (t) => new FirstModel(t))));
  }
  public create(resource: FirstModel): Observable<FirstModel> {
    return this.http
      .post<FirstModel>(`${this.hostURl}/api/first`, resource)
      .pipe(map(result => new FirstModel(result)));
  }
  public delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.hostURl}/api/first/${id}`);
  }

  public update(resource: FirstModel): Observable<FirstModel> {
    return this.http
      .put<FirstModel>(`${this.hostURl}/api/first/${resource._id}`, resource)
      .pipe(map(result => new FirstModel(result)));
  }

  public getById(id: string): Observable<FirstModel> {
    return this.http
      .get<FirstModel>(`${this.hostURl}/api/first/${id}`)
      .pipe(map(result => new FirstModel(result)));
  }


  // Debug function for deleting all items
  private deleteAll() {
    this.getAll().subscribe((data: FirstModel[]) => {
      data.forEach((item: FirstModel) => {
        this.delete((item as any)._id).subscribe((data: any) => { });
      });
    });
  }

}
