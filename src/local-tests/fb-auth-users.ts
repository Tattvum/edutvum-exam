import * as admin from "firebase/compat-admin";

//https://firebase.google.com/docs/admin/setup#initialize-sdk
//export GOOGLE_APPLICATION_CREDENTIALS="/home/svr/lindata/edutvum/...
//...edutvum-exam-firebase-adminsdk-fx0vy-8f31c813ce.json"
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://edutvum-exam.firebaseio.com"
})

//https://firebase.google.com/docs/auth/admin/manage-users#list_all_users
function listAllUsers(nextPageToken?) {
  // List batch of users, 1000 at a time.
  admin.auth().listUsers()
    .then(function (listUsersResult) {
      listUsersResult.users.forEach(userRecord => {
        console.log(userRecord.toJSON(), ",");
      });
    })
    .catch(function (error) {
      console.log('Error listing users:', error);
    });
}
// Start listing users from the beginning, 1000 at a time.
listAllUsers();
