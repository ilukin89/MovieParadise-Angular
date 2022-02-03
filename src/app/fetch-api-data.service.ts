import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';

//Declaring the api url that will provide data for the client app
const apiUrl = 'https://glacial-ocean-39750.herokuapp.com/';

export interface User {
  _id: string;
  FavoriteMovies: Array<string>;
  Username: string;
  Email: string;
  Birthday: Date;
}

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  /**
   * Inject the HttpClient module to the constructor params
  This will provide HttpClient to the entire class, making it available via this.http
   * @param http 
   */

  constructor(private http: HttpClient) {}

  /**
   * call API end-point to register a new user
   * @function userRegistration
   * @param userDetails {any}
   * @returns a new user object in json format
   */
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'users', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * call API end-point to log in a user
   * @param userDetails {any}
   * @returns user's data in json format
   */
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http
      .post(apiUrl + 'login', userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * call API end-point to get all movies
   * @function getAllMovies
   * @return array of movies object in json format
   */
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const requestHeader = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    };
    console.log({ requestHeader });

    return this.http
      .get(apiUrl + 'movies', requestHeader)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call API end-point to get a specific movie by Title
   * @function getMovie
   * @param Title {any}
   * @returns a movie object in json format
   */
  getMovie(title: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'movies/' + title, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call API end-point to get a genre data
   * @function getGenre
   * @param Name {any}
   * @returns a genre data in json format
   */
  getGenre(genre: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'genres/' + genre, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call API end-point to get a director data by dirctor's name
   * @function getDirector
   * @param Name {any}
   * @returns a director's data in json format
   */
  getDirector(director: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'directors/' + director, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call API end-point to get a user's informations
   * @function getUser
   * @param userPayload {any}
   * @returns a user's information in json format
   */
  getUser(userPayload: any): Observable<any> {
    const userObject = JSON.parse(userPayload || '{}');
    const token = localStorage.getItem('token');

    if (!userObject.Username) {
      throw new Error('User does not exists');
    }
    return this.http
      .get(apiUrl + 'users/' + userObject.Username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  
  /**
   * call API end-point for editing a user's profile
   * @function editUser
   * @param userDetails {any}
   * @returns a user's information in json format
   */
  editUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .put(apiUrl + 'users/' + userDetails.Username, userDetails, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call API end-point to get a user's favorite movies list
   * @param Username {any}
   * @returns a list of the user's favorite movies in json format
   */
  getFavoriteMovies(username: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http
      .get(apiUrl + 'users/' + username + '/movies', {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  /**
   * call API end-point to add a movie to the user's favorite list
   * @param MovieID {any}
   * @returns the user's favorite list in json format
   */
  addFavoriteMovie(movieId: any): Observable<any> {
    const userObject = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    // console.log({username, token});

    if (!userObject.Username) {
      throw new Error('User object does not contain username');
    }

    const requestHeader = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + token,
      }),
    };
    const urlToCall =
      apiUrl + 'users/' + userObject.Username + '/movies/' + movieId;

    console.log({ requestHeader, urlToCall });

    return this.http
      .post(urlToCall, {}, requestHeader)
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }
  /**
   * call API end-point to delete a movie from user's favorite list
   * @param MovieID {any}
   * @returns the user's favorite list in json format
   */
  deleteMovie(movieId: any): Observable<any> {
    const userObject = JSON.parse(localStorage.getItem('user') || '{}');
    // const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + userObject.Username + '/movies/' + movieId, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * call API end-point to add a movie to the user's favorite list
   * @function deleteUser
   * @returns delete status
   */
  deleteUser(): Observable<any> {
    const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http
      .delete(apiUrl + 'users/' + username, {
        headers: new HttpHeaders({
          Authorization: 'Bearer ' + token,
        }),
      })
      .pipe(map(this.extractResponseData), catchError(this.handleError));
  }

  /**
   * Non-typed response extracttion
   * @param res {any}
   * @returns response || empty object
   */
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` + `Error body is: ${error.error}`
      );
    }
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
