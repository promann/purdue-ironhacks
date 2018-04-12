This document contains technical details about how the Purdue Ironhacks platform works.

### Dependencies

The app is powered by [Bloggify](https://bloggify.org)—a modular and flexible platform for building modular applications. Since Bloggify is a Node.js platform, you have to install Node.js on your machine. The data is stored in a MongoDB database.

### Installation

To run this application, you will have to have Node.js and MongoDB installed on your machine.

 - [Node.js](https://nodejs.org/en/)
 - [MongoDB](https://www.mongodb.com/download-center?jmp=nav#community)

Then you can proceed to the next steps:

 1. Clone the repo either from GitHub or Heroku:

  ```sh
  git clone https://github.com/HackPurdue/purdue-ironhacks.git
  ```

  or Heroku (this is not recommended, but it will still work as long you have access to the project):

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
  cd purdue-ironhacks
  ```

 3. Install the dependencies:

  ```sh
  npm install
  ```

Start MongoDB:

```sh
mongod
# or
sudo mongod
```


#### Set up the enviroment

Before starting the app, you will have to create a file named `.env`, containing:

```env
# GitHub Keys
GITHUB_CLIENT=...
GITHUB_SECRET=...
GITHUB_ADMIN_TOKEN=a09...b76c99

# Where will the GitHub projects be created
GITHUB_PROJECTS_ORGANIZATION=goldironhack

# Sendgrid Keys
SENDGRID_KEY=SG.qzv8HNb...mqpcHD8

# Database
DB_URI=mongodb://localhost/purdue_ironhacks

# Amazon S3 Keys
S3_BUCKET=purdue-ironhacks-projects
S3_ACCESS_KEY_ID=AK...ZUA
S3_ACCESS_SECRET=Bvo...R63G

# Domain
DOMAIN=http://localhost:8080

# This is used for creating encrypted urls
# for seeing the projects
CRYPTO_PASSWORD=some_secret_you_want

# Make yourself an admin
ADMIN_USERNAME=your_username
```

You can get the GitHub keys after creating a GitHub application. Do not share these with anyone.

#### Starting the application

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

When deployed to Heroku, the application url is `https://<app-name>.herokuapp.com` (unless it's using a custom domain).
**Note:** When using a free dyno, it's working fine, but with some limitations:

 - it's slower
 - it's going to sleep if it's innactive for a certain period of time.
 - it has bandwidth limits, but pretty liberal

The app configuration is stored in the `bloggify.js` file.

 1. Make sure that the `heroku` remote exists (run `git remote -v` for that). If it doesn't exist, run:

    ```sh
    heroku git:remote ironhackplatform
    ```

 2. Commit all the changes and then run the following command:

    ```sh
    npm run deploy
    ```


### Forum structure

There is one forum for Purdue, and three forums for Bogota, and three forums for
Platzi. In each hack type we can extend the number of forums from the admin
interface.

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

Being a Bloggify application, the application configuration is kept in a file: `bloggify.js`.:

```js
"use strict";

// Set the right MongoDB URI (depending on the environment).
const DB_URI = process.env.DB_URI
if (!DB_URI) {
    Bloggify.log(new Error(">>>> Please provide the MongoDB URI. Set the DB_URI environment variable."));
}

module.exports = {
    title: "IronHacks",
    description: "Hack for inovation and join the open data movement.",
    domain: process.env.DOMAIN || "http://www.ironhacks.com",
    core_plugins: [
        ["github-login", {
            githubClient: process.env.GITHUB_CLIENT,
            githubSecret: process.env.GITHUB_SECRET,
        }]
    ],
    plugins: [
        ["sendgrid", {
            key: process.env.SENDGRID_KEY
        }]
    ],
    styles: [ "app/assets/stylesheets/index.css" ],
    bundles: {
        publicHomepage: {
            scripts: [ "app/assets/javascripts/homepage/index.js" ],
            styles: [ "app/assets/stylesheets/homepage/index.css" ]
        },
        editor: {
            styles: [ "app/assets/stylesheets/editor/index.css" ]
        },
        auth: {
            scripts: [ "app/assets/javascripts/private-router.js" ],
            styles: [ "app/assets/stylesheets/auth.css" ]
        },
        notAuth: {
            scripts: [ "app/assets/javascripts/public-router.js" ]
        },
        main: {
            scripts: [ "app/assets/javascripts/common-router.js" ]
        }
    }
};
```

The way how this Bloggify application is structured is explained below.

The `app` directory contains the application files

The application routes (urls) are:

```sh
GET         /
GET         /404
GET         /422
GET         /500
GET/POST    /admin
GET         /admin/csv/export-users
GET         /admin/csv/scores
GET         /admin/csv/topics
GET         /countdown
GET/POST    /logout
GET/POST    /new
GET/POST    /register
GET         /login
GET         /scores
GET         /search
GET         /quizzes
GET         /posts
GET         /timeline
GET         /task
GET/POST    /posts/:topicId-:slug/
POST        /posts/:topicId-:slug/comments
POST        /posts/:topicId-:slug/delete
GET/POST    /posts/:topicId-:slug/edit
POST        /posts/:topicId-:slug/toggle-vote
GET/POST    /users/:user/edit
GET         /users/:user
GET/POST    /users/:user/edit
GET         /users/:user/projects
GET         /users/:user/projects/:projectName
GET/POST    /users/:user/projects/:projectName/delete
GET/POST    /users/:user/projects/:projectName/edit
GET         /users/:user/projects/:projectName/preview
GET/POST    /users/:user/projects/:projectName/new
GET         /users/:user/projects/:projectName/preview/:filepath*
GET         /preview/:user/:projectName/:filepath*
```

The `GET` method means that we fetch information from the server, while the `POST` means we post information to the server side.

The routes may have associated controllers which are located in the `app/controllers` directory.

#### Qualtrics integration

All the quizzes created on the Qualtrics platform have a snippet of JavaScript which stores the user data in the response (as known as *Embedded data*).

We store the `user_email` and the `user_id` which are sent in the url.


The code in the Qualtrics quizzes is set in the last block, last question (which may happen to be an empty question, used for tracking):

```js
function getParameterByName(name, url) {
    if (!url) {
      url = window.location.href;
    }
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

var redirectUrl = getParameterByName("redirect_to");
var userEmail = getParameterByName("user_email");
var userId = getParameterByName("user_id");
if (userEmail) {
   Qualtrics.SurveyEngine.setEmbeddedData("email", userEmail);
}
if (userId) {
   Qualtrics.SurveyEngine.setEmbeddedData("user_id", userId);
}
if (redirectUrl) {
	var interval = setInterval(function () {
		if (Qualtrics.SurveyEngine.Page.isEndOfSurvey()) {
			window.location = decodeURIComponent(redirectUrl);
			clearInterval(interval);
		}
	}, 100);
}
```

This approach is being used for all the quizzes: the sign up survey and the other technical quizzes.

```
Surveys:                    -------> Qualtrics
     d3.js                                  | email, user_id
     HTML & CSS                             | And after the survey we redirect back
     JavaScript and jQuery                  |
        ^                                   |
        +-----------------------------------+
            Save in db
            (that the user took the survey)
```

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

This is the authentication workflow:

![](http://i.imgur.com/b0RRhc6.png)

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

The `hack_id` values are assigned either when the user signs up (if the contest is already started) or when the contest starts.
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

This function receives as input a hack type object and groups the users inside of the hack type.

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

#### Quizzes

The quizzes page displays the quizzes that can be taken by the user. The user may answer the same quiz multiple times.

In the view file (`app/routes/quizzes.ajs`) we have the part which renders the links to each quiz:

```erb
<% include("../views/header", { title: "Quizzes" }) %>
<% include("../views/container/start") %>
<h1>Quizzes</h1>

<% quizzes.forEach(function (quiz) { %>
    <a class="btn" href="<%= quiz.url %>"><%= quiz.label %></a>
<% }); %>

<% include("../views/container/end") %>
<% include("../views/footer") %>
```

The data associated with this view is storred in the controller (`app/controllers/quizzes.js`)–see below. The user can click the generated link which contains information about the user (the email address and the user id)–which are storred in the Qualtrics quiz responses as embedded data, and also the redirect url.
When the user finishes the quiz, they are redirected back the application, on the `/quizzes` page and the application marks the quiz complete internally. Even the quiz was completed, the user can take it again.

```js
const Bloggify = require("bloggify")
    , Session = require("./Session")
    , User = require("./User")
    , findValue = require("find-value")
    ;

// Define the quizzes list
const quizzes = [
    ["d3.js", "https://purdue.qualtrics.com/jfe/form/SV_71xEzp5vQ7rC817", "d3"]
  , ["HTML & CSS", "https://purdue.qualtrics.com/jfe/form/SV_do6Sc9VJsAMmOih", "html_css"]
  , ["JavaScript & jQuery", "https://purdue.qualtrics.com/jfe/form/SV_b8zyxX8wozQfNul", "javascript_jquery"]
];

// Map the quizzes labels to the data
const validQuizzes = {};
quizzes.forEach(c => {
    validQuizzes[c[2]] = c;
});

module.exports = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) { return lien.redirect("/"); }

    // Set the quiz complete
    const completed = lien.query.markComplete;
    if (completed && validQuizzes[completed]) {
        return User.update({
            _id: user._id
        }, {
            profile: {
                surveys: {
                    [completed]: {
                        ended_at: new Date()
                    }
                }
            }
        }, (err, _user) => {
            lien.redirect("/quizzes");
        })
    }

    // Generate the redirect links
    const completedSurveys = findValue(user, "profile.surveys") || {};
    const userQuizzes = quizzes.map(c => {
        const redirectTo =  encodeURIComponent(`${Bloggify.options.metadata.domain}/quizzes?markComplete=${c[2]}`);
        return {
            label: c[0]
          , url: `${c[1]}?redirect_to=${redirectTo}&user_email=${user.email}&user_id=${user._id}`
          , is_complete: !!completedSurveys[c[2]]
        };
    });

    // Send the quizzes array to the view
    cb(null, {
        quizzes: userQuizzes
    });
};
```


#### Search

On the search page (`/search`) we can search for content which appears either in the post data or in the comments.

The view associated with this page is storred in the `app/routes/search.ajs` and it looks like this:

```erb
<% include("../views/header", { title: "Search" }) %>
<% include("../views/container/start") %>
<h1>Search</h1>
<div class="search-form-wrapper">
    <% include("../views/search-form") %>
</div>
<% if (f("results")) { %>
    <p class="search-results-text">Search results for <em>‘<%= lien.query.search %>’</em></p>
    <div class="search-results">
        <% if (results.length) { %>
            <% results.forEach(function (cResult) { %>
                <div class="seach-result-item">
                    <h2>
                        <a href="<%= cResult.url %>">
                            <%= cResult.title %>
                        </a>
                    </h2>
                </div>
            <% }) %>
        <% } else { %>
            <div class="no-search-results">
                There are no results. Maybe try a different query.
            </div>
        <% } %>
    </div>
<% } %>
<% include("../views/container/end") %>
<% include("../views/footer") %>
```

This file requires the `search-form` which appears in the `app/views/search-form.ajs` file, representing the search form itself:

```erb
<form>
    <input type="text" name="search" value="<%= lien.query.search || "" %>" placeholder="Search for something..." />
</form>
```

When the user submits the query, the `?search=<query>` querystring parameter is added in the url, triggering the search functionality in the controller (located in `app/controllers/search.js`). To increase the search results accuracy we used the internal MongoDB text search indexes like this: we created text indexes for the topic title and content and comment content, using the `text: true` in the model configuration:

**`app/models/Topic.js`**:

```js
module.exports = {
    ...
    title: {
        type: String,
        text: true
    },
    ...
    body: {
        type: String,
        text: true
    },
    ...
};
```

**`app/models/Comment.js`**:

```js
module.exports = {
    ...
    body: {
        type: String,
        text: true
    },
    ...
};
```

**Note**: The admin users will see the search results from all the forums, while the simple users will see the search results from the forum they belong to.

The controller which takes care of searching looks like this:

```js
const Session = require("./Session")
    , Topic = require("./Topic")
    , Comment = require("./Comment")
    ;

module.exports = (lien, cb) => {

    const user = Session.getUser(lien);
    if (!user) {
        return lien.redirect("/");
    }

    const isAdmin = Session.isAdmin(user);

    // Perform the search query
    if (lien.query.search) {

        // Use the $text index to search
        const filters = {
            $text: {
                $search: lien.query.search
            }
        };
        let results = {};

        // Search in the topics and comments
        Promise.all([
            Topic.model.find(filters)
          , Comment.model.find(filters)
        ]).then(data => {
            results.topics = data[0];
            results.comments = data[1].map(c => c.toObject());
            return Promise.all(results.comments.map(cComment => {
                return Topic.model.findOne({ _id: cComment.topic });
            }));
        }).then(topics => {
            let uniqueTopics = {};
            results.topics.concat(topics).forEach(c => {
                if (!c) { return; }

                // Let the admin see all the posts/comments in all the forums
                if (!isAdmin) {
                    if (c.metadata.hack_type !== user.profile.hack_type ||
                        c.metadata.hack_id !== user.profile.hack_id) {
                        return;
                    }
                }
                uniqueTopics[c._id] = c;
                c.url = Topic.getUrl(c);
            });

            cb(null, { results: Object.keys(uniqueTopics).map(k => uniqueTopics[k]) });
        }).catch(e => {
            cb(e);
        });
    } else {
        cb();
    }
};
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

If in the admin interface the scores are not provided, the scores collumns will not appear in the scores. In a similar way it happens for the urls: if we don't enter the urls, the urls collumns will not appear in the scores page.

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

An admin can access additional functionality (such as deleting and editing any post).
They have access to the dashboard (`/admin`) where they can make other users admins.
If nobody is admin (say there are no users), we can make somebody an admin (even if
they don't exist *yet* in the database) by assiging the GitHub username of an eventual
user to the environment variable called `ADMIN_USERNAME`.

The `ADMIN_USERNAME` environment variable represents the GitHub username of the user
which should be an admin (this user cannot be a simple user anymore, nobody being
able to remove the admin rights from them). When they are going to log in,
they will be authenticated as admin.

To set the `ADMIN_USERNAME` variable, there are multiple ways, but the easiest ones are:

 - If the application runs in a Heroku environment, the variable can be set from the
   browser interface: `https://dashboard.heroku.com/apps/<app-name>/settings`, by
   clicking the `Reveal Config Vars` button or in the command line using:

    ```sh
    heroku config:set ADMIN_USERNAME=hackpurdue
    ```

    Note: after setting an enviroment variable on Heroku (either from the
    command line) or from the browser interface, the application will be
    restarted automatically.

 - When running locally, the environment variable can be set when starting the app:

    ```sh
    ADMIN_USERNAME=hackpurdue npm run start:dev
    ```

In the admin interface, the admin can:

 1. Change the Phase.
 2. Download the CSV stats.
 3. Set the start dates for each hack type.
 4. See all the users and update the scores for each and eventually make them admins.

In case another user is made admin, they should log out (if they are authenticated) and log in back.

###### Custom database Filters for admin

For simple users, the database queries include the `author`, being the current authenticated user.
When the user has admin permissions, we do not append anymore the `author` the queries, therefore making the queries more liberal, giving more power to the admin.

For instance, when deleting a post, the user will create the following query:

*delete the post with `_id`=... and `author=...`*

Therefore, if the user tries to delete another post, having the id, that post will not be found because it is not created by the authenticated user.

Tho, if the user is an admin, the query is simpler, lacking the `author` field (we want to give them the power to delete any post):


*delete the post with `_id=...` *


This is happening in the `app/controllers/posts/_topicId-_slug/delete.js` controller:

```js
const Topic = require("../../Topic")
    , Session = require("../../Session")
    ;

exports.post = (lien, cb) => {
    const user = Session.getUser(lien);
    if (!user) {
        return lien.next();
    }

    const filters = {
        _id: lien.params.topicId
    };

    if (!Session.isAdmin(user)) {
         filters.author = user._id;
    }

    Topic.remove(filters, (err, count) => {
        if (err) { return lien.apiError(err); }
        lien.redirect("/");
    })
};
```

#### Application structure

In the `routes` folder, we have the page templates which are linked to the controllers from the `controllers` folder.

```
app/routes/
├── 404.ajs
├── 422.ajs
├── 500.ajs
├── _.ajs
├── _.js
├── admin
│   ├── _.ajs
│   ├── _.js
│   └── csv
│       ├── _.js
│       ├── export-users
│       │   └── _.js
│       ├── scores
│       │   └── _.js
│       └── topics
│           └── _.js
├── logout
│   ├── _.ajs
│   └── _.js
├── new
│   ├── _.ajs
│   └── _.js
├── posts
│   ├── _.ajs
│   └── _topicId-_slug
│       ├── _.ajs
│       ├── _.js
│       ├── comments
│       │   ├── _.ajs
│       │   └── _.js
│       ├── delete
│       │   └── _.js
│       ├── edit
│       │   ├── _.ajs
│       │   └── _.js
│       └── toggle-vote
│           └── _.js
├── preview
│   └── _user
│       └── _projectName
│           └── _filepath*
│               └── _.js
├── quizzes
│   ├── _.ajs
│   └── _.js
├── register
│   ├── _.ajs
│   └── _.js
├── scores
│   ├── _.ajs
│   └── _.js
├── search
│   ├── _.ajs
│   └── _.js
├── task
│   ├── _.ajs
│   └── _.js
├── timeline
│   ├── _.ajs
│   └── _.js
├── users
│   └── _user
│       ├── _.ajs
│       ├── _.js
│       ├── edit
│       │   ├── _.ajs
│       │   └── _.js
│       └── projects
│           ├── _.ajs
│           ├── _.js
│           ├── _projectName
│           │   ├── _.ajs
│           │   ├── _.js
│           │   ├── delete
│           │   │   ├── _.ajs
│           │   │   └── _.js
│           │   ├── edit
│           │   │   ├── _.ajs
│           │   │   └── _.js
│           │   └── preview
│           │       ├── _.ajs
│           │       └── _filepath*
│           │           └── _.js
│           └── new
│               ├── _.ajs
│               └── _.js
└── view-project
    └── _projectHash
        ├── _.ajs
        └── _.js
```

The `_` character marks a dynamic route (such as a topic id/slug, or user). The `.js` files are the controlers.

#### Modules

In this application we use the following main modules:

##### Database Connection
To connect with the database the [`bloggify-mongoose`](https://github.com/Bloggify/bloggify-mongoose) module was used.
The database models are stored in the `app/models` directory:

```
models/
├── Comment.js
├── Settings.js
├── Stats.js
├── Topic.js
└── User.js
```

To see the raw database collections and documents, we can connect directly using the MongoDB CLI:

```sh
mongo ....mlab.com:63758/heroku_... -u <dbuser> -p <dbpassword>
```

or we can see that in the browser:

 1. Open the application *Overview*  page `https://dashboard.heroku.com/apps/ironhackplatform`
 2. Clik the `mLab MongoDB`. This will redirect to an url like this:

    ```
    https://www.mlab.com/databases/heroku_...
    ```
 3. On this page, we can see the collections and eventually the documents and edit them.

The models we interact with are:

###### `Comment`
Stores the comments in the `comments` collection.

```js
module.exports = {
    author: "string",
    body: {
        type: String,
        text: true
    },
    created_at: "date",
    topic: "string",
    votes: ["string"]
};
```

###### `Settings`

Stores the application settings.

```sh
module.exports = {
    settings: "object"
};
```

###### `Stats`
Used to store the stats we collect.

```js
module.exports = {
    actor: "string",
    metadata: "object",
    event: "string",
    created_at: "date"
};
```

In this collection we save the user events. See below what stats we collect.

###### `Topic`
Stores the topics in the `topics` collection.

```js
module.exports = {
    author: "string",
    title: {
        type: String,
        text: true
    },
    slug: "string",
    body: {
        type: String,
        text: true
    },
    created_at: "date",
    votes: ["string"],
    sticky: "boolean",
    metadata: "object"
};
```


###### `User`
Stores the users in the `users` collection.

```js
module.exports = {
    username: "string",
    email: "string",
    password: "string",
    profile: "object",
    role: "string"
};
```


##### What stats we collect

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

##### GitHub Login

We used [`bloggify-github-login`](https://github.com/Bloggify/github-login) to handle the GitHub authentication.

By providing the GitHub application credentials, this module handles the OAuth2 workflow.

```js
{
    "githubClient": "45...7",
    "githubSecret": "1f...2"
}
```

##### Email Notifications

To send emails, we use [`bloggify-sendgrid`](https://github.com/Bloggify/bloggify-sendgrid).

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
