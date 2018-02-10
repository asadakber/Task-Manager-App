import { Component } from '@angular/core';
import {
  IonicPage,
  NavController,
  NavParams,
  AlertController
} from 'ionic-angular';
import { TeamProvider } from '../../providers/team/team';
import { AuthProvider } from '../../providers/auth/auth';
import { Observable } from 'rxjs';

@IonicPage()
@Component({
  selector: 'page-member-profile',
  templateUrl: 'member-profile.html'
})
export class MemberProfilePage {
  public memberId: string;
  public teamId: string;
  public userProfile: Observable<any>;
  public memberProfile: Observable<any>;
  public pendingTaskList: Observable<any>;
  public completedTaskList: Observable<any>;
  constructor(
    public navCtrl: NavController,
    public teamProvider: TeamProvider,
    public authProvider: AuthProvider,
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() {
    const memberId: string = this.navParams.get('memberId');
    this.userProfile = this.teamProvider.getUserProfile().valueChanges();
    this.memberProfile = this.teamProvider
      .getMemberProfile(memberId)
      .valueChanges();

    this.memberProfile.subscribe(profile => {
      this.teamId = profile.teamId;
      const taskList: Observable<any> = this.teamProvider
        .getMemberTaskList(profile.teamId, memberId)
        .valueChanges();

      taskList.subscribe(tasks => {
        this.pendingTaskList = tasks.filter(task => task.completed === false);
        this.completedTaskList = tasks.filter(task => task.completed === true);
      });
    });
  }

  completeTask(taskId: string): void {
    let confirm = this.alertCtrl.create({
      title: 'Are you done?',
      message: 'Hit OK to mark this task as completed.',
      buttons: [
        {
          text: 'Cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: () => {
            this.teamProvider.completeTask(this.teamId, taskId);
          }
        }
      ]
    });
    confirm.present();
  }
}
