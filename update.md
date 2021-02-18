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


2021-02-18 Thu - on 5.3.0-alpha1
---
`ng`
Available Commands:
  add Adds support for an external library to your project.
  ...
  xi18n (i18n-extract) Extracts i18n messages from source code.

For more detailed help run "ng [command name] --help"
---
`ng update`
The installed local Angular CLI version is older than the latest stable version.
Installing a temporary version to perform the update.
Installing packages for tooling via npm.
Installed packages for tooling via npm.
Using package manager: 'npm'
Collecting installed dependencies...
Found 60 dependencies.
    We analyzed your package.json, there are some packages to update:
    
      Name                               Version                  Command to update
     --------------------------------------------------------------------------------
      @angular/cdk                       10.2.2 -> 11.2.1         ng update @angular/cdk
      @angular/cli                       10.1.2 -> 11.2.1         ng update @angular/cli
      @angular/core                      10.1.2 -> 11.2.1         ng update @angular/core
      @angular/material                  10.2.2 -> 11.2.1         ng update @angular/material
    
    There might be additional packages which don't provide 'ng update' capabilities that are outdated.
    You can update the additional packages by running the update command of your package manager.
---
`ng --version`
...
Angular CLI: 10.1.2
Node: 14.15.4
OS: linux x64

Angular: 
... 
Ivy Workspace: 

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.1001.2 (cli-only)
@angular-devkit/core         10.1.2 (cli-only)
@angular-devkit/schematics   10.1.2 (cli-only)
@schematics/angular          10.1.2 (cli-only)
@schematics/update           0.1001.2 (cli-only)
---
`npm install @angular/cli@latest`
...
+ @angular/cli@11.2.1
added 74 packages from 19 contributors, removed 38 packages, updated 48 packages and audited 2369 packages in 35.917s

63 packages are looking for funding
  run `npm fund` for details

found 365 vulnerabilities (345 low, 1 moderate, 19 high)
  run `npm audit fix` to fix them, or `npm audit` for details
---
`npm install -g @angular/cli@latest`
...
+ @angular/cli@11.2.1
added 55 packages from 19 contributors, removed 94 packages, updated 53 packages and moved 1 package in 16.148s
---
`ng --version`
...
Angular CLI: 11.2.1
Node: 14.15.4
OS: linux x64

Angular: 
... 
Ivy Workspace: 

Package                      Version
------------------------------------------------------
@angular-devkit/architect    0.1102.1 (cli-only)
@angular-devkit/core         11.2.1 (cli-only)
@angular-devkit/schematics   11.2.1 (cli-only)
@schematics/angular          11.2.1 (cli-only)
@schematics/update           0.1102.1 (cli-only)
---
(trying...)
`ng update @angular/cdk @angular/core @angular/material rxjs`
Repository is not clean. Please commit or stash any changes before updating.
--
(trying...)
`ng update @angular/cdk @angular/core @angular/material rxjs --allow-dirty`
Using package manager: 'npm'
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package 'rxjs' is already up to date.
  Package "@angular-devkit/build-angular" has an incompatible peer dependency to "@angular/compiler-cli" (requires ">=9.0.0 < 10" (extended), would install "12.0.0-next.1").
  Package "@angular/animations" has an incompatible peer dependency to "@angular/core" (requires "12.0.0-next.1", would install "11.2.1")
  Package "@angular/flex-layout" has an incompatible peer dependency to "@angular/cdk" (requires "^9.0.0-rc.8", would install "11.2.1").
  Package "@angular/common" has an incompatible peer dependency to "@angular/core" (requires "12.0.0-next.1", would install "11.2.1")
  Package "@angular/fire" has an incompatible peer dependency to "@angular/common" (requires "^9.0.0 || ^10.0.0" (extended), would install "12.0.0-next.1").
  Package "codelyzer" has an incompatible peer dependency to "@angular/compiler" (requires ">=2.3.1 <10.0.0 || >9.0.0-beta <10.0.0 || >9.1.0-beta <10.0.0 || >9.2.0-beta <10.0.0" (extended), would install "12.0.0-next.1").
  Package "codelyzer" has an incompatible peer dependency to "@angular/core" (requires ">=2.3.1 <10.0.0 || >9.0.0-beta <10.0.0 || >9.1.0-beta <10.0.0 || >9.2.0-beta <10.0.0" (extended), would install "11.2.1").
  Package "@angular/forms" has an incompatible peer dependency to "@angular/core" (requires "12.0.0-next.1", would install "11.2.1")
  Package "ngx-quill" has an incompatible peer dependency to "@angular/forms" (requires "^9.0.0" (extended), would install "12.0.0-next.1").
  Package "@angular/platform-browser" has an incompatible peer dependency to "@angular/core" (requires "12.0.0-next.1", would install "11.2.1")
  Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser" (requires "^9.0.0 || ^10.0.0" (extended), would install "12.0.0-next.1").
  Package "@angular/platform-browser-dynamic" has an incompatible peer dependency to "@angular/core" (requires "12.0.0-next.1", would install "11.2.1")
  Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser-dynamic" (requires "^9.0.0 || ^10.0.0" (extended), would install "12.0.0-next.1").
  Package "@angular/platform-server" has an incompatible peer dependency to "@angular/core" (requires "12.0.0-next.1", would install "11.2.1")
  Package "@angular/router" has an incompatible peer dependency to "@angular/core" (requires "12.0.0-next.1", would install "11.2.1")
  Package "@angular/service-worker" has an incompatible peer dependency to "@angular/core" (requires "12.0.0-next.1", would install "11.2.1")
