import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
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
  providedIn: 'root'
})

export class FetchApiDataService {
  // Inject the HttpClient module to the constructor params
  // This will provide HttpClient to the entire class, making it available via this.http
  constructor(private http: HttpClient) {
  }

  // Making the API call for the user registration endpoint
  public userRegistration(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'users', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Making the API call for the user login endpoint 
  public userLogin(userDetails: any): Observable<any> {
    console.log(userDetails);
    return this.http.post(apiUrl + 'login', userDetails).pipe(
      catchError(this.handleError)
    );
  }

  // Making the API call for getting all movies
  getAllMovies(): Observable<any> {
    const token = localStorage.getItem('token');
    const requestHeader= {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }
    console.log({requestHeader});
    
    return this.http.get(apiUrl + 'movies', requestHeader).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  //  Making the API call for getting a single movie
  getMovie(title: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'movies/' + title, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the API call for getting a genre's description
  getGenre(genre: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'genres/' + genre, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the API call for getting a director's details
  getDirector(director: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.get(apiUrl + 'directors/' + director, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the API call for getting a user's information
  getUser(userPayload: any): Observable<any> {
    const userObject = JSON.parse(userPayload || '{}')
    const token = localStorage.getItem('token');

    if(!userObject.Username) {
      throw new Error('User does not exists')
    }
    return this.http.get(apiUrl + 'users/' + userObject.Username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the API call for editing a user's profile
  editUser(userDetails: any): Observable<any> {
    const token = localStorage.getItem('token');
    return this.http.put(apiUrl + 'users/' + userDetails.Username, userDetails, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

     // Get user's favorites movies list
     getFavoriteMovies(username: any): Observable<any> {
      const token = localStorage.getItem('token');
      return this.http.get(apiUrl + 'users/' + username + '/movies', {
        headers: new HttpHeaders(
          {
            Authorization: 'Bearer ' + token,
          })
      }).pipe(
        map(this.extractResponseData),
        catchError(this.handleError)
      );
    }

  // Making the API call for adding movies to a user's favorites
  addFavoriteMovie(movieId: any): Observable<any> {
    const userObject = JSON.parse(localStorage.getItem('user') || '{}')
    const token = localStorage.getItem('token');
    // console.log({username, token});

    if(!userObject.Username){
      throw new Error('User object does not contain username')
    }
    
    const requestHeader= {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }
    const urlToCall = apiUrl + 'users/' + userObject.Username + '/movies/' + movieId

    console.log({requestHeader, urlToCall});
    

    return this.http.post(urlToCall, {}, requestHeader).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the API call for deleting movies from a user's favorites
  deleteMovie(movieId: any): Observable<any> {
    const userObject = JSON.parse(localStorage.getItem('user') || '{}');
    // const username = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + userObject.Username + '/movies/' + movieId, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Making the API call for deleting a user's profile
  deleteUser(): Observable<any> {
    const username = localStorage.getItem('user')
    const token = localStorage.getItem('token');
    return this.http.delete(apiUrl + 'users/' + username, {
      headers: new HttpHeaders(
        {
          Authorization: 'Bearer ' + token,
        })
    }).pipe(
      map(this.extractResponseData),
      catchError(this.handleError)
    );
  }

  // Non-typed response extraction
  private extractResponseData(res: any): any {
    const body = res;
    return body || {};
  }

  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Some error occurred:', error.error.message);
    } else {
      console.error(
        `Error Status code ${error.status}, ` +
        `Error body is: ${error.error}`);
    }
    return throwError(() => new Error(
      'Something bad happened; please try again later.'));
  }
}