import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import {
  AngularFireDatabase,
  AngularFireList,
  AngularFireObject
} from 'angularfire2/database';
import firebase from 'firebase/app';

@Injectable()
export class TeamProvider {
  public userId: string;
  constructor(afAuth: AngularFireAuth, public afDb: AngularFireDatabase) {
    afAuth.authState.subscribe(user => {
      this.userId = user.uid;
    });
  }

  getAdminStatus(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.afDb
        .object(`/userProfile/${this.userId}/teamAdmin`)
        .snapshotChanges()
        .subscribe(action => {
          resolve(action.payload.val());
        });
    });
  }

  getUserProfile(): AngularFireObject<any> {
    return this.afDb.object(`/userProfile/${this.userId}/`);
  }

  getMemberProfile(memberId: string): AngularFireObject<any> {
    return this.afDb.object(`/userProfile/${memberId}/`);
  }
  getTeamMemberList(teamId: string): AngularFireList<any> {
    return this.afDb.list(`/teamProfile/${teamId}/teamMembers`);
  }

  getTeamProfile(teamId: string): AngularFireObject<any> {
    return this.afDb.object(`/teamProfile/${teamId}`);
  }

  createTask(
    taskName: string,
    memberId: string,
    memberName: string,
    memberEmail: string
  ): Promise<any> {
    const taskRef: firebase.database.ThenableReference = this.afDb
      .list(`/taskListByTeam/${this.userId}/`)
      .push({});

    return taskRef.set({
      taskName,
      memberId,
      memberName,
      memberEmail,
      completed: false,
      id: taskRef.key
    });
  }

  getTaskList(teamId: string): AngularFireList<any> {
    return this.afDb.list(`/taskListByTeam/${teamId}/`);
  }

  getMemberTaskList(teamId: string, memberId: string): AngularFireList<any> {
    return this.afDb.list(`/taskListByTeam/${teamId}`, ref =>
      ref.orderByChild('memberId').equalTo(memberId)
    );
  }

  completeTask(teamId: string, taskId: string): Promise<any> {
    return this.afDb
      .object(`/taskListByTeam/${teamId}/${taskId}/`)
      .update({ completed: true });
  }
}
