import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  /**
   * Perform a GET request
   * @param endpoint API endpoint (without base URL)
   * @param params Optional query parameters
   * @param headers Optional additional headers
   * @returns Observable of response
   */
  get<T>(endpoint: string, params?: any, headers?: HttpHeaders): Observable<T> {
    const options = {
      params: this.toHttpParams(params),
      headers,
    };

    return this.http
      .get<T>(`${this.apiUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Perform a POST request
   * @param endpoint API endpoint (without base URL)
   * @param body Request body
   * @param headers Optional additional headers
   * @returns Observable of response
   */
  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .post<T>(`${this.apiUrl}/${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Perform a PUT request
   * @param endpoint API endpoint (without base URL)
   * @param body Request body
   * @param headers Optional additional headers
   * @returns Observable of response
   */
  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .put<T>(`${this.apiUrl}/${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Perform a PATCH request
   * @param endpoint API endpoint (without base URL)
   * @param body Request body
   * @param headers Optional additional headers
   * @returns Observable of response
   */
  patch<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http
      .patch<T>(`${this.apiUrl}/${endpoint}`, body, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Perform a DELETE request
   * @param endpoint API endpoint (without base URL)
   * @param params Optional query parameters
   * @param headers Optional additional headers
   * @returns Observable of response
   */
  delete<T>(
    endpoint: string,
    params?: any,
    headers?: HttpHeaders
  ): Observable<T> {
    const options = {
      params: this.toHttpParams(params),
      headers,
    };

    return this.http
      .delete<T>(`${this.apiUrl}/${endpoint}`, options)
      .pipe(catchError(this.handleError));
  }

  /**
   * Convert params object to HttpParams
   * @param params Parameters object
   * @returns HttpParams object
   */
  private toHttpParams(params?: any): HttpParams {
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key]);
        }
      });
    }

    return httpParams;
  }

  /**
   * Handle API errors
   * @param error HTTP error
   * @returns Observable with error
   */
  private handleError(error: any): Observable<never> {
    return throwError(() => error);
  }
}
