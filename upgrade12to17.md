https://update.angular.io/?l=2&v=12.0-17.0

---

## 6.0.0

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/core@13 @angular/cli@13
Workspace extension with invalid name (defaultProject) found.
The installed Angular CLI version is outdated.
Installing a temporary Angular CLI versioned 13.3.11 to perform the update.
✔ Packages successfully installed.
Using package manager: 'npm'
Collecting installed dependencies...
Found 6 dependencies.
Package '@angular/core' is not a dependency.

npm install

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/core@17 @angular/cli@17
The installed local Angular CLI version is older than the latest stable version.
Installing a temporary version to perform the update.
✔ Package successfully installed.
Workspace extension with invalid name (defaultProject) found.
Using package manager: npm
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Updating multiple major versions of '@angular/core' at once is not supported. Please migrate each major version individually.
Run 'ng update @angular/core@13' in your workspace directory to update to latest '13.x' version of '@angular/core'.

For more information about the update process, see https://update.angular.io/?v=12.0-13.0

---

## 6.0.1

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/core@13 @angular/cli@13
The installed local Angular CLI version is older than the latest stable version.
Installing a temporary version to perform the update.
✔ Package successfully installed.
Workspace extension with invalid name (defaultProject) found.
Using package manager: npm
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package "@angular/fire" has an incompatible peer dependency to "@angular/common" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "13.4.0").
Package "@angular/fire" has an incompatible peer dependency to "@angular/core" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "13.4.0").
Package "ngx-quill" has an incompatible peer dependency to "@angular/forms" (requires "^9.0.0" (extended), would install "13.4.0").
Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "13.4.0").
Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser-dynamic" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "13.4.0").
✖ Migration failed: Incompatible peer dependencies found.
Peer dependency warnings when installing dependencies means that those dependencies might not work correctly together.
You can use the '--force' option to ignore incompatible peer dependencies and instead address these warnings later.
See "/tmp/ng-h9kFsd/angular-errors.log" for further details.

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/core@13 @angular/cli@13 --force
The installed local Angular CLI version is older than the latest stable version.
Installing a temporary version to perform the update.
✔ Package successfully installed.
Workspace extension with invalid name (defaultProject) found.
Using package manager: npm
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package "@angular/fire" has an incompatible peer dependency to "@angular/common" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "13.4.0").
Package "@angular/fire" has an incompatible peer dependency to "@angular/core" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "13.4.0").
Package "ngx-quill" has an incompatible peer dependency to "@angular/forms" (requires "^9.0.0" (extended), would install "13.4.0").
Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "13.4.0").
Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser-dynamic" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "13.4.0").
Updating package.json with dependency @angular-devkit/build-angular @ "13.3.11" (was "12.1.0")...
Updating package.json with dependency @angular/cli @ "13.3.11" (was "12.1.0")...
Updating package.json with dependency @angular/compiler-cli @ "13.4.0" (was "12.1.0")...
Updating package.json with dependency @angular/language-service @ "13.4.0" (was "12.1.0")...
Updating package.json with dependency typescript @ "4.6.4" (was "4.3.4")...
Updating package.json with dependency @angular/animations @ "13.4.0" (was "12.1.0")...
Updating package.json with dependency @angular/common @ "13.4.0" (was "12.1.0")...
Updating package.json with dependency @angular/compiler @ "13.4.0" (was "12.1.0")...
Updating package.json with dependency @angular/core @ "13.4.0" (was "12.1.0")...
Updating package.json with dependency @angular/forms @ "13.4.0" (was "12.1.0")...
Updating package.json with dependency @angular/platform-browser @ "13.4.0" (was "12.1.0")...
Updating package.json with dependency @angular/platform-browser-dynamic @ "13.4.0" (was "12.1.0")...
Updating package.json with dependency @angular/platform-server @ "13.4.0" (was "12.1.0")...
Updating package.json with dependency @angular/router @ "13.4.0" (was "12.1.0")...
Updating package.json with dependency @angular/service-worker @ "13.4.0" (was "12.1.0")...
UPDATE package.json (3320 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cli' **

▸ Remove polyfills required only for Internet Explorer which is no longer supported.
Migration completed (No changes made).

▸ Remove no longer valid Angular schematic options from `angular.json`.
Migration completed (No changes made).

▸ Remove deprecated options from 'angular.json' that are no longer present in v13.
UPDATE angular.json (4337 bytes)
Migration completed (1 file modified).

▸ Updating '.gitignore' to include '.angular/cache'.
UPDATE .gitignore (852 bytes)
Migration completed (1 file modified).

▸ Update library projects to be published in partial mode and removed deprecated options from ng-packagr configuration.
Migration completed (No changes made).

** Executing migrations of package '@angular/core' **

▸ Migrates `[routerLink]=""` in templates to `[routerLink]="[]"` because these links are likely intended to route to the current page with updated fragment/query params.
Migration completed (No changes made).

▸ In Angular version 13, the `teardown` flag in `TestBed` will be enabled by default.
This migration automatically opts out existing apps from the new teardown behavior.
UPDATE src/test.ts (1054 bytes)
Migration completed (1 file modified).

▸ As of Angular version 13, `entryComponents` are no longer necessary.
Migration completed (No changes made).

---

## 6.0.2

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/material@13
Using package manager: 'npm'
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package "@angular/flex-layout" has an incompatible peer dependency to "@angular/cdk" (requires "^9.0.0-rc.8", would install "13.3.9").
✖ Migration failed: Incompatible peer dependencies found.
Peer dependency warnings when installing dependencies means that those dependencies might not work correctly together.
You can use the '--force' option to ignore incompatible peer dependencies and instead address these warnings later.
See "/tmp/ng-6CFUz1/angular-errors.log" for further details.

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/material@13 --force
Using package manager: 'npm'
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
(node:214108) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 close listeners added to [TLSSocket]. Use emitter.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)
Package "@angular/flex-layout" has an incompatible peer dependency to "@angular/cdk" (requires "^9.0.0-rc.8", would install "13.3.9").
Updating package.json with dependency @angular/cdk @ "13.3.9" (was "12.1.0")...
Updating package.json with dependency @angular/material @ "13.3.9" (was "12.1.0")...
UPDATE package.json (3320 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cdk' **

▸ Updates the Angular CDK to v13.

      ✓  Updated Angular CDK to version 13

UPDATE src/styles.css (174 bytes)
Migration completed.

** Executing migrations of package '@angular/material' **

▸ Updates Angular Material to v13.

      ✓  Updated Angular Material to version 13

Migration completed.

---

## 6.0.3

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/core@14 @angular/cli@14 --force
The installed Angular CLI version is outdated.
Installing a temporary Angular CLI versioned 14.2.13 to perform the update.
✔ Package successfully installed.
Using package manager: npm
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package "@angular/fire" has an incompatible peer dependency to "@angular/common" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "14.3.0").
Package "@angular/fire" has an incompatible peer dependency to "@angular/core" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "14.3.0").
Package "ngx-quill" has an incompatible peer dependency to "@angular/forms" (requires "^9.0.0" (extended), would install "14.3.0").
Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "14.3.0").
Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser-dynamic" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "14.3.0").
Updating package.json with dependency @angular-devkit/build-angular @ "14.2.13" (was "13.3.11")...
Updating package.json with dependency @angular/cli @ "14.2.13" (was "13.3.11")...
Updating package.json with dependency @angular/compiler-cli @ "14.3.0" (was "13.4.0")...
Updating package.json with dependency @angular/language-service @ "14.3.0" (was "13.4.0")...
Updating package.json with dependency @angular/animations @ "14.3.0" (was "13.4.0")...
Updating package.json with dependency @angular/common @ "14.3.0" (was "13.4.0")...
Updating package.json with dependency @angular/compiler @ "14.3.0" (was "13.4.0")...
Updating package.json with dependency @angular/core @ "14.3.0" (was "13.4.0")...
Updating package.json with dependency @angular/forms @ "14.3.0" (was "13.4.0")...
Updating package.json with dependency @angular/platform-browser @ "14.3.0" (was "13.4.0")...
Updating package.json with dependency @angular/platform-browser-dynamic @ "14.3.0" (was "13.4.0")...
Updating package.json with dependency @angular/platform-server @ "14.3.0" (was "13.4.0")...
Updating package.json with dependency @angular/router @ "14.3.0" (was "13.4.0")...
Updating package.json with dependency @angular/service-worker @ "14.3.0" (was "13.4.0")...
UPDATE package.json (3320 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cli' **

▸ Remove 'defaultProject' option from workspace configuration.
The project to use will be determined from the current working directory.
UPDATE angular.json (4301 bytes)
Migration completed.

▸ Remove 'showCircularDependencies' option from browser and server builders.
Migration completed.

▸ Replace 'defaultCollection' option in workspace configuration with 'schematicCollections'.
Migration completed.

▸ Update Angular packages 'dependencies' and 'devDependencies' version prefix to '^' instead of '~'.
✔ Packages installed successfully.
Migration completed.

▸ Remove 'package.json' files from library projects secondary entrypoints.
Migration completed.

▸ Update TypeScript compilation target to 'ES2020'.
✖ Migration failed: Path "/tsconfig.json" does not exist.
See "/tmp/ng-jM5C0M/angular-errors.log" for further details.

---

## 6.0.4

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/material@14 --force
Using package manager: npm
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
(node:220981) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 close listeners added to [TLSSocket]. Use emitter.setMaxListeners() to increase limit
(Use `node --trace-warnings ...` to show where the warning was created)
Package "@angular/flex-layout" has an incompatible peer dependency to "@angular/cdk" (requires "^9.0.0-rc.8", would install "14.2.7").
Updating package.json with dependency @angular/cdk @ "14.2.7" (was "13.3.9")...
Updating package.json with dependency @angular/material @ "14.2.7" (was "13.3.9")...
UPDATE package.json (3320 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cdk' **

▸ Updates the Angular CDK to v14.

      ✓  Updated Angular CDK to version 14

Migration completed.

** Executing migrations of package '@angular/material' **

▸ Updates the Angular Material to v14.

      ✓  Updated Angular Material to version 14

Migration completed.

---

## 6.0.5

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/core@15 @angular/cli@15 --force
The installed Angular CLI version is outdated.
Installing a temporary Angular CLI versioned 15.2.11 to perform the update.
✔ Packages successfully installed.
Using package manager: npm
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package "@angular/fire" has an incompatible peer dependency to "@angular/common" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "15.2.10").
Package "@angular/fire" has an incompatible peer dependency to "@angular/core" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "15.2.10").
Package "ngx-quill" has an incompatible peer dependency to "@angular/forms" (requires "^9.0.0" (extended), would install "15.2.10").
Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "15.2.10").
Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser-dynamic" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "15.2.10").
Updating package.json with dependency @angular-devkit/build-angular @ "15.2.11" (was "14.2.13")...
Updating package.json with dependency @angular/cli @ "15.2.11" (was "14.2.13")...
Updating package.json with dependency @angular/compiler-cli @ "15.2.10" (was "14.3.0")...
Updating package.json with dependency @angular/language-service @ "15.2.10" (was "14.3.0")...
Updating package.json with dependency typescript @ "4.9.5" (was "4.6.4")...
Updating package.json with dependency @angular/animations @ "15.2.10" (was "14.3.0")...
Updating package.json with dependency @angular/common @ "15.2.10" (was "14.3.0")...
Updating package.json with dependency @angular/compiler @ "15.2.10" (was "14.3.0")...
Updating package.json with dependency @angular/core @ "15.2.10" (was "14.3.0")...
Updating package.json with dependency @angular/forms @ "15.2.10" (was "14.3.0")...
Updating package.json with dependency @angular/platform-browser @ "15.2.10" (was "14.3.0")...
Updating package.json with dependency @angular/platform-browser-dynamic @ "15.2.10" (was "14.3.0")...
Updating package.json with dependency @angular/platform-server @ "15.2.10" (was "14.3.0")...
Updating package.json with dependency @angular/router @ "15.2.10" (was "14.3.0")...
Updating package.json with dependency @angular/service-worker @ "15.2.10" (was "14.3.0")...
UPDATE package.json (3332 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cli' **

▸ Remove Browserslist configuration files that matches the Angular CLI default configuration.
Migration completed (No changes made).

▸ Remove exported `@angular/platform-server` `renderModule` method.
The `renderModule` method is now exported by the Angular CLI.
Migration completed (No changes made).

▸ Remove no longer needed require calls in Karma builder main file.
UPDATE src/test.ts (885 bytes)
Migration completed (1 file modified).

▸ Update TypeScript compiler `target` and set `useDefineForClassFields`.
These changes are for IDE purposes as TypeScript compiler options `target` and `useDefineForClassFields` are set to `ES2022` and `false` respectively by the Angular CLI.
To control ECMA version and features use the Browerslist configuration.
✖ Migration failed: Path "tsconfig.json" does not exist.
See "/tmp/ng-mwgx5D/angular-errors.log" for further details.

---

## 6.0.6

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/material@15 --force
Using package manager: npm
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package "@angular/flex-layout" has an incompatible peer dependency to "@angular/cdk" (requires "^9.0.0-rc.8", would install "15.2.9").
Updating package.json with dependency @angular/cdk @ "15.2.9" (was "14.2.7")...
Updating package.json with dependency @angular/material @ "15.2.9" (was "14.2.7")...
UPDATE package.json (3332 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cdk' **

▸ Updates the Angular CDK to v15.

      ✓  Updated Angular CDK to version 15

Migration completed (No changes made).

** Executing migrations of package '@angular/material' **

▸ Updates the Angular Material to v15.

      ✓  Updated Angular Material to version 15

UPDATE src/app/app.module.ts (8678 bytes)
UPDATE src/app/tags-manager/tags-manager.component.ts (3493 bytes)
UPDATE src/app/common/autoinput.component.ts (2233 bytes)
UPDATE src/app/common/autochip.component.ts (2868 bytes)
UPDATE src/app/results-chart/results-chart.component.ts (2088 bytes)
UPDATE src/app/editor/editor.component.ts (4029 bytes)
UPDATE src/app/model/general-context.ts (884 bytes)
Migration completed (7 files modified).

---

## 6.0.7

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/core@16 @angular/cli@16 --force
The installed Angular CLI version is outdated.
Installing a temporary Angular CLI versioned 16.2.13 to perform the update.
✔ Packages successfully installed.
Using package manager: npm
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package "@angular/fire" has an incompatible peer dependency to "@angular/common" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "16.2.12").
Package "@angular/fire" has an incompatible peer dependency to "@angular/core" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "16.2.12").
Package "ngx-quill" has an incompatible peer dependency to "@angular/forms" (requires "^9.0.0" (extended), would install "16.2.12").
Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "16.2.12").
Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser-dynamic" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "16.2.12").
Updating package.json with dependency @angular-devkit/build-angular @ "16.2.13" (was "15.2.11")...
Updating package.json with dependency @angular/cli @ "16.2.13" (was "15.2.11")...
Updating package.json with dependency @angular/compiler-cli @ "16.2.12" (was "15.2.10")...
Updating package.json with dependency @angular/language-service @ "16.2.12" (was "15.2.10")...
Updating package.json with dependency @angular/animations @ "16.2.12" (was "15.2.10")...
Updating package.json with dependency @angular/common @ "16.2.12" (was "15.2.10")...
Updating package.json with dependency @angular/compiler @ "16.2.12" (was "15.2.10")...
Updating package.json with dependency @angular/core @ "16.2.12" (was "15.2.10")...
Updating package.json with dependency @angular/forms @ "16.2.12" (was "15.2.10")...
Updating package.json with dependency @angular/platform-browser @ "16.2.12" (was "15.2.10")...
Updating package.json with dependency @angular/platform-browser-dynamic @ "16.2.12" (was "15.2.10")...
Updating package.json with dependency @angular/platform-server @ "16.2.12" (was "15.2.10")...
Updating package.json with dependency @angular/router @ "16.2.12" (was "15.2.10")...
Updating package.json with dependency @angular/service-worker @ "16.2.12" (was "15.2.10")...
Updating package.json with dependency zone.js @ "0.13.3" (was "0.11.4")...
UPDATE package.json (3332 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cli' **

▸ Remove 'defaultProject' option from workspace configuration.
The project to use will be determined from the current working directory.
Migration completed (No changes made).

▸ Replace removed 'defaultCollection' option in workspace configuration with 'schematicCollections'.
Migration completed (No changes made).

▸ Update the '@angular-devkit/build-angular:server' builder configuration to disable 'buildOptimizer' for non optimized builds.
Migration completed (No changes made).

** Executing migrations of package '@angular/core' **

▸ In Angular version 15.2, the guard and resolver interfaces (CanActivate, Resolve, etc) were deprecated.
This migration removes imports and 'implements' clauses that contain them.
UPDATE src/app/auth.guard.ts (482 bytes)
Migration completed (1 file modified).

▸ As of Angular v16, the `moduleId` property of `@Component` is deprecated as it no longer has any effect.
Migration completed (No changes made).

---

## 6.0.7

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/material@16 --force
Using package manager: npm
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package "@angular/flex-layout" has an incompatible peer dependency to "@angular/cdk" (requires "^9.0.0-rc.8", would install "16.2.14").
Updating package.json with dependency @angular/cdk @ "16.2.14" (was "15.2.9")...
Updating package.json with dependency @angular/material @ "16.2.14" (was "15.2.9")...
UPDATE package.json (3334 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cdk' **

▸ Updates the Angular CDK to v16.

      ✓  Updated Angular CDK to version 16

Migration completed (No changes made).

** Executing migrations of package '@angular/material' **

▸ Updates the Angular Material to v16.

      ✓  Updated Angular Material to version 16

Migration completed (No changes made).

---

## 6.0.7

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/core@17 @angular/cli@17 --force
The installed Angular CLI version is outdated.
Installing a temporary Angular CLI versioned 17.3.2 to perform the update.
✔ Packages successfully installed.
Using package manager: npm
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package "@angular/fire" has an incompatible peer dependency to "@angular/common" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "17.3.1").
Package "@angular/fire" has an incompatible peer dependency to "@angular/core" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "17.3.1").
Package "ngx-quill" has an incompatible peer dependency to "@angular/forms" (requires "^9.0.0" (extended), would install "17.3.1").
Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "17.3.1").
Package "@angular/fire" has an incompatible peer dependency to "@angular/platform-browser-dynamic" (requires "^9.0.0 || ^10.0.0 || ^11.0.0" (extended), would install "17.3.1").
Updating package.json with dependency @angular-devkit/build-angular @ "17.3.2" (was "16.2.13")...
Updating package.json with dependency @angular/cli @ "17.3.2" (was "16.2.13")...
Updating package.json with dependency @angular/compiler-cli @ "17.3.1" (was "16.2.12")...
Updating package.json with dependency @angular/language-service @ "17.3.1" (was "16.2.12")...
Updating package.json with dependency typescript @ "5.4.3" (was "4.9.5")...
Updating package.json with dependency @angular/animations @ "17.3.1" (was "16.2.12")...
Updating package.json with dependency @angular/common @ "17.3.1" (was "16.2.12")...
Updating package.json with dependency @angular/compiler @ "17.3.1" (was "16.2.12")...
Updating package.json with dependency @angular/core @ "17.3.1" (was "16.2.12")...
Updating package.json with dependency @angular/forms @ "17.3.1" (was "16.2.12")...
Updating package.json with dependency @angular/platform-browser @ "17.3.1" (was "16.2.12")...
Updating package.json with dependency @angular/platform-browser-dynamic @ "17.3.1" (was "16.2.12")...
Updating package.json with dependency @angular/platform-server @ "17.3.1" (was "16.2.12")...
Updating package.json with dependency @angular/router @ "17.3.1" (was "16.2.12")...
Updating package.json with dependency @angular/service-worker @ "17.3.1" (was "16.2.12")...
Updating package.json with dependency zone.js @ "0.14.4" (was "0.13.3")...
UPDATE package.json (3320 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cli' **

▸ Replace usages of '@nguniversal/builders' with '@angular-devkit/build-angular'.
Migration completed (No changes made).

▸ Replace usages of '@nguniversal/' packages with '@angular/ssr'.
Migration completed (No changes made).

▸ Replace deprecated options in 'angular.json'.
UPDATE angular.json (4289 bytes)
Migration completed (1 file modified).

▸ Add 'browser-sync' as dev dependency when '@angular-devkit/build-angular:ssr-dev-server' is used, as it is no longer a direct dependency of '@angular-devkit/build-angular'.
Migration completed (No changes made).

** Executing migrations of package '@angular/core' **

▸ Angular v17 introduces a new control flow syntax that uses the @ and } characters.
This migration replaces the existing usages with their corresponding HTML entities.
Migration completed (No changes made).

