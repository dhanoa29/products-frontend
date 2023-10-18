import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, last, map, of } from 'rxjs';
import { Country } from '../common/Country';
import { State } from '../common/State';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private countriesUrl = 'http://localhost:8080/api/countries';
  private statesUrl = 'http://localhost:8080/api/states';

  constructor(private httpClient: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.httpClient
      .get<GetResponseCountries>(this.countriesUrl)
      .pipe(map((data) => data._embedded.countries));
  }

  getStates(theCountryCode: string): Observable<State[]> {
    return this.httpClient
      .get<GetResponseStates>(
        this.statesUrl + '/search/findByCountryCode?code=' + theCountryCode
      )
      .pipe(map((data) => data._embedded.states));
  }

  getCreditCardMonths(startMonth: number): Observable<number[]> {
    let months: number[] = [];

    for (let month = startMonth; month <= 12; month++) {
      months.push(month);
    }

    return of(months);
  }

  getCreditCardYears(): Observable<number[]> {
    let years: number[] = [];
    let currentYear = new Date().getFullYear();
    let lastYear = currentYear + 10;

    for (let year = currentYear; year <= lastYear; year++) {
      years.push(year);
    }

    return of(years);
  }
}

interface GetResponseCountries {
  _embedded: {
    countries: Country[];
  };
}

interface GetResponseStates {
  _embedded: {
    states: State[];
  };
}
