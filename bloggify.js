"use strict";

const conf = require("bloggify-config");

// Set the right MongoDB URI (depending on the environment).
const DB_URI = conf.isProduction
             ? "mongodb://bloggify:JwRsdG28yZUCVLRBU3IHfGGKlfXyhci3rVo1K0z4h4xjZ1Zf1eC3ZCXiItyMRM8i@ds163758.mlab.com:63758/heroku_l6lb4k6w"
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
            "githubClient": "c26d485f95fb06c9002d",
            "githubSecret": "22cb7e7b89a41b2e65338e4382909a504aa0ca0d"
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
            "error_pages": {
                "404": "404.ajs",
                "500": "500.ajs",
                "bad_csrf": "422.ajs"
            }
        },

        // Login with GitHub
        "bloggify-github-login": {
            "githubClient": "45168d125a3ba1f26fe7",
            "githubSecret": "1f4b54ed8fd52dacd84daa8a8a5e81129e858d62"
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
