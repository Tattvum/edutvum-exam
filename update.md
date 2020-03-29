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
