const Session = require("./Session")
    , Topic = require("./Topic")
    ;

exports.get = (lien, cb) => {
    if (!Session.isAuthenticated(lien)) {
        return lien.redirect("/");
    }
    if (lien.query.search) {
        Topic.getMore({
            filters: {
                $text: { $search: lien.query.search }
            }
        }, (err, data) => {
            cb(null, {
                results: data
            });
        });
    }
    cb();
};