✖ Migration failed: Incompatible peer dependencies found.
Peer dependency warnings when installing dependencies means that those dependencies might not work correctly together.
You can use the '--force' option to ignore incompatible peer dependencies and instead address these warnings later.
  See "/tmp/ng-FO0rSM/angular-errors.log" for further details.
---
`ng update @angular/cdk @angular/core @angular/material rxjs --allow-dirty --force`
...
    Updating package.json with dependency @angular/compiler-cli @ "12.0.0-next.1" (was "10.1.2")...
    Updating package.json with dependency @angular/language-service @ "12.0.0-next.1" (was "10.1.2")...
    Updating package.json with dependency @angular/animations @ "12.0.0-next.1" (was "10.1.2")...
    Updating package.json with dependency @angular/cdk @ "11.2.1" (was "10.2.2")...
    Updating package.json with dependency @angular/common @ "12.0.0-next.1" (was "10.1.2")...
    Updating package.json with dependency @angular/compiler @ "12.0.0-next.1" (was "10.1.2")...
    Updating package.json with dependency @angular/core @ "11.2.1" (was "10.1.2")...
    Updating package.json with dependency @angular/forms @ "12.0.0-next.1" (was "10.1.2")...
    Updating package.json with dependency @angular/material @ "11.2.1" (was "10.2.2")...
    Updating package.json with dependency @angular/platform-browser @ "12.0.0-next.1" (was "10.1.2")...
    Updating package.json with dependency @angular/platform-browser-dynamic @ "12.0.0-next.1" (was "10.1.2")...
    Updating package.json with dependency @angular/platform-server @ "12.0.0-next.1" (was "10.1.2")...
    Updating package.json with dependency @angular/router @ "12.0.0-next.1" (was "10.1.2")...
    Updating package.json with dependency @angular/service-worker @ "12.0.0-next.1" (was "10.1.2")...
  UPDATE package.json (2919 bytes)
✔ Packages installed successfully.
** Executing migrations of package '@angular/cdk' **

▸ Updates the Angular CDK to v11.
    
      ✓  Updated Angular CDK to version 11
    
  Migration completed.

** Executing migrations of package '@angular/core' **

▸ In Angular version 11, the type of `AbstractControl.parent` can be `null` to reflect the runtime value more accurately.
  This migration automatically adds non-null assertions to existing accesses of the `parent` property on types like `FormControl`, `FormArray` and `FormGroup`.
  Migration completed.

▸ ViewEncapsulation.Native has been removed as of Angular version 11.
  This migration replaces any usages with ViewEncapsulation.ShadowDom.
  Migration completed.

▸ NavigationExtras omissions migration.
  In version 11, some unsupported properties were omitted from the `extras` parameter of the `Router.navigateByUrl` and `Router.createUrlTree` methods.
  Migration completed.

▸ Updates the `initialNavigation` property for `RouterModule.forRoot`.
  Migration completed.

