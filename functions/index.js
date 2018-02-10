const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.createTeamMember = functions.database
  .ref('/teamProfile/{teamId}/teamMembers/{memberId}')
  .onWrite(event => {
    // If the member is updated instead of created exit the function.
    if (event.data.previous.exists()) {
      console.log('User edited, exiting the function now');
      return;
    }

    return admin
      .auth()
      .getUserByEmail(event.data.val().email)
      .then(userRecord => {
        console.log("There's already another user with that email, aborting.");
        return event.data.adminRef.set(null);
      })
      .catch(error => {
        console.log(
          "There's no user with those credentials, creating a new user."
        );
        // Access the parent node to get the Team's name.
        return event.data.adminRef.parent.parent
          .child('teamName')
          .once('value', snapshot => {
            const teamId = event.params.teamId;
            const memberId = event.params.memberId;
            const email = event.data.val().email;
            const fullName = event.data.val().fullName;
            const teamName = snapshot.val();

            return admin
              .auth()
              .createUser({
                uid: memberId,
                email: email,
                password: '123456789',
                displayName: fullName
              })
              .then(newUserRecord => {
                return admin
                  .database()
                  .ref(`/userProfile/${memberId}`)
                  .set({
                    id: memberId,
                    fullName: fullName,
                    email: email,
                    teamAdmin: false,
                    teamId: teamId,
                    teamName: teamName
                  });
              });
          });
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });
