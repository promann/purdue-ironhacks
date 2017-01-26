"use strict";
module.exports = require("bloggify-config")(require("./config"), {
    server: {
        session: {
            storeOptions: {
                url: "mongodb://localhost/bloggify-forum",
            }
        }
    }
});
