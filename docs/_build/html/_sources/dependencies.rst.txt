############
Dependencies
############

The app is powered by [Bloggify](https://bloggify.org)—a modular and flexible platform for building modular applications. Since Bloggify is a Node.js platform, you have to install Node.js on your machine. The data is stored in a MongoDB database.

Along with this platform, other direct dependencies are needed. Some of them are only needed in the development environment, while others are required while the app is running in production.

**Bloggify-related dependencies**

 - `bloggify`: The Bloggify platform.
 - `bloggify-github-login`: A Bloggify plugin to provide GitHub authentication.
 - `bloggify-icons`: A set of icons by Bloggify.
 - `bloggify-mongoose`: The Mongoose module for Bloggify.
 - `bloggify-sendgrid`: A module for sending emails using Sendgrid as a service.
 - `bloggify-ws`: Websocket communication for Bloggify.

**React-related Dependencies**

 - `react`: The React library.
 - `react-ace`: ACE editor bindings for React.
 - `react-dom`:
 - `react-folder-tree`: Tree view for folders and files for React.
 - `react-github-contribution-calendar`: GitHub-like contributions calendar for React.
 - `react-markdown`: Render MarkDown content using React.
 - `react-md-editor`: MarkDown editor for React.
 - `react-treebeard`: Tree view for folders and files for React.
 - `sweetalert2-react`: SweetAlert for React.

**UI & UX Libraries**
 - `bag.css`: A small CSS library for building DOM containers.
 - `gridly`: CSS library for handling grids.
 - `sweetalert`: Cute alternative for the native browser prompts.
 - `codemirror`: Editor for the web.

**Utility Libraries**

 - `array-unique`: Remove duplicate values from an array.
 - `bindy`:  Create an array of functions bound to an the values of an input array.
 - `execa`:  Execute child processes.
 - `fast-csv`: A Node.js module for managing CSV files (creation and parsing).
 - `find-value`: Find a specific value in an object, by providing the key.
 - `html-entities`: Parse HTML entities in a string.
 - `is-valid-path`: Check whether the path is valid.
 - `modernizr`: A friendly library for checking different browser features.
 - `moment`: A library for managing date objects.
 - `moment-timezone`: An extension for `moment` for managing timezones.
 - `uc-first`: Uppercase the first character in a string.
 - `unique-random-range`: Get a unique random in a specific range.
 - `treeify-paths`:
 - `util-promisifyall`: Polyfill for `util.promisifyall`.
 - `map-o`: Iterate over objects.
 - `node-schedule`: Node.js module to schedule tasks.
 - `obj-flatten`: Get the flatten version of an provided object
 - `paths2tree`: Get the tree of an array of paths.
 - `regex-escape`: Escape special characters in regular expressions.
 - `connect-mongo`: Connect plugin for MongoDB sessions.
 - `same-time`: Run tasks in parallel.
 - `slugo`: Used to get the title slugs etc.
 - `streamp`: Create readable and writable streams in directories which do not exist (those will be created if needed).

**API Wrappers**
 - `gh.js`: A small Node.js wrapper for the GitHub API.
 - `aws-sdk`: The AWS SDK for Node.js. Used for the S3 APIs.

**DOM Libraries**
 - `jquery`: The jQuery library.
 - `elly`: Select DOM elements.

**Polyfills**
 - `whatwg-fetch`: Polyfill for `fetch`.
