# IronHack Platform
The IronHack Platform built on Bloggify.

### Deployment

```sh
git push heroku master
```

App url: http://ironhackplatform.herokuapp.com/

It's using a free dyno, therefore it's slower and it goes to


### Installation


 1. Clone the repo either from GitHub or Heroku:

  ```sh
  git clone https://github.com/hackpurdue/courseswebpage.git
  ```

  or Heroku:

  ```sh
  git clone https://git.heroku.com/ironhackplatform.git courseswebpage
  ```

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
