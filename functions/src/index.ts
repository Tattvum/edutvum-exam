import * as functions from 'firebase-functions'
import * as admin from 'firebase-admin'

admin.initializeApp(functions.config().firebase)

export const helloWorld2 = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase2!");
});
