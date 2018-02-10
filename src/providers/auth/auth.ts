import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';

@Injectable()
export class AuthProvider {
  constructor(
    public afAuth: AngularFireAuth,
    public afDb: AngularFireDatabase
  ) {}

  createAdmin(
    email: string,
    password: string,
    fullName: string,
    teamName: string
  ): Promise<void> {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(email, password)
      .then(
        newUser => {
          this.afDb
            .object(`/userProfile/${newUser.uid}`)
            .set({
              email,
              fullName,
              teamId: newUser.uid,
              teamName,
              teamAdmin: true
            })
            .then(userProfileRecord => {
              this.afDb
                .object(`/teamProfile/${newUser.uid}`)
                .set({ teamName, teamAdmin: newUser.uid });
            });
        },
        error => {
          console.error(error);
        }
      );
  }

  createMember(email: string, teamId: string, fullName: string): Promise<any> {
    const newMemberRef = this.afDb
      .list(`teamProfile/${teamId}/teamMembers/`)
      .push({});

    return newMemberRef.set({
      fullName,
      email,
      id: newMemberRef.key
    });
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  logoutUser(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  resetPassword(email: string): Promise<void> {
    return this.afAuth.auth.sendPasswordResetEmail(email);
  }
}
