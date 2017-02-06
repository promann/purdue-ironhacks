"use strict";

const conf = require("bloggify-config");
const DB_URI = conf.isProduction ? "mongodb://bloggify:keh69T3d1QGlu=M@ds129179.mlab.com:29179/heroku_4h3bmd1g" :  "mongodb://localhost/bloggify-forum";

module.exports = conf({
    "title": "IronHack",
    "description": "",
    "domain": "http://ironhackplatform.herokuapp.com",
    "corePlugins": [
        "bloggify-mongoose",
    ],
    "plugins": [
        "bloggify-sendgrid",
        "bloggify-custom-assets",
        "bloggify-github-login"
    ],
    "router": "bloggify-flexible-router",
    "viewer": null,
    "devConfig": {
        "bloggify-github-login": {
            "githubClient": "c26d485f95fb06c9002d",
            "githubSecret": "22cb7e7b89a41b2e65338e4382909a504aa0ca0d"
        }
    },
    "config": {
        "bloggify-custom-assets": {
            "styles": [
                "src/css/index.css"
            ],
            "server": [
                "server/index.js"
            ]
        },
        "bloggify-flexible-router": {
            "errorPages": {
                "404": "404.ajs",
                "500": "500.ajs"
            }
        },
        "bloggify-github-login": {
            "githubClient": "45168d125a3ba1f26fe7",
            "githubSecret": "1f4b54ed8fd52dacd84daa8a8a5e81129e858d62"
        },
        "bloggify-mongoose": {
            "db": DB_URI,
            "models": {
                "User": {
                    "username": "string",
                    "email": "string",
                    "password": "string",
                    "profile": "object",
                    "role": "string"
                },
                "Topic": {
                    "author": "string",
                    "title": "string",
                    "slug": "string",
                    "body": "string",
                    "created_at": "date",
                    "votes": ["string"],
                    "sticky": "boolean",
                    "metadata": "object"
                },
                "Comment": {
                    "author": "string",
                    "body": "string",
                    "created_at": "date",
                    "topic": "string",
                    "votes": ["string"]
                },
                "Stats": {
                    "actor": "string",
                    "metadata": "object",
                    "event": "string",
                    "created_at": "date",
                },
                "Settings": {
                    "settings": "object"
                }

            }
        },
        "bloggify-sendgrid": {
            "key": "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"
        }
    }
}, {
    server: {
        session: {
            storeOptions: {
                url: DB_URI
            }
        }
    }
});
