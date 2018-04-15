##########
Deployment
##########

When deployed to Heroku, the application url is
``https://<app-name>.herokuapp.com`` (unless it's using a custom
domain). **Note:** When using a free dyno, it's working fine, but with
some limitations:

-  it's slower
-  it's going to sleep if it's innactive for a certain period of time.
-  it has bandwidth limits, but pretty liberal

The app configuration is stored in the ``bloggify.js`` file.

1. Make sure that the ``heroku`` remote exists (run ``git remote -v``
   for that). If it doesn't exist, run:

   .. code:: sh

       heroku git:remote ironhackplatform

2. Commit all the changes and then run the following command:

   .. code:: sh

       npm run deploy
