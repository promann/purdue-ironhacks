"use strict";

const conf = require("bloggify-config");
const DB_URI = conf.isProduction ? "mongodb://bloggify:keh69T3d1QGlu=M@ds129179.mlab.com:29179/heroku_4h3bmd1g" :  "mongodb://localhost/bloggify-forum";

module.exports = conf({
    "title": "Bloggify Discussions",
    "description": "A forum application.",
    "domain": "http://bloggify-forum.com",
    "plugins": [
        "bloggify-custom-assets",
        "bloggify-mongoose"
    ],
    "router": "bloggify-flexible-router",
    "viewer": null,
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
        "bloggify-mongoose": {
            "db": DB_URI,
            "models": {
                "User": {
                    "username": "string",
                    "email": "string",
                    "password": "string",
                    "profile": "object"
                },
                "Topic": {
                    "author": "string",
                    "title": "string",
                    "slug": "string",
                    "body": "string",
                    "created_at": "date",
                    "votes": ["string"]
                },
                "Comment": {
                    "author": "string",
                    "body": "string",
                    "created_at": "date",
                    "topic": "string",
                    "votes": "number"
                }
            }
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
