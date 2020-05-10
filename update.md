2019-07-13 Sat - 1.15.1
https://stackoverflow.com/questions/43931986/how-to-upgrade-angular-cli-to-the-latest-version
First update cli globally
```sh
npm install -g @angular/cli@latest
```
then inside the project
```sh
npm install @angular/cli@latest
```
It worked simply.
"ng update
Using package manager: 'npm'
Collecting installed dependencies...
Found 53 dependencies.
    We analyzed your package.json and everything seems to be in order. Good work!"


2019-07-13 Sat - 3.15.0
```sh
ng update --force @angular/cdk @angular/cli @angular/core @angular/material
```
Upgraded to Angular 8.1. TBD cli and general pruning.
Due to flex-layout isssue, it is kept in old version, hence --force.
cli still not updated. 


2019-11-19,20 Wed - on 3.16.9
```sh
npm update
npm run install (after changing package.json)

ng update @angular/cli @angular/core
npm install -g npm 
```
Upgraded ng2-pagination control, just a name change.
TBD: again that layout issue in exam listisg marks right alignment
To update angular, need to commit
Upgraded angular too to 8.2


2020-02-14 Fri - on 4.0.0
The automatic route was messy. Says 'unhandled exception... update failed'...
So went manual
https://levelup.gitconnected.com/upgrade-to-angular-9-within-10-minutes-671c6fd6174b
Did all in the above link, and then I had to ...
1. Updated app.module.ts
    import from @angular/material to @angular/material/card... etc.
2. Updated firebase-api.service.ts
    changed to '...data as {}' as in https://stackoverflow.com/a/59316300
    The main link...
    https://stackoverflow.com/questions/51189388/typescript-spread-types-may-only-be-created-from-object-types/51193091
3. Updated tsconfig.json and dummied tsconfig.app.json
    changed 'only keep entry points in files (main.ts and polyfills.ts)'
    as in https://stackoverflow.com/a/57730727  
    The main link...
    https://stackoverflow.com/questions/57729518/how-to-get-rid-of-the-warning-ts-file-is-part-of-the-typescript-compilation-but
4. Reverted back core-js in package.json
    did 'npm i -S core-js@2.5.7' as in https://stackoverflow.com/a/56125576
    The main link...
    https://stackoverflow.com/questions/55398923/error-cant-resolve-core-js-es7-reflect-in-node-modules-angular-devkit-bui
TBD: remove angularfire2 and use @angular/fire

2020-03-29 Sun - on 4.0.2
did global and then local
`npm install -g @angular/cli`
`npm install @angular/cli`
Both came to 9.1.0
using...
https://stackoverflow.com/questions/56773528/repository-is-not-clean-please-commit-or-stash-any-changes-before-updating-in-a
`ng update @angular/core @angular/material @angular/cdk --allow-dirty --force`
(Repository is not clean. Update changes will be mixed with pre-existing changes.)
But still upgraded to 9.1.0!
`svr@tnr:~/lindata/edutvum/edutvum-exam$ ng update`
  Using package manager: 'npm'
  Collecting installed dependencies...
  Found 55 dependencies.
      We analyzed your package.json and everything seems to be in order. Good work!
`npm run stage`
working, but showed some errors about flattening source map for angular fire... so ...
https://github.com/angular/angular/issues/35757
Due to this, deleted package-lock.json and node_modules folder and did ...
`npm install`
then
`npm run prod`
working clean

2020-04-24 Sat - on 4.3.0
did global and then local
`npm install -g @angular/cli`
`npm install @angular/cli`
Both came to 9.1.3
using...
https://stackoverflow.com/questions/43931986/how-to-upgrade-angular-cli-to-the-latest-version
(di the bigger dance of un install and install. But maybe install alone should have done!)
Then...(did not work without allow-dirty and force)
`ng update`
`ng update @angular/core @angular/material @angular/cdk rxjs --allow-dirty --force`
---
✖ Package install failed, see above.
✖ Migration failed. See above for further details.
(package json updated)
---
But `ng update` again
---
Found 55 dependencies.
    We analyzed your package.json and everything seems to be in order. Good work!
---
For safety, deleted package-lock.json and node_modules folder and did ...
`npm install`
then
`npm run prod`
working clean

2020-05-01 Fri - on 4.6.8
did global and then local
`npm install -g @angular/cli`
`npm install @angular/cli`
Both came to 9.1.4

