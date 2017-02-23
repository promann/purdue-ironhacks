"use strict";

const conf = require("bloggify-config");
const DB_URI = conf.isProduction
             ? "mongodb://bloggify:JwRsdG28yZUCVLRBU3IHfGGKlfXyhci3rVo1K0z4h4xjZ1Zf1eC3ZCXiItyMRM8i@ds163758.mlab.com:63758/heroku_l6lb4k6w"
             : "mongodb://localhost/bloggify-forum"
             ;

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
                "app/assets/stylesheets/index.css"
            ],
            "server": [
                "app/server/index.js"
            ]
        },
        "bloggify-flexible-router": {
            "controllers_dir": "app/controllers",
            "routes_dir": "app/routes",
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
            "models_dir": "app/models"
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
