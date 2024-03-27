https://update.angular.io/?l=2&v=12.0-17.0

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