▸ Updates `TransferState`, `makeStateKey`, `StateKey` imports from `@angular/platform-browser` to `@angular/core`.
Migration completed (No changes made).

▸ CompilerOption.useJit and CompilerOption.missingTranslation are unused under Ivy.
This migration removes their usage
Migration completed (No changes made).

▸ Updates two-way bindings that have an invalid expression to use the longform expression instead.
Migration completed (No changes made).

---

## 6.0.7

svr@tnr:~/edutvum/edutvum-exam$ ng update @angular/material@17 --force
Using package manager: npm
Collecting installed dependencies...
Found 60 dependencies.
Fetching dependency metadata from registry...
Package "@angular/flex-layout" has an incompatible peer dependency to "@angular/cdk" (requires "^9.0.0-rc.8", would install "17.3.1").
Updating package.json with dependency @angular/cdk @ "17.3.1" (was "16.2.14")...
Updating package.json with dependency @angular/material @ "17.3.1" (was "16.2.14")...
UPDATE package.json (3318 bytes)
✔ Packages successfully installed.
** Executing migrations of package '@angular/cdk' **

▸ Updates the Angular CDK to v17.

      ✓  Updated Angular CDK to version 17

Migration completed (No changes made).

** Executing migrations of package '@angular/material' **

▸ Updates Angular Material to v17.
Cannot update to Angular Material v17 because the project is using the legacy Material components
that have been deleted. While Angular Material v16 is compatible with Angular v17, it is recommended
to switch away from the legacy components as soon as possible because they no longer receive bug fixes,
accessibility improvements and new features.

    Read more about migrating away from legacy components: https://material.angular.io/guide/mdc-migration

    Files in the project using legacy Material components:
     - /src/app/app.module.ts
     - /src/app/common/autochip.component.ts
     - /src/app/common/autoinput.component.ts
     - /src/app/editor/editor.component.ts
     - /src/app/model/general-context.ts
     - /src/app/results-chart/results-chart.component.ts
     - /src/app/tags-manager/tags-manager.component.ts

UPDATE package.json (3318 bytes)
✔ Packages installed successfully.
Migration completed (1 file modified).
