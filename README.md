# IronHack Platform
The IronHack Platform built on Bloggify.

### About

App url: http://ironhackplatform.herokuapp.com/

It's using a free dyno, therefore it's slower and it goes to


App url: http://ironhackplatform.herokuapp.com/

It's using a free dyno, therefore it's slower and it goes to


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
      excdeeding it).

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

There is one forum for Purdue, and three forums for Bogota, and three forums for Plazi.

The posts and discussions from one forum are *not* visible by the users from the other forums.

```
+--------------------+-------------+--------------+
|       Purdue       |   Bogota    |     Plazi    |
+--------------------+-------------+--------------+
|         0          |  0  | 1 | 2 |  0  | 1 | 2  |
+--------------------+-------------+--------------+
|                    |     |   |   |     |   |    |
...
```

### Workflow and functionality

#### Login / Register Process

The main page displays a login button when the user is not authenticated. When this button is clicked, the `/login` url is opened.
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

In the `controllers/register.js` file, we create a new user or authenticate an existing user.
For the first-time users, we display the selection of the University: Purdue, Bogota and Platzi, and then redirect to the survey.
At this moment, we start a session on the server side, but we don't write any data in the users database yet.

After the the user completes the survey, they are redirected back, and the user account is created.

To redirect the users to the survey, we send the `Location` header from the server to the client. Additional data is added in the url parameters to track the user:

 - `email`: The email of the user
 - `user_id`: The user id
 - `redirect_to`: The redirection url where they will arrive after answering the survey.

Using a JavaScript snippet in the survey page we store the email and the user id in the survey answer and we detect when the survey is done and redirect the users back to the app.

When they finish the survey, they are redirect to the main app and the account is created.

When creating a user account, we assign a `hack_id` to the user. The `hack_id` is a number between `0` and `2` based on which we create multiple forums inside of the same university.

For Purdue, we have one forume (the `hack_id` will be always `0`) and for `Bogota` and `Platzi` we have three forums for each (the `hack_id` can be `0`, `1` or `2`).

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

#### Posts Page

For authenticated users, we display the posts on the first page, ordered by the date, but the sticky posts are always the first ones.

Here, the users from a specific forum can see and upvote the posts from the same forum. They can click on the post urls and post comments.

#### Single post pages
The single post pages are accessible by authenticated users only. They display the post title, body, votes and comments.

In case somebody comments, the comments are updated in real-time, the votes too.

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

#### Admin interface

An admin can access additional functionality (such as deleting and editing any post). They have access in the dashboard (`/admin`) where they can make other users admins.
If nobody is admin (say there are no users), we can make somebody an admin (even if they don't exist in the database) by setting the `ADMIN_USERNAME` environment variable.

The `ADMIN_USERNAME` environment variable represents the GitHub username of the user which should be admin. When they are going to log in, they will be authenticated as admin.

In the admin interface, the admin can:

 1. Change the Phase.
 2. Download the CSV stats.
 3. Set the start dates for each university.
 4. See all the users and update the scores for each and eventually make them admins.

In case another user is made admin, they should log out (if they are authenticated) and log in back.

### How was this built?

The main thing which powers the entire application is [Bloggify](https://bloggify.org). This is a Node.js powered platform to build modular applications. The app configuration is stored in the `bloggify.js` file.


#### Application structure

In the `routes` folder we have the page templates which are linked to the controllers from the `controllers` folder.

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
│   ├── _topicId-_slug
│   │   ├── comments.ajs
│   │   ├── delete.ajs
│   │   ├── edit.ajs
│   │   ├── index.ajs
│   │   └── toggle-vote.ajs
│   └── index.ajs
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
