import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';



@Component({
  selector: 'app-login-form',
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
})
export class UserLoginFormComponent implements OnInit {
  /**
   * This decorator binds the form input values to the userData object
   */
  @Input() userCredentials = { Username: '', Password: '' };

  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    public router: Router
  ) { }

  /**
   * Initializes the component
   * @ignore
   */
  ngOnInit(): void { }

  /**
   * Logs the user in by sending a request to the backend endpoint.
   * A snack bar is shown, holding a message about the result of the operation.
   */
  login(): void {
    this.fetchApiData.userLogin(this.userCredentials).subscribe(
      (response) => {
        this.dialogRef.close(); //close modal on success

        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.user));
        this.dialogRef.close();
        this.snackBar.open('Successfully logged in!', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['movies']);
      },
      (response) => {
        console.log(response);
        this.snackBar.open(response, 'OK', { duration: 500 });
          // 'Wrong username or password. Please try again.',
          // 'Alright',
          // {
          //   duration: 2000,
          // }
        // );
      }
    );
  }
}