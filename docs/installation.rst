############
Installation
############

To run this application, you will have to have Node.js and MongoDB
installed on your machine.

-  `Node.js <https://nodejs.org/en/>`__
-  `MongoDB <https://www.mongodb.com/download-center?jmp=nav#community>`__

Then you can proceed to the next steps:

1. Clone the repo either from GitHub or Heroku:

``sh   git clone https://github.com/HackPurdue/purdue-ironhacks.git``

or Heroku (this is not recommended, but it will still work as long you
have access to the project):

``sh   git clone https://git.heroku.com/ironhackplatform.git courseswebpage``

**Note**: This is not recommended because the code pushed to Heroku is a
little bit different than the version we push to GitHub. When deploying
the app on Heroku, we bundle the files **before** pushing them,
therefore the Heroku version will store the production bundles, while
the GitHub version doesn't store any bundles at all.

There are two reasons why we bundle the files before deployment:

1. Heroku is going to complain if we do it on their servers because it's
   a very resource-consuming process (it's using RAM memory, eventually
   exceeding it).

   Doing it on our machines is much better because we have enough RAM.

2. The boot time of the app will be much faster (because no bundles have
   to be generated on Heroku).

3. Open the folder:

``sh   cd purdue-ironhacks``

3. Install the dependencies:

``sh   npm install``

Start MongoDB:

.. code:: sh

    mongod
    # or
    sudo mongod

Set up the enviroment
^^^^^^^^^^^^^^^^^^^^^

Before starting the app, you will have to create a file named ``.env``,
containing:

.. code:: env

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

You can get the GitHub keys after creating a GitHub application. Do not
share these with anyone.

Starting the application
^^^^^^^^^^^^^^^^^^^^^^^^

Start the app in dev mode:

.. code:: sh

    npm run start:dev

Make yourself an admin, by passing YOUR GitHub username (the username of
the account you use to sign in for the first time):

.. code:: sh

    ADMIN_USERNAME=<your-github-username> npm run start:dev

For example:

.. code:: sh

    ADMIN_USERNAME=hackpurdue npm run start:dev

**Note**: The very first start takes up to 30 seconds because there is
no existing cache. After the cache is created, the next application
starts will be much faster (1-3 seconds).