▸ NavigationExtras.preserveQueryParams has been removed as of Angular version 11.
   This migration replaces any usages with the appropriate assignment of the queryParamsHandling key.
  Migration completed.

▸ The default value for `relativeLinkResolution` is changing from 'legacy' to 'corrected'.
This migration updates `RouterModule` configurations that use the default value to 
now specifically use 'legacy' to prevent breakages when updating.
  UPDATE src/app/app-routing.module.ts (1430 bytes)
  Migration completed.

▸ `async` to `waitForAsync` migration.
  The `async` testing function has been renamed to `waitForAsync` to avoid confusion with the native `async` keyword.
  UPDATE src/app/comments-manager/comments-manager.component.spec.ts (707 bytes)
  UPDATE src/app/common/treetable.component.spec.ts (1185 bytes)
  UPDATE src/app/model/data.service.spec.ts (4801 bytes)
  UPDATE src/app/model/firebase-data-source.service.spec.ts (7696 bytes)
  UPDATE src/app/model/firebase-upload.service.spec.ts (1694 bytes)
  UPDATE src/app/nav/nav.component.spec.ts (8005 bytes)
  UPDATE src/app/questions-manager/questions-manager.component.spec.ts (714 bytes)
  UPDATE src/app/tags-manager/tags-manager.component.spec.ts (679 bytes)
  Migration completed.

▸ Removes `canActivate` from a `Route` config when `redirectTo` is also present.
  Migration completed.

** Executing migrations of package '@angular/material' **

▸ Updates Angular Material to v11.
    
    ⚠  General notice: The HammerJS v9 migration for Angular Components is not able to migrate tests. Please manually clean up tests in your project if they rely on HammerJS.
    Read more about migrating tests: https://git.io/ng-material-v9-hammer-migrate-tests
    
      ✓  Updated Angular Material to version 11
    
  Migration completed.
(wow, first forceful try!)
(Oops! gone to 12.0.0-next.1, but aimed 11.2.0)
(ok, core, material, cdk still in 11.2.1)
---
(trying again to test...)
`ng update @angular/cdk @angular/core @angular/material rxjs --allow-dirty --force`
Repository is not clean. Update changes will be mixed with pre-existing changes.
Using package manager: 'npm'
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package '@angular/cdk' is already up to date.
Package '@angular/core' is already up to date.
Package '@angular/material' is already up to date.
Package 'rxjs' is already up to date.\
---
(trying again to test...)
`ng update`
Using package manager: 'npm'
Collecting installed dependencies...
Found 60 dependencies.
    We analyzed your package.json and everything seems to be in order. Good work!
---
`firebase emulators:start --only database`
firebase emulators:start --only database
i  emulators: Starting emulators: database
⚠  database: Did not find a Realtime Database rules file specified in a firebase.json config file. The emulator will default to allowing all reads and writes. Learn more about this option: https://firebase.google.com/docs/emulator-suite/install_and_configure#security_rules_configuration.
i  database: Database Emulator logging to database-debug.log
i  ui: Emulator UI logging to ui-debug.log
...
│ ✔  All emulators ready! View status and logs at http://localhost:4000 │
...
^C
...
   │                                          Update available 8.10.0 → 8.11.1                                           │
   │                    To update to the latest version using npm, run npm install -g firebase-tools                     │
