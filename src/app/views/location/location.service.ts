import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { ICountry, IState } from './i-location';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
private baseurl: string = 'https://localhost:7082';
  constructor(private http: HttpClient) { }

  public fetchCountryList(): Observable<ICountry[]>{
    const url: string = `${this.baseurl}/Location/CountryList`;
    return <Observable<ICountry[]>>this.http.get(url);
  }

  public modifyCountry(d: ICountry): Observable<any[]>{
    const url: string = `${this.baseurl}/Location/ModifyCountry`;
    return <Observable<any[]>>this.http.post(url, d);
  }

  public fetchStateList(): Observable<IState[]>{
    const url: string = `${this.baseurl}/Location/StateList`;
    return <Observable<IState[]>>this.http.get(url);
  }

  
  public modifyState(d: IState): Observable<any[]>{
    const url: string = `${this.baseurl}/Location/ModifyState`;
    return <Observable<any[]>>this.http.post(url, d);
  }
}
