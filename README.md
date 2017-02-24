# IronHacks Platform
Hack for inovation and join the open data movement.

### About

This application is powered by [Bloggify](https://bloggify.org)–a Node.js powered platform to build modular applications.

When deployed to Heroku, the application url is `https://<app-name>.herokuapp.com` (unless it's using a custom domain).
**Note:** When using a free dyno, it's working fine, but with some limitations:

 - it's slower
 - it's going to sleep if it's innactive for a certain period of time.
 - has bandwidth limits, but pretty liberal

The app configuration is stored in the `bloggify.js` file.

### Installation


 1. Clone the repo either from GitHub or Heroku:

  ```sh
  git clone https://github.com/hackpurdue/courseswebpage.git
  ```

  or Heroku (this is not recommended, but it will still work):

  ```sh
  git clone https://git.heroku.com/ironhackplatform.git courseswebpage
  ```

  **Note**: This is not recommended because the code pushed to Heroku is a little
  bit different than the version we push to GitHub. When deploying the app on
  Heroku, we bundle the files **before** pushing them, therefore the Heroku
  version will store the production bundles, while the GitHub version doesn't
  store any bundles at all.

  There are two reasons why we bundle the files before deployment:

   1. Heroku is going to complain if we do it on their servers because it's a
      very resource-consuming process (it's using RAM memory, eventually
      exceeding it).

      Doing it on our machines is much better because we have enough RAM.

   2. The boot time of the app will be much faster (because no bundles have to
      be generated on Heroku).

 2. Open the folder:

  ```sh
  cd courseswebpage
  ```

 3. Install the dependencies:

  ```sh
  npm i
  ```

Start MongoDB:

```sh
mongod
# or
sudo mongod
```

Start the app in dev mode:

```sh
npm run start:dev
```

Make yourself an admin, by passing YOUR GitHub username (the username of the
account you use to sign in for the first time):

```sh
ADMIN_USERNAME=<your-github-username> npm run start:dev
```

For example:

```sh
ADMIN_USERNAME=hackpurdue npm run start:dev
```

**Note**: The very first start takes up to 30 seconds because there is no
existing cache. After the cache is created, the next application starts will be
much faster (1-3 seconds).

### Deployment

 1. Ensure that the `heroku` remote exists (run `git remote -v` for that). If it doesn't exist, run:

    ```sh
    heroku git:remote ironhackplatform
    ```

 2. Commit all the changes and then run the following command:

    ```sh
    npm run deploy
    ```


### Forum structure

There is one forum for Purdue, and three forums for Bogota, and three forums for Platzi.

The posts and discussions from one forum are *not* visible to the users from the other forums.

```
+--------------------+-----------+-----------+
|       Purdue       |  Bogota   |   Plazi   |
+--------------------+-----------+-----------+
|         0          | 0 | 1 | 2 | 0 | 1 | 2 |
+--------------------+-----------+-----------+
|                    |   |   |   |   |   |   |
...
```

### Workflow and functionality

Being a Bloggify application, the application configuration is kept in a file: `bloggify.js`. This contains (see the inline comments):

```js
"use strict";

const conf = require("bloggify-config");

// Set the right MongoDB URI (depending on the environment).
const DB_URI = conf.isProduction
             ? "mongodb://..."
             : "mongodb://localhost/bloggify-forum"
             ;

module.exports = conf({
    // Application metadata
    "title": "IronHacks",
    "description": "",

    // The production domain
    "domain": "http://www.ironhacks.com",

    // Core plugins (which are initialized before the others)
    "corePlugins": [
        "bloggify-mongoose",
    ],

    // Application plugins
    "plugins": [
        "bloggify-sendgrid",
        "bloggify-custom-assets",
        "bloggify-github-login"
    ],

    // The application router
    "router": "bloggify-flexible-router",

    // We do not have a blog page, so we do not need a Bloggify viewer at all
    "viewer": null,

    // Plugins config in development
    "devConfig": {
        "bloggify-github-login": {
            "githubClient": "...",
            "githubSecret": "..."
        }
    },

    // Plugins configuration
    "config": {

        // Custom application assets
        "bloggify-custom-assets": {
            "styles": [
                "app/assets/stylesheets/index.css"
            ],
            "server": [
                "app/server/index.js"
            ]
        },

        // The application router
        "bloggify-flexible-router": {
            "controllers_dir": "app/controllers",
            "routes_dir": "app/routes",
            "errorPages": {
                "404": "404.ajs",
                "500": "500.ajs"
            }
        },

        // Login with GitHub
        "bloggify-github-login": {
            "githubClient": "...",
            "githubSecret": "..."
        },

        // Connect to the MongoDB database
        "bloggify-mongoose": {
            "db": DB_URI,
            "models_dir": "app/models"
        },

        // Send emails
        "bloggify-sendgrid": {
            "key": "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"
        }
    }
}, {
    // Session information
    server: {
        session: {
            storeOptions: {
                url: DB_URI
            }
        }
    }
});
```

The way how this Bloggify application is structured is explained below:

 - the `app` directory contains the application files

The application routes (urls) are:

```sh
GET         /
GET         /404
GET         /500
GET/POST    /admin
GET         /countdown
GET/POST    /logout
GET/POST    /new
POST        /posts/topicId-_slug/comments
POST        /posts/topicId-_slug/delete
GET/POST    /posts/topicId-_slug/edit
GET         /posts/topicId-_slug/
POST        /posts/topicId-_slug/toggle-vote
GET/POST    /register
GET         /scores
GET/POST    /users/_user/edit
GET         /users/_user
```

The `GET` method means that we fetch information from the server, while the `POST` means we post information to the server side.

The routes may have associated controllers which are located in the `app/controllers` directory.

#### Login / Register Process

When the user is not authenticated, the main page displays two buttons:
a login button and a <kbd>Sign up</kbd> button.

When the login button is clicked, the `/login` url is opened.
The login url redirects to the GitHub authentication workflow (OAuth2) where the user should accept access of our GitHub app in their GitHub account.


```
IronHack Platform                             GitHub.com
-----------------                             ----------
/login  ----------------------------------------> Do you want to accept access of the app?
                                            (the message won't appear if accept was already granted)
                                                    |
                                                    *------------ GitHub App: IronHack
                                                    |
                                        ___________/ \___________
                                       /                         \
                                     Yes                          No
/login-callback  <-------------------/                            |
/                <------------------------------------------------/
```

The difference between the <kbd>Sign in</kbd> and <kbd>Sign up</kbd> buttons is that for the sign in,
we assume that the user already has an account, therefore we make the redirection
to GitHub APIs and authenticate them with their GitHub account. In case they do
*not* have an account on the site, they will have to choose the hack type *after*
the GitHub authentication.

In <kbd>Sign up</kbd> case we will assume that the user doesn't have an account yet, therefore
we ask them to choose the hack type and only then the GitHub authentication is
made. Still, if an existing user clicks the <kbd>Sign up</kbd> button, they will log in
into their account anyways.

In the `controllers/register.js` file, we create a new user or authenticate an existing user.
For the first-time users, we display the selection of the hack type: Purdue, Bogota and Platzi, and then redirect to the survey.
At this moment, we start a session on the server side, but we don't write any data in the users' database yet.

After the user completes the survey, they are redirected back, and the user account is created.

To redirect the users to the survey, we send the `Location` header from the server to the client. Additional data is added in the url parameters to track the user:

 - `email`: The email of the user
 - `user_id`: The user id
 - `redirect_to`: The redirection url where they will arrive after answering the survey.

Using a JavaScript snippet in the survey page we store the email and the user id in the survey answer and we detect when the survey is done and redirect the users back to the app.

When they finish the survey, they are redirected to the main app and the account is created.

When creating a user account, we do *not* assign a `hack_id` to the user but we wait until the contest is started.
The `hack_id` is a number between `0` and `2` based on which we create multiple forums inside of the same hack type.
The range can be configured in the admin dashboard.

For Purdue, we have one forum (the `hack_id` will be always `0`) and for `Bogota` and `Platzi`, we have three forums for each (the `hack_id` can be `0`, `1` or `2`).

```
+--------------------+-------------+--------------+
|       Purdue       |   Bogota    |     Plazi    |
+--------------------+-------------+--------------+
|         0          |  0  | 1 | 2 |  0  | 1 | 2  |
+--------------------+-------------+--------------+
|                    |     |   |   |     |   |    |
...
```

If the user is already registered, they are authenticated based on the existing data.

The `hack_id` values are assigned either when the user signs up, *after* the contest started.
The default value for `hack_id` is `null`. This is changed automatically when the contest starts.

The algorithm which assigns the hack ids is designed to create groups of an equal number of users.
Specifically, the user will join in the hack id with the fewest users at that moment.

The database query is: find how many users we have in each hack id, for a given hack type.
Then, join the current user in the hack id with the fewest users.

```js
function generateGetHackId(hType, name) {
    return cb => {
        User.model.aggregate([{
            $match: {
                "profile.hack_id": { $ne: null },
                "profile.hack_type": name
            }
        }, {
            $group: {
                _id: "$profile.hack_id",
                total: { $sum: 1 }
            }
        }], (err, docs) => {
            if (err) { return cb(0); }
            const ids = Array(hType.subforums_count + 1).fill(0);
            docs.forEach(c => {
                ids[c._id] = c.total;
            });
            let minId = 0;
            let min = ids[minId];
            ids.forEach((count, index) => {
                if (count < min) {
                    minId = index;
                    min = ids[minId];
                }
            });
            cb(minId);
        });
    };
}


forEach(HACK_TYPES, (c, name) => {
    c.getHackId = generateGetHackId(c, name);
});
```

The function which assigns the hack id values to the users is in the `HackTypes` controller (`app/controllers/HackTypes.js`).

This function receives as input a hack type object and groups the user inside of the hack type.

```js
const assignHackIdsToUsers = hType => {
    const usersCursor = User.model.find({
        "profile.hack_id": null,
        "profile.hack_type": hType.name
    }).cursor();

    usersCursor.on("data", cDoc => {
        usersCursor.pause();
        hType.getHackId(uHackId => {
            User.update({
                _id: cDoc._id
            }, {
                profile: {
                    hack_id: uHackId
                }
            }, (err, data) => {
                if (err) { Bloggify.log(err); }
                usersCursor.resume();
            });
        });
    });

    usersCursor.on("error", err => {
        Bloggify.log(err);
    });

    usersCursor.on("end", cDoc => {
        Bloggify.log(`Grouped the studends from ${hType.name}.`);
    });
};
```

The function above is called when the countdown finishes, being triggered by a
scheduler:

```js
const setScheduleForHackType = name => {
    if (name.name) {
        name = name.name;
    }

    let hackTypeObj = HACK_TYPES[name];
    if (hackTypeObj.startSchedule) {
        hackTypeObj.startSchedule.cancel();
    }

    hackTypeObj.startSchedule = schedule.scheduleJob(hackTypeObj.start_date, () => {
        assignHackIdsToUsers(hackTypeObj);
    });
};
```

Or, it may be triggered when we make changes in the admin dashboard, changing the
start of the contest.

```js
if (new Date() > thisHackType.start_date) {
    if (thisHackType.startSchedule) {
        thisHackType.startSchedule.cancel();
    }
    assignHackIdsToUsers(thisHackType);
} else {
    setScheduleForHackType(thisHackType);
}
```

To catch the `save` event, we add a hook using the `addHook` method defined
by the [`bloggify-mongoose`](https://github.com/Bloggify/bloggify-mongoose) plugin.

```js
Settings.model.addHook("post", "save", update);
```

#### Posts Page

For authenticated users, we display the posts on the first page, ordered by the date, but the sticky posts are always the first ones. Only the admin users can make create sticky posts (or edit a post and make it sticky).

Here, the users from a specific forum can see and upvote the posts from the same forum. They can click on the post urls and post comments.

#### Single post pages
The single post pages are accessible by authenticated users only. They display the post title, body, votes and comments.

In case somebody comments, the comments are updated in real-time, the votes too.

When a user opens a topic page, we collect stats about that event:

 - `actor`: the user id who clicked the button
 - `topic_id`: the topic id
 - `phase`: the phase of the project
 - `created_at`: the timestamp

#### Posting a new topic

By accessing the `/new` endpoint, one can post a topic in their forum. They have to write the title and the topic content.

The topic content can be styled with Markdown specific styles (bold, italic etc).

#### The scores page

We display the scores of the users, on the `/scores` page. The users see the anonymous name of the users in the table. The displayed items in the table are shuffled each time.

When the user clicks on the <kbd>View scores</kbd> button, we collect stats:

 - `actor`: the user id who clicked the button
 - `hacker_id`: the user from the table which was clicked
 - `phase`: the phase of the project
 - `created_at`: the timestamp

Similar things happen when one clicks the Project url or the GitHub repository url. We know what was clicked and who did it.

In the scores controller (the `controllers/scores.js` file) a query to fetch the users from a certain forum is made. Then we get the active scores and urls for the current phase of the contest and create an array which is passed to the scores view.
To keep the users semi-anonymous, we change the usernames into `Hacker {1-...}`. Then the users array is shuffled.

This is the code snippet which fetches the users, modifies the usernames and shuffles the array.

```js
User.model.find({
    "profile.hack_type": user.profile.hack_type,
    "profile.hack_id": user.profile.hack_iand usls for the current phase of the contest and create an array which is passed to the scores view.
}, (err, users) => {
    if (err) { return cb(err); }
    Settings.get((err, options) => {
        if (err) { return cb(err); }
        const phase = options.settings.hack_types[user.profile.hack_type].phase;
        users = users.map((u, i) => {
            u = u.toObject();
            u.username = `Hacker ${i + 1}`;
            const phaseObj = Object(u.profile[phase]);
            return {
                _id: u._id,
                username: u.username,
                score_technical: phaseObj.score_technical,
                score_info_viz: phaseObj.score_info_viz,
                score_novelty: phaseObj.score_novelty,
                score_total: phaseObj.score_total,
                project_url: phaseObj.project_url,
                github_repo_url: phaseObj.github_repo_url
            };
        });

        shuffle(users);

        cb(null, {
            users: users,
            phase: phase
        });
    });
});
```

The `shuffle` function is a basic algorithm of shuffling the elements from a given array:

```js
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}
```

#### Admin interface

An admin can access additional functionality (such as deleting and editing any post). They have access to the dashboard (`/admin`) where they can make other users admins.
If nobody is admin (say there are no users), we can make somebody an admin (even if they don't exist in the database) by setting the `ADMIN_USERNAME` environment variable.

The `ADMIN_USERNAME` environment variable represents the GitHub username of the user which should be an admin. When they are going to log in, they will be authenticated as admin.

In the admin interface, the admin can:

 1. Change the Phase.
 2. Download the CSV stats.
 3. Set the start dates for each hack type.
 4. See all the users and update the scores for each and eventually make them admins.

In case another user is made admin, they should log out (if they are authenticated) and log in back.


#### Application structure

In the `routes` folder, we have the page templates which are linked to the controllers from the `controllers` folder.

```
routes/
├── 404.ajs
├── 500.ajs
├── admin.ajs
├── countdown.ajs
├── index.ajs
├── logout.ajs
├── new.ajs
├── posts
│   ├── _topicId-_slug
│   │   ├── comments.ajs
│   │   ├── delete.ajs
│   │   ├── edit.ajs
│   │   ├── index.ajs
│   │   └── toggle-vote.ajs
│   └── index.ajs
├── register.ajs
├── scores.ajs
└── users
    └── _user
        ├── edit.ajs
        └── index.ajs
```

The `_` character marks a dynamic route (such as a topic id/slug, or user).

#### Modules

In this application we use the following main modules:

##### Database Connection
To connect with the database the [`bloggify-mongoose`](http://npmjs.com/bloggify-mongoose) module was used. The models we interact with are:

###### `User`
Stores the users in the `users` collection.

```js
{
    "username": "string",
    "email": "string",
    "password": "string",
    "profile": "object",
    "role": "string"
}
```

###### `Topic`
Stores the topics in the `topics` collection.

```js
{
    "author": "string",
    "title": "string",
    "slug": "string",
    "body": "string",
    "created_at": "date",
    "votes": ["string"],
    "sticky": "boolean",
    "metadata": "object"
}
```

###### `Comment`
Stores the comments in the `comments` collection.

```js
{
    "author": "string",
    "body": "string",
    "created_at": "date",
    "topic": "string",
    "votes": ["string"]
}
```

###### `Stats`
Used to store the stats we collect.

```js
{
    "actor": "string",
    "metadata": "object",
    "event": "string",
    "created_at": "date",
}
```

We collect stats when the user:

 - clicks the <kbd>View scores</kbd> button
 - opens a topic page

The stats are collected by making HTTP requests to the server, using the
`fetch` technology (it's a new browser API, similar to `XHRHttpRequest`).

The code snippets that take care of this is located in `app/assets/javascripts/util/index.js`:

```js
...
    /**
     * post
     * Posts the data to the server.
     *
     * @name post
     * @function
     * @param {String} url The endpoint url.
     * @param {Object} data The post data.
     * @returns {Promise} The `fetch` promise.
     */
  , post (url, data) {
        data._csrf = data._csrf || _pageData.csrfToken;
        return fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "same-origin",
            body: JSON.stringify(data)
        });
    }

    /**
     * getJSON
     * Fetches from the server JSON data.
     *
     * @name getJSON
     * @function
     * @param {String} url The endpoint url.
     * @returns {Promise} The `fetch` promise.
     */
  , getJSON (url) {
        return fetch(url, {
            credentials: "same-origin"
        }).then(c => c.json())
    }
...
```

That's the low-level side of sending/receiving any data to/from the server using
`fetch`. Note: some browsers don't have the `fetch` technology, therefore we use
a [polyfill created by GitHub](https://github.com/github/fetch) to ensure the function is there.

We collect three types of stats:

 1. `view-topic`

    Emitted when the user opens a topic.

    Metadata:

     - `topic_id`: The topic id.
     - `topic_author`: The user id of the topic author.

    Code snippet:

    ```js
    util.post("/api/stats", {
        event: "view-topic",
        metadata: {
            topic_id: topic._id,
            topic_author: topic.author._id
        }
    });
    ```

 2. `score-click`

    Emitted when the user clicks the <kbd>View scores</kbd> button.

    Metadata:

      - `hacker_id`: The user that *was clicked*.

    Code snippet:

    ```js
    util.post("/api/stats", {
        event: "score-click",
        metadata: {
            hacker_id: this.props.hacker._id
        }
    });
    ```

 3. Clicks on the urls.

    The following events are emitted:

     - `click-project-url`: When clicking the project url.
     - `click-github-repo-url`: When clicking the GitHub repository url.

    Metadata:

     - `hacker_id`: The hacker id from the table.
     - `url`: The clicked url.

    Code snippet:

    ```js
    util.post("/api/stats", {
        event: e.target.dataset.event,
        metadata: {
            hacker_id: this.props.hacker._id,
            url: e.target.href
        }
    });
    ```

**The stats functionality on the server**:

On the server, we create a custom endpoint at `/api/stats` which expects `POST`
data. We do not collect any stats from unauthenticated users.

Along with the metadata we receive from the client side (see above) we add in the
stat object the following information:

 - `actor`: The current authenticated user id.
 - `event`: The event name.
 - `user_agent`: The user agent: this contains device and browser information.
 - `phase`: The phase of the contest.

The `actor` is the authenticated user id, and it will always be appended in the
event object because we know there is an authenticated user.

After we build the stats object, we call the `Stats.record` which will record
the event in the database. The `record` method is not anything more than just
a create query, after appending the `created_at` field in the event object.

```js
Bloggify.server.addPage("/api/stats", "post", lien => {
    const user = Session.getUser(lien);

    if (!user) {
        return lien.next();
    }

    const ev = {
        actor: user._id,
        event: lien.data.event,
        metadata: lien.data.metadata || {}
    };

    ev.metadata.user_agent = lien.header("user-agent");

    Settings.get((err, settings) => {
        if (settings) {
            ev.metadata.phase = settings.settings.hack_types[user.profile.hack_type].phase;
        }
        Stats.record(ev, (err, data) => {
            if (err) {
                return lien.apiError(err);
            }
            lien.apiMsg("success");
        });
    });
});
```

###### `Settings`
This contains the app settings which are editable by the admins.

```js
{
    "settings": "object"
}
```

##### GitHub Login

We used [`bloggify-github-login`](https://www.npmjs.com/package/bloggify-github-login) to handle the GitHub authentication.

By providing the GitHub application credentials, this module handles the OAuth2 workflow.

```js
{
    "githubClient": "45...7",
    "githubSecret": "1f...2"
}
```

##### Email Notifications

To send emails, we use [`bloggify-sendgrid`](https://www.npmjs.com/package/bloggify-sendgrid).

```js
{
    "key": "SG.SmlHGA...ylY"
}
```

The `notifications.js` file takes care of sending the emails using this module. We send emails when:

 1. Somebody creates a new topic

    Emails are sent to all the users from the forum the author belongs to, except to the author.

 2. Somebody posts a comment

    Emails are sent to previous people involved in the conversation.
