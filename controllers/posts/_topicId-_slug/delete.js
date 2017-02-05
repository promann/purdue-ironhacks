const Topic = require("../../Topic")
    , Session = require("../../Session")
    ;

exports.post = (lien, cb) => {
    if (!Session.isAdmin(lien)) {
        return lien.apiError("Forbidden", 403);
    }
    Topic.remove({
        _id: lien.params.topicId
    }, (err, count) => {
        if (err) { return lien.apiError(err); }
        lien.redirect("/");
    })
};
