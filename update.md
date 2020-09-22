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


2020-07-02 Thu - on 4.12.2
`...edutvum-exam$ ng version`

...
Angular CLI: 9.1.4
Node: 12.18.1
OS: linux x64

Angular: 9.1.4
... animations, cli, common, compiler, compiler-cli, core, forms
... language-service, platform-browser, platform-browser-dynamic
... platform-server, router, service-worker
Ivy Workspace: <error>

Package                           Version
-----------------------------------------------------------
@angular-devkit/architect         0.900.7
@angular-devkit/build-angular     0.900.7
@angular-devkit/build-optimizer   0.900.7
@angular-devkit/build-webpack     0.900.7
@angular-devkit/core              9.0.7
@angular-devkit/schematics        9.1.3
@angular/cdk                      9.2.2
@angular/fire                     6.0.0
@angular/flex-layout              9.0.0-beta.29
@angular/material                 9.2.2
@angular/pwa                      0.901.3
@ngtools/webpack                  9.0.7
@schematics/angular               9.1.3
@schematics/update                0.901.4
rxjs                              6.5.5
typescript                        3.8.3
webpack                           4.43.0
---
using https://update.angular.io/#9.0:10.0
---
`svr@tnr:~$ npm list -g @angular/cli --depth=0`

/home/svr/.npm-global/lib
`-- @angular/cli@9.1.4 
---
https://angular.io/guide/ivy#speeding-up-ngcc-compilation
In package.json...
Don't use --create-ivy-entry-points as this will cause Node not to resolve the Ivy version of the packages correctly.
---
Update global
`npm install -g @angular/cli`
...
+ @angular/cli@10.0.1
removed 2 packages and updated 25 packages in 61.279s
---
`npm i typescript`
+ typescript@3.9.6
updated 1 package and audited 2294 packages in 16.464s
---
The main update in the project folder...
`npm install @angular/cli@latest`
+ @angular/cli@10.0.1
added 18 packages from 3 contributors, removed 2 packages, updated 15 packages and audited 2310 packages in 19.014s
---
`ng update @angular/core @angular/material @angular/cdk --allow-dirty --force`
Repository is not clean. Update changes will be mixed with pre-existing changes.
... (but still updating)
Package "@angular/flex-layout" has an incompatible peer dependency to "@angular/cdk" (requires "^9.0.0-rc.8", would install "10.0.1").
✖ Package install failed, see above.
✖ Migration failed. See above for further details.
Using: command not found
---
(but still package.json updated to 10.0.2)
---
`ng version`
Angular CLI: 10.0.1
Node: 12.18.1
OS: linux x64

Angular: 10.0.2
... animations, common, compiler, compiler-cli, core, forms
... language-service, platform-browser, platform-browser-dynamic
... platform-server, router, service-worker
Ivy Workspace: <error>

Package                           Version
-----------------------------------------------------------
@angular-devkit/architect         0.900.7
@angular-devkit/build-angular     0.900.7
@angular-devkit/build-optimizer   0.900.7
@angular-devkit/build-webpack     0.900.7
@angular-devkit/core              9.0.7
@angular-devkit/schematics        9.1.3
@angular/cdk                      10.0.1
@angular/cli                      10.0.1
@angular/fire                     6.0.0
@angular/flex-layout              9.0.0-beta.29
@angular/material                 10.0.1
@angular/pwa                      0.901.3
@ngtools/webpack                  9.0.7
@schematics/angular               9.1.3
@schematics/update                0.1000.1
rxjs                              6.5.5
typescript                        3.9.6
webpack                           4.43.0
---
`npm run dev`
...
.ngtypecheck.ts is part of the TypeScript compilation but it's unused.
Add only entry points to the 'files' or 'include' properties in your tsconfig
...(but run server, all working!)
---
`npm install @types/node --save-dev`
For mudder lib in model/lib.ts require
---


2020-07-13 Mon - on 4.16.3
---
Update available 8.4.3 → 8.5.0       │
...Run npm i -g firebase-tools to update
---
+ firebase-tools@8.5.0
removed 2 packages and updated 9 packages in 90.652s
---


2020-07-24 Fri - on 4.16.7
---
`ng update`
---
The installed local Angular CLI version is older than the latest stable version.
...
An unhandled exception occurred: Package install failed.
---
`npm install @angular/cli@latest`
---
+ @angular/cli@10.0.4
added 1 package from 1 contributor, updated 11 packages and audited 2324 packages in 57.433s
---
`ng update`
---
@angular/cdk                       10.0.1 -> 10.1.0         ng update @angular/cdk
@angular/core                      10.0.2 -> 10.0.5         ng update @angular/core
@angular/material                  10.0.1 -> 10.1.0         ng update @angular/material
rxjs                               6.5.5 -> 6.6.0           ng update rxjs
---
`ng update @angular/cdk @angular/core @angular/material rxjs --allow-dirty --force`
---
✖ Package install failed, see above.
✖ Migration failed. See above for further details.
(but package.json updated?!)
---
`ng update @angular/cdk @angular/core @angular/material rxjs --allow-dirty --force`
---
...
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package '@angular/cdk' is already up to date.
Package '@angular/core' is already up to date.
Package '@angular/material' is already up to date.
Package 'rxjs' is already up to date.
---
`ng version`
---
Angular CLI: 10.0.4
Node: 12.18.1
OS: linux x64

Angular: 10.0.5
---
`npm run build`
---
(works lot of warning as with 10..)
WARNING in Unable to fully load .../node_modules/angularfire2/.../auth.d.ts for source-map flattening: Circular source file mapping dependency: .../node_modules/.../auth.d.ts.map -> .../node_modules/angularfire2/.../auth.d.ts.map
...
WARNING in .../src/app/model/data.service.ngtypecheck.ts is part of the TypeScript compilation but it's unused.
Add only entry points to the 'files' or 'include' properties in your tsconfig.
---
`npm i @angular/flex-layout`
---
+ @angular/flex-layout@9.0.0-beta.31
removed 1 package, updated 1 package and audited 2328 packages in 41.474s
---
`npm i @angular/fire`
---
+ @angular/fire@6.0.2
updated 1 package and audited 2328 packages in 24.079s
---
`npm run dev`
---
(works!)
Date: 2020-07-24T07:35:43.695Z - Hash: 02f7b05467f465c2df07
5 unchanged chunks

Time: 4728ms
: Compiled successfully.
---


2020-07-26 Sun - on 5.0.0-rc1
---
`firebase emulators:start --only database`
---
...
Update available 8.5.0 → 8.6.0       │
   Run npm i -g firebase-tools to update
---
`npm i -g firebase-tools`
---
+ firebase-tools@8.6.0
updated 7 packages in 98.887s
...
New patch version of npm available! 6.14.5 → 6.14.7
Run npm install -g npm to update!
---
`npm i -g npm`
---
+ npm@6.14.7
added 16 packages from 2 contributors, removed 17 packages and updated 19 packages in 10.503s
---
`firebase emulators:start --only database`
---
... 
ui: downloading ui-v1.1.1.zip...
...
---


2020-08-13 Thu - on 5.2.1
---
`firebase emulators:start --only database`
...
Error: TIMEOUT: Port 9000 on localhost was not active within 30000ms
Update available 8.6.0 → 8.7.0
Run npm i -g firebase-tools to update
---
`npm i -g firebase-tools`
+ firebase-tools@8.7.0
added 62 packages from 15 contributors, updated 9 packages and moved 8 packages in 179.588s
---
`firebase emulators:start --only database`
Database │ localhost:9000 │ http://localhost:4000/database 
(all works)
---


2020-09-22 Tue - on 5.2.4
---
Update available 8.7.0 → 8.10.0       │
Run npm i -g firebase-tools to update
---
`npm i -g firebase-tools`
+ firebase-tools@8.10.0
added 51 packages from 21 contributors, removed 52 packages, updated 45 packages and moved 10 packages in 113.448s
---
`ng update`
The installed local Angular CLI version is older than the latest stable version.
Installing a temporary version to perform the update.
Installing packages for tooling via npm.
An unhandled exception occurred: Package install failed.
See "/tmp/ng-3C9w9B/angular-errors.log" for further details.
---
`npm install @angular/cli@latest`
+ @angular/cli@10.1.2
added 8 packages from 11 contributors, removed 4 packages, updated 28 packages and audited 2332 packages in 48.915s
---
`npm install -g @angular/cli@latest`
+ @angular/cli@10.1.2
added 15 packages from 7 contributors, removed 7 packages and updated 35 packages in 17.505s
---
`ng update`
Using package manager: 'npm'
Collecting installed dependencies...
Found 60 dependencies.
    We analyzed your package.json, there are some packages to update:
    
      Name                               Version                  Command to update
     --------------------------------------------------------------------------------
      @angular/cdk                       10.1.0 -> 10.2.2         ng update @angular/cdk
      @angular/core                      10.0.5 -> 10.1.2         ng update @angular/core
      @angular/material                  10.1.0 -> 10.2.2         ng update @angular/material
      rxjs                               6.6.0 -> 6.6.3           ng update rxjs
---
`ng update @angular/cdk @angular/core @angular/material rxjs --allow-dirty --force`
UPDATE package.json (2842 bytes)
✖ Package install failed, see above.
✖ Migration failed. See above for further details.
(but package.json updated?!)
---
`ng update @angular/cdk @angular/core @angular/material rxjs --allow-dirty --force`
Repository is not clean. Update changes will be mixed with pre-existing changes.
Using package manager: 'npm'
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package '@angular/cdk' is already up to date.
Package '@angular/core' is already up to date.
Package '@angular/material' is already up to date.
Package 'rxjs' is already up to date.
---
`ng version`
Angular CLI: 10.1.2
Node: 12.18.4
OS: linux x64

Angular: 10.1.2
---
`firebase emulators:start --only database`
(port taken)
`fuser -k 9000/tcp`
(killed)
`firebase emulators:start --only database`
Emulator │ Host:Port      │ View in Emulator UI            │
Database │ localhost:9000 │ http://localhost:4001/database 
---
`npm run dev`
(now all works!)
(then I ctrl+c stopped)
---
`npm i @angular/flex-layout`
+ @angular/flex-layout@9.0.0-beta.31
removed 1 package, updated 1 package and audited 2332 packages in 36.817s
(oh same?!)
---
`npm i @angular/fire`
+ @angular/fire@6.0.2
updated 1 package and audited 2332 packages in 15.462s
(same again!?)
---
`npm outdated`
Package                                 Current         Wanted          Latest  Location
@angular/flex-layout              9.0.0-beta.31  9.0.0-beta.31  10.0.0-beta.32  edutvum-exam
typescript                                3.9.6          3.9.7           4.0.3  edutvum-exam
npm                                      6.14.4         6.14.8          6.14.8  edutvum-exam
protractor                                5.4.4          5.4.4           7.0.0  edutvum-exam
ngx-pagination                            4.1.0          4.1.0           5.0.0  edutvum-exam
firebase                                 7.14.2         7.21.0          7.21.0  edutvum-exam
firebase-admin                           8.12.1         8.13.0           9.2.0  edutvum-exam
...
(so no changes in angular firebase)
---
`ng typescript`
+ typescript@3.9.7
updated 1 package and audited 2332 packages in 17.068s
`ng typescript@latest`
+ typescript@4.0.3
updated 1 package and audited 2332 packages in 18.332s
`ng -g typescript@latest`
/home/svr/.npm-global/bin/tsc -> /home/svr/.npm-global/lib/node_modules/typescript/bin/tsc
/home/svr/.npm-global/bin/tsserver -> /home/svr/.npm-global/lib/node_modules/typescript/bin/tsserver
+ typescript@4.0.3
updated 1 package in 1.186s
---
`npm run dev`
...
Compiling @angular/flex-layout : es2015 as esm2015
(many warnings)
WARNING in /home/svr/lindata/edutvum/edutvum-exam/src/app/details/details.component.ngtypecheck.ts is part of the TypeScript compilation but it's unused.
Add only entry points to the 'files' or 'include' properties in your tsconfig.
WARNING in /home/svr/lindata/edutvum/edutvum-exam/src/polyfills.ngtypecheck.ts is part of the TypeScript compilation but it's unused.
Add only entry points to the 'files' or 'include' properties in your tsconfig.
...
Date: 2020-09-22T05:23:51.890Z - Hash: 39ba4da3194e531a04bc
5 unchanged chunks

Time: 3955ms
: Compiled successfully.
(all work fine!)
---
