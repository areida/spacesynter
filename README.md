# Front End Template with React

### Initializing the Development Environment
1. `npm install`
1. `gulp watch`

### Customizing for your project
1. Clone or copy this repository into a new directory
1. Run the initialization script `chmod +x initialize.sh; ./initialize.sh`. It will ask for:
    1. Repository SSH clone URL
    1. Development API Host
    1. Production API Host - if unknown give best guess
    1. QA App Name
    1. QA Host
    - If you want to start without a remote repo initialize with `./initialize.sh -t`
1. Update `package.json`
    1. Update `@todo` with proper values
    1. Run `npm outdated --depth=0` to see if there are new versions of dependencies. If so, consider updating them in the frontend template as well as the project
1. Update `application/index.html` to replace `@todo` with proper values