2020-05-02 Sat - on 4.7.0
svr@tnr:~/lindata/edutvum/edutvum-exam$ ng add @angular/material
Skipping installation: Package already installed
[ Preview: https://material.angular.io?theme=indigo-pink ]
? Set up global Angular Material typography styles? Yes
? Set up browser animations for Angular Material? Yes
UPDATE package.json (2650 bytes)
✖ Package install failed, see above.
The Schematic workflow failed. See above.
---
`ng update @angular/cdk @angular/core @angular/material`
Repository is not clean. Please commit or stash any changes before updating.
---
`ng update @angular/cdk @angular/core @angular/material --allow-dirty --force`
UPDATE package.json (2650 bytes)Found 54 dependencies.
Fetching dependency metadata from registry...
    Updating package.json with dependency @angular/cdk @ "9.2.2" (was "9.2.1")...
    ...
✖ Package install failed, see above.
✖ Migration failed. See above for further details.
---
But `ng update` again
---
Using package manager: 'npm'
Collecting installed dependencies...
Found 54 dependencies.
    We analyzed your package.json and everything seems to be in order. Good work!
---
`npm run stage`
All working!

2020-05-08 Fri - on 4.7.3 (after 4 alpha, 2 beta, 1 rc)
svr@tnr:~/lindata/edutvum/edutvum-exam$ firebase init emulators
...
You're about to initialize a Firebase project in this directory:
  /home/svr/lindata/edutvum/edutvum-exam
Before we get started, keep in mind:
  * You are initializing in an existing Firebase project directory
=== Project Setup
First, let's associate this project directory with a Firebase project.
You can create multiple project aliases by running firebase use --add, 
but for now we'll just set up a default project.
i  .firebaserc already has a default project, using edutvum-exam.
=== Emulators Setup
? Which Firebase emulators do you want to set up? Press Space to select emulators, then Enter to confirm yo
ur choices. Functions, Firestore, Database, Hosting, Pubsub
? Which port do you want to use for the functions emulator? 5001
? Which port do you want to use for the firestore emulator? 9080
? Which port do you want to use for the database emulator? 9000
? Which port do you want to use for the hosting emulator? 5000
? Which port do you want to use for the pubsub emulator? 8085
? Would you like to download the emulators now? Yes
i  firestore: downloading cloud-firestore-emulator-v1.11.3.jar...
Progress: =================================================================================> (100% of 64MB
i  pubsub: downloading pubsub-emulator-0.1.0.zip...
Progress: =================================================================================> (100% of 37MB
i  Writing configuration info to firebase.json...
i  Writing project information to .firebaserc...
✔  Firebase initialization complete!

svr@tnr:~/lindata/edutvum/edutvum-exam$ firebase emulators:start --only database
i  emulators: Starting emulators: database
✔  hub: emulator hub started at http://localhost:4400
⚠  database: Did not find a Realtime Database rules file specified in a firebase.json config file.
⚠  database: The emulator will default to allowing all reads and writes. Learn more about this option: https://firebase.google.com/docs/emulator-suite/install_and_configure#security_rules_configuration.
i  database: database emulator logging to database-debug.log
✔  database: database emulator started at http://localhost:9000
i  database: For testing set FIREBASE_DATABASE_EMULATOR_HOST=localhost:9000
✔  emulators: All emulators started, it is now safe to connect.

svr@tnr:~/Downloads$ curl -X POST -d @edutvum-exam-export.json  http://localhost:9000/.json
{"name":"-M6p9ppYF1teDOrYXRgb"}

svr@tnr:~/lindata/edutvum/edutvum-exam$ curl http://localhost:9000/-M6p9ppYF1teDOrYXRgb/ver5/users/.json
.../-M6p9ppYF1teDOrYXRgb/ver5/exams/.json
.../-M6p9ppYF1teDOrYXRgb/ver5/tags/.json
.../-M6p9ppYF1teDOrYXRgb/ver5/charts/.json
.../-M6p9ppYF1teDOrYXRgb/ver5/results/.json
(this brings back the data inside)
svr@tnr:~/lindata/edutvum/edutvum-exam$ curl http://localhost:9000/-M6qx7JtX-qW7UOQkYsN/ver5/charts/.json
null
(if the path is non existant, null returned)

2020-05-09 Sat - on 4.7.4-alpha.1
svr@tnr:~/lindata/edutvum/edutvum-exam$ firebase emulators:export firebase-emulator-export
i  Found running emulator hub for project edutvum-exam at http://localhost:4400
i  Creating export directory /home/svr/lindata/edutvum/edutvum-exam/firebase-emulator-export
i  Exporting data to: /home/svr/lindata/edutvum/edutvum-exam/firebase-emulator-export

Error: Export request failed, see emulator logs for more information.

Having trouble? Try firebase [command] --help
----
https://firebase.google.com/docs/emulator-suite/install_and_configure
"Cloud Firestore emulator. Export data from a running Cloud Firestore emulator instance"
(so only for firestore)
in the firebase rtdb (run time database) emulator window...
----
i  emulators: Received export request. Exporting data to /home/svr/lindata/edutvum/edutvum-exam/firebase-emulator-export.
⚠  emulators: Export failed: No running emulators support import/export.
----

2020-05-10 Sun - on 4.7.4-rc.1
```
  res = await axios1.get('ver5/users.json');
  let users = res.data
  users[13].localId = 'u1'
  await axios1.put('ver5/users.json', users);
```
This takes care of the ADMIN rights for the dummy 'u1' user.
Basically I change the SVR staging user's localId to u1
