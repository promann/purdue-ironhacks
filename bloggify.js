"use strict";

const conf = require("bloggify-config");

// Set the right MongoDB URI (depending on the environment).
const DB_URI = process.env.MONGODB_URI
if (!DB_URI) {
    console.error(">>>> Please provide the MongoDB URI. Set the MONGODB_URI environment variable.");
}

module.exports = conf({
    // Application metadata
    title: "IronHacks"
  , description: "Hack for inovation and join the open data movement.",

    // The production domain
  , domain: "http://www.ironhacks.com"

    // Core plugins (which are initialized before the others)
  , corePlugins: [
        "bloggify-mongoose"
    ]

    // Application plugins
  , plugins: [
        "bloggify-sendgrid"
      , "bloggify-custom-assets"
      , "bloggify-github-login"
    ]

    // The application router
  , router: "bloggify-flexible-router"

    // We do not have a blog page, so we do not need a Bloggify viewer at all
  , viewer: null

    // Plugins configuration
  , config: {

        // Custom application assets
        "bloggify-custom-assets": {
            styles: [
                "app/assets/stylesheets/index.css"
            ]
          , server: [
                "app/server/index.js"
            ]
        }

        // The application router
      , "bloggify-flexible-router": {
            controllers_dir: "app/controllers"
          , routes_dir: "app/routes"
          , error_pages: {
                404: "404.ajs"
              , 500: "500.ajs"
              , bad_csrf: "422.ajs"
            }
        }

        // Login with GitHub
      , "bloggify-github-login": {
            githubClient: process.env.GITHUB_CLIENT
          , githubSecret: process.env.GITHUB_SECRET
        }

        // Connect to the MongoDB database
      , "bloggify-mongoose": {
            db: DB_URI
          , models_dir: "app/models"
        }

        // Send emails
      , "bloggify-sendgrid": {
            key: process.env.SENDGRID_KEY
        }
    }
}, {
    cms_methods: false
  , server: {
        session: {
            storeOptions: {
                url: DB_URI
            }
        }
    }
});
