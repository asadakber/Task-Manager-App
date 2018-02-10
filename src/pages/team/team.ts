import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController } from 'ionic-angular';
import { TeamProvider } from '../../providers/team/team';
import { AuthProvider } from '../../providers/auth/auth';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-team',
  templateUrl: 'team.html'
})
export class TeamPage {
  public teamProfile: Observable<any>;
  public teamMemberList: Observable<any>;
  public userProfile: Observable<any>;
  public teamId: string;

  constructor(
    public navCtrl: NavController,
    public alertCtrl: AlertController,
    public teamProvider: TeamProvider,
    public authProvider: AuthProvider
  ) {}

  ionViewDidLoad() {
    this.userProfile = this.teamProvider.getUserProfile().valueChanges();
    this.userProfile.subscribe(userProfile => {
      this.teamId = userProfile.teamId;

      this.teamProfile = this.teamProvider
        .getTeamProfile(userProfile.teamId)
        .valueChanges();

      this.teamMemberList = this.teamProvider
        .getTeamMemberList(userProfile.teamId)
        .valueChanges();
    });
  }

  inviteTeamMember(): void {
    let prompt = this.alertCtrl.create({
      title: 'Invite a team member',
      message:
        "Enter your coworker's email to send an invitation to use the app.",
      inputs: [
        {
          name: 'name',
          placeholder: "Your coworker's name",
          type: 'text'
        },
        {
          name: 'email',
          placeholder: "Your coworker's email",
          type: 'email'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.authProvider.createMember(data.email, this.teamId, data.name);
          }
        }
      ]
    });
    prompt.present();
  }

  goToMemberProfilePage(memberId): void {
    this.navCtrl.push('MemberProfilePage', {
      memberId: memberId
    });
  }
}
