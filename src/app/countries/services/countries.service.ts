import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of } from 'rxjs';

import { Country } from '../interfaces/country.interface';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';

  constructor( private http: HttpClient ) { }

  searchCapital( term: string ): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/capital/${term}`)
      .pipe(
        catchError(error => of([]))
      );
  }
  searchCountry( term: string ): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/name/${term}`)
      .pipe(
        catchError(error => of([]))
      );
  }
  searchRegion( term: string ): Observable<Country[]> {
    return this.http.get<Country[]>(`${this.baseUrl}/region/${term}`)
      .pipe(
        catchError(error => of([]))
      );
  }

  searchCountryByAlphaCode( code: string ): Observable<Country | null> {
    return this.http.get<Country[]>(`${this.baseUrl}/alpha/${code}`)
      .pipe(
        map( countries => countries.length ? countries[0] : null ),
        catchError(error => of(null))
      );
  }
}
