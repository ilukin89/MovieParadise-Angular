import { Component, OnInit } from '@angular/core';
import { FetchApiDataService, User } from '../fetch-api-data.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { EditProfileFormComponent } from '../edit-profile-form/edit-profile-form.component';
import { GenreCardComponent } from '../genre-card/genre-card.component';
import { DirectorCardComponent } from '../director-card/director-card.component';
import { SynopsisCardComponent } from '../synopsis-card/synopsis-card.component';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  user: any = {};
  Username = localStorage.getItem('user');

  FavMovies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public dialog: MatDialog,
    public router: Router
  ) {}

  ngOnInit(): void {
    this.getUserInfo();
    this.getFavoriteMovies();
  }

  /**
   * call API end-point to get the user's information
   * @function getUser
   * @param Username
   * @return user's data in json format
   */
  getUserInfo(): void {
    const user = localStorage.getItem('user');
    if (user) {
      this.fetchApiData.getUser(user).subscribe((resp: User) => {
        this.user = resp;

        console.log(this.user);
      });
    }
  }

  /**
   * get user's FavoriteMovies from the user's data
   */
  getFavoriteMovies(): void {
    const user = localStorage.getItem('user');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.FavMovies = resp.FavoriteMovies;
      console.log(this.FavMovies);
      return this.FavMovies;
    });
  }

  /**
   * use API end-point to remove user favorite
   * @function deleteFavoriteMovie
   * @param MovieId {string}
   * @param title {string}
   * @returns updated user's data in json format
   */
  removeFavoriteMovie(MovieId: string, title: string): void {
    this.fetchApiData.deleteMovie(MovieId).subscribe((resp: any) => {
      console.log(resp);
      this.snackBar.open(
        `${title} has been removed from your favorites!`,
        'OK',
        {
          duration: 4000,
        }
      );
      this.ngOnInit();
    });
  }

  /**
   * open a dialog to edit the user profile
   * @module EditProfileFormComponent
   */
  openEditProfileFormDialog(): void {
    this.dialog.open(EditProfileFormComponent, {
      width: '280px',
    });
  }
  /**
   *open a dialog to display the GenreCardComponent
   * @param name {string}
   * @param description {string}
   */
  openGenreDialog(name: string, description: string): void {
    this.dialog.open(GenreCardComponent, {
      data: { name: name, description: description },
      width: '300px',
    });
  }



  /**
   * call API end-point to remove the current user
   * @function deleteUser
   * @param Username {any}
   * @return remove status
   */
   deleteUser(): void {
    this.fetchApiData.deleteUser().subscribe(() => {
      this.snackBar.open(`${this.Username} has been removed!`, 'OK', {
        duration: 4000,
      });
      localStorage.clear();
    });
    this.router.navigate(['welcome']);
  }


  /**
   * open a dialog to display the DirectorCardComponent
   * @param name {string}
   * @param bio {string}
   * @param birth {string}
   * @param death {string}
   */
  openDirectorDialog(
    name: string,
    bio: string,
    birth: string
  ): void {
    this.dialog.open(DirectorCardComponent, {
      data: { name: name, bio: bio, birth: birth },
      width: '300px',
    });
  }

  /**
   * open a dialog to display the SynopsisCardComponent
   * @param title {string}
   * @param description {string}
   */
  openSynopsisDialog(title: string, description: string): void {
    this.dialog.open(SynopsisCardComponent, {
      data: { title: title, description: description },
      width: '300px',
    });
  }
}