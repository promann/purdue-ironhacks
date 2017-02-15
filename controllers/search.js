const Session = require("./Session")
    , Topic = require("./Topic")
    ;

exports.get = (lien, cb) => {
    if (!Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    if (lien.params.query) {
        // TODO
        cb(null, [
            { url: "" }
        ]);
    }
    cb();
};
