import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, delay, map, of, tap } from 'rxjs';

import { Country } from '../interfaces/country.interface';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: {
      term: '',
      countries: []
    },
    byCountry: {
      term: '',
      countries: []
    },
    byRegion: {
      region: '',
      countries: []
    },
  }

  constructor( private http: HttpClient ) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage() {
    localStorage.setItem('store', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage() {
    const store = localStorage.getItem('store');
    if (store) {
      this.cacheStore = JSON.parse(store);
    }
  }

  private getCountriesrequest( url: string ): Observable<Country[]> {
    return this.http.get<Country[]>( url )
      .pipe(
        catchError(error => of([]))
      );
  }

  searchCapital( term: string ): Observable<Country[]> {
    const url = `${this.baseUrl}/capital/${term}`;
    return this.getCountriesrequest(url)
      .pipe(
        tap(countries => this.cacheStore.byCapital = { term, countries }),
        tap(() => this.saveToLocalStorage())
      );
  }
  searchCountry( term: string ): Observable<Country[]> {
    const url = `${this.baseUrl}/name/${term}`;
    return this.getCountriesrequest(url)
      .pipe(
        tap(countries => this.cacheStore.byCountry = { term, countries }),
        tap(() => this.saveToLocalStorage())
      );
  }
  searchRegion( term: Region ): Observable<Country[]> {
    const url = `${this.baseUrl}/region/${term}`;
    return this.getCountriesrequest(url)
      .pipe(
        tap(countries => this.cacheStore.byRegion = { region: term, countries }),
        tap(() => this.saveToLocalStorage())
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
