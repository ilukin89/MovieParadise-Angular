import { Component, OnInit, Input, Inject } from '@angular/core';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-edit-profile-form',
  templateUrl: './edit-profile-form.component.html',
  styleUrls: ['./edit-profile-form.component.scss'],
})
export class EditProfileFormComponent implements OnInit {
  Username = localStorage.getItem('user');
  user: any = {};

  /**
   *  Binding input values to userProfile object
   */
  @Input() userProfile = {
    Username: this.user.Username,
    Password: this.user.Password,
    Email: this.user.Email,
    Birthday: this.user.Birthday,
  };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<EditProfileFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getUser();
  }

  /**
   * get user info
   */
  getUser(): void {
    const user = localStorage.getItem('user');
    this.fetchApiData.getUser(user).subscribe((resp: any) => {
      this.user = resp;
    });
  }

  /**
   * updates the user information in API
   * @function editUser
   * @param Username {any}
   * @param userProfile {any}
   * @return an updated user in json format
   * then stores it in localstorage. a popup message is displayed after successful updated
   */
  editUser(): void {
    this.fetchApiData
      .editUser(this.Username)
      .subscribe(() => {
        this.dialogRef.close();

        // update profile in localstorage
        localStorage.setItem('Username', this.userProfile.Username);
        localStorage.setItem('Password', this.userProfile.Password);

        this.snackBar.open('Your profile was updated successfully!', 'OK', {
          duration: 4000,
        });
        setTimeout(() => {
          window.location.reload();
        });
      });
  }
}