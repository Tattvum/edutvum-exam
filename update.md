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
Upgraded angular too

