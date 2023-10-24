import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of } from 'rxjs';

import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';

  constructor( private http: HttpClient ) { }

  private getCountriesrequest( url: string ): Observable<Country[]> {
    return this.http.get<Country[]>( url )
      .pipe(
        catchError(error => of([]))
      );
  }

  searchCapital( term: string ): Observable<Country[]> {
    const url = `${this.baseUrl}/capital/${term}`;
    return this.getCountriesrequest(url);
  }
  searchCountry( term: string ): Observable<Country[]> {
    const url = `${this.baseUrl}/name/${term}`;
    return this.getCountriesrequest(url);
  }
  searchRegion( term: string ): Observable<Country[]> {
    const url = `${this.baseUrl}/region/${term}`;
    return this.getCountriesrequest(url);
  }

  searchCountryByAlphaCode( code: string ): Observable<Country | null> {
    return this.http.get<Country[]>(`${this.baseUrl}/alpha/${code}`)
      .pipe(
        map( countries => countries.length ? countries[0] : null ),
        catchError(error => of(null))
      );
  }
}
