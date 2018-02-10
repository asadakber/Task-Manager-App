import { Component } from '@angular/core';
import { IonicPage, NavController, LoadingController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthProvider } from '../../providers/auth/auth';
import { EmailValidator } from '../../validators/email';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  public createTeamForm: FormGroup;
  constructor(
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    formBuilder: FormBuilder,
    public authProvider: AuthProvider
  ) {
    this.createTeamForm = formBuilder.group({
      fullName: ['', Validators.required],
      teamName: ['', Validators.required],
      email: [
        '',
        Validators.compose([Validators.required, EmailValidator.isValid])
      ],
      password: [
        '',
        Validators.compose([Validators.minLength(6), Validators.required])
      ]
    });
  }

  createTeam(): void {
    const loading = this.loadingCtrl.create();
    if (!this.createTeamForm.valid) {
      console.log(this.createTeamForm.value);
    } else {
      this.authProvider
        .createAdmin(
          this.createTeamForm.value.email,
          this.createTeamForm.value.password,
          this.createTeamForm.value.fullName,
          this.createTeamForm.value.teamName
        )
        .then(
          () => {
            loading.dismiss().then(() => {
              this.navCtrl.setRoot('LoginPage');
            });
          },
          error => {
            loading.dismiss().then(() => {
              console.log(error);
            });
          }
        );
    }
    loading.present();
  }
}
