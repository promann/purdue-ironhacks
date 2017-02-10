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