...
---
`npm i -g firebase-tools`
...
+ firebase-tools@9.4.0
added 99 packages from 86 contributors, removed 44 packages, updated 85 packages and moved 4 packages in 90.774s
---
`npm outdated`
Package                                  Current         Wanted          Latest  Location
@angular-devkit/build-angular            0.900.7        0.900.7        0.1102.1  edutvum-exam
@angular/animations                12.0.0-next.1  12.0.0-next.1          11.2.1  edutvum-exam
@angular/common                    12.0.0-next.1  12.0.0-next.1          11.2.1  edutvum-exam
@angular/compiler                  12.0.0-next.1  12.0.0-next.1          11.2.1  edutvum-exam
@angular/compiler-cli              12.0.0-next.1  12.0.0-next.1          11.2.1  edutvum-exam
@angular/fire                              6.0.2          6.1.4           6.1.4  edutvum-exam
@angular/flex-layout               9.0.0-beta.31  9.0.0-beta.31  11.0.0-beta.33  edutvum-exam
@angular/forms                     12.0.0-next.1  12.0.0-next.1          11.2.1  edutvum-exam
@angular/language-service          12.0.0-next.1  12.0.0-next.1          11.2.1  edutvum-exam
@angular/platform-browser          12.0.0-next.1  12.0.0-next.1          11.2.1  edutvum-exam
@angular/platform-browser-dynamic  12.0.0-next.1  12.0.0-next.1          11.2.1  edutvum-exam
@angular/platform-server           12.0.0-next.1  12.0.0-next.1          11.2.1  edutvum-exam
@angular/pwa                             0.901.3       0.901.14        0.1102.1  edutvum-exam
@angular/router                    12.0.0-next.1  12.0.0-next.1          11.2.1  edutvum-exam
@angular/service-worker            12.0.0-next.1  12.0.0-next.1          11.2.1  edutvum-exam
@types/jasmine                            3.5.10          3.6.3           3.6.3  edutvum-exam
@types/node                             13.13.12       13.13.42        14.14.28  edutvum-exam
axios                                     0.19.2         0.19.2          0.21.1  edutvum-exam
bootstrap                                  3.4.1          3.4.1           4.6.0  edutvum-exam
codelyzer                                  5.2.2          5.2.2           6.0.1  edutvum-exam
core-js                                   2.6.11         2.6.12           3.8.3  edutvum-exam
firebase                                  7.14.2         7.24.0           8.2.7  edutvum-exam
firebase-admin                            8.12.1         8.13.0           9.5.0  edutvum-exam
jasmine-core                               3.5.0          3.6.0           3.6.0  edutvum-exam
jasmine-spec-reporter                      5.0.2          5.0.2           6.0.0  edutvum-exam
jsonfile                                   5.0.0          5.0.0           6.1.0  edutvum-exam
jsonschema                                 1.2.6          1.4.0           1.4.0  edutvum-exam
karma                                      5.0.2          5.2.3           6.1.1  edutvum-exam
karma-coverage                             2.0.2          2.0.3           2.0.3  edutvum-exam
karma-coverage-istanbul-reporter           2.1.1          2.1.1           3.0.3  edutvum-exam
karma-jasmine                              3.1.1          3.3.1           4.0.1  edutvum-exam
karma-jasmine-html-reporter                1.5.3          1.5.4           1.5.4  edutvum-exam
katex                                     0.11.1         0.11.1          0.12.0  edutvum-exam
moment                                    2.24.0         2.29.1          2.29.1  edutvum-exam
mudder                                     1.0.9         1.0.10          1.0.10  edutvum-exam
ngx-pagination                             4.1.0          4.1.0           5.0.0  edutvum-exam
ngx-quill                                 11.0.0         11.1.0          13.2.0  edutvum-exam
npm                                       6.14.4        6.14.11           7.5.4  edutvum-exam
protractor                                 5.4.4          5.4.4           7.0.0  edutvum-exam
puppeteer                                  3.0.2          3.3.0           7.1.0  edutvum-exam
rxjs-compat                                6.5.5          6.6.3           6.6.3  edutvum-exam
ts-node                                    8.9.0         8.10.2           9.1.1  edutvum-exam
tsickle                                   0.35.0         0.35.0          0.39.1  edutvum-exam
tslib                                     1.11.1         1.14.1           2.1.0  edutvum-exam
tslint                                     6.1.1          6.1.3           6.1.3  edutvum-exam
typescript                                 4.0.3          4.1.5           4.1.5  edutvum-exam
webpack                                   4.43.0         4.46.0          5.22.0  edutvum-exam
zone.js                                   0.10.3         0.10.3          0.11.4  edutvum-exam
---
`npm i @angular/flex-layout`
...
+ @angular/flex-layout@9.0.0-beta.31
updated 1 package and audited 2402 packages in 14.676s
...
(oh same!)
---
`npm i @angular/fire`
...
+ @angular/fire@6.1.4
added 1 package from 1 contributor, updated 1 package and audited 2403 packages in 16.157s
...
---
`ng -g typescript@latest`
The specified command ("typescript") is invalid. For a list of available options,
run "ng help".

Did you mean "test"?
---
`ng -g typescript@latest`
The specified command ("typescript@latest") is invalid. For a list of available options,
run "ng help".

