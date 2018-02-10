import { Component } from '@angular/core';
import { IonicPage } from 'ionic-angular';
import { TeamProvider } from '../../providers/team/team';

@IonicPage()
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  tab1Root: string = 'HomePage';
  tab2Root: string = 'TeamPage';
  isAdmin: boolean = false;

  constructor(public teamProvider: TeamProvider) {}

  ionViewDidLoad() {
    this.teamProvider.getAdminStatus().then(adminStatus => {
      this.isAdmin = adminStatus;
    });
  }
}
