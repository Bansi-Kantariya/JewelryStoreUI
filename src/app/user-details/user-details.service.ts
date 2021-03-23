import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { UserDetail } from '../models/user-detail';
import { sha256 } from 'js-sha256'
import { LoginDetails } from '../models/login-detail';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { AppConfig } from 'src/app.config';

@Injectable({
  providedIn: 'root'
})
export class UserDetailsService {
  private userDetailUrl = `${AppConfig.settings.apiServer.serverUrl}UserDetails/`;
  constructor(private http: HttpClient) { }

  authenticateUser(loginDetail: LoginDetails) : Observable<UserDetail>{
    const url = `${this.userDetailUrl}AuthenticateUser?userName=${loginDetail.userName}&password=${sha256(loginDetail.password)}`;

    return this.http.get<UserDetail>(url)
    .pipe(
      tap(item => console.log("data", item)),
      catchError(this.handleError)
    );
  }
  
  private handleError(err: { error: { message: any; }; status: any; message: { error: any; }; }) {
    console.log("handle", err);
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      errorMessage = `Backend returned code ${err.status}: ${err.message}`;
    }
    console.error('error in service', err);
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