Did you mean "generate"?
---
`npm i @angular/pwa`
...
+ @angular/pwa@0.901.14
updated 15 packages and audited 2403 packages in 20.125s
...
---
`npm i @types/jasmine`
...
+ @types/jasmine@3.6.3
updated 1 package and audited 2403 packages in 14.267s
...
---
`npm i @types/node`
...
+ @types/node@13.13.42
updated 1 package and audited 2403 packages in 14.868s
...
---
`npm update`
...
+ karma-jasmine@3.3.1
+ jsonschema@1.4.0
+ karma-jasmine-html-reporter@1.5.4
+ jasmine-core@3.6.0
+ firebase-admin@8.13.0
+ karma@5.2.3
+ core-js@2.6.12
+ karma-coverage@2.0.3
+ moment@2.29.1
+ tslib@1.14.1
+ ts-node@8.10.2
+ tslint@6.1.3
+ rxjs-compat@6.6.3
+ puppeteer@3.3.0
+ firebase@7.24.0
+ webpack@4.46.0
+ npm@6.14.11
+ mudder@1.0.10
+ typescript@4.1.5
+ ngx-quill@11.1.0
added 110 packages from 53 contributors, removed 47 packages, updated 150 packages, moved 1 package and audited 2469 packages in 100.27s
...
---
(not recorded)
`npm -v`
6.14.11 (guessing)
---
`npm install -g npm@latest`
home/svr/.npm-global/bin/npm -> /home/svr/.npm-global/lib/node_modules/npm/bin/npm-cli.js
/home/svr/.npm-global/bin/npx -> /home/svr/.npm-global/lib/node_modules/npm/bin/npx-cli.js
+ npm@7.5.4
added 59 packages from 24 contributors, removed 241 packages and updated 194 packages in 13.916s
---
`npm -v`
7.5.4
---
`node -v`
v14.15.4
---
`npm install -g ts-node@latest`
added 4 packages, removed 11 packages, changed 5 packages, and audited 11 packages in 2s
found 0 vulnerabilities
---
`ts-node -v`
v9.1.1
---
(following steps in environment.dev.ts)
---
`firebase emulators:start --only database`
...
Error: Could not start Database Emulator, port taken.
---
`fuser 9000/tcp`
9000/tcp:            59014
---
`fuser -k 9000/tcp`
9000/tcp:            59014
---
`firebase emulators:start --only database`
...
i  database: downloading firebase-database-emulator-v4.7.2.jar...
Progress: =====================================================================================================================> (100% of 29MB
i  database: Removing outdated emulator files: firebase-database-emulator-v4.5.0.jar
i  database: Database Emulator logging to database-debug.log
⚠  ui: Emulator UI unable to start on port 4000, starting on 4001 instead.
i  ui: downloading ui-v1.4.1.zip...
Progress: ======================================================================================================================> (100% of 4MB
i  ui: Removing outdated emulator files: ui-v1.1.1
i  ui: Removing outdated emulator files: ui-v1.1.1.zip
i  ui: Emulator UI logging to ui-debug.log
...
  Emulator Hub running at localhost:4400
  Other reserved ports: 4500
...
^C 
i  emulators: Received SIGINT (Ctrl-C) for the first time. Starting a clean shutdown.
i  emulators: Please wait for a clean shutdown or send the SIGINT (Ctrl-C) signal again to stop right now.
i  emulators: Shutting down emulators.
i  ui: Stopping Emulator UI
⚠  Emulator UI has exited upon receiving signal: SIGINT
i  database: Stopping Database Emulator
i  hub: Stopping emulator hub
i  logging: Stopping Logging Emulator
---
`firebase emulators:start --only database`
...
⚠  ui: Emulator UI unable to start on port 4000, starting on 4001 instead.
...
  Emulator Hub running at localhost:4400
  Other reserved ports: 4500
...
^C 
...
---
`fuser -k 4000/tcp`
4000/tcp:            59061
(oops! what was 4000?!)
(RESTART LINUX!! to be safe)
---
`firebase emulators:start --only database`
...
│ i  View Emulator UI at http://localhost:4000                │
...
│ Database │ localhost:9000 │ http://localhost:4000/database │
...
  Emulator Hub running at localhost:4400
  Other reserved ports: 4500...
(oh! all fine!)
---
import json from the browser from http://localhost:4000/database
json: ~/Downloads/edutvum-exam-export-dev.json
---
`fshttp -d ../uploads`
8000 /home/svr/lindata/edutvum/uploads
Listening on port 8000
(wow works, there is an empty folder in ~/.../edutvum)
---
`npm run dev`

> edutvum-exam@0.0.0 dev
> ng serve -c dev

0% compiling
Compiling @angular/fire : es2015 as esm2015

Compiling @angular/fire/auth : es2015 as esm2015

Compiling @angular/fire/database : es2015 as esm2015

chunk {main} main.js, main.js.map (main) 644 kB [initial] [rendered]
chunk {quill} quill.js, quill.js.map (quill) 430 kB  [rendered]
chunk {runtime} runtime.js, runtime.js.map (runtime) 8.98 kB [entry] [rendered]
chunk {styles} styles.js, styles.js.map (styles) 858 kB [initial] [rendered]
chunk {vendor} vendor.js, vendor.js.map (vendor) 8.25 MB [initial] [rendered]
Date: 2021-02-18T03:55:36.289Z - Hash: c83d3ce1e4c0998c4910 - Time: 38085ms

WARNING in /home/svr/lindata/edutvum/edutvum-exam/src/main.ngtypecheck.ts is part of the TypeScript compilation but it's unused.
Add only entry points to the 'files' or 'include' properties in your tsconfig.
...
...
** Angular Live Development Server is listening on localhost:4200, open your browser on http://localhost:4200/ **
: Compiled successfully.

Date: 2021-02-18T03:55:37.993Z - Hash: 9a4519e6d590534bc2d8
5 unchanged chunks

Time: 932ms
: Compiled successfully.
---
http://localhost:4200
(--> Login)
(All working !!! though upgrade added {relativeLinkResolution: 'legacy'})
---
^C
All three firebase emulator, fshttp, npm dev
---
`npm test`
...
secsChrome Headless 88.0.4324.150 (Linux x86_64): Executed 113 of 145 (skipped 30) SUCCESS (0 secs / 0.619 secsChrome Headless 88.0.4324.150 (Linux x86_64): Executed 113 of 145 (skipped 32) SUCCESS (0.868 secs / 0.619 secs)
TOTAL: 113 SUCCESS
TOTAL: 113 SUCCESS
(Tests working too!, though 8 file upgraded async-->waitForAsync)
---
`npm run build`
svr@tnr:~/lindata/edutvum/edutvum-exam$ npm run build
...
chunk {2} polyfills-es5.e958949e2d7c286bdd0c.js (polyfills-es5) 89.5 kB [initial] [rendered]
chunk {0} runtime-es2015.b68caf476115faf9caf1.js (runtime) 2.24 kB [entry] [rendered]
chunk {0} runtime-es5.b68caf476115faf9caf1.js (runtime) 2.23 kB [entry] [rendered]
chunk {4} 4-es2015.ffd9b92b4e07a52ed4ce.js () 209 kB  [rendered]
chunk {4} 4-es5.ffd9b92b4e07a52ed4ce.js () 209 kB  [rendered]
chunk {1} main-es2015.e15eddbe6513e349a4f5.js (main) 1.88 MB [initial] [rendered]
chunk {1} main-es5.e15eddbe6513e349a4f5.js (main) 2.05 MB [initial] [rendered]
chunk {3} styles.690c881cad083da62077.css (styles) 184 kB [initial] [rendered]
Date: 2021-02-18T04:24:53.971Z - Hash: 18155cafc389f275dcf2 - Time: 146273ms

WARNING in /home/svr/lindata/edutvum/edutvum-exam/src/main.ngtypecheck.ts is part of the TypeScript compilation but it's unused.
Add only entry points to the 'files' or 'include' properties in your tsconfig.
...
(around 43 such warnings...)
---
For the above warnings...
https://stackoverflow.com/questions/57729518/how-to-get-rid-of-the-warning-ts-file-is-part-of-the-typescript-compilation-but
Therefore they ('src/**/*.spec.ts' etc.) can be added to the exclude section in tsconfig.app.json or applicable TypeScript configuration file in your app like below:
...
Once these are added as above, the warning will not show anymore.
(FAILED. nope!, still the warnings in both dev and build...)
---
