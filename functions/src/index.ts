import functions = require('firebase-functions')
import admin = require('firebase-admin')
import gcs = require('@google-cloud/storage')

admin.initializeApp(functions.config().firebase)

export const helloWorld3 = functions.https.onRequest((request, response) => {
  response.send("Hello from Firebase3!");
});

// Listens for new messages added to /messages/:pushId/original and creates an
// uppercase version of the message to /messages/:pushId/uppercase
export const makeUppercase = functions.database.ref('ver3/testing/messages/{pushId}/original').onWrite(event => {
  // Grab the current value of what was written to the Realtime Database.
  const original = event.data.val();
  if (event.params && event.data.ref.parent) {
    console.log('Uppercasing', event.params.pushId, original);
    const uppercase = original.toUpperCase();
    // You must return a Promise when performing asynchronous tasks inside a Functions such as
    // writing to the Firebase Realtime Database.
    // Setting an "uppercase" sibling in the Realtime Database returns a Promise.
    return event.data.ref.parent.child('uppercase').set(uppercase);
  }
});

export const processFile = functions.storage.object().onChange(event => {
  const object = event.data; // The Storage object.

  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.
  const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
  const metageneration = object.metageneration; // Number of times metadata has been generated. New objects have a value of 1.

  console.log(fileBucket, "|", filePath, "|", contentType, "|", resourceState, "|", metageneration, "|=")

  // Download file from bucket.
  const storage: Storage = new Storage();
  const bucket = storage.bucket(fileBucket);
  const temp = `/tmp/jsonfile`;
  if(filePath) {
    return bucket.file(filePath).download({ destination: temp }).then(() => {
      console.log('Image downloaded locally to', temp);
    });
  }
});
